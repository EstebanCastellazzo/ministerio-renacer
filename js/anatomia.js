/* =========================================
   LANDING "ANATOMÍA DE UN CAMBIO VERDADERO"
   ========================================= */
(function () {
  'use strict';

  /* --- Reveal on scroll --- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.av-reveal').forEach(function (el) { revealObserver.observe(el); });

  /* --- Barra CTA fija en mobile (aparece al pasar el hero, se oculta en la compra) --- */
  var sticky = document.getElementById('av-sticky-cta');
  var hero = document.querySelector('.av-hero');
  var comprar = document.getElementById('comprar');
  var pasoHero = false, enCompra = false;

  function actualizarSticky() {
    sticky.classList.toggle('visible', pasoHero && !enCompra);
  }
  new IntersectionObserver(function (entries) {
    pasoHero = !entries[0].isIntersecting;
    actualizarSticky();
  }, { threshold: 0.1 }).observe(hero);
  new IntersectionObserver(function (entries) {
    enCompra = entries[0].isIntersecting;
    actualizarSticky();
  }, { threshold: 0.15 }).observe(comprar);
})();
