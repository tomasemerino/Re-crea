/* ==========================================================
   Re-crea · estado.js
   Guarda en el navegador SOLO el resultado del cuestionario (perfil).
   Las cuentas (usuario, contraseña, plan) se manejan en js/cuentas.js.
   ========================================================== */

const Recrea = (() => {
  const CLAVE_PERFIL = 'recrea_perfil';

  function leer(clave, porDefecto = null) {
    try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : porDefecto; }
    catch { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; }
    catch { return false; }
  }

  return {
    perfil: () => leer(CLAVE_PERFIL),
    guardarPerfil: (p) => guardar(CLAVE_PERFIL, p)
  };
})();
