/* ==========================================================
   Re-crea · modelo.js
   Simulador del modelo de negocio (proyecto académico).
   Cada mes:
     clientes nuevos = clientes nuevos del mes anterior × (1 + crecimiento)
     clientes        = clientes del mes anterior × (1 − cancelación) + clientes nuevos
     ingresos        = clientes × precio
     costos          = clientes × costo variable + nuevos × costo de captación + costos fijos
     utilidad        = ingresos − costos
   Los valores son SUPUESTOS de ejemplo, no datos reales.
   ========================================================== */
(function () {
  const form = document.getElementById('supuestos');
  if (!form) return;

  const EJEMPLO = { precio: 2990, nuevosIni: 15, crecimiento: 5, cancelacion: 8, costoVar: 900, cac: 2500, costoFijo: 80000 };
  const CLAVE = 'recrea_modelo';
  const MESES = 12;
  const CAMPOS = Object.keys(EJEMPLO);

  /* ---------- Lectura y guardado de supuestos ---------- */
  function cargar() {
    try { return Object.assign({}, EJEMPLO, JSON.parse(localStorage.getItem(CLAVE)) || {}); }
    catch { return Object.assign({}, EJEMPLO); }
  }
  function guardar(v) { try { localStorage.setItem(CLAVE, JSON.stringify(v)); } catch { /* sin acción */ } }

  function leerFormulario() {
    const v = {};
    CAMPOS.forEach(c => {
      const n = parseFloat(document.getElementById(c).value);
      v[c] = Number.isFinite(n) ? n : 0;
    });
    v.crecimiento = Math.min(Math.max(v.crecimiento, -50), 100);
    v.cancelacion = Math.min(Math.max(v.cancelacion, 0), 100);
    ['precio', 'nuevosIni', 'costoVar', 'cac', 'costoFijo'].forEach(c => { v[c] = Math.max(v[c], 0); });
    return v;
  }

  /* ---------- Cálculo ---------- */
  function calcular(v) {
    const filas = [];
    let clientes = 0, nuevos = 0, acumulada = 0;
    for (let m = 1; m <= MESES; m++) {
      nuevos = m === 1 ? v.nuevosIni : nuevos * (1 + v.crecimiento / 100);
      clientes = m === 1 ? nuevos : clientes * (1 - v.cancelacion / 100) + nuevos;
      const ingresos = clientes * v.precio;
      const costos = clientes * v.costoVar + nuevos * v.cac + v.costoFijo;
      const utilidad = ingresos - costos;
      acumulada += utilidad;
      filas.push({ mes: m, nuevos, clientes, ingresos, costos, utilidad, acumulada });
    }
    const margen = v.precio - v.costoVar;
    const equilibrioClientes = margen > 0 ? v.costoFijo / margen : null;
    const mesPositivo = filas.find(f => f.utilidad > 0);
    const ltv = margen > 0 && v.cancelacion > 0 ? margen / (v.cancelacion / 100) : null;
    return {
      filas, margen, equilibrioClientes, ltv,
      mesPositivo: mesPositivo ? mesPositivo.mes : null,
      ltvCac: ltv !== null && v.cac > 0 ? ltv / v.cac : null,
      ingresosAnio: filas.reduce((s, f) => s + f.ingresos, 0),
      utilidadAnio: filas[MESES - 1].acumulada
    };
  }

  /* ---------- Formatos ---------- */
  const clp = (n) => (n < 0 ? '−' : '') + '$' + Math.abs(Math.round(n)).toLocaleString('es-CL');
  const entero = (n) => Math.round(n).toLocaleString('es-CL');
  function compacto(n) {
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toLocaleString('es-CL', { maximumFractionDigits: 1 }) + ' M';
    if (a >= 1e3) return Math.round(n / 1e3).toLocaleString('es-CL') + ' mil';
    return String(Math.round(n));
  }

  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  /* ---------- Tarjetas de indicadores ---------- */
  function dibujarKpis(r) {
    const cont = document.getElementById('kpis');
    cont.textContent = '';
    const items = [
      ['Punto de equilibrio', r.equilibrioClientes === null ? 'No hay' : entero(Math.ceil(r.equilibrioClientes)) + ' clientes',
        r.equilibrioClientes === null ? 'El precio no cubre el costo variable.' : 'para cubrir los costos fijos'],
      ['Primer mes con utilidad', r.mesPositivo ? 'Mes ' + r.mesPositivo : 'Ninguno', r.mesPositivo ? 'ingresos mayores que costos' : 'en los 12 meses'],
      ['Clientes al mes 12', entero(r.filas[MESES - 1].clientes), 'suscripciones activas'],
      ['Ingresos del año', clp(r.ingresosAnio), 'suma de los 12 meses'],
      ['Utilidad acumulada', clp(r.utilidadAnio), r.utilidadAnio >= 0 ? 'ganancia en 12 meses' : 'pérdida en 12 meses'],
      ['LTV / costo de captación', r.ltvCac === null ? '—' : r.ltvCac.toLocaleString('es-CL', { maximumFractionDigits: 1 }) + ' veces',
        r.ltv === null ? 'faltan datos' : 'un cliente deja ' + clp(r.ltv)]
    ];
    items.forEach(([titulo, valor, nota]) => {
      const k = el('div', 'kpi');
      k.append(el('p', 'kpi__titulo', titulo), el('p', 'kpi__valor', valor), el('p', 'kpi__nota', nota));
      cont.append(k);
    });
  }

  /* ---------- Tabla ---------- */
  function dibujarTabla(r) {
    const t = document.getElementById('tablaMeses');
    t.textContent = '';
    const cab = el('tr');
    ['Mes', 'Clientes nuevos', 'Clientes', 'Ingresos', 'Costos', 'Utilidad', 'Utilidad acumulada'].forEach(h => {
      const th = el('th', '', h); th.scope = 'col'; cab.append(th);
    });
    const thead = el('thead'); thead.append(cab);
    const tbody = el('tbody');
    r.filas.forEach(f => {
      const tr = el('tr');
      const th = el('th', '', String(f.mes)); th.scope = 'row'; tr.append(th);
      [entero(f.nuevos), entero(f.clientes), clp(f.ingresos), clp(f.costos), clp(f.utilidad), clp(f.acumulada)]
        .forEach(x => tr.append(el('td', 'num', x)));
      tbody.append(tr);
    });
    t.append(thead, tbody);
  }

  /* ---------- Gráfico (SVG dibujado a mano, sin librerías) ---------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, texto) {
    const e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  function ticksBonitos(max) {
    if (max <= 0) return [0, 1];
    const bruto = max / 4;
    const potencia = Math.pow(10, Math.floor(Math.log10(bruto)));
    const f = bruto / potencia;
    const paso = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * potencia;
    const ticks = [];
    for (let v = 0; v <= max + paso * 0.999; v += paso) ticks.push(v);
    return ticks;
  }

  let ultimo = null;

  function dibujarGrafico(r) {
    ultimo = r;
    const cont = document.getElementById('grafico');
    cont.textContent = '';
    const W = Math.max(cont.clientWidth, 280);
    const H = W < 420 ? 240 : 290;
    const M = { t: 14, r: 18, b: 30, l: W < 420 ? 52 : 62 };
    const iw = W - M.l - M.r, ih = H - M.t - M.b;

    const maxVal = Math.max(...r.filas.map(f => Math.max(f.ingresos, f.costos)), 1);
    const ticks = ticksBonitos(maxVal);
    const top = ticks[ticks.length - 1];
    const x = (i) => M.l + (iw * i) / (MESES - 1);
    const y = (val) => M.t + ih - (ih * val) / top;

    const svg = s('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });

    // Cuadrícula y eje Y (líneas finas, sólidas, discretas)
    ticks.forEach(t => {
      svg.append(s('line', { x1: M.l, x2: W - M.r, y1: y(t), y2: y(t), class: 'g-grid' }));
      svg.append(s('text', { x: M.l - 8, y: y(t) + 4, class: 'g-eje', 'text-anchor': 'end' }, t === 0 ? '0' : '$' + compacto(t)));
    });
    // Eje X
    const salto = W < 420 ? 2 : 1;
    r.filas.forEach((f, i) => {
      if ((MESES - 1 - i) % salto === 0) svg.append(s('text', { x: x(i), y: H - 8, class: 'g-eje', 'text-anchor': 'middle' }, 'M' + f.mes));
    });

    // Líneas
    const linea = (clave) => r.filas.map((f, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(f[clave]).toFixed(1)).join(' ');
    svg.append(s('path', { d: linea('costos'), class: 'g-linea g-linea--costos' }));
    svg.append(s('path', { d: linea('ingresos'), class: 'g-linea g-linea--ingresos' }));

    // Puntos finales (con aro del color de la superficie)
    const ult = r.filas[MESES - 1];
    svg.append(s('circle', { cx: x(MESES - 1), cy: y(ult.costos), r: 4, class: 'g-punto g-punto--costos' }));
    svg.append(s('circle', { cx: x(MESES - 1), cy: y(ult.ingresos), r: 4, class: 'g-punto g-punto--ingresos' }));

    // Capa de interacción
    const guia = s('line', { y1: M.t, y2: M.t + ih, class: 'g-guia', visibility: 'hidden' });
    const pI = s('circle', { r: 5, class: 'g-punto g-punto--ingresos', visibility: 'hidden' });
    const pC = s('circle', { r: 5, class: 'g-punto g-punto--costos', visibility: 'hidden' });
    const capa = s('rect', { x: M.l, y: M.t, width: iw, height: ih, fill: 'transparent' });
    svg.append(guia, pI, pC, capa);
    cont.append(svg);

    const tip = el('div', 'g-tooltip');
    tip.hidden = true;
    cont.append(tip);

    function mostrar(ev) {
      const caja = svg.getBoundingClientRect();
      const px = ev.clientX - caja.left;
      let i = Math.round(((px - M.l) / iw) * (MESES - 1));
      i = Math.min(Math.max(i, 0), MESES - 1);
      const f = r.filas[i];
      guia.setAttribute('x1', x(i)); guia.setAttribute('x2', x(i)); guia.setAttribute('visibility', 'visible');
      pI.setAttribute('cx', x(i)); pI.setAttribute('cy', y(f.ingresos)); pI.setAttribute('visibility', 'visible');
      pC.setAttribute('cx', x(i)); pC.setAttribute('cy', y(f.costos)); pC.setAttribute('visibility', 'visible');
      tip.textContent = '';
      tip.append(el('strong', '', 'Mes ' + f.mes));
      [['Ingresos', f.ingresos, 'ingresos'], ['Costos totales', f.costos, 'costos'], ['Utilidad', f.utilidad, 'utilidad']].forEach(([n, val, tipo]) => {
        const fila = el('div', 'g-tooltip__fila');
        const marca = el('span', 'g-marca g-marca--' + tipo);
        fila.append(marca, el('span', '', n), el('span', 'num', clp(val)));
        tip.append(fila);
      });
      tip.hidden = false;
      const ancho = tip.offsetWidth;
      let izq = x(i) + 12;
      if (izq + ancho > W) izq = x(i) - ancho - 12;
      tip.style.left = Math.max(izq, 0) + 'px';
      tip.style.top = M.t + 'px';
    }
    function ocultar() {
      tip.hidden = true;
      [guia, pI, pC].forEach(n => n.setAttribute('visibility', 'hidden'));
    }
    capa.addEventListener('pointermove', mostrar);
    capa.addEventListener('pointerdown', mostrar);
    capa.addEventListener('pointerleave', ocultar);
  }

  function dibujarLeyenda() {
    const l = document.getElementById('leyenda');
    l.textContent = '';
    [['ingresos', 'Ingresos'], ['costos', 'Costos totales (variables, captación y fijos)']].forEach(([clave, texto]) => {
      const it = el('span', 'leyenda__item');
      it.append(el('span', 'g-marca g-marca--' + clave), el('span', '', texto));
      l.append(it);
    });
  }

  function dibujarBajada(r) {
    const e = document.getElementById('grafBajada');
    e.textContent = r.mesPositivo
      ? 'Con estos supuestos, desde el mes ' + r.mesPositivo + ' los ingresos superan a los costos.'
      : 'Con estos supuestos, en 12 meses los costos siguen superando a los ingresos.';
  }

  /* ---------- Actualizar todo ---------- */
  function actualizar() {
    const v = leerFormulario();
    guardar(v);
    const r = calcular(v);
    dibujarKpis(r);
    dibujarBajada(r);
    dibujarGrafico(r);
    dibujarTabla(r);
  }

  const inicial = cargar();
  CAMPOS.forEach(c => { document.getElementById(c).value = inicial[c]; });
  dibujarLeyenda();
  actualizar();

  CAMPOS.forEach(c => document.getElementById(c).addEventListener('input', actualizar));
  document.getElementById('btnReset').addEventListener('click', () => {
    CAMPOS.forEach(c => { document.getElementById(c).value = EJEMPLO[c]; });
    actualizar();
  });
  let tRes;
  window.addEventListener('resize', () => { clearTimeout(tRes); tRes = setTimeout(() => ultimo && dibujarGrafico(ultimo), 120); });
})();
