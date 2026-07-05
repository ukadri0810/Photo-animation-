const hasGsap = window.gsap;
let audioCtx;

function tone(freq, start, duration, type = 'sine', gain = 0.035) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const vol = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
  vol.gain.setValueAtTime(0, audioCtx.currentTime + start);
  vol.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + start + 0.015);
  vol.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration);
  osc.connect(vol).connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + start);
  osc.stop(audioCtx.currentTime + start + duration + 0.03);
}

function cameraClick(start = 0) {
  tone(90, start, 0.045, 'square', 0.06);
  tone(260, start + 0.035, 0.035, 'triangle', 0.045);
  tone(70, start + 0.075, 0.06, 'square', 0.035);
}

function playSoundTrack() {
  if (!audioCtx) return;
  tone(160, 0.10, 0.12, 'sawtooth', 0.018); // startup
  tone(220, 0.24, 0.10, 'triangle', 0.014);
  tone(310, 3.95, 0.08, 'sine', 0.018); // focus hunt 1
  tone(250, 4.28, 0.08, 'sine', 0.018); // focus hunt 2
  tone(880, 5.15, 0.13, 'sine', 0.035); // focus lock beep
  cameraClick(5.85);
}

function resetElements() {
  gsap.set('.intro', { autoAlpha: 1, x: 0, y: 0 });
  gsap.set('.site', { autoAlpha: 0, scale: 1.04 });
  gsap.set('.intro-copy', { autoAlpha: 0, y: 16 });
  gsap.set('.lens-wrap', { autoAlpha: 0, scale: 0.75, rotate: -10 });
  gsap.set('.lens-body', { rotate: 0 });
  gsap.set('.aperture', { rotate: 0, scale: 1 });
  gsap.set('.blade', { scale: 1, autoAlpha: 1 });
  gsap.set('.aperture-hole', { scale: 0.74 });
  gsap.set('.glass-shine', { x: -40, autoAlpha: 0.35 });
  gsap.set('.viewfinder', { autoAlpha: 0, x: 0, y: 0 });
  gsap.set('.vf-bg', { filter: 'blur(18px)', scale: 1.15, x: 0, y: 0 });
  gsap.set('.vf-scanline', { y: -20, autoAlpha: 0 });
  gsap.set('.focus-target', { scale: 1.35, autoAlpha: 0 });
  gsap.set('.focus-target span', { borderColor: 'rgba(255,255,255,0.9)' });
  gsap.set('.focus-pulse', { scale: 0.8, autoAlpha: 0 });
  gsap.set('.focus-status', { textContent: 'Searching focus...', color: '#d7b574' });
  gsap.set('.flash', { autoAlpha: 0 });
  gsap.set('.navbar, .hero-content > *, .hero-card', { y: 30, autoAlpha: 0 });
  gsap.set('.replay', { autoAlpha: 0, y: 12 });
}

function playIntro(withSound = true) {
  const body = document.body;
  const replay = document.querySelector('.replay');
  body.classList.remove('ready');
  replay.classList.remove('show');

  if (!hasGsap) {
    body.classList.add('ready');
    return;
  }

  resetElements();
  if (withSound) playSoundTrack();

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.intro-copy', { autoAlpha: 1, y: 0, duration: 0.75 })
    .to('.lens-wrap', { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.05 }, '-=0.42')
    .to('.glass-shine', { x: 44, autoAlpha: 0.92, duration: 0.85, stagger: 0.08 }, '-=0.45')
    .to('.lens-body', { rotate: 18, duration: 1.0 }, '-=0.35')
    .to('.aperture', { rotate: 42, scale: 1.08, duration: 1.0 }, '<')
    .to('.blade', { scale: 0.28, autoAlpha: 0.19, duration: 1.0, stagger: 0.02 }, '<')
    .to('.aperture-hole', { scale: 2.9, duration: 1.0 }, '<')
    .to('.lens-wrap', { scale: 4.5, autoAlpha: 0, duration: 0.9, ease: 'power4.inOut' }, '-=0.10')
    .to('.intro-copy', { autoAlpha: 0, y: -16, duration: 0.46 }, '<')
    .to('.viewfinder', { autoAlpha: 1, duration: 0.35 }, '-=0.48')
    .to('.vf-scanline', { autoAlpha: 1, y: '100vh', duration: 0.8, ease: 'none' }, '-=0.2')
    .to('.focus-target', { autoAlpha: 1, scale: 1, duration: 0.42 }, '-=0.62')
    .to('.focus-pulse', { autoAlpha: 0.8, scale: 1.12, duration: 0.38, ease: 'sine.out' }, '-=0.12')
    .to('.focus-pulse', { autoAlpha: 0, scale: 1.45, duration: 0.36, ease: 'sine.out' })
    .to('.vf-bg', { filter: 'blur(7px)', scale: 1.08, x: -8, duration: 0.48, ease: 'sine.inOut' })
    .to('.vf-bg', { filter: 'blur(16px)', scale: 1.13, x: 7, duration: 0.28, ease: 'sine.inOut' })
    .to('.vf-bg', { filter: 'blur(5px)', scale: 1.06, x: -3, duration: 0.34, ease: 'sine.inOut' })
    .to('.vf-bg', { filter: 'blur(0px)', scale: 1, x: 0, duration: 0.62, ease: 'power2.out' })
    .to('.focus-target span', { borderColor: '#4cff8f', duration: 0.1 }, '<')
    .to('.focus-status', { textContent: 'Focus locked', color: '#4cff8f', duration: 0.1 }, '<')
    .to('.viewfinder', { x: 8, duration: 0.045, yoyo: true, repeat: 3, ease: 'none' }, '+=0.34')
    .to('.flash', { autoAlpha: 1, duration: 0.06, ease: 'none' }, '<')
    .to('.flash', { autoAlpha: 0, duration: 0.42, ease: 'power2.out' })
    .to('.viewfinder', { autoAlpha: 0, duration: 0.42 }, '<')
    .to('.intro', { autoAlpha: 0, duration: 0.5, onComplete: () => body.classList.add('ready') }, '<')
    .to('.site', { autoAlpha: 1, scale: 1, duration: 0.72 }, '<')
    .to('.navbar', { y: 0, autoAlpha: 1, duration: 0.52 }, '-=0.22')
    .to('.hero-content > *', { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.08 }, '-=0.17')
    .to('.hero-card', { y: 0, autoAlpha: 1, duration: 0.7 }, '-=0.42')
    .to('.replay', { autoAlpha: 1, y: 0, duration: 0.32, onComplete: () => replay.classList.add('show') }, '-=0.05');
}

function startExperience() {
  document.querySelector('.start-screen').style.display = 'none';
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  audioCtx.resume();
  playIntro(true);
}

document.querySelector('.start-screen').addEventListener('click', startExperience);
document.querySelector('.replay').addEventListener('click', () => playIntro(true));
