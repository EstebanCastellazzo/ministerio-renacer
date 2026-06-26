/* =========================================
   ACTIVIDADES — Landing Page JavaScript
   ========================================= */

'use strict';

/* === TITULAR DINÁMICO (efecto máquina de escribir) === */
(function initRotatingWord() {
  const el = document.getElementById('rotating-word');
  if (!el) return;

  const words = ['renacer', 'sanar', 'volver a empezar', 'encontrar paz', 'creer otra vez'];

  // Si el usuario prefiere menos movimiento, dejamos solo la primera palabra.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charCount = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];

    if (!deleting) {
      charCount++;
      el.textContent = word.slice(0, charCount);
      if (charCount === word.length) {
        deleting = true;
        return setTimeout(tick, 1700); // pausa con la palabra completa
      }
      return setTimeout(tick, 90);
    }

    charCount--;
    el.textContent = word.slice(0, charCount);
    if (charCount === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      return setTimeout(tick, 320);
    }
    return setTimeout(tick, 45);
  }

  setTimeout(tick, 1200);
})();

/* === SCROLL REVEAL === */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* === CONTADORES ANIMADOS === */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = target > 100 ? 2000 : 1200;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target).toLocaleString('es-AR');
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* === SMOOTH SCROLL PARA LINKS INTERNOS === */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* === PARALLAX SUAVE EN LAS PARTÍCULAS DEL HERO === */
(function initParallax() {
  const particles = document.querySelector('.acti-hero .hero-particles');
  if (!particles || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    particles.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
})();
