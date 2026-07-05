const stage = document.getElementById('cameraStage');
const lensIntro = document.getElementById('lensIntro');
const hud = document.getElementById('hud');
const blurScene = document.getElementById('blurScene');
const bracket = document.getElementById('focusBracket');
const focusLabel = document.getElementById('focusLabel');
const tapHint = document.getElementById('tapHint');
const enterSite = document.getElementById('enterSite');
const website = document.getElementById('website');
const cursor = document.querySelector('.custom-cursor');
const battery = document.getElementById('battery');
const shots = document.getElementById('shots');
const iso = document.getElementById('iso');
const dust = document.getElementById('dust');

let focusCount = 0;
let audioCtx;
let currentX = innerWidth / 2;
let currentY = innerHeight / 2;
let targetX = currentX;
let targetY = currentY;

function initDust(){
  for(let i=0;i<48;i++){
    const p=document.createElement('span');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.top=Math.random()*100+'%';
    p.style.animationDuration=(7+Math.random()*10)+'s';
    p.style.animationDelay=(-Math.random()*8)+'s';
    dust.appendChild(p);
  }
}

function audio(type='beep'){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    if(type==='motor'){
      o.type='sawtooth'; o.frequency.setValueAtTime(72,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(44,audioCtx.currentTime+.16); g.gain.setValueAtTime(.025,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.18); o.start(); o.stop(audioCtx.currentTime+.19);
    } else if(type==='shutter'){
      o.type='square'; o.frequency.setValueAtTime(190,audioCtx.currentTime); g.gain.setValueAtTime(.045,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.08); o.start(); o.stop(audioCtx.currentTime+.09);
    } else {
      o.type='sine'; o.frequency.setValueAtTime(880,audioCtx.currentTime); g.gain.setValueAtTime(.035,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.11); o.start(); o.stop(audioCtx.currentTime+.12);
    }
  }catch(e){}
}

function boot(){
  setTimeout(()=>{ lensIntro.classList.add('hidden'); hud.classList.add('active'); }, 2350);
  setInterval(()=>{
    const b = Math.max(94, 98 - Math.floor(Date.now()/9000)%5);
    battery.textContent = b + '%';
  }, 2500);
}

function nearestTarget(x,y){
  const targets=[...document.querySelectorAll('.target-dot')];
  let best=null, bestD=Infinity;
  targets.forEach(t=>{
    const r=t.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const d=Math.hypot(x-cx,y-cy);
    if(d<bestD){bestD=d; best={x:cx,y:cy,name:t.dataset.target};}
  });
  return bestD < 190 ? best : {x,y,name:'Focus'};
}

function focusAt(x,y){
  const t = nearestTarget(x,y);
  targetX = t.x; targetY = t.y;
  focusCount++;

  tapHint.classList.add('hidden');
  bracket.classList.add('active');
  bracket.classList.remove('lock');
  focusLabel.classList.add('show');
  focusLabel.textContent = 'AF-C';
  audio('motor');

  const xp = (targetX / innerWidth) * 100;
  const yp = (targetY / innerHeight) * 100;

  stage.animate([
    { transform:'translate3d(0,0,0) scale(1)' },
    { transform:'translate3d(-1px,1px,0) scale(1.006)' },
    { transform:'translate3d(1px,-1px,0) scale(.998)' },
    { transform:'translate3d(0,0,0) scale(1)' }
  ], { duration:420, easing:'cubic-bezier(.16,1,.3,1)' });

  document.documentElement.animate([
    {'--breath':'1.015'},
    {'--breath':'1.032'},
    {'--breath':'1.008'},
    {'--breath':'1.02'}
  ], {duration:520, easing:'cubic-bezier(.16,1,.3,1)'});

  blurScene.animate([
    { filter:'blur(18px) saturate(1.1)' },
    { filter:'blur(10px) saturate(1.12)' },
    { filter:'blur(15px) saturate(1.1)' },
    { filter:'blur(16px) saturate(1.1)' }
  ], { duration:480, easing:'cubic-bezier(.16,1,.3,1)' });

  blurScene.style.setProperty('--fx', xp + '%');
  blurScene.style.setProperty('--fy', yp + '%');
  iso.textContent = focusCount % 2 ? 'ISO 160' : 'ISO 100';
  shots.textContent = (1423 - focusCount) + ' Photos';

  setTimeout(()=>{
    bracket.classList.add('lock');
    focusLabel.textContent = 'FOCUS LOCK · ' + t.name;
    audio('beep');
    if(focusCount >= 2) enterSite.classList.add('show');
  }, 430);
}

function animateBracket(){
  currentX += (targetX - currentX) * 0.16;
  currentY += (targetY - currentY) * 0.16;
  bracket.style.transform = `translate(${currentX - innerWidth/2}px, ${currentY - innerHeight/2}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateBracket);
}

stage.addEventListener('pointerdown', e => {
  if(e.target === enterSite) return;
  audioCtx && audioCtx.resume && audioCtx.resume();
  focusAt(e.clientX, e.clientY);
});

stage.addEventListener('pointermove', e => {
  cursor.style.opacity = .75;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
stage.addEventListener('pointerleave', () => cursor.style.opacity = 0);

enterSite.addEventListener('click', e => {
  e.stopPropagation();
  audio('shutter');
  document.body.style.overflow='hidden';
  website.classList.add('visible');
  hud.style.opacity = 0;
  enterSite.classList.remove('show');
});

initDust();
boot();
animateBracket();
