/* ==========================================================
   Re-crea · inscripcion.js
   Inscripción SIMULADA:
   - No pide ni guarda datos de pago.
   - Guarda en el navegador (localStorage) una "membresía" de ejemplo.
   ========================================================== */
(function () {
  const form = document.getElementById('formInscripcion');
  if (!form) return;

  const vistaForm = document.getElementById('vistaFormulario');
  const vistaConf = document.getElementById('vistaConfirmacion');
  const opcionesPlan = document.getElementById('opcionesPlan');
  const perfilDetectado = document.getElementById('perfilDetectado');
  const estado = document.getElementById('estadoForm');

  const perfilGuardado = Recrea.perfil();
  const planesPagos = PLANES.filter(p => p.precio > 0);

  // Plan elegido por la dirección: inscripcion.html?plan=anual
  const parametro = new URLSearchParams(location.search).get('plan');
  const planInicial = planesPagos.some(p => p.id === parametro) ? parametro : 'mensual';

  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }

  /* ---------- 1) Opciones de plan ---------- */
  planesPagos.forEach(plan => {
    const label = el('label', 'opcion-plan');
    const input = el('input');
    input.type = 'radio'; input.name = 'plan'; input.value = plan.id;
    input.checked = plan.id === planInicial;
    const caja = el('span', 'opcion-plan__caja');
    caja.append(el('strong', '', plan.nombre), el('span', '', formatoCLP(plan.precio) + ' ' + plan.periodo + ' (ficticio)'));
    label.append(input, caja);
    opcionesPlan.append(label);
  });

  /* ---------- 3) Perfil y vivienda ---------- */
  const viviendaPrevia = perfilGuardado && perfilGuardado.respuestas && perfilGuardado.respuestas.vivienda;

  if (perfilGuardado && PERFILES_PLUS[perfilGuardado.id]) {
    const p = el('p', 'perfil-detectado');
    p.append('Usaremos tu perfil del cuestionario: ', el('strong', '', PERFILES_PLUS[perfilGuardado.id].nombre), '.');
    perfilDetectado.append(p);
  } else {
    perfilDetectado.append(el('p', 'ayuda', 'No encontramos tu resultado del cuestionario. Elige el perfil que más se parezca a ti (o haz el cuestionario primero).'));
    const select = el('select');
    select.id = 'perfilSelect';
    select.setAttribute('aria-label', 'Perfil');
    select.append(new Option('Elige tu perfil', ''));
    Object.keys(PERFILES_PLUS).forEach(id => select.append(new Option(PERFILES_PLUS[id].nombre, id)));
    perfilDetectado.append(select);
    const link = el('a', 'ayuda', 'Hacer el cuestionario ahora');
    link.href = 'index.html#cuestionario';
    perfilDetectado.append(link);
  }

  const viv = el('div', 'vivienda-opciones');
  viv.append(el('p', 'ayuda', '¿Dónde vives? (para adaptar los consejos)'));
  [['casa', 'En una casa'], ['depto', 'En un departamento']].forEach(([valor, texto]) => {
    const l = el('label', 'check');
    const i = el('input'); i.type = 'radio'; i.name = 'vivienda'; i.value = valor;
    i.checked = viviendaPrevia === valor;
    l.append(i, el('span', '', texto));
    viv.append(l);
  });
  perfilDetectado.append(viv);

  /* ---------- Envío del formulario ---------- */
  function mostrarError(texto) {
    estado.textContent = texto;
    estado.className = 'estado estado--error';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    estado.textContent = '';

    const planId = (form.querySelector('input[name=plan]:checked') || {}).value;
    const apodo = document.getElementById('apodo').value.trim();
    const vivienda = (form.querySelector('input[name=vivienda]:checked') || {}).value;
    const perfilId = perfilGuardado && PERFILES_PLUS[perfilGuardado.id]
      ? perfilGuardado.id
      : (document.getElementById('perfilSelect') || {}).value;
    const acepto = document.getElementById('acepto').checked;

    if (!planId) return mostrarError('Elige un plan.');
    if (apodo.length < 2) return mostrarError('Escribe un nombre o apodo (mínimo 2 letras).');
    if (apodo.includes('@') || /\d{6,}/.test(apodo.replace(/[\s.-]/g, ''))) {
      return mostrarError('Por seguridad, no escribas correos ni teléfonos: usa solo un nombre o apodo.');
    }
    if (!perfilId) return mostrarError('Elige tu perfil.');
    if (!vivienda) return mostrarError('Indica si vives en casa o en departamento.');
    if (!acepto) return mostrarError('Marca la casilla para confirmar que entiendes que es una simulación.');

    const plan = PLANES.find(p => p.id === planId);
    const codigo = 'SIM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const membresia = {
      plan: planId, apodo, perfilId, vivienda, codigo,
      precio: plan.precio, fecha: new Date().toISOString()
    };
    if (!Recrea.guardarMembresia(membresia)) {
      return mostrarError('Tu navegador no permite guardar datos (¿modo privado?). Prueba en una ventana normal.');
    }
    mostrarConfirmacion(membresia, plan);
  });

  /* ---------- Confirmación ---------- */
  function mostrarConfirmacion(m, plan) {
    vistaForm.hidden = true;
    vistaConf.hidden = false;
    document.getElementById('confTitulo').textContent = '¡Bienvenido/a, ' + m.apodo + '!';
    document.getElementById('confTexto').textContent =
      'Quedaste inscrito/a en ' + plan.nombre + ' de forma simulada. Tu primer plan mensual ya está listo en "Mi cuenta".';
    const dl = document.getElementById('confResumen');
    dl.textContent = '';
    const filas = [
      ['Plan', plan.nombre],
      ['Monto (ficticio)', formatoCLP(plan.precio) + ' ' + plan.periodo],
      ['Perfil', PERFILES_PLUS[m.perfilId].nombre],
      ['Código de simulación', m.codigo],
      ['Fecha', new Date(m.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })]
    ];
    filas.forEach(([k, v]) => { dl.append(el('dt', '', k), el('dd', '', v)); });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
})();
