'use strict';
/* ================================================
   MYSTERY SECURITY — Shared Site JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initMobileMenu();
  initBackToTop();
  initScrollSpy();
  initForms();
  initStats();
  setActiveNav();
});

/* ---- Navigation Dropdowns ---- */
function initNav() {
  const navItems = document.querySelectorAll('.nav-item');
  let closeTimer = null;

  navItems.forEach(item => {
    const dropdown = item.querySelector('.nav-dropdown');
    if (!dropdown) return;

    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
    });

    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        // handled by CSS :hover, just here for safety
      }, 100);
    });

    // Keyboard
    const trigger = item.querySelector('.nav-trigger');
    if (trigger) {
      trigger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
        if (e.key === 'Escape') {
          dropdown.classList.remove('open');
          trigger.focus();
        }
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    // animate hamburger
    btn.querySelector('.bar-top')?.classList.toggle('rotate-45');
    btn.querySelector('.bar-mid')?.classList.toggle('opacity-0');
    btn.querySelector('.bar-bot')?.classList.toggle('-rotate-45');
  });

  // Mobile accordion (service/company sub-menus)
  document.querySelectorAll('.mobile-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (!content) return;
      const isOpen = content.classList.toggle('open');
      btn.querySelector('.accordion-icon')?.classList.toggle('rotate-180', isOpen);
    });
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('active'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ---- Back To Top ---- */
function initBackToTop() {
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.className = 'fixed bottom-7 right-7 z-40 w-10 h-10 rounded-full bg-bg3 border border-border text-muted flex items-center justify-center opacity-0 pointer-events-none transition-all duration-200 hover:border-red hover:text-red shadow-lg';
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    document.body.appendChild(btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) { btn.classList.remove('opacity-0','pointer-events-none'); btn.classList.add('opacity-100'); }
    else { btn.classList.add('opacity-0','pointer-events-none'); btn.classList.remove('opacity-100'); }
  }, { passive: true });
}

/* ---- ScrollSpy ---- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('[data-spy]');
  if (!sections.length || !links.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop, h = sec.offsetHeight;
      if (y >= top && y < top + h) {
        links.forEach(l => { l.classList.toggle('nav-link-active', l.getAttribute('href') === `#${sec.id}`); });
      }
    });
  }, { passive: true });
}

/* ---- Set Active Nav Based on Current URL ---- */
function setActiveNav() {
  const path = window.location.pathname.replace(/\/+$/, '');
  document.querySelectorAll('[data-nav-href]').forEach(el => {
    const href = el.getAttribute('data-nav-href').replace(/\/+$/, '');
    if (path === href || path.startsWith(href + '/')) {
      el.classList.add('text-red-primary', 'opacity-100');
    }
  });
}

/* ---- Contact Form ---- */
function initForms() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('#cf-name')?.value.trim() || '';
    const company = form.querySelector('#cf-company')?.value.trim() || '';
    const email   = form.querySelector('#cf-email')?.value.trim() || '';
    const service = form.querySelector('#cf-service')?.value || '';
    const message = form.querySelector('#cf-message')?.value.trim() || '';

    const subject = encodeURIComponent(`[Security Inquiry] ${service} — ${name} @ ${company}`);
    const body = encodeURIComponent(
`MYSTERY Security Team,

Name: ${name}
Company: ${company}
Email: ${email}
Service: ${service}

Details:
${message}

—
Sent via mystery.security inquiry form`
    );

    const btn = form.querySelector('[type=submit]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Opening mail client…';
    window.location.href = `mailto:mystery.security@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; }, 1200);
  });
}

/* ---- Stat Counters ---- */
function initStats() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.ceil(target / 50);
      const tick = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(tick);
      }, 24);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

/* ---- Escape HTML ---- */
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
