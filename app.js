let currentAI="MIA";
const orb=document.getElementById("orb");
const aiLabel=document.getElementById("aiLabel");
const secondsInput=document.getElementById("seconds");
const countdownEl=document.getElementById("countdown");
let timerId=null;

let VOICES=[];speechSynthesis.onvoiceschanged=()=>VOICES=speechSynthesis.getVoices();VOICES=speechSynthesis.getVoices();
const MIA_P=["Aria","Jenny","Samantha","Victoria","Karen","Google UK English Female"];
const BRIAN_P=["Guy","Christopher","Daniel","Tom","Google UK English Male"];
function pick(list){if(!VOICES.length)return null;for(const n of list){const v=VOICES.find(v=>v.name===n)||VOICES.find(v=>v.name.includes(n));if(v)return v;}return VOICES[0];}
function speak(ai,text){const u=new SpeechSynthesisUtterance(text);if(ai==="MIA"){u.voice=pick(MIA_P);u.pitch=1.16;u.rate=0.98;}else{u.voice=pick(BRIAN_P);u.pitch=0.95;u.rate=1.05;}u.onstart=()=>orb.classList.add("talking");u.onend=()=>orb.classList.remove("talking");speechSynthesis.speak(u);}

document.querySelectorAll(".chip").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".chip").forEach(b=>b.classList.remove("active"));btn.classList.add("active");currentAI=btn.dataset.ai;aiLabel.textContent="Selected: "+currentAI;orb.classList.toggle("mia",currentAI==="MIA");orb.classList.toggle("brian",currentAI==="BRIAN");document.getElementById("bioMIA").classList.toggle("show",currentAI==="MIA");document.getElementById("bioBRIAN").classList.toggle("show",currentAI==="BRIAN");speak(currentAI,"Starlight systems online.");}));

document.querySelectorAll(".pill").forEach(p=>p.addEventListener("click",()=>{secondsInput.value=p.dataset.secs;speak(currentAI,`Preset set to ${Math.round(p.dataset.secs/60)} minutes.`);}));

document.getElementById("startBtn").addEventListener("click",()=>{stopTimer();let s=Math.max(1,parseInt(secondsInput.value||"600",10));let t=s;orb.classList.add("pulse");setTimeout(()=>orb.classList.remove("pulse"),600);speak(currentAI,`Starting timer for ${Math.floor(s/60)} minutes ${s%60? (s%60+" seconds"):""}.`);tick();timerId=setInterval(tick,1000);function tick(){countdownEl.textContent=t>0?`${Math.floor(t/60)}m ${t%60}s remaining`:"Time's up!";if(t<=0){clearInterval(timerId);timerId=null;speak(currentAI,"Timer complete. Well done.");}t--;}});

document.getElementById("stopBtn").addEventListener("click",()=>{if(timerId){clearInterval(timerId);timerId=null;countdownEl.textContent="Stopped.";speak(currentAI,"Timer stopped.");}});

let deferredPrompt=null;const installBtn=document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.classList.remove("hidden");});
installBtn&&installBtn.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.classList.add("hidden");});
