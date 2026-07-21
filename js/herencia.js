/* =========================================
   LANDING "SANANDO LA HERENCIA" — interacciones
   ========================================= */
(function () {
  'use strict';

  /* --- Video de fondo: si falta el archivo, usar el fondo animado --- */
  var video = document.getElementById('lh-video');
  if (video) {
    video.addEventListener('error', function () { document.body.classList.add('sin-video'); }, true);
    var source = video.querySelector('source');
    if (source) source.addEventListener('error', function () { document.body.classList.add('sin-video'); });
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
  document.querySelectorAll('.lh-reveal').forEach(function (el) { revealObserver.observe(el); });

  /* --- Animación de la cadena generacional --- */
  var cadena = document.getElementById('lh-cadena');
  if (cadena) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        setTimeout(function () { cadena.classList.add('cortada'); }, 600);
        obs.disconnect();
      }
    }, { threshold: 0.3 }).observe(cadena);
  }

  /* --- Test interactivo de patrones --- */
  var chips = document.querySelectorAll('.lh-chip');
  var resultBox = document.getElementById('lh-chips-result');
  var resultMsg = document.getElementById('lh-chips-msg');

  function actualizarResultado() {
    var activos = document.querySelectorAll('.lh-chip.activo').length;
    if (activos === 0) {
      resultBox.hidden = true;
      return;
    }
    var msg;
    if (activos === 1) {
      msg = 'Identificaste 1 patrón. Reconocerlo ya es el primer paso: lo que se nombra, se puede cortar.';
    } else if (activos <= 3) {
      msg = 'Identificaste ' + activos + ' patrones que se repiten en tu historia. No es casualidad que hayas llegado hasta acá.';
    } else {
      msg = 'Identificaste ' + activos + ' patrones. Cargaste con esto demasiado tiempo — pero la cadena se puede cortar en tu generación.';
    }
    resultMsg.textContent = msg;
    resultBox.hidden = false;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('activo');
      actualizarResultado();
    });
  });

  /* --- Cuenta regresiva --- */
  var countdown = document.getElementById('lh-countdown');
  if (countdown) {
    var inicio = new Date(countdown.getAttribute('data-inicio')).getTime();
    var $d = document.getElementById('cd-dias');
    var $h = document.getElementById('cd-horas');
    var $m = document.getElementById('cd-min');
    var $s = document.getElementById('cd-seg');

    var tick = function () {
      var resta = inicio - Date.now();
      if (isNaN(inicio) || resta <= 0) {
        countdown.style.display = 'none';
        return;
      }
      $d.textContent = Math.floor(resta / 86400000);
      $h.textContent = String(Math.floor(resta / 3600000) % 24).padStart(2, '0');
      $m.textContent = String(Math.floor(resta / 60000) % 60).padStart(2, '0');
      $s.textContent = String(Math.floor(resta / 1000) % 60).padStart(2, '0');
      setTimeout(tick, 1000);
    };
    tick();
  }

  /* --- Barra CTA fija en mobile (aparece al pasar el hero, se oculta en el form) --- */
  var sticky = document.getElementById('lh-sticky-cta');
  var hero = document.querySelector('.lh-hero');
  var inscripcion = document.getElementById('inscripcion');
  var pasoHero = false, enForm = false;

  function actualizarSticky() {
    sticky.classList.toggle('visible', pasoHero && !enForm);
  }
  new IntersectionObserver(function (entries) {
    pasoHero = !entries[0].isIntersecting;
    actualizarSticky();
  }, { threshold: 0.1 }).observe(hero);
  new IntersectionObserver(function (entries) {
    enForm = entries[0].isIntersecting;
    actualizarSticky();
  }, { threshold: 0.15 }).observe(inscripcion);

  /* --- Captura de UTMs (para saber qué reel trajo cada inscripto) --- */
  var params = new URLSearchParams(window.location.search);
  var utms = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (k) {
    var v = params.get(k);
    if (v) utms[k] = v.slice(0, 100);
  });

  /* --- Envío del formulario --- */
  var form = document.getElementById('lh-form');
  var formMsg = document.getElementById('lh-form-msg');
  var formOk = document.getElementById('lh-form-ok');
  var submitBtn = document.getElementById('lh-submit');

  function mostrarError(texto) {
    formMsg.textContent = texto;
    formMsg.className = 'lh-form-msg error';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formMsg.textContent = '';
    formMsg.className = 'lh-form-msg';

    var nombre = form.nombre.value.trim();
    var apellido = form.apellido.value.trim();
    var telefono = form.telefono.value.trim();
    var edad = parseInt(form.edad.value, 10);

    [form.nombre, form.apellido, form.telefono, form.edad].forEach(function (i) { i.classList.remove('invalido'); });

    if (nombre.length < 2) { form.nombre.classList.add('invalido'); return mostrarError('Contanos tu nombre 🙂'); }
    if (apellido.length < 2) { form.apellido.classList.add('invalido'); return mostrarError('Falta tu apellido.'); }
    if (telefono.replace(/\D/g, '').length < 8) { form.telefono.classList.add('invalido'); return mostrarError('Revisá el teléfono: necesitamos un WhatsApp válido para contactarte.'); }
    if (!(edad >= 12 && edad <= 99)) { form.edad.classList.add('invalido'); return mostrarError('Ingresá una edad válida.'); }

    var datos = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      edad: edad,
      sitio_web: form.sitio_web.value, // honeypot
      curso: 'sanando-la-herencia'
    };
    Object.keys(utms).forEach(function (k) { datos[k] = utms[k]; });

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    if (window.location.protocol === 'file:') {
      mostrarError('Estás abriendo la página como archivo local: el formulario solo funciona subido al hosting (necesita PHP).');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Quiero mi lugar en el\u00A0curso\u00A0→';
      return;
    }

    fetch('inscripcion.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then(function (res) {
        return res.text().then(function (texto) {
          var data = null;
          try { data = JSON.parse(texto); } catch (e) { /* respuesta no-JSON: la diagnosticamos abajo */ }

          if (data && data.ok) {
            form.hidden = true;
            formOk.hidden = false;
            formOk.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
          if (data && data.error) {
            mostrarError(data.error);
            return;
          }
          // Respuesta que no es JSON: diagnóstico según el caso
          console.error('Respuesta de inscripcion.php (HTTP ' + res.status + '):', texto.slice(0, 500));
          if (res.status === 404) {
            mostrarError('No se encuentra inscripcion.php en el servidor. Verificá que esté subido en la misma carpeta que esta página.');
          } else if (texto.indexOf('<?php') !== -1) {
            mostrarError('El servidor no está ejecutando PHP. Verificá que el hosting tenga PHP habilitado.');
          } else {
            mostrarError('El servidor respondió con un error (HTTP ' + res.status + '). Revisá la consola del navegador (F12) para ver el detalle.');
          }
        });
      })
      .catch(function (err) {
        console.error('Error de red al enviar la inscripción:', err);
        mostrarError('No hubo respuesta del servidor. Verificá tu conexión o escribinos por WhatsApp.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Quiero mi lugar en el\u00A0curso\u00A0→';
      });
  });
})();
