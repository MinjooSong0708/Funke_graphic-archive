/* Funke brand mood: lit slider tracks, ember light that follows the pointer, gentle scroll rise */
(() => {
  'use strict';
  const root = document.documentElement;
  const fine = matchMedia('(pointer:fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* sliders: paint the filled part of the track (also when the app changes values itself) */
  const sliders = [...document.querySelectorAll('input[type=range]')];
  const paint = r => {
    const mn = +r.min || 0, mx = +r.max || 100;
    r.style.setProperty('--pct', ((r.value - mn) / (mx - mn) * 100).toFixed(1) + '%');
  };
  sliders.forEach(r => { paint(r); r.addEventListener('input', () => paint(r)); });
  setInterval(() => sliders.forEach(paint), 250);

  /* ember light */
  if (fine && !reduce) {
    const g = document.createElement('div'); g.id = 'ember'; document.body.appendChild(g);
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, seen = false, last = 0;
    addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; x = tx; y = ty; g.classList.add('on'); }
      const hot = e.target.closest && e.target.closest('a,button,input,select,[data-tab]');
      g.classList.toggle('hot', !!hot);
    }, { passive: true });
    document.addEventListener('mouseleave', () => g.classList.remove('on'));
    document.addEventListener('mouseenter', () => seen && g.classList.add('on'));
    document.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return;
      const r = document.createElement('i'); r.className = 'm-ring';
      r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      document.body.appendChild(r); setTimeout(() => r.remove(), 950);
    });
    requestAnimationFrame(function loop(t) {
      const dt = Math.min(3, Math.max(.25, (t - (last || t - 16.7)) / 16.7)); last = t;
      const k = 1 - Math.pow(1 - .09, dt);
      x += (tx - x) * k; y += (ty - y) * k;
      g.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      requestAnimationFrame(loop);
    });
  }

  /* scroll rise for the closing sections */
  if ('IntersectionObserver' in window && !reduce) {
    const items = [...document.querySelectorAll('.guide .eyebrow,.guide h2,.guide-columns p,.preset-dock .section-label')];
    items.forEach((el, i) => { el.classList.add('m-rise'); el.style.transitionDelay = (i % 4) * 90 + 'ms'; });
    root.classList.add('mood-js');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
    items.forEach(el => io.observe(el));
  }
})();
