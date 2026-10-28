import type { MuscleGroup } from "../lib/exercises";

type Props = { name: string; muscle: MuscleGroup; equipment: string };

const muscleLabels: Record<MuscleGroup, string> = {
  Chest: "Peitoral", Back: "Costas", Shoulder: "Ombros",
  Legs: "Pernas e glúteos", Arms: "Braços", Core: "Abdômen", Other: "Corpo inteiro",
};

function ExercisePose({ name }: { name: string }) {
  const n = name.toLowerCase();
  const squat = /squat|agach|lunge|afundo|leg press/.test(n);
  const curl = /curl|rosca/.test(n);
  const plank = /plank|prancha|push.?up|flexão/.test(n);
  const row = /row|remada|pulldown|pull.?up|barra fixa/.test(n);
  const deadlift = /deadlift|terra|stiff|romanian/.test(n);
  const press = /press|supino|desenvolvimento|shoulder/.test(n);
  return <svg className="mf-pose-svg" viewBox="0 0 150 150" role="img" aria-label={`Ilustração do movimento: ${name}`}>
    <defs><linearGradient id="mf-person" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d7ff8a"/><stop offset="1" stopColor="#54e58b"/></linearGradient></defs>
    <circle cx="75" cy="22" r="12" fill="#b7ff5a" opacity=".18"/>
    <path d="M18 130H132" stroke="#3b5944" strokeWidth="2" strokeLinecap="round"/>
    {plank ? <>
      <circle cx="40" cy="77" r="9" fill="url(#mf-person)"/>
      <path d="M48 81 L77 92 L105 99 L125 111 M77 92 L60 112 L46 124 M93 96 L104 116" fill="none" stroke="url(#mf-person)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M56 82 L73 98 L83 114" fill="none" stroke="#b7ff5a" strokeWidth="4" strokeLinecap="round"/>
    </> : squat ? <>
      <circle cx="76" cy="28" r="10" fill="url(#mf-person)"/>
      <path d="M76 41 L76 70 L58 87 L41 111 M76 70 L97 86 L111 111 M76 48 L53 62 L40 78 M76 48 L98 61 L112 75" fill="none" stroke="url(#mf-person)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M33 113h17 M103 113h17" stroke="#b7ff5a" strokeWidth="5" strokeLinecap="round"/>
    </> : curl ? <>
      <circle cx="74" cy="24" r="10" fill="url(#mf-person)"/>
      <path d="M74 37 L74 76 L61 104 L60 126 M74 76 L89 103 L92 126 M74 44 L54 60 L65 73 M74 44 L92 57 L88 72" fill="none" stroke="url(#mf-person)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M55 59 L66 48 M88 57 L99 46" stroke="#eaffc7" strokeWidth="5" strokeLinecap="round"/>
      <rect x="48" y="43" width="13" height="7" rx="2" fill="#b7ff5a"/><rect x="94" y="41" width="13" height="7" rx="2" fill="#b7ff5a"/>
    </> : row || deadlift ? <>
      <circle cx="76" cy="29" r="10" fill="url(#mf-person)"/>
      <path d="M69 41 L58 65 L78 83 L67 108 L64 126 M78 83 L97 104 L103 126 M62 57 L43 74 L53 84 M62 57 L86 63 L102 73" fill="none" stroke="url(#mf-person)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 92 H115" stroke="#b7ff5a" strokeWidth="4" strokeLinecap="round"/><rect x="28" y="84" width="9" height="16" rx="2" fill="#b7ff5a"/><rect x="111" y="84" width="9" height="16" rx="2" fill="#b7ff5a"/>
    </> : press ? <>
      <circle cx="75" cy="32" r="10" fill="url(#mf-person)"/>
      <path d="M75 44 L75 78 L61 105 L60 126 M75 78 L91 105 L94 126 M75 49 L54 31 L47 17 M75 49 L96 31 L103 17" fill="none" stroke="url(#mf-person)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38 14 H112" stroke="#b7ff5a" strokeWidth="4" strokeLinecap="round"/><rect x="35" y="7" width="7" height="14" rx="2" fill="#b7ff5a"/><rect x="108" y="7" width="7" height="14" rx="2" fill="#b7ff5a"/>
    </> : <>
      <circle cx="75" cy="26" r="11" fill="url(#mf-person)"/>
      <path d="M75 39 L75 77 L61 104 L59 126 M75 77 L91 104 L94 126 M75 48 L53 65 L42 83 M75 48 L97 65 L108 83" fill="none" stroke="url(#mf-person)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M36 84h12 M102 84h12" stroke="#b7ff5a" strokeWidth="5" strokeLinecap="round"/>
    </>}
  </svg>;
}

export function ExerciseVisual({ name, muscle, equipment }: Props) {
  return <div className="mf-exercise-visual">
    <div className="mf-pose-panel"><span className="mf-visual-kicker">MOVIMENTO</span><ExercisePose name={name}/><span className="mf-pose-caption">Demonstração ilustrativa</span></div>
    <div className="mf-anatomy-panel">
      <span className="mf-visual-kicker">MÚSCULO-ALVO</span>
      <svg className="mf-anatomy-svg" viewBox="0 0 100 150" role="img" aria-label={`Grupo muscular: ${muscleLabels[muscle]}`}>
        <g fill="#263a2d" stroke="#62806a" strokeWidth="1.4" strokeLinejoin="round">
          <circle cx="50" cy="14" r="9"/>
          <path d="M42 26 Q50 22 58 26 L65 43 L61 70 L58 86 L61 112 L58 143 L47 143 L45 113 L42 88 L39 113 L37 143 L26 143 L29 111 L32 86 L29 70 L35 43Z"/>
          <path d="M35 31 L24 36 L13 63 L19 67 L32 48 M65 31 L76 36 L87 63 L81 67 L68 48" />
        </g>
        <g fill="#b7ff5a" stroke="#e3ffad" strokeWidth=".7">
          {(muscle === "Chest" ? <><path d="M36 38 Q43 32 49 39 L48 51 Q40 53 35 46Z"/><path d="M51 39 Q58 32 64 38 L65 46 Q60 53 52 51Z"/></> :
          muscle === "Back" ? <><path d="M38 31 L49 35 L48 58 L37 52 L34 39Z"/><path d="M51 35 L62 31 L66 39 L63 52 L52 58Z"/></> :
          muscle === "Shoulder" ? <><circle cx="34" cy="35" r="5"/><circle cx="66" cy="35" r="5"/></> :
          muscle === "Arms" ? <><path d="M25 39 L31 40 L25 57 L20 60 L17 55Z"/><path d="M69 40 L75 39 L83 55 L80 60 L75 57Z"/></> :
          muscle === "Legs" ? <><path d="M32 83 L44 84 L41 111 L36 122 L30 111Z"/><path d="M47 84 L59 83 L64 111 L58 122 L51 111Z"/></> :
          muscle === "Core" ? <><rect x="40" y="53" width="8" height="22" rx="3"/><rect x="52" y="53" width="8" height="22" rx="3"/></> :
          <><path d="M36 38 Q43 32 49 39 L48 51 Q40 53 35 46Z"/><path d="M51 39 Q58 32 64 38 L65 46 Q60 53 52 51Z"/><path d="M32 83 L44 84 L41 111 L36 122 L30 111Z"/><path d="M47 84 L59 83 L64 111 L58 122 L51 111Z"/></>)}
        </g>
      </svg>
      <strong>{muscleLabels[muscle]}</strong>
      <span className="mf-equipment-pill">{equipment === "bodyweight" ? "Peso corporal" : equipment === "barbell" ? "Barra" : equipment === "dumbbell" ? "Halteres" : equipment === "machine" ? "Máquina" : equipment === "cable" ? "Polia" : equipment === "kettlebell" ? "Kettlebell" : "Equipamento variado"}</span>
    </div>
  </div>;
}
