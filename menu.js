/* ==========================================================
   Re-crea · menu.js
   - Abre y cierra el menú en celulares
   - Marca la página actual en el menú
   - Muestra la cuenta con sesión iniciada
   - Registra el "service worker" que permite instalar el sitio como app
   ========================================================== */
(function () {
  const boton = document.getElementById('menuBoton');
  const menu = document.getElementById('menu');
  if (boton && menu) {
    boton.addEventListener('click', () => {
      const abierto = menu.classList.toggle('menu--abierto');
      boton.setAttribute('aria-expanded', abierto);
    });
    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') { menu.classList.remove('menu--abierto'); boton.setAttribute('aria-expanded', false); }
    });
    // Marcar la página actual (ej: planes.html)
    const actual = location.pathname.split('/').pop() || 'index.html';
    menu.querySelectorAll('a').forEach(a => {
      const destino = a.getAttribute('href').split('#')[0];
      if (destino && destino === actual && !a.getAttribute('href').includes('#')) a.setAttribute('aria-current', 'page');
    });
  }

  // Mostrar quién tiene la sesión iniciada (copia mínima que deja js/cuentas.js en este navegador)
  function pintarCuenta() {
    if (!menu) return;
    let u = null;
    try { u = JSON.parse(localStorage.getItem('recrea_menu')); } catch { u = null; }
    const enlaceCuenta = menu.querySelector('a[href="miembros.html"]');
    const enlaceCrear = menu.querySelector('a[href="inscripcion.html"]');
    const conSesion = !!(u && u.usuario);
    if (enlaceCrear) enlaceCrear.hidden = conSesion;      // con sesión iniciada ya no hace falta
    if (!enlaceCuenta) return;
    enlaceCuenta.textContent = '';
    if (conSesion) {
      const plus = u.plan !== 'gratis';
      enlaceCuenta.append(u.usuario + ' ');
      const ins = document.createElement('span');
      ins.className = 'insignia' + (plus ? ' insignia--plus' : '');
      ins.textContent = plus ? 'Plus' : 'Gratis';
      enlaceCuenta.append(ins);
    } else {
      enlaceCuenta.textContent = 'Iniciar sesión';
    }
  }
  pintarCuenta();
  window.addEventListener('recrea:sesion', pintarCuenta);   // lo avisa js/cuentas.js al crear o cerrar sesión

  // App instalable: solo funciona en http(s), no abriendo el archivo directamente
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sin acción: el sitio funciona igual */ });
  }
})();
