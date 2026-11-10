(()=>{
 const root=document.documentElement,buttons=[...document.querySelectorAll('[data-set-theme]')];
 function apply(theme){
  root.dataset.theme=theme;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.setTheme===theme)));
  document.querySelectorAll('img[data-preset-light]').forEach(img=>{const src=theme==='dark'?img.dataset.presetDark:img.dataset.presetLight;if(img.getAttribute('src')!==src)img.src=src;});
  document.querySelectorAll('img[data-hero-light]').forEach(img=>{const src=theme==='dark'?img.dataset.heroDark:img.dataset.heroLight;if(img.getAttribute('src')!==src)img.src=src;});
  try{localStorage.setItem('funke-theme-v2',theme);}catch{}
  window.funkeLab?.applyTheme(theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#12141c':'#ffffff');
  dispatchEvent(new Event('resize'));
 }
 buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.setTheme)));apply(root.dataset.theme||'dark');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.guide-columns>div').forEach(el=>{el.classList.add('reveal-copy');observer.observe(el);});
 }
})();
