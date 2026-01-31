(() => {
  const hero = document.querySelector('.hero');
  const lines = document.querySelector('.lines');
  const cards = document.querySelectorAll('.card[data-tilt="1"]');
  const reveal = document.querySelectorAll('.fade-in');
  const navLinks = document.querySelectorAll('.nav a');

  const path = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(a => { if (a.getAttribute('href') === path) a.classList.add('active'); });

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href === path) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 220);
    });
  });

  if (hero && lines){
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5);
      const my = ((e.clientY - r.top) / r.height - 0.5);
      lines.style.setProperty('--mx', `${mx * 18}px`);
      lines.style.setProperty('--my', `${my * 14}px`);
    });
    hero.addEventListener('mouseleave', () => {
      lines.style.setProperty('--mx', `0px`);
      lines.style.setProperty('--my', `0px`);
    });
  }

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-2px) rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('is-in'); });
  }, { threshold: 0.12 });
  reveal.forEach(el => io.observe(el));

  // AI widget UI (demo) — connect to n8n later
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  const addMsg = (text, who) => {
    const el = document.createElement('div');
    el.className = 'msg ' + who;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  };

  const fakeReply = (t) => {
    const s = String(t||'').toLowerCase();
    if (s.includes('hekur')) return 'Për hekur: projektim, prodhim, montim. A ke dimensione apo foto?';
    if (s.includes('arkitekt')) return 'Për arkitekturë: koncept, plane 2D, vizualizime 3D. Çfarë objekti është?';
    if (s.includes('mirembajt')) return 'Për mirëmbajtje: riparime dhe servisim. Ku është lokacioni?';
    if (s.includes('projekt')) return 'Menaxhim projektesh: planifikim, koordinim, afate. A ke afat të përafërt?';
    return 'Jam widget (UI). Më vonë lidhem me AI/n8n. Shkruaj çfarë kërkon.';
  };

  if (fab && panel){
    fab.addEventListener('click', () => {
      panel.style.display = (panel.style.display === 'flex') ? 'none' : 'flex';
      panel.style.flexDirection = 'column';
      setTimeout(() => input && input.focus(), 60);
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', () => panel.style.display = 'none');

  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = (input.value || '').trim();
      if (!text) return;
      addMsg(text, 'user');
      input.value = '';
      setTimeout(() => addMsg(fakeReply(text), 'bot'), 260);
    });
  }
})();

// Mobile nav toggle
(() => {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (!btn || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  // close on click of a link
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav-toggle")) return;
    if (e.target.closest("#site-nav")) return;
    close();
  });

  // close on resize back to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) close();
  });
})();
