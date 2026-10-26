/* ==========================================================
   Re-crea · menu.js
   - Abre y cierra el menú en celulares
   - Marca la página actual en el menú
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

  // App instalable: solo funciona en http(s), no abriendo el archivo directamente
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sin acción: el sitio funciona igual */ });
  }
})();
