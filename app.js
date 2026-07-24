const DAYS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];

const makeSets = (count, weight, reps, rest=60) =>
  Array.from({length: count}, (_, i) => ({ id: crypto.randomUUID(), weight, reps, rest, done:false }));

const starterMonth = {
  id: crypto.randomUUID(),
  name: "Julho 2026",
  workouts: {
    Segunda: { name:"Quadríceps e Panturrilha", exercises:[
      {id:crypto.randomUUID(),name:"Agachamento livre",notes:"Mantenha o abdômen firme.",sets:makeSets(4,40,12,60)},
      {id:crypto.randomUUID(),name:"Leg press 45°",notes:"Controle a descida.",sets:makeSets(4,80,12,75)},
      {id:crypto.randomUUID(),name:"Cadeira extensora",notes:"Segure 1 segundo no topo.",sets:makeSets(3,30,15,60)}
    ]},
    Terça: { name:"Posterior e Glúteos", exercises:[
      {id:crypto.randomUUID(),name:"Elevação pélvica",notes:"Contraia glúteos no topo.",sets:makeSets(4,50,12,60)},
      {id:crypto.randomUUID(),name:"Mesa flexora",notes:"Movimento controlado.",sets:makeSets(4,25,12,60)}
    ]},
    Quarta:{name:"Costas e Bíceps",exercises:[]},
    Quinta:{name:"Peito, Ombro e Tríceps",exercises:[]},
    Sexta:{name:"Pernas completas",exercises:[]},
    Sábado:{name:"Cardio e Abdômen",exercises:[]},
    Domingo:{name:"Descanso ou Mobilidade",exercises:[]}
  }
};

let state = JSON.parse(localStorage.getItem("ironPurpleState")) || {
  months:[starterMonth],
  currentMonthId:starterMonth.id,
  currentDay:"Segunda",
  workoutTimer:{running:false,startedAt:null,elapsed:0},
  history:[]
};

let restSeconds=60, restCountdown=60, restInterval=null, workoutInterval=null, deferredPrompt=null;
let promptAction = null;

const $ = id => document.getElementById(id);
const clone = obj => JSON.parse(JSON.stringify(obj));
const currentMonth = () => state.months.find(m=>m.id===state.currentMonthId);
const currentWorkout = () => currentMonth().workouts[state.currentDay];

function save(){ localStorage.setItem("ironPurpleState", JSON.stringify(state)); }

function formatDuration(sec){
  const h=String(Math.floor(sec/3600)).padStart(2,"0");
  const m=String(Math.floor((sec%3600)/60)).padStart(2,"0");
  const s=String(sec%60).padStart(2,"0");
  return `${h}:${m}:${s}`;
}
function getWorkoutElapsed(){
  let elapsed=state.workoutTimer.elapsed||0;
  if(state.workoutTimer.running && state.workoutTimer.startedAt){
    elapsed += Math.floor((Date.now()-state.workoutTimer.startedAt)/1000);
  }
  return elapsed;
}
function formatRest(sec){return `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`}

function renderSelectors(){
  $("monthSelect").innerHTML = state.months.map(m=>`<option value="${m.id}" ${m.id===state.currentMonthId?"selected":""}>${m.name}</option>`).join("");
  $("daySelect").innerHTML = DAYS.map(d=>`<option value="${d}" ${d===state.currentDay?"selected":""}>${d}</option>`).join("");
}
function renderHeader(){
  $("monthBadge").textContent=currentMonth().name;
  $("todayTitle").textContent=currentWorkout().name;
}
function renderWorkout(){
  const list=$("workoutList"); list.innerHTML="";
  const exercises=currentWorkout().exercises;
  if(!exercises.length){list.innerHTML=`<div class="card empty">Nenhum exercício cadastrado neste treino.</div>`}
  exercises.forEach(ex=>{
    const allDone=ex.sets.length>0 && ex.sets.every(s=>s.done);
    const card=document.createElement("article");
    card.className=`exercise card ${allDone?"done-card":""}`;
    card.innerHTML=`
      <div class="exercise-head">
        <div>
          <h3>${ex.name}</h3>
          <p class="exercise-meta">${ex.sets.length} séries · pesos editáveis por série</p>
        </div>
        <div class="exercise-actions">
          <button class="icon-btn" data-edit="${ex.id}">Editar</button>
          <button class="icon-btn" data-delete="${ex.id}">Excluir</button>
        </div>
      </div>
      <table class="sets-table">
        <thead><tr><th>Série</th><th>Peso kg</th><th>Reps</th><th>Desc.</th><th>Check</th></tr></thead>
        <tbody>
        ${ex.sets.map((s,i)=>`
          <tr>
            <td>${i+1}</td>
            <td><input type="number" step="0.5" min="0" value="${s.weight}" data-field="weight" data-ex="${ex.id}" data-set="${s.id}"></td>
            <td><input type="number" min="1" value="${s.reps}" data-field="reps" data-ex="${ex.id}" data-set="${s.id}"></td>
            <td><input type="number" min="10" value="${s.rest}" data-field="rest" data-ex="${ex.id}" data-set="${s.id}"></td>
            <td><button class="check-btn ${s.done?"done":""}" data-check="${ex.id}" data-set="${s.id}">${s.done?"✓":""}</button></td>
          </tr>`).join("")}
        </tbody>
      </table>
      <div class="exercise-footer">
        <p class="exercise-notes">${ex.notes||"Sem observações."}</p>
        <div class="button-row wrap">
          <button class="secondary" data-addset="${ex.id}">+ Série</button>
          <button class="ghost" data-complete="${ex.id}">${allDone?"Desmarcar exercício":"Concluir exercício"}</button>
        </div>
      </div>`;
    list.appendChild(card);
  });

  document.querySelectorAll("[data-check]").forEach(btn=>btn.onclick=()=>toggleSet(btn.dataset.check,btn.dataset.set));
  document.querySelectorAll("[data-field]").forEach(inp=>inp.onchange=()=>updateSet(inp.dataset.ex,inp.dataset.set,inp.dataset.field,Number(inp.value)));
  document.querySelectorAll("[data-addset]").forEach(btn=>btn.onclick=()=>addSet(btn.dataset.addset));
  document.querySelectorAll("[data-complete]").forEach(btn=>btn.onclick=()=>toggleExercise(btn.dataset.complete));
  document.querySelectorAll("[data-edit]").forEach(btn=>btn.onclick=()=>openEditExercise(btn.dataset.edit));
  document.querySelectorAll("[data-delete]").forEach(btn=>btn.onclick=()=>deleteExercise(btn.dataset.delete));
  updateProgress();
}
function updateProgress(){
  const ex=currentWorkout().exercises;
  const total=ex.reduce((a,e)=>a+e.sets.length,0);
  const done=ex.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0);
  const pct=total?Math.round(done/total*100):0;
  $("progressValue").textContent=`${pct}%`;
  document.querySelector(".progress-ring").style.background=`conic-gradient(#fff ${pct}%,rgba(255,255,255,.16) ${pct}%)`;
}
function updateSet(exId,setId,field,value){
  const ex=currentWorkout().exercises.find(e=>e.id===exId);
  const set=ex.sets.find(s=>s.id===setId); set[field]=value; save();
}
function toggleSet(exId,setId){
  const ex=currentWorkout().exercises.find(e=>e.id===exId);
  const set=ex.sets.find(s=>s.id===setId); set.done=!set.done;
  if(set.done){restSeconds=set.rest||60;restCountdown=restSeconds;$("restTimer").textContent=formatRest(restCountdown)}
  save();renderWorkout();
}
function toggleExercise(exId){
  const ex=currentWorkout().exercises.find(e=>e.id===exId);
  const mark=!ex.sets.every(s=>s.done); ex.sets.forEach(s=>s.done=mark); save();renderWorkout();
}
function addSet(exId){
  const ex=currentWorkout().exercises.find(e=>e.id===exId);
  const last=ex.sets.at(-1)||{weight:0,reps:12,rest:60};
  ex.sets.push({id:crypto.randomUUID(),weight:last.weight,reps:last.reps,rest:last.rest,done:false});
  save();renderWorkout();
}
function deleteExercise(exId){
  if(!confirm("Excluir este exercício?"))return;
  currentWorkout().exercises=currentWorkout().exercises.filter(e=>e.id!==exId);save();renderWorkout();
}
function openEditExercise(exId){
  const ex=currentWorkout().exercises.find(e=>e.id===exId);
  $("exerciseDialogTitle").textContent="Editar exercício";$("editingExerciseId").value=ex.id;
  $("exerciseName").value=ex.name;$("exerciseSets").value=ex.sets.length;
  $("exerciseReps").value=ex.sets[0]?.reps||12;$("exerciseWeight").value=ex.sets[0]?.weight||0;
  $("exerciseRest").value=ex.sets[0]?.rest||60;$("exerciseNotes").value=ex.notes||"";
  $("exerciseDialog").showModal();
}
function openNewExercise(){
  $("exerciseDialogTitle").textContent="Novo exercício";$("editingExerciseId").value="";
  $("exerciseName").value="";$("exerciseSets").value=4;$("exerciseReps").value=12;
  $("exerciseWeight").value=0;$("exerciseRest").value=60;$("exerciseNotes").value="";
  $("exerciseDialog").showModal();
}
function saveExercise(){
  const name=$("exerciseName").value.trim(); if(!name)return alert("Digite o nome do exercício.");
  const count=Number($("exerciseSets").value), reps=Number($("exerciseReps").value), weight=Number($("exerciseWeight").value), rest=Number($("exerciseRest").value), notes=$("exerciseNotes").value.trim();
  const id=$("editingExerciseId").value;
  if(id){
    const ex=currentWorkout().exercises.find(e=>e.id===id); ex.name=name; ex.notes=notes;
    if(count>ex.sets.length){while(ex.sets.length<count)ex.sets.push({id:crypto.randomUUID(),weight,reps,rest,done:false})}
    if(count<ex.sets.length)ex.sets=ex.sets.slice(0,count);
    ex.sets.forEach(s=>{if(!Number.isFinite(s.weight))s.weight=weight;if(!Number.isFinite(s.reps))s.reps=reps;if(!Number.isFinite(s.rest))s.rest=rest});
  }else currentWorkout().exercises.push({id:crypto.randomUUID(),name,notes,sets:makeSets(count,weight,reps,rest)});
  save();renderWorkout();$("exerciseDialog").close();
}
function startWorkout(){
  if(state.workoutTimer.running)return;
  state.workoutTimer.running=true;state.workoutTimer.startedAt=Date.now();save();startWorkoutTick();
}
function pauseWorkout(){
  if(!state.workoutTimer.running)return;
  state.workoutTimer.elapsed=getWorkoutElapsed();state.workoutTimer.running=false;state.workoutTimer.startedAt=null;save();clearInterval(workoutInterval);renderWorkoutTimer();
}
function startWorkoutTick(){clearInterval(workoutInterval);workoutInterval=setInterval(renderWorkoutTimer,1000);renderWorkoutTimer()}
function renderWorkoutTimer(){$("workoutTimer").textContent=formatDuration(getWorkoutElapsed())}
function openFinish(){ $("finishDialog").showModal(); }
function confirmFinish(){
  const elapsed=getWorkoutElapsed();
  const ex=currentWorkout().exercises;
  const totalSets=ex.reduce((a,e)=>a+e.sets.length,0);
  const doneSets=ex.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0);
  const volume=ex.reduce((a,e)=>a+e.sets.filter(s=>s.done).reduce((b,s)=>b+(s.weight*s.reps),0),0);
  state.history.unshift({
    id:crypto.randomUUID(),date:new Date().toISOString(),month:currentMonth().name,day:state.currentDay,
    workout:currentWorkout().name,duration:elapsed,totalSets,doneSets,volume,
    difficulty:$("difficultySelect").value,notes:$("workoutNotes").value.trim()
  });
  state.workoutTimer={running:false,startedAt:null,elapsed:0};
  ex.forEach(e=>e.sets.forEach(s=>s.done=false));
  save();clearInterval(workoutInterval);renderAll();$("finishDialog").close();alert("Treino salvo no histórico!");
}
function startRest(){
  clearInterval(restInterval);restCountdown=restSeconds;$("restTimer").textContent=formatRest(restCountdown);
  restInterval=setInterval(()=>{restCountdown--;$("restTimer").textContent=formatRest(restCountdown);
    if(restCountdown<=0){clearInterval(restInterval);if("vibrate"in navigator)navigator.vibrate([200,100,200]);alert("Descanso concluído!")}
  },1000);
}
function showProgress(){
  const ex=currentWorkout().exercises,totalSets=ex.reduce((a,e)=>a+e.sets.length,0),doneSets=ex.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0);
  const planned=ex.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+s.weight*s.reps,0),0);
  const completed=ex.reduce((a,e)=>a+e.sets.filter(s=>s.done).reduce((b,s)=>b+s.weight*s.reps,0),0);
  $("progressSummary").innerHTML=`<strong>${doneSets}</strong> de ${totalSets} séries concluídas.<br>Tempo atual: <strong>${formatDuration(getWorkoutElapsed())}</strong>.<br>Volume concluído: <strong>${completed.toLocaleString("pt-BR")} kg</strong>.<br>Volume planejado: <strong>${planned.toLocaleString("pt-BR")} kg</strong>.`;
  $("progressDialog").showModal();
}
function showHistory(){
  const box=$("historyList");
  box.innerHTML=state.history.length?state.history.map(h=>`<div class="history-item"><strong>${new Date(h.date).toLocaleDateString("pt-BR")} · ${h.workout}</strong><br>${h.month} · ${h.day}<br>Tempo: ${formatDuration(h.duration)} · Séries: ${h.doneSets}/${h.totalSets}<br>Volume: ${h.volume.toLocaleString("pt-BR")} kg · Dificuldade: ${h.difficulty}${h.notes?`<br>Obs.: ${h.notes}`:""}</div>`).join(""):`<div class="empty">Nenhum treino finalizado ainda.</div>`;
  $("historyDialog").showModal();
}
function resetDay(){
  if(!confirm("Limpar os checks do treino atual?"))return;
  currentWorkout().exercises.forEach(e=>e.sets.forEach(s=>s.done=false));save();renderWorkout();
}
function openSimplePrompt(title,label,value,action){
  promptAction=action;$("simplePromptTitle").textContent=title;$("simplePromptLabel").childNodes[0].nodeValue=label+" ";
  $("simplePromptInput").value=value||"";$("simplePromptDialog").showModal();
}
function newMonth(){
  openSimplePrompt("Novo mês","Nome do mês","Agosto 2026",value=>{
    const m={id:crypto.randomUUID(),name:value,workouts:Object.fromEntries(DAYS.map(d=>[d,{name:"Novo treino",exercises:[]}]))};
    state.months.push(m);state.currentMonthId=m.id;save();renderAll();
  });
}
function duplicateMonth(){
  openSimplePrompt("Duplicar mês","Nome da cópia",currentMonth().name+" - cópia",value=>{
    const m=clone(currentMonth());m.id=crypto.randomUUID();m.name=value;
    Object.values(m.workouts).forEach(w=>w.exercises.forEach(e=>{e.id=crypto.randomUUID();e.sets.forEach(s=>{s.id=crypto.randomUUID();s.done=false})}));
    state.months.push(m);state.currentMonthId=m.id;save();renderAll();
  });
}
function renameWorkout(){
  openSimplePrompt("Renomear treino","Nome do treino",currentWorkout().name,value=>{currentWorkout().name=value;save();renderAll()});
}
function renderAll(){renderSelectors();renderHeader();renderWorkout();renderWorkoutTimer()}
$("monthSelect").onchange=e=>{state.currentMonthId=e.target.value;save();renderAll()}
$("daySelect").onchange=e=>{state.currentDay=e.target.value;save();renderAll()}
$("addExerciseBtn").onclick=openNewExercise;$("saveExerciseBtn").onclick=saveExercise;
$("startWorkoutBtn").onclick=startWorkout;$("pauseWorkoutBtn").onclick=pauseWorkout;$("finishWorkoutBtn").onclick=openFinish;$("confirmFinishBtn").onclick=confirmFinish;
$("startRestBtn").onclick=startRest;$("progressBtn").onclick=showProgress;$("historyBtn").onclick=showHistory;$("resetDayBtn").onclick=resetDay;
$("newMonthBtn").onclick=newMonth;$("duplicateMonthBtn").onclick=duplicateMonth;$("renameWorkoutBtn").onclick=renameWorkout;
$("simplePromptSaveBtn").onclick=()=>{const v=$("simplePromptInput").value.trim();if(!v)return alert("Digite um valor.");promptAction?.(v);$("simplePromptDialog").close()}
document.querySelectorAll("[data-time]").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll("[data-time]").forEach(b=>b.classList.remove("active-rest"));btn.classList.add("active-rest");
  restSeconds=Number(btn.dataset.time);restCountdown=restSeconds;$("restTimer").textContent=formatRest(restCountdown);
});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden")};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
if(state.workoutTimer.running)startWorkoutTick();
renderAll();$("restTimer").textContent=formatRest(restCountdown);
