/* ==========================================================
   Re-crea · miembros.js
   Área "Mi cuenta": muestra el plan del mes según el perfil guardado
   y recuerda qué tareas marcó la persona (todo en su navegador).
   ========================================================== */
(function () {
  const vistaSin = document.getElementById('vistaSinCuenta');
  const vistaCuenta = document.getElementById('vistaCuenta');
  if (!vistaSin || !vistaCuenta) return;

  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }

  const membresia = Recrea.membresia();
  if (!membresia) { vistaSin.hidden = false; return; }

  vistaCuenta.hidden = false;

  const plan = PLANES.find(p => p.id === membresia.plan) || PLANES[1];
  const perfilId = CONTENIDO_PLUS[membresia.perfilId] ? membresia.perfilId : 'camino';
  const perfilInfo = PERFILES_PLUS[perfilId];
  const meses = Object.keys(CONTENIDO_PLUS[perfilId]).map(Number).sort((a, b) => a - b);

  /* ---------- Encabezado ---------- */
  document.getElementById('cuentaEtiqueta').textContent = plan.nombre + ' · simulación';
  document.getElementById('cuentaSaludo').textContent = 'Hola, ' + membresia.apodo;
  document.getElementById('cuentaPerfil').textContent = 'Tu perfil: ' + perfilInfo.nombre + '. ' + perfilInfo.enfoque;

  /* ---------- Resumen de la suscripción ---------- */
  const dl = document.getElementById('cuentaResumen');
  [
    ['Plan', plan.nombre + ' (' + formatoCLP(plan.precio) + ' ' + plan.periodo + ', ficticio)'],
    ['Vivienda', membresia.vivienda === 'casa' ? 'Casa' : 'Departamento'],
    ['Código de simulación', membresia.codigo],
    ['Inscripción', new Date(membresia.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })]
  ].forEach(([k, v]) => dl.append(el('dt', '', k), el('dd', '', v)));

  /* ---------- Progreso guardado ---------- */
  const progreso = Recrea.progreso();
  const claveMes = (mes) => perfilId + '-' + mes;

  function hechas(mes) { return progreso[claveMes(mes)] || []; }

  function alternar(mes, indice, marcado) {
    const set = new Set(hechas(mes));
    if (marcado) set.add(indice); else set.delete(indice);
    progreso[claveMes(mes)] = Array.from(set);
    Recrea.guardarProgreso(progreso);
  }

  /* ---------- Pestañas de meses ---------- */
  const tabs = document.getElementById('mesTabs');
  let mesActual = meses[0];

  function dibujarTabs() {
    tabs.textContent = '';
    meses.forEach(m => {
      const b = el('button', 'tab' + (m === mesActual ? ' tab--activa' : ''), 'Mes ' + m);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', m === mesActual ? 'true' : 'false');
      b.addEventListener('click', () => { mesActual = m; dibujarTabs(); dibujarMes(); });
      tabs.append(b);
    });
  }

  /* ---------- Plan del mes ---------- */
  function actualizarProgreso(total) {
    const hechasN = hechas(mesActual).length;
    const pct = Math.round((hechasN / total) * 100);
    document.getElementById('progresoRelleno').style.width = pct + '%';
    document.getElementById('progresoTexto').textContent =
      hechasN === total ? '¡Mes completado! Excelente trabajo.' : hechasN + ' de ' + total + ' tareas completadas (' + pct + '%)';
  }

  function dibujarMes() {
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
      input.checked = hechas(mesActual).includes(i);
      input.addEventListener('change', () => { alternar(mesActual, i, input.checked); actualizarProgreso(datos.pasos.length); });
      label.append(input, el('span', '', paso));
      li.append(label);
      lista.append(li);
    });

    const esCasa = membresia.vivienda === 'casa';
    document.getElementById('viviendaTitulo').textContent = esCasa ? 'Para tu casa' : 'Para tu departamento';
    document.getElementById('viviendaTexto').textContent = esCasa ? datos.casa : datos.depto;
    document.getElementById('economiaTexto').textContent = datos.economia;
    actualizarProgreso(datos.pasos.length);
  }

  dibujarTabs();
  dibujarMes();

  /* ---------- Cancelar (con confirmación en 2 pasos) ---------- */
  const btn = document.getElementById('btnCancelar');
  const estadoCuenta = document.getElementById('estadoCuenta');
  let esperando = false, temporizador = null;

  btn.addEventListener('click', () => {
    if (!esperando) {
      esperando = true;
      btn.textContent = 'Confirmar cancelación';
      estadoCuenta.textContent = 'Presiona de nuevo para cancelar tu suscripción simulada.';
      estadoCuenta.className = 'estado';
      temporizador = setTimeout(() => {
        esperando = false; btn.textContent = 'Cancelar suscripción'; estadoCuenta.textContent = '';
      }, 6000);
    } else {
      clearTimeout(temporizador);
      Recrea.cancelarMembresia();
      location.reload();
    }
  });
})();
