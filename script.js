const intro = document.getElementById('intro');
const site = document.getElementById('site');
const startBtn = document.getElementById('startBtn');
const statusText = document.getElementById('statusText');
const hud = document.getElementById('viewfinderHud');
const focusSquare = document.getElementById('focusSquare');
const flash = document.getElementById('flash');
const cameraShell = document.getElementById('cameraShell');
const lensGlass = document.getElementById('lensGlass');
const cursor = document.querySelector('.custom-cursor');
const isoValue = document.getElementById('isoValue');
const shutterValue = document.getElementById('shutterValue');
const battery = document.getElementById('battery');

let audioCtx;
function tone(freq, duration, type='sine', volume=.05){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  }catch(e){}
}
function wait(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
async function runExperience(){
  startBtn.classList.add('hide');
  hud.classList.add('active');
  statusText.textContent = 'Autofocus hunting...';
  tone(110, .18, 'sawtooth', .035);
  await wait(650);
  isoValue.textContent = '320'; shutterValue.textContent = '250'; battery.textContent = '86%';
  statusText.textContent = 'Finding the perfect frame...';
  tone(150, .14, 'triangle', .035);
  await wait(850);
  intro.classList.add('focused');
  focusSquare.classList.add('locked');
  statusText.textContent = 'Focus locked.';
  tone(880, .12, 'sine', .06);
  await wait(600);
  statusText.textContent = 'Capturing the story.';
  cameraShell.animate([{transform:'translateX(0)'},{transform:'translateX(-7px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260,easing:'ease-out'});
  flash.classList.add('fire');
  tone(60, .08, 'square', .08);
  await wait(380);
  intro.classList.add('zoom');
  await wait(900);
  site.classList.add('visible');
  await wait(700);
  intro.classList.add('hidden');
  document.body.style.overflow = 'auto';
}
startBtn.addEventListener('click', runExperience, {once:true});

window.addEventListener('mousemove', (e)=>{
  const x = e.clientX / window.innerWidth - .5;
  const y = e.clientY / window.innerHeight - .5;
  if(cursor){ cursor.style.left = e.clientX+'px'; cursor.style.top = e.clientY+'px'; }
  if(cameraShell){ cameraShell.style.transform = `rotateY(${x*8}deg) rotateX(${-y*8}deg)`; }
  if(lensGlass){
    lensGlass.querySelectorAll('.reflection').forEach((r,i)=>{
      r.style.transform = `translate(${x*(i?24:42)}px, ${y*(i?20:34)}px) rotate(-25deg)`;
    });
  }
});

const cards = document.querySelectorAll('.frame-card');
const obs = new IntersectionObserver(entries=>{
  entries.forEach((entry, index)=>{
    if(entry.isIntersecting){ setTimeout(()=> entry.target.classList.add('show'), index*110); }
  });
},{threshold:.22});
cards.forEach(card=>obs.observe(card));

document.querySelectorAll('a,button,.frame-card').forEach(el=>{
  el.addEventListener('mouseenter',()=> cursor && (cursor.style.width='54px',cursor.style.height='54px'));
  el.addEventListener('mouseleave',()=> cursor && (cursor.style.width='34px',cursor.style.height='34px'));
});

window.addEventListener('load',()=>{ document.body.style.overflow='hidden'; });
