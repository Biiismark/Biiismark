#!/usr/bin/env python3
"""Coleta apenas metadados públicos do YouTube; nunca baixa vídeos ou áudios."""
from __future__ import annotations
import json
import re
import subprocess
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "data" / "isabella-catalog.json"
CHANNEL = "Isabella Duarte Personal Online"
SOURCES = [
    ("video", "https://www.youtube.com/@Isapersonall/videos"),
    ("short", "https://www.youtube.com/@Isapersonall/shorts"),
    ("live", "https://www.youtube.com/@Isapersonall/streams"),
]
ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
KIND_ORDER = {"video": 1, "short": 2, "live": 3}

def fold(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    return "".join(ch for ch in value if not unicodedata.combining(ch)).lower()

def group_for(title: str) -> tuple[str, list[str]]:
    t = fold(title)
    rules = [
        ("Pernas e glúteos", ["glute", "perna", "coxa", "quadriceps", "posterior", "panturrilha", "agachamento", "sumo", "bulgaro", "stiff", "leg press", "passada", "afundo"]),
        ("Costas", ["costas", "remada", "puxada", "pulldown", "barra fixa", "dorsal"]),
        ("Peito", ["peito", "peitoral", "supino", "crucifixo", "flexao"]),
        ("Ombros", ["ombro", "deltoide", "elevacao lateral", "desenvolvimento"]),
        ("Braços", ["biceps", "triceps", "braco", "rosca", "martelo", "pulley"]),
        ("Abdômen", ["abdomen", "abdominal", "core", "prancha", "crunch"]),
        ("Mobilidade e alongamento", ["alongamento", "mobilidade", "flexibilidade", "aquecimento"]),
        ("Cardio", ["cardio", "corrida", "esteira", "bike", "aerobico", "hiit", "tabata"]),
        ("Corpo inteiro", ["corpo inteiro", "full body", "fullbody", "funcional"]),
    ]
    for label, words in rules:
        hits = [w for w in words if w in t]
        if hits:
            return label, hits[:4]
    return "Geral", []

def pick_date(entry: dict) -> str | None:
    for key in ("upload_date", "release_date"):
        value = entry.get(key)
        if isinstance(value, str) and re.fullmatch(r"\d{8}", value):
            return value[:4] + "-" + value[4:6] + "-" + value[6:8]
    ts = entry.get("release_timestamp") or entry.get("timestamp")
    if isinstance(ts, (int, float)):
        return datetime.fromtimestamp(ts, timezone.utc).date().isoformat()
    return None

def pick_thumbnail(entry: dict, video_id: str) -> str:
    if isinstance(entry.get("thumbnail"), str) and entry["thumbnail"].startswith("http"):
        return entry["thumbnail"]
    thumbs = entry.get("thumbnails") or []
    for thumb in reversed(thumbs):
        if isinstance(thumb, dict) and isinstance(thumb.get("url"), str):
            return thumb["url"]
    return "https://i.ytimg.com/vi/" + video_id + "/hqdefault.jpg"

def collect(kind: str, url: str) -> tuple[list[dict], str | None]:
    command = ["yt-dlp", "--flat-playlist", "--dump-single-json", "--skip-download", "--ignore-errors", "--no-warnings", url]
    result = subprocess.run(command, capture_output=True, text=True, timeout=300)
    if not result.stdout.strip():
        message = (result.stderr or "yt-dlp exited " + str(result.returncode)).strip().splitlines()
        return [], message[-1][:240] if message else "No output"
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        return [], "Invalid JSON: " + str(exc)
    entries = data.get("entries") if isinstance(data, dict) else None
    if entries is None and isinstance(data, dict) and data.get("id"):
        entries = [data]
    rows = []
    for entry in entries or []:
        if not isinstance(entry, dict):
            continue
        video_id = str(entry.get("id") or entry.get("url") or "")
        if not ID_RE.fullmatch(video_id):
            continue
        title = str(entry.get("title") or "Vídeo sem título").strip()
        muscle_group, tags = group_for(title)
        rows.append({
            "id": video_id, "title": title,
            "url": "https://www.youtube.com/watch?v=" + video_id,
            "thumbnail": pick_thumbnail(entry, video_id),
            "uploadDate": pick_date(entry),
            "duration": entry.get("duration") if isinstance(entry.get("duration"), (int, float)) else None,
            "kind": kind, "muscleGroup": muscle_group, "tags": tags,
        })
    return rows, None if rows else "No video entries found"

def main() -> int:
    videos: dict[str, dict] = {}
    errors: list[str] = []
    for kind, url in SOURCES:
        print("Collecting " + kind + ": " + url, flush=True)
        try:
            rows, error = collect(kind, url)
        except (OSError, subprocess.TimeoutExpired) as exc:
            rows, error = [], str(exc)
        if error:
            print("WARNING " + kind + ": " + error, file=sys.stderr, flush=True)
            errors.append(kind)
        for row in rows:
            current = videos.get(row["id"])
            if current is None or KIND_ORDER[row["kind"]] > KIND_ORDER[current["kind"]]:
                videos[row["id"]] = row
        print("Collected " + str(len(rows)) + " entries from " + kind, flush=True)
    if not videos:
        print("No videos collected; preserving the existing catalog.", file=sys.stderr)
        return 1
    data = {
        "channel": CHANNEL,
        "source": "yt-dlp / YouTube public channel pages",
        "refreshedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "count": len(videos),
        "collectionErrors": errors,
        "videos": sorted(videos.values(), key=lambda item: (item.get("uploadDate") or "0000-00-00", item["title"].casefold()), reverse=True),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Saved " + str(len(videos)) + " unique public video entries to " + str(OUT))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
