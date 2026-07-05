const hasGsap = window.gsap;

function playIntro() {
  const body = document.body;
  const replay = document.querySelector('.replay');

  body.classList.remove('ready');
  replay.classList.remove('show');

  if (!hasGsap) {
    body.classList.add('ready');
    return;
  }

  gsap.set('.intro', { autoAlpha: 1 });
  gsap.set('.site', { autoAlpha: 0, scale: 1.04 });
  gsap.set('.intro-copy', { autoAlpha: 0, y: 16 });
  gsap.set('.lens-wrap', { autoAlpha: 0, scale: 0.78, rotate: -8 });
  gsap.set('.lens-body', { rotate: 0 });
  gsap.set('.aperture', { rotate: 0, scale: 1 });
  gsap.set('.blade', { scale: 1, autoAlpha: 1 });
  gsap.set('.aperture-hole', { scale: 0.78 });
  gsap.set('.glass-shine', { x: -34, autoAlpha: 0.4 });
  gsap.set('.viewfinder', { autoAlpha: 0 });
  gsap.set('.vf-bg', { filter: 'blur(18px)', scale: 1.14 });
  gsap.set('.focus-target', { scale: 1.28, autoAlpha: 0 });
  gsap.set('.focus-target span', { borderColor: 'rgba(255,255,255,0.9)' });
  gsap.set('.focus-status', { textContent: 'Searching focus...', color: '#d7b574' });
  gsap.set('.flash', { autoAlpha: 0 });
  gsap.set('.navbar, .hero-content > *, .hero-card', { y: 30, autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.intro-copy', { autoAlpha: 1, y: 0, duration: 0.9 })
    .to('.lens-wrap', { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.05 }, '-=0.45')
    .to('.glass-shine', { x: 34, autoAlpha: 0.9, duration: 0.9, stagger: 0.08 }, '-=0.5')
    .to('.lens-body', { rotate: 16, duration: 1.0 }, '-=0.4')
    .to('.aperture', { rotate: 38, scale: 1.08, duration: 1.05 }, '<')
    .to('.blade', { scale: 0.26, autoAlpha: 0.2, duration: 1.05, stagger: 0.025 }, '<')
    .to('.aperture-hole', { scale: 2.7, duration: 1.05 }, '<')
    .to('.lens-wrap', { scale: 4.3, autoAlpha: 0, duration: 0.9, ease: 'power4.inOut' }, '-=0.15')
    .to('.intro-copy', { autoAlpha: 0, y: -18, duration: 0.55 }, '<')
    .to('.viewfinder', { autoAlpha: 1, duration: 0.35 }, '-=0.48')
    .to('.focus-target', { autoAlpha: 1, scale: 1, duration: 0.5 }, '-=0.05')
    .to('.vf-bg', { filter: 'blur(8px)', scale: 1.08, duration: 0.7, ease: 'sine.inOut' })
    .to('.vf-bg', { filter: 'blur(16px)', scale: 1.12, duration: 0.34, ease: 'sine.inOut' })
    .to('.vf-bg', { filter: 'blur(0px)', scale: 1, duration: 0.7, ease: 'power2.out' })
    .to('.focus-target span', { borderColor: '#4cff8f', duration: 0.15 }, '<')
    .to('.focus-status', { textContent: 'Focus locked', color: '#4cff8f', duration: 0.1 }, '<')
    .to('.flash', { autoAlpha: 1, duration: 0.08, ease: 'none' }, '+=0.32')
    .to('.flash', { autoAlpha: 0, duration: 0.42, ease: 'power2.out' })
    .to('.viewfinder', { autoAlpha: 0, duration: 0.45 }, '<')
    .to('.intro', { autoAlpha: 0, duration: 0.55, onComplete: () => body.classList.add('ready') }, '<')
    .to('.site', { autoAlpha: 1, scale: 1, duration: 0.75 }, '<')
    .to('.navbar', { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.25')
    .to('.hero-content > *', { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.09 }, '-=0.2')
    .to('.hero-card', { y: 0, autoAlpha: 1, duration: 0.7 }, '-=0.45')
    .to('.replay', { autoAlpha: 1, y: 0, duration: 0.35, onComplete: () => replay.classList.add('show') }, '-=0.1');
}

window.addEventListener('load', playIntro);
document.querySelector('.replay').addEventListener('click', playIntro);
