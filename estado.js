/* ==========================================================
   Re-crea · estado.js  (versión 3: cuentas de usuario SIMULADAS)

   Todo se guarda en el NAVEGADOR de cada persona (localStorage).
   No hay servidor, contraseñas ni datos personales: es una demostración.

   Qué se guarda:
     perfil     -> el último resultado del cuestionario
     usuarios   -> la lista de cuentas simuladas de este navegador
     activo     -> el id de la cuenta con la sesión iniciada
     progreso   -> las tareas marcadas, separadas por usuario
   ========================================================== */

const Recrea = (() => {
  const C = {
    perfil: 'recrea_perfil',
    usuarios: 'recrea_usuarios',
    activo: 'recrea_activo',
    progreso: 'recrea_progreso',
    legado: 'recrea_membresia'      // formato de la versión 2 (se migra solo)
  };

  /* ---------- Lectura y escritura segura ---------- */
  function leer(clave, porDefecto = null) {
    try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : porDefecto; }
    catch { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; }
    catch { return false; }
  }
  function borrar(clave) {
    try { localStorage.removeItem(clave); } catch { /* sin acción */ }
  }

  const nuevoId = () => 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const nuevoCodigo = () => 'SIM-' + Math.random().toString(36).slice(2, 8).toUpperCase();

  /* ---------- Migración desde la versión 2 (una sola membresía) ---------- */
  function migrarLegado() {
    const m = leer(C.legado);
    if (!m) return;
    const lista = leer(C.usuarios, []);
    if (!lista.length) {
      const u = { id: nuevoId(), apodo: m.apodo, perfilId: m.perfilId, vivienda: m.vivienda,
                  plan: m.plan, codigo: m.codigo || nuevoCodigo(), fecha: m.fecha || new Date().toISOString() };
      guardar(C.usuarios, [u]);
      guardar(C.activo, u.id);
    }
    borrar(C.legado);
  }

  /* ---------- Usuarios ---------- */
  function usuarios() { migrarLegado(); return leer(C.usuarios, []); }
  function usuarioActivo() {
    migrarLegado();            // primero migrar, para que el id activo ya exista
    const id = leer(C.activo);
    return id ? (usuarios().find(u => u.id === id) || null) : null;
  }

  function crearUsuario({ apodo, perfilId, vivienda, plan }) {
    const lista = usuarios();
    const u = { id: nuevoId(), apodo, perfilId, vivienda, plan, codigo: nuevoCodigo(), fecha: new Date().toISOString() };
    lista.push(u);
    if (!guardar(C.usuarios, lista)) return null;
    guardar(C.activo, u.id);
    return u;
  }

  function actualizarUsuario(id, cambios) {
    const lista = usuarios();
    const u = lista.find(x => x.id === id);
    if (!u) return null;
    Object.assign(u, cambios);
    guardar(C.usuarios, lista);
    return u;
  }

  function entrar(id) { guardar(C.activo, id); }
  function salir() { borrar(C.activo); }

  function eliminarUsuario(id) {
    guardar(C.usuarios, usuarios().filter(u => u.id !== id));
    const prog = leer(C.progreso, {});
    Object.keys(prog).forEach(k => { if (k.startsWith(id + ':')) delete prog[k]; });
    guardar(C.progreso, prog);
    if (leer(C.activo) === id) salir();
  }

  /* ---------- Usuarios de ejemplo (definidos en planes-data.js) ---------- */
  function entrarComoEjemplo(demo) {
    const lista = usuarios();
    if (!lista.some(u => u.id === demo.id)) {
      lista.push({ id: demo.id, apodo: demo.apodo, perfilId: demo.perfilId, vivienda: demo.vivienda,
                   plan: demo.plan, codigo: 'EJEMPLO', fecha: new Date().toISOString(), ejemplo: true });
      guardar(C.usuarios, lista);
      const prog = leer(C.progreso, {});
      Object.keys(demo.progresoInicial || {}).forEach(mes => {
        prog[demo.id + ':' + demo.perfilId + '-' + mes] = demo.progresoInicial[mes];
      });
      guardar(C.progreso, prog);
    }
    entrar(demo.id);
  }

  /* ---------- Progreso de tareas (por usuario, perfil y mes) ---------- */
  const claveProg = (uid, perfilId, mes) => uid + ':' + perfilId + '-' + mes;
  function tareasHechas(uid, perfilId, mes) {
    return (leer(C.progreso, {})[claveProg(uid, perfilId, mes)]) || [];
  }
  function marcarTarea(uid, perfilId, mes, indice, marcada) {
    const prog = leer(C.progreso, {});
    const k = claveProg(uid, perfilId, mes);
    const set = new Set(prog[k] || []);
    if (marcada) set.add(indice); else set.delete(indice);
    prog[k] = Array.from(set);
    guardar(C.progreso, prog);
  }

  return {
    perfil: () => leer(C.perfil),
    guardarPerfil: (p) => guardar(C.perfil, p),
    usuarios, usuarioActivo, crearUsuario, actualizarUsuario, entrar, salir, eliminarUsuario,
    entrarComoEjemplo, tareasHechas, marcarTarea,
    esPlus: (u) => !!u && u.plan !== 'gratis'
  };
})();
