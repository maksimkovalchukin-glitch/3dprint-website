/* майстер. — main.js */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobile();
  setNavActive();
  initReveal();
  initSmooth();
  initFaq();
  initFilter('.works-grid', '[data-cat]');
  initContactForm();
});

/* Nav scroll effect */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile burger */
function initMobile() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', menu.classList.contains('open'));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* Mark active nav link by current page */
function setNavActive() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === page.replace('.html','') ||
      (page === '' || page === 'index.html') && el.dataset.nav === 'home');
  });
}

/* Reveal on scroll */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* Smooth scroll to anchors with nav offset */
function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('nav')?.offsetHeight || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: 'smooth' });
    });
  });
}

/* FAQ accordion */
function initFaq() {
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* Works / gallery filter */
function initFilter(gridSel, cardAttr) {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      document.querySelectorAll(cardAttr).forEach(card => {
        card.classList.toggle('hidden', cat !== 'all' && card.dataset.cat !== cat);
      });
    });
  });
}

/* Contact form — Formspree async submit */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method:'POST', body: data, headers:{ Accept:'application/json' } });
      if (res.ok) {
        form.reset();
        if (success) { success.style.display = 'block'; }
      }
    } catch {}
  });
}
