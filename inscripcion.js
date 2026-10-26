/* ==========================================================
   Re-crea · inscripcion.js
   Crear una cuenta SIMULADA y elegir plan.
   - No hay contraseñas ni datos de pago.
   - La cuenta se guarda solo en este navegador (ver js/estado.js).
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
  const sesion = Recrea.usuarioActivo();

  // Plan elegido por la dirección: inscripcion.html?plan=anual
  const parametro = new URLSearchParams(location.search).get('plan');
  const planInicial = PLANES.some(p => p.id === parametro) ? parametro : 'mensual';

  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }

  /* ---------- Aviso si ya hay una sesión ---------- */
  if (sesion) {
    const n = el('p', 'ayuda', 'Ya tienes la sesión iniciada como ' + sesion.apodo + '. Al crear una cuenta nueva, pasarás a usar la nueva.');
    form.prepend(n);
  }

  /* ---------- 1) Opciones de plan ---------- */
  PLANES.forEach(plan => {
    const label = el('label', 'opcion-plan');
    const input = el('input');
    input.type = 'radio'; input.name = 'plan'; input.value = plan.id;
    input.checked = plan.id === planInicial;
    const caja = el('span', 'opcion-plan__caja');
    const detalle = plan.precio === 0 ? 'Gratis' : formatoCLP(plan.precio) + ' ' + plan.periodo + ' (ficticio)';
    caja.append(el('strong', '', plan.nombre), el('span', '', detalle));
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

    const usuario = Recrea.crearUsuario({ apodo, perfilId, vivienda, plan: planId });
    if (!usuario) {
      return mostrarError('Tu navegador no permite guardar datos (¿modo privado?). Prueba en una ventana normal.');
    }
    mostrarConfirmacion(usuario);
  });

  /* ---------- Confirmación ---------- */
  function mostrarConfirmacion(u) {
    const plan = PLANES.find(p => p.id === u.plan);
    vistaForm.hidden = true;
    vistaConf.hidden = false;
    document.getElementById('confTitulo').textContent = '¡Bienvenido/a, ' + u.apodo + '!';
    document.getElementById('confTexto').textContent = plan.precio === 0
      ? 'Tu cuenta simulada con el plan Gratis está lista. Puedes pasar a Plus cuando quieras desde "Mi cuenta".'
      : 'Tu cuenta simulada con ' + plan.nombre + ' está lista. Tu primer plan mensual ya te espera en "Mi cuenta".';
    const dl = document.getElementById('confResumen');
    dl.textContent = '';
    [
      ['Plan', plan.nombre],
      ['Monto (ficticio)', plan.precio === 0 ? 'Gratis' : formatoCLP(plan.precio) + ' ' + plan.periodo],
      ['Perfil', PERFILES_PLUS[u.perfilId].nombre],
      ['Código de simulación', u.codigo],
      ['Fecha', new Date(u.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })]
    ].forEach(([k, v]) => dl.append(el('dt', '', k), el('dd', '', v)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
})();
