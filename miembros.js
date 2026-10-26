/* ==========================================================
   Re-crea · miembros.js
   "Mi cuenta":
   - Sin sesión: formulario de usuario y contraseña, o un usuario de ejemplo.
   - Con sesión: plan del mes (Plus) o vista previa bloqueada (Gratis), cambio de plan,
     cerrar sesión y eliminar la cuenta. Los planes y pagos son una simulación.
   ========================================================== */
(async function () {
  const vistaAcceso = document.getElementById('vistaAcceso');
  const vistaCuenta = document.getElementById('vistaCuenta');
  if (!vistaAcceso || !vistaCuenta) return;

  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }
  const nombrePlan = (id) => (PLANES.find(p => p.id === id) || {}).nombre || id;
  const fechaLarga = (iso) => new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

  function insignia(plan) {
    return el('span', 'insignia' + (plan !== 'gratis' ? ' insignia--plus' : ''), plan === 'gratis' ? 'Gratis' : 'Plus');
  }

  /* ======================================================
     SIN SESIÓN
     ====================================================== */
  async function mostrarAcceso() {
    vistaAcceso.hidden = false;

    // Formulario de ingreso
    const form = document.getElementById('formAcceso');
    const estado = document.getElementById('estadoAcceso');
    document.getElementById('accVer').addEventListener('change', (e) => {
      document.getElementById('accClave').type = e.target.checked ? 'text' : 'password';
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      estado.textContent = ''; estado.className = 'estado';
      const usuario = document.getElementById('accUsuario').value;
      const clave = document.getElementById('accClave').value;
      if (!usuario.trim() || !clave) { estado.textContent = 'Escribe tu usuario y tu contraseña.'; estado.className = 'estado estado--error'; return; }
      const boton = document.getElementById('btnEntrar');
      boton.disabled = true; estado.textContent = 'Entrando…';
      try {
        await Cuentas.entrar(usuario, clave);
        location.href = 'miembros.html';
      } catch (err) {
        estado.textContent = err.message; estado.className = 'estado estado--error';
        boton.disabled = false;
      }
    });

    // Usuarios de ejemplo
    const ejemplos = document.getElementById('listaEjemplos');
    USUARIOS_EJEMPLO.forEach(demo => {
      const card = el('article', 'enlace-tarjeta');
      const cab = el('h3', 'usuario-nombre', demo.apodo + ' ');
      cab.append(insignia(demo.plan));
      const boton = el('button', 'boton boton--secundario', 'Ver como ' + demo.apodo);
      boton.type = 'button';
      boton.addEventListener('click', () => { Cuentas.entrarEjemplo(demo); location.reload(); });
      card.append(cab, el('p', '', demo.descripcion), boton);
      ejemplos.append(card);
    });

    // Aviso si estamos en modo de prueba (Firebase sin configurar)
    try {
      if (await Cuentas.modo() === 'local') {
        const aviso = document.getElementById('avisoModo');
        aviso.hidden = false;
        aviso.textContent = 'Modo de prueba: las cuentas se guardan solo en este navegador. En el sitio publicado se guardan en línea y funcionan en cualquier dispositivo.';
      }
    } catch (err) {
      estado.textContent = err.message; estado.className = 'estado estado--error';
    }
  }

  /* ======================================================
     CON SESIÓN
     ====================================================== */
  let mesActual = 1;

  let u = null;   // usuario con sesión iniciada (se vuelve a cargar tras cada cambio)

  function mostrarCuenta() {
    if (!u) { location.reload(); return; }

    vistaAcceso.hidden = true;
    vistaCuenta.hidden = false;

    const perfilId = CONTENIDO_PLUS[u.perfilId] ? u.perfilId : 'camino';
    const info = PERFILES_PLUS[perfilId];
    const esPlus = Cuentas.esPlus(u);

    document.getElementById('cuentaEtiqueta').textContent =
      nombrePlan(u.plan) + (u.ejemplo ? ' · usuario de ejemplo' : ' · @' + u.usuario);
    document.getElementById('cuentaSaludo').textContent = 'Hola, ' + u.usuario;
    document.getElementById('cuentaPerfil').textContent = 'Tu perfil: ' + info.nombre + '. ' + info.enfoque;

    avisoPerfilNuevo();

    document.getElementById('bloquePlus').hidden = !esPlus;
    document.getElementById('bloqueGratis').hidden = esPlus;
    if (esPlus) dibujarPlus(perfilId); else dibujarPrevia(perfilId);

    dibujarResumen(info);
    dibujarCambioPlan();
  }

  /* ---------- Si rehizo el cuestionario con otro resultado ---------- */
  function avisoPerfilNuevo() {
    const caja = document.getElementById('avisoPerfil');
    caja.hidden = true; caja.textContent = '';
    const ultimo = Recrea.perfil();
    if (u.ejemplo || !ultimo || ultimo.id === u.perfilId || !PERFILES_PLUS[ultimo.id]) return;
    caja.hidden = false;
    caja.append(el('p', '', 'Tu último resultado del cuestionario es "' + PERFILES_PLUS[ultimo.id].nombre + '". ¿Quieres actualizar tu plan a ese perfil?'));
    const b = el('button', 'boton boton--primario', 'Actualizar mi perfil');
    b.type = 'button';
    b.addEventListener('click', async () => {
      const cambios = { perfilId: ultimo.id };
      if (ultimo.respuestas && ultimo.respuestas.vivienda) cambios.vivienda = ultimo.respuestas.vivienda;
      try { u = await Cuentas.actualizar(cambios); mesActual = 1; mostrarCuenta(); }
      catch (err) { caja.append(el('p', 'estado estado--error', err.message)); }
    });
    caja.append(b);
  }

  /* ---------- Plan Plus: pestañas, tareas y progreso ---------- */
  function dibujarPlus(perfilId) {
    const meses = Object.keys(CONTENIDO_PLUS[perfilId]).map(Number).sort((a, b) => a - b);
    if (!meses.includes(mesActual)) mesActual = meses[0];

    const tabs = document.getElementById('mesTabs');
    tabs.textContent = '';
    meses.forEach(m => {
      const b = el('button', 'tab' + (m === mesActual ? ' tab--activa' : ''), 'Mes ' + m);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', m === mesActual ? 'true' : 'false');
      b.addEventListener('click', () => { mesActual = m; dibujarPlus(perfilId); });
      tabs.append(b);
    });

    const datos = CONTENIDO_PLUS[perfilId][mesActual];
    document.getElementById('planMesNumero').textContent = 'Mes ' + mesActual;
    document.getElementById('planMesTitulo').textContent = datos.titulo;
    document.getElementById('planPorque').textContent = datos.porque;

    const lista = document.getElementById('planTareas');
    lista.textContent = '';
    datos.pasos.forEach((paso, i) => {
      const li = el('li', 'tarea');
      const label = el('label');
      const input = el('input');
      input.type = 'checkbox';
      input.checked = Cuentas.tareasHechas(u, perfilId, mesActual).includes(i);
      input.addEventListener('change', async () => {
        const marcada = input.checked;
        try {
          u = await Cuentas.marcarTarea(perfilId, mesActual, i, marcada);
          actualizarProgreso(perfilId, datos.pasos.length);
        } catch (err) {
          input.checked = !marcada;
          document.getElementById('progresoTexto').textContent = 'No se pudo guardar el avance: ' + err.message;
        }
      });
      label.append(input, el('span', '', paso));
      li.append(label);
      lista.append(li);
    });

    const esCasa = u.vivienda === 'casa';
    document.getElementById('viviendaTitulo').textContent = esCasa ? 'Para tu casa' : 'Para tu departamento';
    document.getElementById('viviendaTexto').textContent = esCasa ? datos.casa : datos.depto;
    document.getElementById('economiaTexto').textContent = datos.economia;
    actualizarProgreso(perfilId, datos.pasos.length);
  }

  function actualizarProgreso(perfilId, total) {
    const hechas = Cuentas.tareasHechas(u, perfilId, mesActual).length;
    const pct = Math.round((hechas / total) * 100);
    document.getElementById('progresoRelleno').style.width = pct + '%';
    document.getElementById('progresoTexto').textContent =
      hechas === total ? '¡Mes completado! Excelente trabajo.' : hechas + ' de ' + total + ' tareas completadas (' + pct + '%)';
  }

  /* ---------- Plan Gratis: vista previa con candado ---------- */
  function dibujarPrevia(perfilId) {
    const datos = CONTENIDO_PLUS[perfilId][1];
    document.getElementById('previaTitulo').textContent = datos.titulo;
    document.getElementById('previaPorque').textContent = datos.porque;
  }

  /* ---------- Resumen de la cuenta ---------- */
  function dibujarResumen(info) {
    const plan = PLANES.find(p => p.id === u.plan);
    const dl = document.getElementById('cuentaResumen');
    dl.textContent = '';
    [
      ['Usuario', u.usuario],
      ['Plan', plan.nombre + (plan.precio ? ' (' + formatoCLP(plan.precio) + ' ' + plan.periodo + ', ficticio)' : '')],
      ['Perfil', info.nombre],
      ['Vivienda', u.vivienda === 'casa' ? 'Casa' : 'Departamento'],
      ['Código', u.codigo],
      ['Creada', fechaLarga(u.fecha)]
    ].forEach(([k, v]) => dl.append(el('dt', '', k), el('dd', '', v)));
  }

  /* ---------- Cambio de plan ---------- */
  function dibujarCambioPlan() {
    const cont = document.getElementById('opcionesCambio');
    cont.textContent = '';
    const pedido = new URLSearchParams(location.search).get('cambiar');
    const elegido = PLANES.some(p => p.id === pedido) ? pedido : u.plan;
    PLANES.forEach(plan => {
      const label = el('label', 'opcion-plan');
      const input = el('input');
      input.type = 'radio'; input.name = 'cambioPlan'; input.value = plan.id;
      input.checked = plan.id === elegido;
      const caja = el('span', 'opcion-plan__caja');
      const detalle = (plan.precio === 0 ? 'Gratis' : formatoCLP(plan.precio) + ' ' + plan.periodo) + (plan.id === u.plan ? ' · plan actual' : '');
      caja.append(el('strong', '', plan.nombre), el('span', '', detalle));
      label.append(input, caja);
      cont.append(label);
    });
  }

  /* ---------- Botones fijos (se registran una sola vez) ---------- */
  function registrarBotones() {
    const estadoCambio = document.getElementById('estadoCambio');
    const estadoCuenta = document.getElementById('estadoCuenta');

    document.getElementById('btnCambiar').addEventListener('click', async () => {
      const nuevo = (document.querySelector('input[name=cambioPlan]:checked') || {}).value;
      if (!u || !nuevo) return;
      if (nuevo === u.plan) {
        estadoCambio.textContent = 'Ya estás en ese plan.';
        estadoCambio.className = 'estado';
        return;
      }
      try {
        u = await Cuentas.actualizar({ plan: nuevo });
        mostrarCuenta();
        estadoCambio.textContent = 'Listo: ahora estás en ' + nombrePlan(nuevo) + ' (simulado, sin cobros).';
        estadoCambio.className = 'estado estado--ok';
        history.replaceState(null, '', 'miembros.html');
      } catch (err) {
        estadoCambio.textContent = err.message;
        estadoCambio.className = 'estado estado--error';
      }
    });

    document.getElementById('btnSubir').addEventListener('click', () => {
      const r = document.querySelector('input[name=cambioPlan][value=mensual]');
      if (r) r.checked = true;
    });

    document.getElementById('btnSalir').addEventListener('click', async () => {
      await Cuentas.salir();
      location.href = 'miembros.html';
    });

    // Eliminar con confirmación en 2 pasos (en cuentas reales pide la contraseña)
    const btn = document.getElementById('btnEliminar');
    const cajaClave = document.getElementById('confirmarEliminar');
    const campoClave = document.getElementById('claveEliminar');
    let esperando = false;
    btn.addEventListener('click', async () => {
      if (!esperando) {
        esperando = true;
        btn.textContent = 'Confirmar: eliminar cuenta';
        if (!u.ejemplo) { cajaClave.hidden = false; campoClave.focus(); }
        estadoCuenta.textContent = 'Presiona de nuevo para borrar esta cuenta y su progreso. No se puede deshacer.';
        estadoCuenta.className = 'estado';
        return;
      }
      btn.disabled = true;
      try {
        await Cuentas.eliminar(campoClave.value);
        location.href = 'miembros.html';
      } catch (err) {
        estadoCuenta.textContent = err.message;
        estadoCuenta.className = 'estado estado--error';
        btn.disabled = false;
      }
    });
  }

  /* ---------- Inicio ---------- */
  try {
    u = await Cuentas.sesion();
  } catch (err) {
    u = null;
  }
  if (u) {
    registrarBotones();
    mostrarCuenta();
    if (location.hash === '#cambiar-plan') {
      const c = document.getElementById('cambiar-plan');
      if (c) c.scrollIntoView();
    }
  } else {
    mostrarAcceso();
  }
})();
