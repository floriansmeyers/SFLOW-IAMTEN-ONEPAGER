(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Count-up numbers ----
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => { el.textContent = el.dataset.count; });
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      countObs.unobserve(el);
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = Math.round(target * easeOut(p));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countObs.observe(el));


  // ---- Nav: hide on scroll down, show on scroll up + active link ----
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80 && y > lastY) nav.classList.add('nav--hidden');
    else nav.classList.remove('nav--hidden');
    lastY = y;
  }, { passive: true });

  const links = document.querySelectorAll('.nav__links a[href^="#"]');
  const sectionIds = [...links].map(a => a.getAttribute('href')).filter(h => h.length > 1);
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);
  const linkFor = id => document.querySelector(`.nav__links a[href="#${id}"]`);

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const link = linkFor(e.target.id);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });
  sections.forEach(s => activeObs.observe(s));
})();
