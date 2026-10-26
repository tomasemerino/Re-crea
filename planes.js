/* ==========================================================
   Re-crea · planes.js
   Dibuja las tarjetas de planes a partir de PLANES (js/planes-data.js)
   y muestra un aviso con el perfil del cuestionario, si existe.
   ========================================================== */
(function () {
  const grid = document.getElementById('planesGrid');
  const aviso = document.getElementById('planPerfil');
  if (!grid || !aviso) return;

  const perfil = Recrea.perfil();
  const membresia = Recrea.membresia();
  const info = perfil && PERFILES_PLUS[perfil.id];

  /* ---------- Aviso del perfil ---------- */
  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }

  if (membresia) {
    aviso.className = 'perfil-aviso perfil-aviso--ok';
    const t = el('p');
    t.append('Ya tienes una suscripción simulada (', el('strong', '', (PLANES.find(p => p.id === membresia.plan) || {}).nombre || 'Plus'), '). ');
    const a = el('a', 'boton boton--primario', 'Ir a Mi cuenta');
    a.href = 'miembros.html';
    aviso.append(t, a);
  } else if (info) {
    aviso.className = 'perfil-aviso perfil-aviso--ok';
    const t = el('p');
    t.append('Tu perfil: ', el('strong', '', info.nombre), '. ' + info.enfoque);
    aviso.append(t);
  } else {
    aviso.className = 'perfil-aviso';
    const t = el('p', '', 'Todavía no conocemos tu perfil. Hazlo en 1 minuto para que tu plan salga a tu medida.');
    const a = el('a', 'boton boton--secundario', 'Hacer el cuestionario');
    a.href = 'index.html#cuestionario';
    aviso.append(t, a);
  }

  /* ---------- Tarjetas de planes ---------- */
  PLANES.forEach(plan => {
    const card = el('article', 'plan' + (plan.destacado ? ' plan--destacado' : ''));
    if (plan.destacado) card.append(el('span', 'plan__cinta', 'Más elegido'));
    card.append(el('h3', 'plan__nombre', plan.nombre));

    const precio = el('p', 'plan__precio');
    precio.append(el('span', 'plan__monto', formatoCLP(plan.precio)));
    if (plan.periodo) precio.append(el('span', 'plan__periodo', ' ' + plan.periodo));
    card.append(precio);
    card.append(el('p', 'plan__resumen', plan.resumen));

    const lista = el('ul', 'plan__lista');
    plan.beneficios.forEach(b => lista.append(el('li', '', b)));
    card.append(lista);

    const boton = el('a', 'boton ' + (plan.id === 'gratis' ? 'boton--secundario' : 'boton--primario'));
    if (plan.id === 'gratis') {
      boton.textContent = 'Hacer el cuestionario';
      boton.href = 'index.html#cuestionario';
    } else {
      boton.textContent = 'Elegir este plan';
      boton.href = 'inscripcion.html?plan=' + plan.id;
    }
    card.append(boton);
    grid.append(card);
  });
})();
