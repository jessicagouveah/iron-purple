/* ANIMAÇÕES DOS EXERCÍCIOS — IRON PURPLE */

(() => {
  const exercicios = [
    ["agachamento sumo", "Plie_Dumbbell_Squat"],
    ["agachamento", "Barbell_Squat"],
    ["leg press", "Leg_Press"],
    ["afundo", "Split_Squats"],
    ["extensora", "Leg_Extensions"],
    ["elevacao pelvica", "Barbell_Hip_Thrust"],
    ["abdutora", "Thigh_Abductor"],
    ["adutora", "Thigh_Adductor"],
    ["panturrilha sentada", "Seated_Calf_Raise"],
    ["panturrilha", "Standing_Calf_Raises"],
    ["puxada", "Wide-Grip_Lat_Pulldown"],
    ["remada unilateral", "One-Arm_Dumbbell_Row"],
    ["remada", "Seated_Cable_Rows"],
    ["face pull", "Face_Pull"],
    ["rosca martelo", "Hammer_Curls"],
    ["rosca", "Barbell_Curl"],
    ["prancha lateral", "Side_Bridge"],
    ["prancha", "Plank"],
    ["abdominal", "Cable_Crunch"],
    ["stiff unilateral", "Kettlebell_One-Legged_Deadlift"],
    ["stiff", "Romanian_Deadlift"],
    ["mesa flexora", "Lying_Leg_Curls"],
    ["flexora", "Seated_Leg_Curl"],
    ["coice", "Glute_Kickback"],
    ["passada", "Bodyweight_Walking_Lunge"],
    ["supino", "Dumbbell_Bench_Press"],
    ["desenvolvimento", "Dumbbell_Shoulder_Press"],
    ["elevacao lateral", "Side_Lateral_Raise"],
    ["crucifixo", "Butterfly"],
    ["triceps frances", "Standing_Dumbbell_Triceps_Extension"],
    ["triceps", "Triceps_Pushdown_-_Rope_Attachment"],
    ["elevacao de pernas", "Hanging_Leg_Raise"],
    ["caminhada", "Walking_Treadmill"],
    ["mobilidade", "Kneeling_Hip_Flexor"],
    ["alongamento", "All_Fours_Quad_Stretch"]
  ];

  const estilo = document.createElement("style");

  estilo.textContent = `
    .iron-animacao {
      position: relative;
      height: 210px;
      margin: 14px 0;
      overflow: hidden;
      border-radius: 14px;
      background: #251633;
      border: 1px solid rgba(180,120,255,.25);
    }

    .iron-animacao img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: white;
      opacity: 0;
    }

    .iron-animacao img.iron-primeira {
      animation: iron-primeira 2.4s infinite;
    }

    .iron-animacao img.iron-segunda {
      animation: iron-segunda 2.4s infinite;
    }

    @keyframes iron-primeira {
      0%, 40% { opacity: 1; }
      50%, 90% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes iron-segunda {
      0%, 40% { opacity: 0; }
      50%, 90% { opacity: 1; }
      100% { opacity: 0; }
    }

    .iron-etiqueta {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px 10px;
      border-radius: 20px;
      background: rgba(34,17,52,.85);
      color: white;
      font-size: 10px;
      z-index: 2;
    }
  `;

  document.head.appendChild(estilo);

  const normalizar = texto =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  function inserirAnimacoes() {
    document.querySelectorAll(".exercise-card").forEach(card => {
      if (card.querySelector(".iron-animacao")) return;

      const titulo = card.querySelector("h3");

      if (!titulo) return;

      const nome = normalizar(titulo.textContent);
      const encontrado = exercicios.find(([termo]) =>
        nome.includes(termo)
      );

      if (!encontrado) return;

      const identificador = encontrado[1];

      const base =
        "https://cdn.jsdelivr.net/gh/yuhonas/" +
        "free-exercise-db@main/exercises/" +
        identificador;

      const animacao = document.createElement("div");
      animacao.className = "iron-animacao";

      animacao.innerHTML = `
        <img
          class="iron-primeira"
          src="${base}/0.jpg"
          alt="Posição inicial"
        >
        <img
          class="iron-segunda"
          src="${base}/1.jpg"
          alt="Posição final"
        >
        <span class="iron-etiqueta">▶ MOVIMENTO</span>
      `;

      const etiquetas = card.querySelector(".exercise-tags");

      if (etiquetas) {
        etiquetas.insertAdjacentElement("afterend", animacao);
      }
    });
  }

  inserirAnimacoes();

  const lista = document.getElementById("workoutList");

  if (lista) {
    new MutationObserver(inserirAnimacoes).observe(lista, {
      childList: true
    });
  }
})();
