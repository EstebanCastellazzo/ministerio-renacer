/* =========================================
   LANDING "ANATOMÍA DE UN CAMBIO VERDADERO"
   ========================================= */
(function () {
  'use strict';

  /* --- Portada del libro: prueba varios nombres de archivo posibles --- */
  var portada = document.getElementById('av-portada');
  var portadaImg = document.getElementById('av-portada-img');
  if (portada && portadaImg) {
    // Busca la portada en la carpeta img/ y también en la raíz del sitio,
    // probando las extensiones y capitalizaciones más habituales.
    var carpetas = ['img/', '', 'imagenes/', 'images/'];
    var nombres = ['portada-anatomia', 'Portada-Anatomia', 'portada_anatomia', 'anatomia'];
    var extensiones = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.PNG'];
    var candidatos = [];
    carpetas.forEach(function (carpeta) {
      nombres.forEach(function (nombre) {
        extensiones.forEach(function (ext) { candidatos.push(carpeta + nombre + ext); });
      });
    });

    var probar = function (i) {
      if (i >= candidatos.length) {
        console.warn('No se encontró la portada. Subila como img/portada-anatomia.jpg (o revisá el nombre del archivo).');
        portada.classList.add('sin-portada');
        portadaImg.remove();
        return;
      }
      var test = new Image();
      test.onload = function () {
        portadaImg.src = candidatos[i];
        portadaImg.hidden = false;
      };
      test.onerror = function () { probar(i + 1); };
      test.src = candidatos[i];
    };
    probar(0);
  }

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
