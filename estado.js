/* ==========================================================
   Re-crea · estado.js
   Guarda en el NAVEGADOR de cada persona (localStorage) tres cosas:
     1) perfil      -> el resultado del cuestionario
     2) membresia   -> la inscripción SIMULADA
     3) progreso    -> las tareas marcadas en "Mi cuenta"
   No hay servidor ni cuentas reales: todo queda solo en el dispositivo.
   Todas las páginas cargan este archivo para compartir esa información.
   ========================================================== */

const Recrea = (() => {
  const CLAVES = {
    perfil: 'recrea_perfil',
    membresia: 'recrea_membresia',
    progreso: 'recrea_progreso'
  };

  // Leer y guardar con try/catch: en algunos navegadores (modo privado) el almacenamiento puede fallar
  function leer(clave, porDefecto = null) {
    try {
      const v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : porDefecto;
    } catch { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; }
    catch { return false; }
  }
  function borrar(clave) {
    try { localStorage.removeItem(clave); } catch { /* sin acción */ }
  }

  return {
    perfil: () => leer(CLAVES.perfil),
    guardarPerfil: (p) => guardar(CLAVES.perfil, p),

    membresia: () => leer(CLAVES.membresia),
    guardarMembresia: (m) => guardar(CLAVES.membresia, m),
    cancelarMembresia: () => borrar(CLAVES.membresia),

    progreso: () => leer(CLAVES.progreso, {}),
    guardarProgreso: (p) => guardar(CLAVES.progreso, p),

    borrarTodo: () => Object.values(CLAVES).forEach(borrar)
  };
})();
