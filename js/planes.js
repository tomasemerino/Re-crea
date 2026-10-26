/* ==========================================================
   Re-crea · planes.js
   Dibuja las tarjetas de planes a partir de PLANES (js/planes-data.js)
   y adapta los botones según si hay una sesión iniciada.
   ========================================================== */
(async function () {
  const grid = document.getElementById('planesGrid');
  const aviso = document.getElementById('planPerfil');
  if (!grid || !aviso) return;

  const perfil = Recrea.perfil();
  const info = perfil && PERFILES_PLUS[perfil.id];

  let usuario = null;
  try { usuario = await Cuentas.sesion(); } catch { /* sin conexión: se muestra como visitante */ }

  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }
  function enlace(texto, href, clase) {
    const a = el('a', clase, texto);
    a.href = href;
    return a;
  }

  /* ---------- Aviso superior ---------- */
  if (usuario) {
    const plan = PLANES.find(p => p.id === usuario.plan);
    aviso.className = 'perfil-aviso perfil-aviso--ok';
    const t = el('p');
    t.append('Tienes la sesión iniciada como ', el('strong', '', usuario.usuario), ' (', plan ? plan.nombre : 'Plus', ').');
    aviso.append(t, enlace('Ir a Mi cuenta', 'miembros.html', 'boton boton--primario'));
  } else {
    aviso.className = 'perfil-aviso' + (info ? ' perfil-aviso--ok' : '');
    const t = el('p');
    if (info) t.append('Tu perfil: ', el('strong', '', info.nombre), '. ' + info.enfoque);
    else t.textContent = 'Todavía no conocemos tu perfil. Hazlo en 1 minuto para que tu plan salga a tu medida.';
    aviso.append(t);
    const acciones = el('div', 'acciones-fila');
    if (!info) acciones.append(enlace('Hacer el cuestionario', 'index.html#cuestionario', 'boton boton--secundario'));
    acciones.append(enlace('Ver cómo funciona con un usuario de ejemplo', 'miembros.html', 'boton boton--secundario'));
    aviso.append(acciones);
  }

  /* ---------- Tarjetas de planes ---------- */
  PLANES.forEach(plan => {
    const esActual = usuario && usuario.plan === plan.id;
    const card = el('article', 'plan' + (plan.destacado ? ' plan--destacado' : '') + (esActual ? ' plan--actual' : ''));
    if (plan.destacado && !esActual) card.append(el('span', 'plan__cinta', 'Más elegido'));
    if (esActual) card.append(el('span', 'plan__cinta', 'Tu plan actual'));
    card.append(el('h3', 'plan__nombre', plan.nombre));

    const precio = el('p', 'plan__precio');
    precio.append(el('span', 'plan__monto', formatoCLP(plan.precio)));
    if (plan.periodo) precio.append(el('span', 'plan__periodo', ' ' + plan.periodo));
    card.append(precio);
    card.append(el('p', 'plan__resumen', plan.resumen));

    const lista = el('ul', 'plan__lista');
    plan.beneficios.forEach(b => lista.append(el('li', '', b)));
    card.append(lista);

    const clase = 'boton ' + (plan.id === 'gratis' ? 'boton--secundario' : 'boton--primario');
    if (esActual) {
      const b = el('span', 'boton boton--secundario boton--inactivo', 'Plan actual');
      b.setAttribute('aria-disabled', 'true');
      card.append(b);
    } else if (usuario) {
      card.append(enlace('Cambiar a este plan', 'miembros.html?cambiar=' + plan.id + '#cambiar-plan', clase));
    } else if (plan.id === 'gratis') {
      card.append(enlace('Usar sin cuenta', 'index.html#cuestionario', clase));
    } else {
      card.append(enlace('Crear cuenta y probar Plus', 'inscripcion.html?plan=' + plan.id, clase));
    }
    grid.append(card);
  });
})();
