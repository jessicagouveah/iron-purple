"use strict";

const STORAGE_KEY = "ironPurpleState";
const SCHEMA_VERSION = 4;
const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const SHORT_DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const APP_VERSION = "2026-08-21-coach-1";
const EXERCISE_IMAGE_BASE = "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises";
const EXERCISE_IMAGE_FALLBACK = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
const EXERCISE_MOTION_IDS = Object.freeze({
  "Agachamento livre ou no smith": "Barbell_Squat",
  "Leg press 45°": "Leg_Press",
  "Afundo búlgaro": "Split_Squats",
  "Cadeira extensora": "Leg_Extensions",
  "Elevação pélvica com barra": "Barbell_Hip_Thrust",
  "Cadeira abdutora": "Thigh_Abductor",
  "Panturrilha em pé": "Standing_Calf_Raises",
  "Puxada frontal na polia": "Wide-Grip_Lat_Pulldown",
  "Remada baixa com triângulo": "Seated_Cable_Rows",
  "Remada unilateral com halter": "One-Arm_Dumbbell_Row",
  "Face pull na corda": "Face_Pull",
  "Rosca direta na barra": "Barbell_Curl",
  "Rosca martelo com halteres": "Hammer_Curls",
  "Prancha abdominal": "Plank",
  "Abdominal na polia alta": "Cable_Crunch",
  "Stiff com barra ou halteres": "Romanian_Deadlift",
  "Mesa flexora": "Lying_Leg_Curls",
  "Cadeira flexora": "Seated_Leg_Curl",
  "Coice na polia": "Glute_Kickback",
  "Passada reversa com halteres": "Dumbbell_Rear_Lunge",
  "Panturrilha sentada": "Seated_Calf_Raise",
  "Supino com halteres": "Dumbbell_Bench_Press",
  "Desenvolvimento com halteres": "Dumbbell_Shoulder_Press",
  "Elevação lateral": "Side_Lateral_Raise",
  "Crucifixo na máquina": "Butterfly",
  "Tríceps na corda": "Triceps_Pushdown_-_Rope_Attachment",
  "Tríceps francês unilateral": "Standing_Dumbbell_Triceps_Extension",
  "Elevação de pernas": "Hanging_Leg_Raise",
  "Prancha lateral": "Side_Bridge",
  "Agachamento sumô": "Plie_Dumbbell_Squat",
  "Elevação pélvica no smith": "Smith_Machine_Hip_Raise",
  "Leg press pés altos": "Leg_Press",
  "Passada andando": "Bodyweight_Walking_Lunge",
  "Stiff unilateral": "Kettlebell_One-Legged_Deadlift",
  "Cadeira abdutora inclinada": "Thigh_Abductor",
  "Panturrilha no leg press": "Calf_Press_On_The_Leg_Press_Machine",
  "Caminhada leve": "Walking_Treadmill",
  "Mobilidade de quadril": "Kneeling_Hip_Flexor",
  "Alongamento leve": "All_Fours_Quad_Stretch"
});
const MOTION_FALLBACKS = [
  ["abdutora", "Thigh_Abductor"], ["adutora", "Thigh_Adductor"], ["extensora", "Leg_Extensions"], ["leg press", "Leg_Press"],
  ["agachamento", "Barbell_Squat"], ["pelvica", "Barbell_Hip_Thrust"], ["hip thrust", "Barbell_Hip_Thrust"],
  ["panturrilha", "Standing_Calf_Raises"], ["flexora", "Seated_Leg_Curl"], ["stiff", "Romanian_Deadlift"],
  ["gluteo", "Glute_Kickback"], ["passada", "Bodyweight_Walking_Lunge"], ["afundo", "Split_Squats"],
  ["puxada", "Wide-Grip_Lat_Pulldown"], ["remada", "Seated_Cable_Rows"], ["face pull", "Face_Pull"],
  ["rosca", "Barbell_Curl"], ["prancha", "Plank"], ["abdominal", "Cable_Crunch"],
  ["supino", "Dumbbell_Bench_Press"], ["desenvolvimento", "Dumbbell_Shoulder_Press"],
  ["elevacao lateral", "Side_Lateral_Raise"], ["crucifixo", "Butterfly"], ["triceps", "Triceps_Pushdown_-_Rope_Attachment"],
  ["caminhada", "Walking_Treadmill"], ["mobilidade", "Kneeling_Hip_Flexor"], ["alongamento", "All_Fours_Quad_Stretch"]
];

const TRAINING_PROGRAM = {
  Segunda: {
    code: "A", name: "Quadríceps + glúteos", category: "PERNAS & GLÚTEOS", focus: "Foco em quadríceps", duration: "65–75 min",
    description: "Base de força para coxas, glúteos e panturrilhas. Priorize amplitude e execução estável.",
    warmup: "5 a 8 min de caminhada ou bicicleta + mobilidade de quadril, joelhos e 2 séries leves do primeiro exercício.",
    exercises: [
      { name: "Agachamento livre ou no smith", muscle: "Quadríceps e glúteos", sets: 4, reps: 10, target: "8–10", rest: 120, type: "Composto", notes: "Mantenha abdômen firme, joelhos acompanhando a ponta dos pés e desça com controle.", alternative: "Hack squat ou agachamento goblet", progression: "Quando concluir 4 séries com 10 repetições limpas, aumente a carga de 2,5% a 5%." },
      { name: "Leg press 45°", muscle: "Quadríceps e glúteos", sets: 4, reps: 12, target: "10–12", rest: 120, type: "Composto", notes: "Apoie a lombar, desça até manter a pelve estável e evite travar totalmente os joelhos.", alternative: "Leg press horizontal", progression: "Aumente a carga apenas quando controlar toda a descida." },
      { name: "Afundo búlgaro", muscle: "Glúteos e quadríceps", sets: 3, reps: 10, target: "10 por perna", rest: 90, type: "Unilateral", notes: "Dê um passo confortável, incline levemente o tronco e empurre o chão com o pé da frente.", alternative: "Afundo reverso com halteres", progression: "Primeiro estabilize as duas pernas; depois acrescente halteres." },
      { name: "Cadeira extensora", muscle: "Quadríceps", sets: 3, reps: 15, target: "12–15", rest: 75, type: "Isolado", notes: "Segure a contração por 1 segundo e controle a volta sem balançar o tronco.", alternative: "Extensora unilateral", progression: "Aumente a carga quando alcançar 15 repetições em todas as séries." },
      { name: "Elevação pélvica com barra", muscle: "Glúteos", sets: 4, reps: 10, target: "8–10", rest: 120, type: "Composto", notes: "Apoie as escápulas no banco, mantenha o queixo recolhido e contraia os glúteos no topo.", alternative: "Hip thrust na máquina", progression: "Segure 1 a 2 segundos no topo antes de subir o peso." },
      { name: "Cadeira abdutora", muscle: "Glúteo médio", sets: 3, reps: 20, target: "15–20", rest: 60, type: "Isolado", notes: "Abra os joelhos sem impulso e faça uma pausa curta na contração.", alternative: "Abdução com miniband", progression: "Aumente a carga só se mantiver o movimento sem jogar o corpo." },
      { name: "Panturrilha em pé", muscle: "Panturrilhas", sets: 4, reps: 15, target: "12–15", rest: 60, type: "Isolado", notes: "Desça os calcanhares com controle, suba o máximo possível e pause no topo.", alternative: "Panturrilha no leg press", progression: "Use amplitude completa antes de acrescentar carga." }
    ]
  },
  Terça: {
    code: "B", name: "Costas + bíceps + abdômen", category: "SUPERIORES & CORE", focus: "Definição de costas", duration: "55–65 min",
    description: "Postura, costas desenhadas, braços firmes e fortalecimento do abdômen.",
    warmup: "5 min de caminhada leve + mobilidade de ombros e 1 a 2 séries leves de puxada.", cardio: "Opcional: 15 a 20 min de caminhada inclinada ou bicicleta em ritmo confortável depois do treino.",
    exercises: [
      { name: "Puxada frontal na polia", muscle: "Costas e dorsal", sets: 4, reps: 12, target: "10–12", rest: 90, type: "Composto", notes: "Puxe em direção à parte superior do peito, mantendo ombros longe das orelhas.", alternative: "Puxada com triangulo", progression: "Aumente o peso quando conseguir 12 repetições sem inclinar o tronco." },
      { name: "Remada baixa com triângulo", muscle: "Costas e romboides", sets: 4, reps: 12, target: "10–12", rest: 90, type: "Composto", notes: "Traga o acessório ao abdômen e aproxime as escápulas no final.", alternative: "Remada articulada", progression: "Segure 1 segundo com as escápulas fechadas." },
      { name: "Remada unilateral com halter", muscle: "Costas e estabilidade", sets: 3, reps: 12, target: "10–12 por lado", rest: 75, type: "Unilateral", notes: "Mantenha a coluna neutra e puxe o cotovelo na direção do quadril.", alternative: "Remada unilateral na polia", progression: "Mantenha a mesma qualidade de movimento nos dois lados." },
      { name: "Face pull na corda", muscle: "Ombros posteriores e postura", sets: 3, reps: 15, target: "12–15", rest: 60, type: "Isolado", notes: "Puxe a corda na direção do rosto, abrindo os cotovelos sem elevar os ombros.", alternative: "Crucifixo inverso na máquina", progression: "Prefira controle e postura a cargas altas." },
      { name: "Rosca direta na barra", muscle: "Bíceps", sets: 3, reps: 12, target: "10–12", rest: 60, type: "Isolado", notes: "Mantenha cotovelos próximos ao corpo e evite jogar o tronco para trás.", alternative: "Rosca direta na polia", progression: "Suba a carga apenas mantendo os cotovelos estáveis." },
      { name: "Rosca martelo com halteres", muscle: "Bíceps e antebraços", sets: 3, reps: 12, target: "10–12", rest: 60, type: "Isolado", notes: "Mantenha as palmas voltadas uma para a outra e desça lentamente.", alternative: "Rosca martelo na corda", progression: "Controle a descida por aproximadamente 2 segundos." },
      { name: "Prancha abdominal", muscle: "Core e estabilidade", sets: 3, reps: 40, target: "30–45 segundos", rest: 45, type: "Isometria", notes: "Mantenha costelas encaixadas, abdômen contraído e quadril alinhado.", alternative: "Prancha com joelhos apoiados", progression: "Aumente 5 segundos quando completar todas as séries com boa postura.", unit: "seg" },
      { name: "Abdominal na polia alta", muscle: "Abdômen", sets: 3, reps: 15, target: "12–15", rest: 45, type: "Isolado", notes: "Enrole o tronco pela força do abdômen, sem puxar a corda com os braços.", alternative: "Abdominal crunch no solo", progression: "Aumente a carga sem perder a flexão controlada do tronco." }
    ]
  },
  Quarta: {
    code: "C", name: "Posterior + glúteos", category: "PERNAS & GLÚTEOS", focus: "Glúteos em evidência", duration: "65–75 min",
    description: "Ênfase em posterior de coxa, glúteos e estabilidade do quadril.",
    warmup: "5 a 8 min de bicicleta + mobilidade de quadril, ativação leve com miniband e 2 séries leves de elevação pélvica.",
    exercises: [
      { name: "Elevação pélvica com barra", muscle: "Glúteos", sets: 4, reps: 10, target: "8–10", rest: 120, type: "Composto", notes: "Contraia os glúteos no topo e evite arquear a lombar.", alternative: "Hip thrust na máquina", progression: "Aumente a carga progressivamente quando as 4 séries estiverem consistentes." },
      { name: "Stiff com barra ou halteres", muscle: "Posterior e glúteos", sets: 4, reps: 10, target: "8–10", rest: 120, type: "Composto", notes: "Empurre o quadril para trás, mantenha joelhos destravados e aproxime a carga do corpo.", alternative: "Levantamento romeno no smith", progression: "A amplitude termina onde a lombar continua neutra." },
      { name: "Mesa flexora", muscle: "Posterior de coxa", sets: 4, reps: 12, target: "10–12", rest: 75, type: "Isolado", notes: "Flexione os joelhos sem tirar o quadril do apoio e controle a volta.", alternative: "Flexora unilateral", progression: "Segure 1 segundo na contração antes de aumentar a carga." },
      { name: "Cadeira flexora", muscle: "Posterior de coxa", sets: 3, reps: 15, target: "12–15", rest: 75, type: "Isolado", notes: "Ajuste o banco e mantenha o tronco apoiado durante todas as repetições.", alternative: "Flexão de joelhos com bola", progression: "Busque 15 repetições sem reduzir a amplitude." },
      { name: "Coice na polia", muscle: "Glúteos", sets: 3, reps: 15, target: "12–15 por perna", rest: 60, type: "Unilateral", notes: "Leve o calcanhar para trás com controle e evite compensar com a lombar.", alternative: "Glúteo na máquina", progression: "Aumente a carga apenas se o quadril continuar estável." },
      { name: "Passada reversa com halteres", muscle: "Glúteos e posteriores", sets: 3, reps: 12, target: "10–12 por perna", rest: 90, type: "Unilateral", notes: "Dê o passo para trás, incline levemente o tronco e pressione o calcanhar da frente.", alternative: "Step-up no banco", progression: "Priorize equilíbrio, amplitude e mesma execução dos dois lados." },
      { name: "Panturrilha sentada", muscle: "Panturrilhas", sets: 4, reps: 15, target: "12–15", rest: 60, type: "Isolado", notes: "Deixe o calcanhar descer e segure a contração no alto.", alternative: "Panturrilha em pé", progression: "Use movimento completo e sem balanço." }
    ]
  },
  Quinta: {
    code: "D", name: "Ombros + peito + tríceps", category: "SUPERIORES & CORE", focus: "Definição de braços", duration: "55–65 min",
    description: "Ombros definidos, peito fortalecido, braços firmes e abdômen ativo.",
    warmup: "5 min de caminhada + mobilidade de ombros, rotações leves e 2 séries leves do primeiro exercício.", cardio: "Opcional: 15 a 20 min de elíptico, bicicleta ou caminhada leve após o treino.",
    exercises: [
      { name: "Supino com halteres", muscle: "Peito e tríceps", sets: 3, reps: 12, target: "10–12", rest: 90, type: "Composto", notes: "Mantenha escápulas apoiadas, punhos firmes e desça os halteres com controle.", alternative: "Chest press na máquina", progression: "Aumente os halteres apenas quando os dois lados se moverem de forma estável." },
      { name: "Desenvolvimento com halteres", muscle: "Ombros", sets: 3, reps: 12, target: "10–12", rest: 90, type: "Composto", notes: "Mantenha abdômen firme e empurre a carga acima da cabeça sem arquear a lombar.", alternative: "Desenvolvimento na máquina", progression: "Prefira a execução sentada se precisar de mais estabilidade." },
      { name: "Elevação lateral", muscle: "Ombros laterais", sets: 4, reps: 15, target: "12–15", rest: 60, type: "Isolado", notes: "Eleve os braços até a linha dos ombros, com cotovelos levemente flexionados.", alternative: "Elevação lateral na polia", progression: "Use carga que permita subir sem balanço do tronco." },
      { name: "Crucifixo na máquina", muscle: "Peito", sets: 3, reps: 15, target: "12–15", rest: 75, type: "Isolado", notes: "Aproxime os braços sem elevar os ombros e faça a volta com controle.", alternative: "Crucifixo com halteres", progression: "Segure 1 segundo na posição de maior contração." },
      { name: "Tríceps na corda", muscle: "Tríceps", sets: 3, reps: 15, target: "12–15", rest: 60, type: "Isolado", notes: "Mantenha cotovelos próximos ao corpo e abra levemente a corda no final.", alternative: "Tríceps na barra reta", progression: "Aumente a carga quando completar as séries sem mexer os ombros." },
      { name: "Tríceps francês unilateral", muscle: "Tríceps", sets: 3, reps: 12, target: "10–12 por lado", rest: 60, type: "Unilateral", notes: "Aponte o cotovelo para cima e mova somente o antebraço.", alternative: "Tríceps testa na polia", progression: "Priorize amplitude confortável e controle dos cotovelos." },
      { name: "Elevação de pernas", muscle: "Abdômen inferior", sets: 3, reps: 15, target: "12–15", rest: 45, type: "Core", notes: "Eleve as pernas controlando a pelve, sem balançar o tronco.", alternative: "Abdominal reverso no banco", progression: "Aumente repetições antes de usar caneleira." },
      { name: "Prancha lateral", muscle: "Core e oblíquos", sets: 3, reps: 30, target: "30 segundos por lado", rest: 45, type: "Isometria", notes: "Alinhe ombro, quadril e tornozelo; mantenha o abdômen firme.", alternative: "Prancha lateral com joelho apoiado", progression: "Aumente 5 segundos conforme ficar mais estável.", unit: "seg" }
    ]
  },
  Sexta: {
    code: "E", name: "Glúteos + pernas completas", category: "PERNAS & GLÚTEOS", focus: "Volume e acabamento", duration: "65–75 min",
    description: "Fechamento da semana com ênfase em glúteos, pernas completas e controle do movimento.",
    warmup: "5 a 8 min de caminhada + mobilidade de quadril, ativação de glúteos e 2 séries leves de agachamento.",
    exercises: [
      { name: "Agachamento sumô", muscle: "Glúteos e adutores", sets: 4, reps: 12, target: "10–12", rest: 105, type: "Composto", notes: "Afaste os pés de forma confortável, direcione joelhos para fora e mantenha o tronco firme.", alternative: "Agachamento sumô no smith", progression: "Aumente a carga somente mantendo profundidade e joelhos estáveis." },
      { name: "Elevação pélvica no smith", muscle: "Glúteos", sets: 4, reps: 12, target: "10–12", rest: 120, type: "Composto", notes: "Segure a contração por 2 segundos no topo e evite compensar com a lombar.", alternative: "Elevação pélvica com barra", progression: "Comece com a carga que permite pausa no topo em todas as repetições." },
      { name: "Leg press pés altos", muscle: "Glúteos e posteriores", sets: 3, reps: 12, target: "10–12", rest: 105, type: "Composto", notes: "Posicione os pés um pouco mais altos na plataforma e mantenha a lombar apoiada.", alternative: "Leg press horizontal com pés altos", progression: "Aumente o peso quando controlar toda a amplitude." },
      { name: "Passada andando", muscle: "Glúteos e quadríceps", sets: 3, reps: 12, target: "12 passos por perna", rest: 90, type: "Unilateral", notes: "Dê passos consistentes, mantenha o tronco estável e evite bater o joelho no chão.", alternative: "Afundo estacionário", progression: "Primeiro domine a coordenação; depois acrescente halteres." },
      { name: "Stiff unilateral", muscle: "Posterior e glúteos", sets: 3, reps: 12, target: "10–12 por perna", rest: 75, type: "Unilateral", notes: "Incline o tronco com quadril alinhado e use apoio leve se precisar estabilizar.", alternative: "Stiff bilateral com halteres", progression: "Priorize equilíbrio e quadril nivelado." },
      { name: "Cadeira abdutora inclinada", muscle: "Glúteo médio", sets: 3, reps: 20, target: "15–20", rest: 60, type: "Isolado", notes: "Incline levemente o tronco à frente e abra os joelhos sem impulso.", alternative: "Abdução em pé na polia", progression: "Faça uma pausa curta na abertura máxima." },
      { name: "Panturrilha no leg press", muscle: "Panturrilhas", sets: 4, reps: 15, target: "12–15", rest: 60, type: "Isolado", notes: "Mova apenas os tornozelos, alongue embaixo e suba até a ponta dos pés.", alternative: "Panturrilha em pé", progression: "Aumente a carga sem encurtar a amplitude." }
    ]
  },
  Sábado: {
    code: "REC", name: "Recuperação ativa", category: "MOBILIDADE & BEM-ESTAR", focus: "Movimento leve", duration: "20–35 min",
    description: "Dia opcional de caminhada confortável, mobilidade e alongamento sem competir com a recuperação muscular.",
    warmup: "Comece devagar e escolha uma intensidade que permita conversar confortavelmente.",
    exercises: [
      { name: "Caminhada leve", muscle: "Condicionamento", sets: 1, reps: 25, target: "20–30 minutos", rest: 30, type: "Opcional", notes: "Caminhe em ritmo leve, sem transformar a recuperação em um treino intenso.", alternative: "Bicicleta ou elíptico leve", progression: "A ideia é se sentir melhor ao terminar, não se exaurir.", unit: "min" },
      { name: "Mobilidade de quadril", muscle: "Quadril e glúteos", sets: 2, reps: 10, target: "8–10 por lado", rest: 30, type: "Mobilidade", notes: "Faça movimentos confortáveis, controlados e sem dor.", alternative: "Alongamento dinâmico leve", progression: "Aumente a amplitude apenas dentro do conforto." },
      { name: "Alongamento leve", muscle: "Corpo inteiro", sets: 2, reps: 30, target: "20–30 segundos", rest: 30, type: "Mobilidade", notes: "Respire naturalmente e mantenha cada posição confortável.", alternative: "Yoga leve", progression: "Não force posições nem ultrapasse desconforto.", unit: "seg" }
    ]
  },
  Domingo: {
    code: "OFF", name: "Descanso e recuperação", category: "DESCANSO", focus: "Recupere para crescer", duration: "Sem pressa",
    description: "Músculos também evoluem fora da academia. Descanse, hidrate-se e prepare a próxima semana.",
    warmup: "Hoje o compromisso é com sono, alimentação, água e recuperação.", exercises: []
  }
};

const TRAINING_GUIDELINES = [
  { title: "Carga com técnica", description: "Escolha um peso desafiador, mas que permita terminar cada série com boa postura e 1 a 2 repetições ainda possíveis." },
  { title: "Progressão de verdade", description: "Quando atingir o topo das repetições em todas as séries com boa execução, aumente a carga na próxima sessão." },
  { title: "Descanse o necessário", description: "Use 90 a 120 segundos nos exercícios principais e 45 a 75 segundos nos isolados ou abdominais." },
  { title: "Recuperação também é treino", description: "Durma bem, respeite os dias leves e não mantenha exercícios que provoquem dor." },
  { title: "Consistência acima da pressa", description: "Acompanhe cargas e repetições. Pequenas melhorias repetidas valem mais que mudar o treino toda semana." }
];

const $ = (id) => document.getElementById(id);
const clone = (value) => JSON.parse(JSON.stringify(value));
const createId = () => globalThis.crypto?.randomUUID?.() || `iron-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const pad = (value) => String(value).padStart(2, "0");

function dateKey(date = new Date()) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function parseDate(value) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day, 12); }
function addDays(date, amount) { const next = new Date(date); next.setDate(next.getDate() + amount); return next; }
function monthKey(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`; }
function weekdayIndex(date) { return (date.getDay() + 6) % 7; }
function weekdayName(date) { return WEEKDAYS[weekdayIndex(date)]; }
function monthLabel(date) { return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`; }
function formatDuration(seconds) { const safe = Math.max(0, Math.floor(seconds || 0)); return `${pad(Math.floor(safe / 3600))}:${pad(Math.floor(safe % 3600 / 60))}:${pad(safe % 60)}`; }
function formatRest(seconds) { const safe = Math.max(0, Math.floor(seconds || 0)); return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`; }
function formatNumber(value) { return Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 }); }
function formatFriendlyDate(value) { return parseDate(value).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", ""); }

function createSets(exercise) {
  return Array.from({ length: exercise.sets }, () => ({ id: createId(), weight: Number(exercise.weight) || 0, reps: exercise.reps, rest: exercise.rest, done: false }));
}

function createExercise(template) {
  const exercise = clone(template);
  const count = Number(exercise.sets) || 3;
  exercise.id = createId();
  exercise.sets = createSets({ ...exercise, sets: count });
  return exercise;
}

function createWorkout(day) {
  const template = TRAINING_PROGRAM[day];
  return { ...clone(template), exercises: template.exercises.map(createExercise) };
}

function createMonth(date) {
  return { id: monthKey(date), year: date.getFullYear(), month: date.getMonth(), name: monthLabel(date), workouts: Object.fromEntries(WEEKDAYS.map((day) => [day, createWorkout(day)])) };
}

function defaultProfile() { return { name: "Jéssica", weight: 62, height: 163, goal: "Hipertrofia e definição", weeklyGoal: 5, waterGoal: 2200, autoRest: false }; }
function defaultTimer() { return { running: false, startedAt: null, elapsed: 0, date: null }; }

function createInitialState() {
  const today = new Date();
  return { schemaVersion: SCHEMA_VERSION, selectedDate: dateKey(today), months: [createMonth(today)], sessions: {}, history: [], hydration: {}, profile: defaultProfile(), workoutTimer: defaultTimer() };
}

function parseLegacyMonth(name) {
  const match = String(name || "").match(/(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+(\d{4})/i);
  if (!match) return null;
  const normalized = match[1].toLocaleLowerCase("pt-BR").replace("marco", "março");
  const index = MONTH_NAMES.findIndex((month) => month.toLocaleLowerCase("pt-BR") === normalized);
  return index < 0 ? null : new Date(Number(match[2]), index, 1, 12);
}

function mergeLegacyExercises(month, oldMonth) {
  for (const day of WEEKDAYS) {
    const oldExercises = oldMonth.workouts?.[day]?.exercises;
    if (!Array.isArray(oldExercises)) continue;
    for (const exercise of month.workouts[day].exercises) {
      const existing = oldExercises.find((item) => String(item.name || "").toLocaleLowerCase("pt-BR") === exercise.name.toLocaleLowerCase("pt-BR"));
      if (!existing?.sets?.length) continue;
      for (let index = 0; index < Math.min(existing.sets.length, exercise.sets.length); index += 1) {
        exercise.sets[index].weight = clamp(existing.sets[index].weight, 0, 1000);
        exercise.sets[index].reps = clamp(existing.sets[index].reps, 1, 100);
      }
    }
  }
}

function normalizeHistory(item) {
  const fallbackDate = item.date ? new Date(item.date) : new Date();
  const validDate = Number.isNaN(fallbackDate.getTime()) ? new Date() : fallbackDate;
  return { id: item.id || createId(), date: item.date || validDate.toISOString(), trainingDate: item.trainingDate || dateKey(validDate), month: item.month || monthLabel(validDate), day: item.day || weekdayName(validDate), workout: item.workout || "Treino", duration: Number(item.duration) || 0, totalSets: Number(item.totalSets) || 0, doneSets: Number(item.doneSets) || 0, volume: Number(item.volume) || 0, difficulty: item.difficulty || "Na medida certa", notes: item.notes || "", exercises: Array.isArray(item.exercises) ? item.exercises : [] };
}

function migrateState(raw) {
  const initial = createInitialState();
  if (!raw || typeof raw !== "object") return initial;
  if (raw.schemaVersion === SCHEMA_VERSION) {
    return { ...initial, ...raw, profile: { ...defaultProfile(), ...(raw.profile || {}) }, workoutTimer: { ...defaultTimer(), ...(raw.workoutTimer || {}) }, history: Array.isArray(raw.history) ? raw.history.map(normalizeHistory) : [], months: Array.isArray(raw.months) ? raw.months : initial.months, sessions: raw.sessions && typeof raw.sessions === "object" ? raw.sessions : {}, hydration: raw.hydration && typeof raw.hydration === "object" ? raw.hydration : {} };
  }
  initial.history = Array.isArray(raw.history) ? raw.history.map(normalizeHistory) : [];
  if (Array.isArray(raw.months)) {
    for (const oldMonth of raw.months) {
      const oldDate = parseLegacyMonth(oldMonth.name);
      if (!oldDate) continue;
      const existing = initial.months.find((item) => item.id === monthKey(oldDate));
      const migratedMonth = existing || createMonth(oldDate);
      mergeLegacyExercises(migratedMonth, oldMonth);
      if (!existing) initial.months.push(migratedMonth);
    }
  }
  return initial;
}

function loadState() {
  try { return migrateState(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return createInitialState(); }
}

let state = loadState();
let currentView = "today";
let calendarVisible = false;
let restSeconds = 90;
let restCountdown = 90;
let restInterval = null;
let workoutInterval = null;
let toastTimeout = null;
let deferredPrompt = null;
const expandedCompletedExercises = new Set();

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { showToast("Não foi possível salvar. Verifique o espaço disponível no navegador."); }
}

function selectedDate() { return parseDate(state.selectedDate); }

function getMonth(date = selectedDate()) {
  const key = monthKey(date);
  let month = state.months.find((item) => item.id === key);
  if (!month) { month = createMonth(date); state.months.push(month); state.months.sort((left, right) => left.id.localeCompare(right.id)); save(); }
  return month;
}

function cleanExercise(exercise) {
  const result = clone(exercise);
  result.id = createId();
  result.sets = result.sets.map((set) => ({ ...set, id: createId(), done: false }));
  return result;
}

function getSession(date = selectedDate()) {
  const key = dateKey(date);
  if (!state.sessions[key]) {
    const template = getMonth(date).workouts[weekdayName(date)] || createWorkout(weekdayName(date));
    state.sessions[key] = { date: key, workout: { ...clone(template), exercises: template.exercises.map(cleanExercise) }, completed: false, completedAt: null };
    save();
  }
  return state.sessions[key];
}

function currentWorkout() { return getSession().workout; }
function hasCompleted(date) { const key = typeof date === "string" ? date : dateKey(date); return Boolean(state.sessions[key]?.completed || state.history.some((item) => item.trainingDate === key)); }
function isWorkoutDay(date) { return weekdayIndex(date) < 5; }
function isRecoveryDay(date) { return weekdayIndex(date) >= 5; }
function workoutSets(workout = currentWorkout()) { return workout.exercises.flatMap((exercise) => exercise.sets); }
function workoutStats(workout = currentWorkout()) { const sets = workoutSets(workout); const completed = sets.filter((set) => set.done); return { totalSets: sets.length, doneSets: completed.length, volume: completed.reduce((sum, set) => sum + Number(set.weight || 0) * Number(set.reps || 0), 0), progress: sets.length ? Math.round(completed.length / sets.length * 100) : 0 }; }

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2700);
}

function renderGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  $("greetingText").textContent = `${greeting}, ${state.profile.name.split(" ")[0] || "Jéssica"}`;
  $("currentDateLabel").textContent = selectedDate().toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" }).replaceAll(".", "");
}

function renderHero() {
  const workout = currentWorkout();
  const stats = workoutStats(workout);
  $("heroBadge").textContent = workout.code === "OFF" ? "DIA DE DESCANSO" : workout.code === "REC" ? "RECUPERAÇÃO ATIVA" : `TREINO ${workout.code}`;
  $("heroDuration").textContent = workout.duration || "No seu ritmo";
  $("todayTitle").textContent = workout.name;
  $("todaySubtitle").textContent = workout.description;
  $("heroExercises").textContent = workout.exercises.length ? `${workout.exercises.length} exercícios` : "Recuperação completa";
  $("heroFocus").textContent = workout.focus;
  $("progressValue").textContent = `${stats.progress}%`;
  $("progressRing").style.background = `conic-gradient(#fff ${stats.progress}%, rgba(255,255,255,.2) ${stats.progress}%)`;
}

function startOfWeek(date) { return addDays(date, -weekdayIndex(date)); }

function renderWeekStrip() {
  const monday = startOfWeek(selectedDate());
  $("weekMonthTitle").textContent = monthLabel(selectedDate());
  $("weekStrip").innerHTML = WEEKDAYS.map((day, index) => {
    const date = addDays(monday, index);
    const classes = ["day-chip", dateKey(date) === state.selectedDate ? "is-selected" : "", dateKey(date) === dateKey() ? "is-today" : "", hasCompleted(date) ? "is-completed" : "", isWorkoutDay(date) ? "has-workout" : ""].filter(Boolean).join(" ");
    return `<button class="${classes}" data-select-date="${dateKey(date)}" aria-label="${day}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}"><small>${SHORT_DAYS[index]}</small><strong>${date.getDate()}</strong></button>`;
  }).join("");
}

function renderCalendarSelectors() {
  const date = selectedDate();
  $("monthSelect").innerHTML = MONTH_NAMES.map((month, index) => `<option value="${index}" ${index === date.getMonth() ? "selected" : ""}>${month}</option>`).join("");
  const currentYear = new Date().getFullYear();
  const years = new Set([currentYear - 1, currentYear, currentYear + 1, currentYear + 2, date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1]);
  $("yearSelect").innerHTML = [...years].sort((left, right) => left - right).map((year) => `<option value="${year}" ${year === date.getFullYear() ? "selected" : ""}>${year}</option>`).join("");
}

function renderCalendar() {
  renderCalendarSelectors();
  const selected = selectedDate();
  const first = new Date(selected.getFullYear(), selected.getMonth(), 1, 12);
  const gridStart = addDays(first, -weekdayIndex(first));
  const last = new Date(selected.getFullYear(), selected.getMonth() + 1, 0, 12);
  const cellCount = Math.ceil((weekdayIndex(first) + last.getDate()) / 7) * 7;
  const headers = SHORT_DAYS.map((day) => `<span class="calendar-weekday">${day}</span>`).join("");
  const days = Array.from({ length: cellCount }, (_, index) => {
    const date = addDays(gridStart, index);
    const key = dateKey(date);
    const classes = ["calendar-day", date.getMonth() !== selected.getMonth() ? "is-other-month" : "", key === state.selectedDate ? "is-selected" : "", key === dateKey() ? "is-today" : "", hasCompleted(date) ? "is-completed" : "", isWorkoutDay(date) ? "has-workout" : ""].filter(Boolean).join(" ");
    return `<button class="${classes}" data-select-date="${key}" aria-label="${weekdayName(date)}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]} de ${date.getFullYear()}">${date.getDate()}</button>`;
  }).join("");
  $("calendarGrid").innerHTML = headers + days;
  $("calendarPanel").classList.toggle("hidden", !calendarVisible);
}

function setSelectedDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
  state.selectedDate = value;
  save();
  renderAll();
}

function changeMonth(amount) {
  const date = selectedDate();
  const originalDay = date.getDate();
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(originalDay, lastDay));
  setSelectedDate(dateKey(target));
}

function setCalendarMonth(month, year) {
  const day = Math.min(selectedDate().getDate(), new Date(year, month + 1, 0).getDate());
  setSelectedDate(dateKey(new Date(year, month, day, 12)));
}

function normalizeMotionName(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function getMotionId(exercise) {
  if (EXERCISE_MOTION_IDS[exercise.name]) return EXERCISE_MOTION_IDS[exercise.name];
  const searchable = normalizeMotionName(`${exercise.name} ${exercise.muscle || ""}`);
  return MOTION_FALLBACKS.find(([term]) => searchable.includes(term))?.[1] || null;
}

function getMotionIllustrationType(motionId) {
  if (/Leg_Press|Calf_Press/.test(motionId)) return "leg-press";
  if (/Hip_Thrust|Hip_Raise|Bench_Press|Lying_Leg/.test(motionId)) return "floor";
  if (/Plank|Side_Bridge/.test(motionId)) return "plank";
  if (/Thigh_|Leg_Extensions|Seated_|Butterfly|Cable_Crunch/.test(motionId)) return "machine";
  if (/Pulldown|Face_Pull|Pushdown|Glute_Kickback/.test(motionId)) return "cable";
  if (/Walking|Lunge|Stretch|Hip_Flexor/.test(motionId)) return "walking";
  return "standing";
}

function renderMotionIllustration(exercise, motionId) {
  const type = getMotionIllustrationType(motionId);
  const safeId = String(exercise.id || motionId).replace(/[^a-zA-Z0-9_-]/g, "");
  const skin = "#f3b7a5";
  const legging = "#cf8eff";
  const shoe = "#efe6fa";
  const equipment = {
    "leg-press": '<path d="M76 186h259M109 179l49-63h81l50-64m-5-5 30 25m-149 98h61" stroke="#a99abd" stroke-width="9"/><path class="motion-machine-load" d="m280 48 34 25" stroke="#d7cde3" stroke-width="12"/><rect x="128" y="116" width="51" height="12" rx="6" fill="#877593" transform="rotate(-17 128 116)"/>',
    floor: '<path d="M82 179h246M97 159h75m-69 0v19m56-19v19" stroke="#a99abd" stroke-width="8"/><path class="motion-machine-load" d="M181 107h98m-97-11v22m98-22v22" stroke="#d5cadd" stroke-width="9"/>',
    plank: '<path d="M93 180h236" stroke="#a99abd" stroke-width="7"/><rect x="113" y="174" width="185" height="10" rx="5" fill="#9779b1"/>',
    machine: '<path d="M95 180h220m-183 0V77m0 31h69m-25 44h78m-18 0v28m65-74v74" stroke="#a99abd" stroke-width="8"/><rect x="127" y="92" width="20" height="53" rx="8" fill="#785f87"/><rect x="174" y="145" width="77" height="13" rx="6" fill="#785f87"/><path class="motion-machine-load" d="M299 114h-42m41 15h-30" stroke="#d5cadd" stroke-width="8"/>',
    cable: '<path d="M100 182h237M112 182V52h203v130m-203-34h53" stroke="#a99abd" stroke-width="8"/><circle cx="310" cy="68" r="8" fill="#d6cbe1"/><path class="motion-machine-load" d="m307 70-65 55" stroke="#d6cbe1" stroke-width="4"/><path d="M105 95h17m-17 15h17m-17 15h17" stroke="#705f7b" stroke-width="6"/>',
    walking: '<path d="M85 183h242m-22 0 21-86m-82 5h86" stroke="#a99abd" stroke-width="8"/><path d="M115 175h175" stroke="#786884" stroke-width="9"/>',
    standing: '<path d="M87 183h243m-214 0V75m193 108V75m-199 17h27m160 0h25" stroke="#a99abd" stroke-width="8"/><path class="motion-machine-load" d="M153 88h121m-113-12v24m106-24v24" stroke="#ded4e8" stroke-width="8"/>'
  }[type];

  const people = {
    "leg-press": `<g class="motion-person"><path d="m163 133 28 15 37-9" stroke="${skin}" stroke-width="10"/><path d="m174 132 43 22" stroke="#bd78ed" stroke-width="22"/><g class="motion-leg-back"><path d="m213 151 38-30 25-32" stroke="${legging}" stroke-width="15"/><path d="m270 87 14 10" stroke="${shoe}" stroke-width="9"/></g><g class="motion-leg-front"><path d="m212 151 45-26 28-37" stroke="${legging}" stroke-width="15"/><path d="m281 85 15 10" stroke="${shoe}" stroke-width="9"/></g><circle cx="157" cy="112" r="15" fill="${skin}"/><path d="M141 110c0-19 25-25 32-4l-6 7-8-12-18 12z" fill="#342435"/></g>`,
    floor: `<g class="motion-person"><circle cx="155" cy="131" r="14" fill="${skin}"/><path d="M140 126c2-15 24-18 29-1l-9 6-8-10-12 10z" fill="#342435"/><path d="m167 143 47 3 29-25" stroke="#be7dec" stroke-width="22"/><g class="motion-leg-back"><path d="m232 130 25 26 22 15" stroke="${legging}" stroke-width="15"/><path d="m275 172 15-1" stroke="${shoe}" stroke-width="9"/></g><g class="motion-leg-front"><path d="m233 125 31 24 17 22" stroke="${legging}" stroke-width="15"/><path d="m276 173 17-1" stroke="${shoe}" stroke-width="9"/></g><path d="m184 141 28-26 28 1" stroke="${skin}" stroke-width="9"/></g>`,
    plank: `<g class="motion-person"><circle cx="151" cy="117" r="14" fill="${skin}"/><path d="M137 111c3-14 25-17 29-1l-9 6-9-10-11 11z" fill="#342435"/><path d="m161 128 63 13" stroke="#bd78ed" stroke-width="21"/><path class="motion-arm-front" d="m173 135-15 32-23 4" stroke="${skin}" stroke-width="10"/><g class="motion-leg-front"><path d="m220 141 45 13 37 14" stroke="${legging}" stroke-width="15"/><path d="m296 172 16-1" stroke="${shoe}" stroke-width="9"/></g></g>`,
    machine: `<g class="motion-person"><circle cx="175" cy="89" r="14" fill="${skin}"/><path d="M160 84c1-17 26-20 31-2l-8 8-9-13-14 13z" fill="#342435"/><path d="m175 109 4 36 45 5" stroke="#bd78ed" stroke-width="20"/><path class="motion-arm-front" d="m183 114 25 20 29-11" stroke="${skin}" stroke-width="9"/><g class="motion-leg-back"><path d="m223 151 29 10 21 7" stroke="${legging}" stroke-width="15"/><path d="m270 170 15-1" stroke="${shoe}" stroke-width="9"/></g><g class="motion-leg-front"><path d="m223 150 29 3 29 6" stroke="${legging}" stroke-width="15"/><path d="m280 162 14-2" stroke="${shoe}" stroke-width="9"/></g></g>`,
    cable: `<g class="motion-person"><circle cx="194" cy="86" r="14" fill="${skin}"/><path d="M179 82c2-17 27-20 32-2l-8 7-10-12-14 13z" fill="#342435"/><path d="m192 105 3 41" stroke="#bd78ed" stroke-width="21"/><g class="motion-arm-front"><path d="m201 112 27 20 26-18" stroke="${skin}" stroke-width="10"/></g><g class="motion-leg-back"><path d="m192 142 20 28" stroke="${legging}" stroke-width="15"/><path d="m208 174 16-1" stroke="${shoe}" stroke-width="9"/></g><g class="motion-leg-front"><path d="m198 141-10 30" stroke="${legging}" stroke-width="15"/><path d="m181 175 17-1" stroke="${shoe}" stroke-width="9"/></g></g>`,
    walking: `<g class="motion-person"><circle cx="190" cy="77" r="14" fill="${skin}"/><path d="M175 73c2-17 27-20 32-2l-8 7-10-12-14 13z" fill="#342435"/><path d="m189 98 6 43" stroke="#bd78ed" stroke-width="21"/><g class="motion-arm-front"><path d="m195 108 25 19 24-14" stroke="${skin}" stroke-width="10"/></g><g class="motion-leg-back"><path d="m190 140-23 31" stroke="${legging}" stroke-width="15"/><path d="m156 175 19-1" stroke="${shoe}" stroke-width="9"/></g><g class="motion-leg-front"><path d="m198 141 26 26" stroke="${legging}" stroke-width="15"/><path d="m220 172 19-1" stroke="${shoe}" stroke-width="9"/></g></g>`,
    standing: `<g class="motion-person"><circle cx="199" cy="73" r="15" fill="${skin}"/><path d="M183 68c2-19 29-23 34-2l-9 8-10-13-15 14z" fill="#342435"/><path d="m197 95 3 42" stroke="#bd78ed" stroke-width="23"/><g class="motion-arm-front"><path d="m200 104 24 23 27-28" stroke="${skin}" stroke-width="10"/></g><g class="motion-leg-back"><path d="m197 134-15 34" stroke="${legging}" stroke-width="16"/><path d="m174 173 18-1" stroke="${shoe}" stroke-width="9"/></g><g class="motion-leg-front"><path d="m204 134 17 35" stroke="${legging}" stroke-width="16"/><path d="m215 173 19-1" stroke="${shoe}" stroke-width="9"/></g></g>`
  }[type];

  return `<svg class="motion-illustration motion-type-${type}" viewBox="0 0 420 220" role="img" aria-label="Ilustração animada de ${escapeHTML(exercise.name)}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="motion-bg-${safeId}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#21132d"/><stop offset="1" stop-color="#372044"/></linearGradient></defs><rect width="420" height="220" fill="url(#motion-bg-${safeId})"/><circle cx="338" cy="61" r="48" fill="#aa68ec" opacity=".08"/><circle cx="83" cy="167" r="57" fill="#f296c2" opacity=".07"/><g fill="none" stroke-linecap="round" stroke-linejoin="round">${equipment}${people}</g><text x="19" y="30" fill="#e7d4fa" font-size="11" font-family="Arial,sans-serif" font-weight="700" letter-spacing="1.3">DEMONSTRAÇÃO DO MOVIMENTO</text></svg>`;
}

function renderExerciseMotion(exercise, variant = "card") {
  const motionId = getMotionId(exercise);
  if (!motionId) return "";
  const base = `${EXERCISE_IMAGE_BASE}/${encodeURIComponent(motionId)}`;
  const fallback = `${EXERCISE_IMAGE_FALLBACK}/${encodeURIComponent(motionId)}`;
  return `<button type="button" class="exercise-motion ${variant === "details" ? "motion-details" : ""}" data-motion="${escapeHTML(exercise.id)}" data-motion-source="${escapeHTML(motionId)}" aria-label="Pausar demonstração animada de ${escapeHTML(exercise.name)}">${renderMotionIllustration(exercise, motionId)}<img class="motion-frame motion-frame-start" src="${base}/0.jpg" data-fallback-src="${fallback}/0.jpg" alt="Posição inicial de ${escapeHTML(exercise.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><img class="motion-frame motion-frame-end" src="${base}/1.jpg" data-fallback-src="${fallback}/1.jpg" alt="Posição final de ${escapeHTML(exercise.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="motion-badge"><span class="motion-dot"></span> MOVIMENTO</span><span class="motion-helper">Toque para pausar</span></button>`;
}

function renderExercise(exercise, index) {
  const allDone = exercise.sets.length > 0 && exercise.sets.every((set) => set.done);
  const isCollapsed = allDone && !expandedCompletedExercises.has(exercise.id);
  const typeLabel = exercise.unit === "seg" ? "Tempo" : exercise.unit === "min" ? "Min" : "Reps";
  const rows = exercise.sets.map((set, setIndex) => `<tr class="set-row ${set.done ? "is-done" : ""}"><td class="set-number">${pad(setIndex + 1)}</td><td><input type="number" inputmode="decimal" min="0" max="1000" step="0.5" value="${escapeHTML(set.weight)}" data-field="weight" data-ex="${exercise.id}" data-set="${set.id}" aria-label="Carga da série ${setIndex + 1} em quilogramas"></td><td><input type="number" inputmode="numeric" min="1" max="100" value="${escapeHTML(set.reps)}" data-field="reps" data-ex="${exercise.id}" data-set="${set.id}" aria-label="${typeLabel} da série ${setIndex + 1}"></td><td><input type="number" inputmode="numeric" min="15" max="600" step="15" value="${escapeHTML(set.rest)}" data-field="rest" data-ex="${exercise.id}" data-set="${set.id}" aria-label="Descanso da série ${setIndex + 1} em segundos"></td><td><button class="check-button ${set.done ? "is-done" : ""}" data-check="${exercise.id}" data-set="${set.id}" aria-label="${set.done ? "Desmarcar" : "Concluir"} série ${setIndex + 1}">${icon("check")}</button></td></tr>`).join("");
  const collapseButton = allDone ? `<button class="icon-button completed-toggle" data-toggle-completed="${exercise.id}" aria-expanded="${!isCollapsed}" aria-label="${isCollapsed ? "Abrir" : "Recolher"} exercício concluído">${icon("chevron-right")}</button>` : "";
  return `<article class="exercise-card ${allDone ? "is-complete" : ""} ${isCollapsed ? "is-collapsed" : ""}"><div class="exercise-top"><div class="exercise-title-wrap"><span class="exercise-number">${allDone ? "✓" : pad(index + 1)}</span><div><h3>${escapeHTML(exercise.name)}</h3><p>${exercise.sets.length} séries · ${escapeHTML(exercise.target || `${exercise.sets[0]?.reps || 12} repetições`)}${isCollapsed ? " · Concluído" : ""}</p></div></div><div class="exercise-actions">${collapseButton}<button class="icon-button" data-details="${exercise.id}" aria-label="Ver execução">${icon("info")}</button><button class="icon-button" data-edit="${exercise.id}" aria-label="Editar exercício">${icon("edit")}</button><button class="icon-button remove-exercise" data-delete="${exercise.id}" aria-label="Excluir exercício">${icon("trash")}</button></div></div><div class="exercise-content"><div class="exercise-tags"><span class="muscle-tag">${escapeHTML(exercise.muscle || "Personalizado")}</span><span>${escapeHTML(exercise.type || "Exercício")}</span><span>${escapeHTML(exercise.sets[0]?.rest || 90)}s de descanso</span></div>${renderExerciseMotion(exercise)}<table class="set-table"><thead><tr><th>Série</th><th>Carga kg</th><th>${typeLabel}</th><th>Desc. s</th><th>✓</th></tr></thead><tbody>${rows}</tbody></table><div class="exercise-tip">${icon("sparkles")}<span>${escapeHTML(exercise.notes || "Mantenha a execução controlada e ajuste a carga ao seu nível.")}</span></div><div class="exercise-footer"><button class="button button-soft" data-add-set="${exercise.id}">${icon("plus")} Série</button><button class="button button-outline" data-complete="${exercise.id}">${allDone ? "Desmarcar tudo" : "Concluir exercício"}</button></div></div></article>`;
}

function renderWorkout() {
  const workout = currentWorkout();
  $("exerciseCountTitle").textContent = workout.exercises.length ? `${workout.exercises.length} exercícios para hoje` : "Hoje é dia de descansar";
  $("warmupText").textContent = workout.warmup;
  $("workoutList").innerHTML = workout.exercises.length ? workout.exercises.map(renderExercise).join("") : `<article class="exercise-card"><div class="empty-message">Seu corpo também precisa de pausa para recuperar e crescer. Aproveite para dormir bem, se hidratar e organizar a próxima semana.</div></article>`;
  $("restTimerCard").classList.toggle("hidden", workout.exercises.length === 0);
  $("workoutControlCard").classList.toggle("hidden", workout.exercises.length === 0);
  $("cardioCard").classList.toggle("hidden", !workout.cardio);
  if (workout.cardio) $("cardioCard").innerHTML = `<strong>Cardio opcional, sem exageros</strong><p>${escapeHTML(workout.cardio)}</p>`;
}

function findExercise(id) { return currentWorkout().exercises.find((exercise) => exercise.id === id); }

function updateSet(exerciseId, setId, field, rawValue) {
  const exercise = findExercise(exerciseId);
  const set = exercise?.sets.find((item) => item.id === setId);
  if (!set || !["weight", "reps", "rest"].includes(field)) return;
  const limits = { weight: [0, 1000], reps: [1, 100], rest: [15, 600] }[field];
  set[field] = clamp(rawValue, limits[0], limits[1]);
  save();
  renderHero();
}

function toggleSet(exerciseId, setId) {
  const exercise = findExercise(exerciseId);
  const set = exercise?.sets.find((item) => item.id === setId);
  if (!set) return;
  set.done = !set.done;
  expandedCompletedExercises.delete(exerciseId);
  if (set.done) {
    restSeconds = set.rest || 90;
    restCountdown = restSeconds;
    $("restTimer").textContent = formatRest(restCountdown);
    updateRestPresets();
    if (state.profile.autoRest) startRest();
  }
  save();
  renderHero();
  renderWorkout();
}

function toggleExercise(exerciseId) {
  const exercise = findExercise(exerciseId);
  if (!exercise) return;
  const markDone = !exercise.sets.every((set) => set.done);
  exercise.sets.forEach((set) => { set.done = markDone; });
  expandedCompletedExercises.delete(exerciseId);
  save();
  renderHero();
  renderWorkout();
  showToast(markDone ? "Exercício concluído. Boa!" : "Séries desmarcadas.");
}

function toggleCompletedExercise(exerciseId) {
  const exercise = findExercise(exerciseId);
  if (!exercise?.sets.length || !exercise.sets.every((set) => set.done)) return;
  if (expandedCompletedExercises.has(exerciseId)) expandedCompletedExercises.delete(exerciseId);
  else expandedCompletedExercises.add(exerciseId);
  renderWorkout();
}

function addSet(exerciseId) {
  const exercise = findExercise(exerciseId);
  if (!exercise) return;
  if (exercise.sets.length >= 12) return showToast("Este exercício já tem 12 séries.");
  const previous = exercise.sets.at(-1) || { weight: 0, reps: 12, rest: 90 };
  exercise.sets.push({ id: createId(), weight: previous.weight, reps: previous.reps, rest: previous.rest, done: false });
  save(); renderHero(); renderWorkout(); showToast("Nova série adicionada.");
}

function deleteExercise(exerciseId) {
  const exercise = findExercise(exerciseId);
  if (!exercise || !window.confirm(`Excluir ${exercise.name} deste treino?`)) return;
  currentWorkout().exercises = currentWorkout().exercises.filter((item) => item.id !== exerciseId);
  save(); renderHero(); renderWorkout(); showToast("Exercício removido deste dia.");
}

function openExerciseDialog(exerciseId = "") {
  const exercise = exerciseId ? findExercise(exerciseId) : null;
  $("exerciseDialogTitle").textContent = exercise ? "Editar exercício" : "Novo exercício";
  $("editingExerciseId").value = exercise?.id || "";
  $("exerciseName").value = exercise?.name || "";
  $("exerciseSets").value = exercise?.sets.length || 3;
  $("exerciseReps").value = exercise?.sets[0]?.reps || 12;
  $("exerciseWeight").value = exercise?.sets[0]?.weight || 0;
  $("exerciseRest").value = exercise?.sets[0]?.rest || 90;
  $("exerciseMuscle").value = exercise?.muscle || "";
  $("exerciseNotes").value = exercise?.notes || "";
  $("exerciseDialog").showModal();
}

function saveExercise() {
  const name = $("exerciseName").value.trim();
  if (!name) return showToast("Digite o nome do exercício.");
  const count = clamp($("exerciseSets").value, 1, 12);
  const reps = clamp($("exerciseReps").value, 1, 100);
  const weight = clamp($("exerciseWeight").value, 0, 1000);
  const rest = clamp($("exerciseRest").value, 15, 600);
  const editing = findExercise($("editingExerciseId").value);
  if (editing) {
    editing.name = name; editing.muscle = $("exerciseMuscle").value.trim() || "Personalizado"; editing.notes = $("exerciseNotes").value.trim(); editing.target = `${reps} repetições`;
    editing.sets = editing.sets.slice(0, count);
    while (editing.sets.length < count) editing.sets.push({ id: createId(), weight, reps, rest, done: false });
    editing.sets.forEach((set) => { set.reps = reps; set.rest = rest; if (!set.weight) set.weight = weight; });
  } else {
    currentWorkout().exercises.push(createExercise({ name, muscle: $("exerciseMuscle").value.trim() || "Personalizado", sets: count, reps, weight, target: `${reps} repetições`, rest, type: "Personalizado", notes: $("exerciseNotes").value.trim(), alternative: "Adapte conforme os equipamentos disponíveis.", progression: "Aumente a carga somente com boa execução." }));
  }
  save(); $("exerciseDialog").close(); renderHero(); renderWorkout(); showToast(editing ? "Exercício atualizado." : "Exercício adicionado ao treino.");
}

function showExerciseDetails(exerciseId) {
  const exercise = findExercise(exerciseId);
  if (!exercise) return;
  $("detailsMuscle").textContent = exercise.muscle || "PERSONALIZADO";
  $("detailsName").textContent = exercise.name;
  $("detailsContent").innerHTML = `${renderExerciseMotion(exercise, "details")}<div class="detail-metrics"><span><strong>${exercise.sets.length}</strong>Séries</span><span><strong>${escapeHTML(exercise.target || "12")}</strong>Repetições</span><span><strong>${exercise.sets[0]?.rest || 90}s</strong>Descanso</span></div><div class="detail-block"><strong>COMO EXECUTAR</strong><p>${escapeHTML(exercise.notes || "Faça o movimento com controle, mantendo postura confortável.")}</p></div><div class="detail-block"><strong>SE O APARELHO ESTIVER OCUPADO</strong><p>${escapeHTML(exercise.alternative || "Escolha outro movimento para o mesmo grupo muscular.")}</p></div><div class="detail-block"><strong>QUANDO AUMENTAR A CARGA</strong><p>${escapeHTML(exercise.progression || "Aumente apenas quando completar todas as repetições com boa execução.")}</p></div>`;
  $("detailsVideoLink").href = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exercise.name} execução correta musculação`)}`;
  $("exerciseDetailsDialog").showModal();
}

function workoutElapsed() {
  const timer = state.workoutTimer;
  let elapsed = Number(timer.elapsed) || 0;
  if (timer.running && timer.startedAt) elapsed += Math.floor((Date.now() - timer.startedAt) / 1000);
  return Math.max(elapsed, 0);
}

function renderWorkoutTimer() {
  const timer = state.workoutTimer;
  const sameDate = !timer.date || timer.date === state.selectedDate;
  const workoutStarted = timer.date === state.selectedDate;
  $("workoutTimer").textContent = sameDate ? formatDuration(workoutElapsed()) : "00:00:00";
  $("timerStatus").textContent = timer.running && sameDate ? "Treino em andamento" : workoutStarted ? "Treino pausado" : "Pronta para começar?";
  $("startWorkoutBtn").classList.toggle("hidden", timer.running && sameDate);
  $("pauseWorkoutBtn").classList.toggle("hidden", !timer.running || !sameDate);
  $("startWorkoutBtn").innerHTML = `${icon("play")} ${workoutStarted ? "Continuar" : "Iniciar"}`;
  $("finishWorkoutBtn").disabled = !workoutStarted;
  $("finishWorkoutBtn").setAttribute("aria-disabled", String(!workoutStarted));
}

function startWorkout() {
  if (state.workoutTimer.running && state.workoutTimer.date !== state.selectedDate) return showToast("Pause o treino que já está em andamento antes de iniciar outro.");
  if (state.workoutTimer.running) return;
  if (state.workoutTimer.date && state.workoutTimer.date !== state.selectedDate) state.workoutTimer = defaultTimer();
  state.workoutTimer.running = true; state.workoutTimer.startedAt = Date.now(); state.workoutTimer.date = state.selectedDate;
  save(); clearInterval(workoutInterval); workoutInterval = setInterval(renderWorkoutTimer, 1000); renderWorkoutTimer(); showToast("Treino iniciado. Bora!");
}

function pauseWorkout() {
  if (!state.workoutTimer.running) return;
  state.workoutTimer.elapsed = workoutElapsed(); state.workoutTimer.running = false; state.workoutTimer.startedAt = null;
  save(); clearInterval(workoutInterval); renderWorkoutTimer(); showToast("Treino pausado.");
}

function updateRestPresets() { document.querySelectorAll("#restPresets [data-time]").forEach((button) => button.classList.toggle("active-rest", Number(button.dataset.time) === restSeconds)); }

function startRest() {
  clearInterval(restInterval);
  restCountdown = restSeconds;
  $("restTimer").textContent = formatRest(restCountdown);
  $("startRestBtn").innerHTML = `${icon("repeat")} Reiniciar`;
  restInterval = setInterval(() => {
    restCountdown -= 1;
    $("restTimer").textContent = formatRest(restCountdown);
    if (restCountdown <= 0) {
      clearInterval(restInterval); $("startRestBtn").innerHTML = `${icon("play")} Iniciar`;
      if ("vibrate" in navigator) navigator.vibrate([160, 90, 160]);
      showToast("Intervalo finalizado. Próxima série!");
    }
  }, 1000);
}

function openFinishDialog() {
  const stats = workoutStats();
  if (!stats.totalSets) return showToast("Hoje é dia de recuperação; não há treino para finalizar.");
  if (state.workoutTimer.date !== state.selectedDate) return showToast("Inicie o treino antes de finalizar.");
  if (!stats.doneSets) return showToast("Marque pelo menos uma série antes de finalizar.");
  const duration = state.workoutTimer.date === state.selectedDate ? workoutElapsed() : 0;
  $("finishSummary").innerHTML = `<div class="finish-stat"><strong>${stats.doneSets}/${stats.totalSets}</strong><span>Séries</span></div><div class="finish-stat"><strong>${formatDuration(duration).slice(0, 5)}</strong><span>Tempo</span></div><div class="finish-stat"><strong>${formatNumber(stats.volume)} kg</strong><span>Volume</span></div>`;
  $("finishDialog").showModal();
}

function confirmFinish() {
  const session = getSession();
  const stats = workoutStats(session.workout);
  if (!stats.doneSets) return showToast("Marque pelo menos uma série concluída.");
  if (session.completed && !window.confirm("Este treino já foi salvo. Deseja adicionar um novo registro ao histórico?")) return;
  const duration = state.workoutTimer.date === state.selectedDate ? workoutElapsed() : 0;
  state.history.unshift(normalizeHistory({ id: createId(), date: new Date().toISOString(), trainingDate: state.selectedDate, month: monthLabel(selectedDate()), day: weekdayName(selectedDate()), workout: session.workout.name, duration, totalSets: stats.totalSets, doneSets: stats.doneSets, volume: stats.volume, difficulty: $("difficultySelect").value, notes: $("workoutNotes").value.trim(), exercises: session.workout.exercises.map((exercise) => ({ name: exercise.name, muscle: exercise.muscle, bestWeight: Math.max(0, ...exercise.sets.filter((set) => set.done).map((set) => Number(set.weight) || 0)), completedSets: exercise.sets.filter((set) => set.done).length })) }));
  session.completed = true; session.completedAt = new Date().toISOString();
  if (state.workoutTimer.date === state.selectedDate) { state.workoutTimer = defaultTimer(); clearInterval(workoutInterval); }
  clearInterval(restInterval); $("workoutNotes").value = ""; $("finishDialog").close(); save(); renderAll(); showToast("Treino salvo! Sua evolução foi registrada.");
}

function hydrationKey() { return state.selectedDate; }

function renderHydration() {
  const amount = Number(state.hydration[hydrationKey()]) || 0;
  const goal = Number(state.profile.waterGoal) || 2200;
  $("waterAmount").textContent = `${formatNumber(amount)} / ${formatNumber(goal)} ml`;
  $("waterProgressFill").style.width = `${Math.min(100, amount / goal * 100)}%`;
}

function changeWater(amount) {
  const key = hydrationKey();
  state.hydration[key] = clamp((Number(state.hydration[key]) || 0) + amount, 0, 10000);
  save(); renderHydration();
  if (amount > 0 && state.hydration[key] >= state.profile.waterGoal && state.hydration[key] - amount < state.profile.waterGoal) showToast("Meta de água alcançada. Perfeito!");
}

function renderPlan() {
  const month = getMonth();
  $("planOverview").innerHTML = `<article class="overview-tile"><strong>3x</strong><span>Pernas e glúteos</span></article><article class="overview-tile"><strong>2x</strong><span>Superiores e core</span></article><article class="overview-tile"><strong>2x</strong><span>Recuperação</span></article>`;
  $("planDays").innerHTML = WEEKDAYS.map((day, index) => {
    const workout = month.workouts[day] || createWorkout(day);
    const previews = workout.exercises.slice(0, 3).map((exercise) => `<span>${escapeHTML(exercise.name)}</span>`).join("");
    const extra = workout.exercises.length > 3 ? `<span>+${workout.exercises.length - 3}</span>` : "";
    return `<article class="plan-day-card ${day === weekdayName(selectedDate()) ? "is-selected" : ""} ${index >= 5 ? "is-recovery" : ""}"><div class="plan-day-header"><div><p class="eyebrow">${day.toLocaleUpperCase("pt-BR")}</p><h3>${escapeHTML(workout.name)}</h3></div><span>${escapeHTML(workout.duration)}</span></div><p>${escapeHTML(workout.description)}</p><div class="plan-exercise-preview">${previews}${extra || (!previews ? "<span>Sono, água e recuperação</span>" : "")}</div><button class="button button-soft button-small" data-plan-day="${index}">Abrir ${day.toLocaleLowerCase("pt-BR")}</button></article>`;
  }).join("");
  $("trainingGuidelines").innerHTML = TRAINING_GUIDELINES.map((guideline, index) => `<article class="guideline-item"><span class="guideline-index">${pad(index + 1)}</span><div><strong>${escapeHTML(guideline.title)}</strong><p>${escapeHTML(guideline.description)}</p></div></article>`).join("");
}

function openPlanDay(index) {
  const monday = startOfWeek(selectedDate());
  setSelectedDate(dateKey(addDays(monday, index)));
  showView("today");
}

function resetPlan() {
  if (!window.confirm("Restaurar os treinos originais deste mês? Os treinos já finalizados e o histórico serão preservados.")) return;
  const current = getMonth();
  const fresh = createMonth(selectedDate());
  current.workouts = fresh.workouts;
  for (const [key, session] of Object.entries(state.sessions)) if (key.startsWith(`${current.id}-`) && !session.completed) delete state.sessions[key];
  save(); renderAll(); showToast("Treinos originais restaurados.");
}

function countStreak() {
  const completed = new Set(state.history.map((item) => item.trainingDate));
  let streak = 0;
  let cursor = new Date();
  for (let guard = 0; guard < 366; guard += 1) {
    if (!isWorkoutDay(cursor)) { cursor = addDays(cursor, -1); continue; }
    if (completed.has(dateKey(cursor))) { streak += 1; cursor = addDays(cursor, -1); continue; }
    if (guard === 0 && dateKey(cursor) === dateKey()) { cursor = addDays(cursor, -1); continue; }
    break;
  }
  return streak;
}

function renderWeeklyChart() {
  const currentMonday = startOfWeek(new Date());
  const bars = Array.from({ length: 6 }, (_, index) => {
    const monday = addDays(currentMonday, (index - 5) * 7);
    const sunday = addDays(monday, 6);
    const dates = new Set(state.history.filter((item) => item.trainingDate >= dateKey(monday) && item.trainingDate <= dateKey(sunday)).map((item) => item.trainingDate));
    const count = dates.size;
    const height = Math.max(6, Math.round(Math.min(count, 7) / 7 * 100));
    return `<div class="chart-column"><div class="chart-bar-wrap"><div class="chart-bar ${count ? "has-value" : ""}" style="height:${height}%">${count ? `<span>${count}</span>` : ""}</div></div><small>${pad(monday.getDate())}/${pad(monday.getMonth() + 1)}</small></div>`;
  });
  $("weeklyChart").innerHTML = bars.join("");
}

function renderRecords() {
  const records = new Map();
  for (const entry of state.history) {
    for (const exercise of entry.exercises || []) {
      if (!exercise.bestWeight) continue;
      const current = records.get(exercise.name);
      if (!current || exercise.bestWeight > current.bestWeight) records.set(exercise.name, { ...exercise, date: entry.trainingDate });
    }
  }
  const best = [...records.values()].sort((left, right) => right.bestWeight - left.bestWeight).slice(0, 6);
  $("personalRecords").innerHTML = best.length ? best.map((record) => `<article class="record-item"><div><strong>${escapeHTML(record.name)}</strong><p>${escapeHTML(record.muscle || "Treino")} · ${formatFriendlyDate(record.date)}</p></div><span class="record-weight">${formatNumber(record.bestWeight)} kg</span></article>`).join("") : `<p class="empty-message">Registre as cargas e finalize um treino para ver suas melhores marcas aqui.</p>`;
}

function renderHistory() {
  $("historyCount").textContent = String(state.history.length);
  $("historyList").innerHTML = state.history.length ? state.history.slice(0, 30).map((entry) => `<article class="history-item"><strong>${escapeHTML(entry.workout)}</strong><p>${formatFriendlyDate(entry.trainingDate)} · ${escapeHTML(entry.day)} · ${escapeHTML(entry.difficulty)}</p><div class="history-meta"><span>${entry.doneSets}/${entry.totalSets} séries</span><span>${formatDuration(entry.duration)}</span><span>${formatNumber(entry.volume)} kg</span></div>${entry.notes ? `<span>${escapeHTML(entry.notes)}</span>` : ""}</article>`).join("") : `<p class="empty-message">Seus treinos finalizados vão aparecer aqui, com tempo, séries, carga total e observações.</p>`;
}

function renderProgress() {
  const date = selectedDate();
  const key = monthKey(date);
  const monthly = state.history.filter((entry) => entry.trainingDate.startsWith(key));
  const monthlyDays = new Set(monthly.map((entry) => entry.trainingDate));
  const volume = monthly.reduce((sum, entry) => sum + entry.volume, 0);
  const totalTime = monthly.reduce((sum, entry) => sum + entry.duration, 0);
  $("progressPeriodLabel").textContent = `Acompanhe seus números em ${monthLabel(date)}.`;
  $("progressStats").innerHTML = `<article class="stat-tile"><strong>${monthlyDays.size}</strong><span>Treinos no mês</span></article><article class="stat-tile"><strong>${countStreak()}</strong><span>Dias de constância</span></article><article class="stat-tile"><strong>${formatNumber(volume)}</strong><span>kg movimentados</span></article><article class="stat-tile"><strong>${Math.round(totalTime / 60)}</strong><span>Minutos treinados</span></article>`;
  renderWeeklyChart(); renderRecords(); renderHistory();
}

function renderProfile() {
  const profile = state.profile;
  $("profileDisplayName").textContent = profile.name;
  $("profileAvatar").textContent = profile.name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "J";
  $("profileGoalLabel").textContent = profile.goal;
  $("profileName").value = profile.name;
  $("profileWeight").value = profile.weight;
  $("profileHeight").value = profile.height;
  $("profileGoal").value = profile.goal;
  $("profileWeeklyGoal").value = String(profile.weeklyGoal);
  $("profileWaterGoal").value = profile.waterGoal;
  $("profileAutoRest").checked = Boolean(profile.autoRest);
  const protein = Math.round(profile.weight * 1.6);
  $("wellnessCard").innerHTML = `<p class="eyebrow">ROTINA DE APOIO</p><h2>O básico bem-feito funciona.</h2><div class="wellness-targets"><div class="wellness-target"><strong>~${protein} g</strong><span>Proteína/dia*</span></div><div class="wellness-target"><strong>${formatNumber(profile.waterGoal)} ml</strong><span>Água/dia</span></div><div class="wellness-target"><strong>7–9 h</strong><span>Sono/noite</span></div></div><p>*Referência geral, calculada a partir do peso informado; ajuste a alimentação com uma nutricionista. Se sentir dor, interrompa o exercício e converse com um profissional de educação física.</p>`;
}

function saveProfile() {
  const name = $("profileName").value.trim();
  if (!name) return showToast("Digite seu nome para salvar o perfil.");
  state.profile = { name, weight: clamp($("profileWeight").value, 25, 350), height: clamp($("profileHeight").value, 100, 250), goal: $("profileGoal").value, weeklyGoal: clamp($("profileWeeklyGoal").value, 3, 6), waterGoal: clamp($("profileWaterGoal").value, 500, 6000), autoRest: $("profileAutoRest").checked };
  save(); renderGreeting(); renderHydration(); renderProfile(); showToast("Suas metas foram atualizadas.");
}

function exportData() {
  const content = JSON.stringify({ app: "IRON Purple", exportedAt: new Date().toISOString(), state }, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url; link.download = `iron-purple-backup-${dateKey()}.json`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); showToast("Backup preparado para download.");
}

async function importData(file) {
  if (!file) return;
  try {
    const content = JSON.parse(await file.text());
    const candidate = content.state || content;
    if (!candidate || !Array.isArray(candidate.months) || !Array.isArray(candidate.history)) throw new Error("invalid");
    if (!window.confirm("Restaurar este backup? Os dados atuais deste navegador serão substituídos.")) return;
    state = migrateState(candidate); clearInterval(workoutInterval); clearInterval(restInterval); save(); renderAll(); showToast("Backup restaurado com sucesso.");
  } catch { showToast("Não consegui abrir esse backup. Escolha um arquivo válido do IRON Purple."); }
  finally { $("importFileInput").value = ""; }
}

function showView(view) {
  if (!["today", "plan", "progress", "profile"].includes(view)) return;
  currentView = view;
  document.querySelectorAll(".view").forEach((section) => section.classList.toggle("is-active", section.id === `${view}View`));
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  if (view === "plan") renderPlan();
  if (view === "progress") renderProgress();
  if (view === "profile") renderProfile();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleCalendar(force) {
  calendarVisible = typeof force === "boolean" ? force : !calendarVisible;
  showView("today");
  renderCalendar();
  if (calendarVisible) $("calendarPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderAll() {
  getMonth(); getSession(); renderGreeting(); renderHero(); renderWeekStrip(); renderCalendar(); renderWorkout(); renderWorkoutTimer(); renderHydration();
  if (currentView === "plan") renderPlan();
  if (currentView === "progress") renderProgress();
  if (currentView === "profile") renderProfile();
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("button");
  if (!trigger) return;
  if (trigger.dataset.motion) {
    const paused = trigger.classList.toggle("is-paused");
    const helper = trigger.querySelector(".motion-helper");
    if (helper) helper.textContent = paused ? "Toque para continuar" : "Toque para pausar";
    trigger.setAttribute("aria-label", `${paused ? "Continuar" : "Pausar"} demonstração animada`);
    return;
  }
  if (trigger.dataset.selectDate) return setSelectedDate(trigger.dataset.selectDate);
  if (trigger.dataset.planDay !== undefined) return openPlanDay(Number(trigger.dataset.planDay));
  if (trigger.dataset.check) return toggleSet(trigger.dataset.check, trigger.dataset.set);
  if (trigger.dataset.complete) return toggleExercise(trigger.dataset.complete);
  if (trigger.dataset.toggleCompleted) return toggleCompletedExercise(trigger.dataset.toggleCompleted);
  if (trigger.dataset.addSet) return addSet(trigger.dataset.addSet);
  if (trigger.dataset.details) return showExerciseDetails(trigger.dataset.details);
  if (trigger.dataset.edit) return openExerciseDialog(trigger.dataset.edit);
  if (trigger.dataset.delete) return deleteExercise(trigger.dataset.delete);
  if (trigger.dataset.closeDialog) return $(trigger.dataset.closeDialog).close();
  if (trigger.dataset.view) return showView(trigger.dataset.view);
  if (trigger.dataset.time) { restSeconds = Number(trigger.dataset.time); restCountdown = restSeconds; clearInterval(restInterval); $("restTimer").textContent = formatRest(restCountdown); $("startRestBtn").innerHTML = `${icon("play")} Iniciar`; updateRestPresets(); }
});

document.addEventListener("load", (event) => {
  const image = event.target;
  if (!image.classList?.contains("motion-frame")) return;
  const motion = image.closest(".exercise-motion");
  if (!motion) return;
  image.classList.add("is-loaded");
  const first = motion.querySelector(".motion-frame-start");
  const last = motion.querySelector(".motion-frame-end");
  if (first?.classList.contains("is-loaded") && last?.classList.contains("is-loaded")) motion.classList.add("has-motion-photos");
}, true);

document.addEventListener("error", (event) => {
  const image = event.target;
  if (!image.classList?.contains("motion-frame")) return;
  const motion = image.closest(".exercise-motion");
  if (!motion) return;
  if (image.dataset.fallbackSrc && !image.dataset.fallbackTried) {
    image.dataset.fallbackTried = "true";
    image.src = image.dataset.fallbackSrc;
    return;
  }
  if (image.classList.contains("motion-frame-end")) {
    image.remove();
    motion.classList.add("single-frame");
    return;
  }
  image.remove();
  motion.classList.add("illustration-only");
}, true);

document.addEventListener("change", (event) => {
  const input = event.target;
  if (input.dataset.field) updateSet(input.dataset.ex, input.dataset.set, input.dataset.field, input.value);
});

$("brandButton").addEventListener("click", () => showView("today"));
$("headerCalendarBtn").addEventListener("click", () => toggleCalendar(true));
$("openCalendarBtn").addEventListener("click", () => toggleCalendar());
$("previousMonthBtn").addEventListener("click", () => changeMonth(-1));
$("nextMonthBtn").addEventListener("click", () => changeMonth(1));
$("monthSelect").addEventListener("change", (event) => setCalendarMonth(Number(event.target.value), selectedDate().getFullYear()));
$("yearSelect").addEventListener("change", (event) => setCalendarMonth(selectedDate().getMonth(), Number(event.target.value)));
$("goToTodayBtn").addEventListener("click", () => { setSelectedDate(dateKey()); showToast("Você voltou para o treino de hoje."); });
$("addExerciseBtn").addEventListener("click", () => openExerciseDialog());
$("saveExerciseBtn").addEventListener("click", saveExercise);
$("startWorkoutBtn").addEventListener("click", startWorkout);
$("pauseWorkoutBtn").addEventListener("click", pauseWorkout);
$("finishWorkoutBtn").addEventListener("click", openFinishDialog);
$("confirmFinishBtn").addEventListener("click", confirmFinish);
$("startRestBtn").addEventListener("click", startRest);
$("addWaterBtn").addEventListener("click", () => changeWater(250));
$("removeWaterBtn").addEventListener("click", () => changeWater(-250));
$("resetPlanBtn").addEventListener("click", resetPlan);
$("saveProfileBtn").addEventListener("click", saveProfile);
$("exportDataBtn").addEventListener("click", exportData);
$("importDataBtn").addEventListener("click", () => $("importFileInput").click());
$("importFileInput").addEventListener("change", (event) => importData(event.target.files[0]));

window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); deferredPrompt = event; $("installBtn").classList.remove("hidden"); });
$("installBtn").addEventListener("click", async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $("installBtn").classList.add("hidden"); });
window.addEventListener("appinstalled", () => { $("installBtn").classList.add("hidden"); showToast("IRON Purple instalado com sucesso."); });
if ("serviceWorker" in navigator && ["http:", "https:"].includes(location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`, { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  });
}
if (state.workoutTimer.running) workoutInterval = setInterval(renderWorkoutTimer, 1000);
renderAll(); renderProfile(); $("restTimer").textContent = formatRest(restCountdown); save();
