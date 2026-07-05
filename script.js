const camera = document.getElementById('camera');
const intro = document.getElementById('intro');
const startBtn = document.getElementById('startBtn');
const hud = document.getElementById('hud');
const focusBox = document.getElementById('focusBox');
const focusStatus = document.getElementById('focusStatus');
const hint = document.getElementById('hint');
const softPhoto = document.getElementById('softPhoto');
const enter = document.getElementById('enter');
const site = document.getElementById('site');
const replay = document.getElementById('replay');
const dust = document.getElementById('dust');
const timer = document.getElementById('timer');
const iso = document.getElementById('iso');
const battery = document.getElementById('battery');

let focusCount = 0;
let active = false;
let audioCtx = null;
let curX = window.innerWidth / 2;
let curY = window.innerHeight / 2;
let targetX = curX;
let targetY = curY;
let timerSeconds = 0;

const focusTargets = [
  { name: 'COUPLE', x: 47, y: 42 },
  { name: 'BOUQUET', x: 39, y: 64 },
  { name: 'RINGS', x: 58, y: 70 },
  { name: 'LIGHTS', x: 72, y: 30 },
  { name: 'DETAILS', x: 29, y: 50 }
];

function makeDust(){
  dust.innerHTML = '';
  for(let i = 0; i < 42; i++){
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = 7 + Math.random() * 12 + 's';
    p.style.animationDelay = -Math.random() * 10 + 's';
    dust.appendChild(p);
  }
}

function sound(type){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    if(type === 'motor'){
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(82, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + .2);
      gain.gain.setValueAtTime(.024, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + .23);
      osc.start(now); osc.stop(now + .24);
    } else if(type === 'shutter'){
      osc.type = 'square';
      osc.frequency.setValueAtTime(210, now);
      gain.gain.setValueAtTime(.05, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + .08);
      osc.start(now); osc.stop(now + .09);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(.033, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + .12);
      osc.start(now); osc.stop(now + .13);
    }
  } catch(err) {}
}

function startExperience(){
  active = true;
  intro.classList.add('hide');
  hud.classList.add('on');
  sound('motor');
}

function nearestPoint(clientX, clientY){
  const w = window.innerWidth;
  const h = window.innerHeight;
  let best = null;
  let bestD = Infinity;
  focusTargets.forEach(t => {
    const px = (t.x / 100) * w;
    const py = (t.y / 100) * h;
    const d = Math.hypot(clientX - px, clientY - py);
    if(d < bestD){ bestD = d; best = { ...t, px, py }; }
  });
  if(bestD < Math.min(230, window.innerWidth * .34)) return best;
  return { name: 'FOCUS', x: clientX / w * 100, y: clientY / h * 100, px: clientX, py: clientY };
}

function focusAt(clientX, clientY){
  if(!active || site.classList.contains('show')) return;
  const point = nearestPoint(clientX, clientY);
  targetX = point.px;
  targetY = point.py;
  focusCount++;

  hint.classList.add('hide');
  enter.classList.toggle('show', focusCount >= 2);
  focusBox.classList.add('show');
  focusBox.classList.remove('lock');
  focusStatus.textContent = 'SEARCHING FOCUS...';
  sound('motor');

  document.documentElement.style.setProperty('--focus-x', point.x + '%');
  document.documentElement.style.setProperty('--focus-y', point.y + '%');
  iso.textContent = focusCount % 2 ? 'ISO 160' : 'ISO 100';

  camera.animate([
    { transform: 'translate3d(0,0,0) scale(1)' },
    { transform: 'translate3d(-1px,1px,0) scale(1.004)' },
    { transform: 'translate3d(1px,-1px,0) scale(.999)' },
    { transform: 'translate3d(0,0,0) scale(1)' }
  ], { duration: 430, easing: 'cubic-bezier(.16,1,.3,1)' });

  const root = document.documentElement;
  root.style.setProperty('--breath', '1.034');
  setTimeout(() => root.style.setProperty('--breath', '1.008'), 160);
  setTimeout(() => root.style.setProperty('--breath', '1.02'), 330);

  softPhoto.animate([
    { opacity: .99, filter: 'blur(18px) saturate(1.08)' },
    { opacity: .91, filter: 'blur(10px) saturate(1.12)' },
    { opacity: .97, filter: 'blur(14px) saturate(1.08)' }
  ], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });

  setTimeout(() => {
    focusBox.classList.add('lock');
    focusStatus.textContent = 'FOCUS LOCKED · ' + point.name;
    sound('beep');
  }, 410);
}

function moveFocusBox(){
  curX += (targetX - curX) * .16;
  curY += (targetY - curY) * .16;
  focusBox.style.transform = `translate(${curX - window.innerWidth / 2}px, ${curY - window.innerHeight / 2}px) translate(-50%, -50%)`;
  requestAnimationFrame(moveFocusBox);
}

function enterSite(){
  sound('shutter');
  site.classList.add('show');
  hud.classList.remove('on');
  enter.classList.remove('show');
}

function reset(){
  focusCount = 0;
  site.classList.remove('show');
  intro.classList.remove('hide');
  hud.classList.remove('on');
  enter.classList.remove('show');
  focusBox.classList.remove('show', 'lock');
  hint.classList.remove('hide');
  focusStatus.textContent = 'Tap anywhere to focus';
  active = false;
}

startBtn.addEventListener('click', e => { e.stopPropagation(); startExperience(); });
camera.addEventListener('pointerdown', e => {
  if(e.target === startBtn || e.target === enter) return;
  if(!active) { startExperience(); return; }
  focusAt(e.clientX, e.clientY);
});
enter.addEventListener('click', e => { e.stopPropagation(); enterSite(); });
replay.addEventListener('click', reset);

setInterval(() => {
  timerSeconds = (timerSeconds + 1) % 60;
  timer.textContent = String(timerSeconds).padStart(2, '0');
  const b = 98 - (timerSeconds % 4);
  battery.textContent = b + '%';
}, 1000);

makeDust();
moveFocusBox();
