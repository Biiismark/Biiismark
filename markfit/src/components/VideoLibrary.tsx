import { useEffect, useMemo, useState } from "react";
import "./VideoLibrary.css";

type VideoKind = "video" | "short" | "live";
type CatalogVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  uploadDate?: string;
  duration?: number;
  kind: VideoKind;
  muscleGroup: string;
  tags?: string[];
};
type CatalogFile = {
  channel: string;
  source: string;
  refreshedAt: string | null;
  count: number;
  videos: CatalogVideo[];
  collectionErrors?: string[];
};

const KIND_LABELS: Record<"all" | VideoKind, string> = {
  all: "Todos",
  video: "Vídeos",
  short: "Shorts",
  live: "Ao vivo",
};

function durationLabel(seconds?: number): string {
  if (seconds == null || !Number.isFinite(seconds)) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) return Math.floor(mins / 60) + "h " + String(mins % 60).padStart(2, "0") + "min";
  return mins + "min" + (secs ? " " + String(secs).padStart(2, "0") + "s" : "");
}
function dateLabel(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("pt-BR");
}

type VideoLibraryProps = { initialQuery?: string; onQueryChange?: (query: string) => void };

export function VideoLibrary({ initialQuery = "", onQueryChange }: VideoLibraryProps) {
  const [catalog, setCatalog] = useState<CatalogFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);
  const [kind, setKind] = useState<"all" | VideoKind>("all");
  const [muscle, setMuscle] = useState("Todos os grupos");
  const [selected, setSelected] = useState<CatalogVideo | null>(null);

  useEffect(() => {
    let active = true;
    fetch(import.meta.env.BASE_URL + "data/isabella-catalog.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("O catálogo ainda não foi publicado.");
        return response.json() as Promise<CatalogFile>;
      })
      .then((data) => { if (active) setCatalog(data); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Não foi possível carregar o catálogo."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const videos = catalog?.videos ?? [];
  const muscles = useMemo(
    () => ["Todos os grupos", ...Array.from(new Set(videos.map((v) => v.muscleGroup).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR"))],
    [videos],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    return videos.filter((video) => {
      const searchText = [video.title, video.muscleGroup, ...(video.tags ?? [])].join(" ").toLocaleLowerCase("pt-BR");
      return (!needle || searchText.includes(needle)) && (kind === "all" || video.kind === kind) &&
        (muscle === "Todos os grupos" || video.muscleGroup === muscle);
    });
  }, [videos, query, kind, muscle]);

  return (
    <main className="video-library pad">
      <header className="video-hero">
        <div className="video-kicker">MARKFIT · BIBLIOTECA</div>
        <h1>Encontre seu próximo exercício</h1>
        <p>Vídeos públicos da Isabella Duarte, organizados para você encontrar uma demonstração durante o treino.</p>
        <div className="video-stats">
          <div><strong className="num">{videos.length.toLocaleString("pt-BR")}</strong><span>vídeos catalogados</span></div>
          <div><strong className="num">{filtered.length.toLocaleString("pt-BR")}</strong><span>resultados</span></div>
          <div><strong className="num">{catalog?.refreshedAt ? dateLabel(catalog.refreshedAt) : "—"}</strong><span>última atualização</span></div>
        </div>
      </header>

      <label className="video-search-wrap">
        <span aria-hidden="true">⌕</span>
        <input className="video-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); onQueryChange?.(event.target.value); }}
          placeholder="Buscar exercício, músculo ou título…" aria-label="Buscar vídeo" />
        {query && <button type="button" className="video-clear" onClick={() => { setQuery(""); onQueryChange?.(""); }}>Limpar</button>}
      </label>

      <div className="video-filter-label">TIPO DE CONTEÚDO</div>
      <div className="video-chips">
        {(Object.keys(KIND_LABELS) as Array<"all" | VideoKind>).map((item) => (
          <button key={item} className={"video-chip " + (kind === item ? "selected" : "")} onClick={() => setKind(item)}>{KIND_LABELS[item]}</button>
        ))}
      </div>

      <div className="video-filter-label">GRUPO MUSCULAR ESTIMADO</div>
      <select className="video-muscle-select" value={muscle} onChange={(event) => setMuscle(event.target.value)}>
        {muscles.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>

      {loading && <div className="video-empty"><span className="video-loader" />Carregando catálogo…</div>}
      {!loading && error && videos.length === 0 && (
        <div className="video-empty"><strong>Catálogo em preparação</strong>
          <p>A coleta automática está configurada para buscar metadados públicos do canal. Quando a primeira execução terminar, os vídeos aparecerão aqui.</p>
          <a href="https://github.com/Biiismark/Biiismark/actions" target="_blank" rel="noreferrer">Ver execução do catálogo no GitHub ↗</a>
        </div>
      )}
      {!loading && !error && videos.length === 0 && (
        <div className="video-empty"><strong>Nenhum vídeo encontrado ainda</strong>
          <p>O catálogo depende da coleta pública do YouTube. Ele será atualizado automaticamente quando a tarefa do GitHub concluir.</p>
        </div>
      )}
      {!loading && videos.length > 0 && filtered.length === 0 && (
        <div className="video-empty"><strong>Nenhum resultado para esta busca</strong><p>Tente outro termo ou remova um dos filtros.</p></div>
      )}

      <section className="video-grid" aria-label="Resultados de vídeos">
        {filtered.map((video) => (
          <button key={video.id} className="video-card" onClick={() => setSelected(video)}>
            <div className="video-thumb-wrap">
              <img className="video-thumb" src={video.thumbnail || ("https://i.ytimg.com/vi/" + video.id + "/hqdefault.jpg")}
                alt="" loading="lazy" onError={(event) => { event.currentTarget.style.opacity = "0"; }} />
              <span className="video-play-mark" aria-hidden="true">▶</span>
              <span className="video-kind">{KIND_LABELS[video.kind] ?? "Vídeo"}</span>
              {video.duration != null && <span className="video-duration">{durationLabel(video.duration)}</span>}
            </div>
            <div className="video-card-body">
              <span className="video-category">{video.muscleGroup || "Geral"}</span>
              <strong>{video.title}</strong>
              <span className="video-date">{dateLabel(video.uploadDate) || "Data não informada"}</span>
            </div>
          </button>
        ))}
      </section>

      <footer className="video-footer">
        <p>As categorias são estimadas por palavras do título e podem conter erros. Os vídeos e as miniaturas continuam hospedados no YouTube; o MarkFit não baixa nem redistribui arquivos de vídeo.</p>
        <a href="https://github.com/Biiismark/Biiismark/tree/main/markfit" target="_blank" rel="noreferrer">Código-fonte do MarkFit · AGPL-3.0 ↗</a>
        <a href="https://www.youtube.com/@Isapersonall" target="_blank" rel="noreferrer">Canal Isabella Duarte ↗</a>
      </footer>

      {selected && (
        <div className="video-modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="video-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={(event) => event.stopPropagation()}>
            <div className="video-modal-heading">
              <div><span className="video-category">{selected.muscleGroup}</span><h2>{selected.title}</h2></div>
              <button className="video-close" onClick={() => setSelected(null)} aria-label="Fechar vídeo">×</button>
            </div>
            <div className="video-player">
              <iframe src={"https://www.youtube-nocookie.com/embed/" + selected.id + "?autoplay=1&rel=0"}
                title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
            <div className="video-modal-actions">
              <span>{dateLabel(selected.uploadDate)}{selected.duration != null ? " · " + durationLabel(selected.duration) : ""}</span>
              <a href={selected.url} target="_blank" rel="noreferrer">Abrir no YouTube ↗</a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
