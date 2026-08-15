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
    var carpetas = ['img/', ''];
    var nombres = ['portada-anatomia', 'Portada-Anatomia', 'anatomia'];
    var extensiones = ['.jpg', '.jpeg', '.png', '.webp'];
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
      test.onload = function () { portadaImg.src = candidatos[i]; };
      test.onerror = function () { probar(i + 1); };
      test.src = candidatos[i];
    };

    // La portada ya viene con su ruta en el HTML: solo buscamos alternativas
    // si esa ruta falla, así la imagen se ve aunque este script no se cargue.
    var buscando = false;
    var alFallar = function () {
      if (buscando) return;
      buscando = true;
      probar(0);
    };
    portadaImg.addEventListener('error', alFallar);
    // El error pudo dispararse antes de que este script se ejecutara.
    if (portadaImg.complete && portadaImg.naturalWidth === 0) alFallar();
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
