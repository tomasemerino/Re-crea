/* ==========================================================
   Re-crea · cuentas.js  (versión 4: usuario + contraseña)

   Crea cuentas, inicia y cierra sesión, y guarda el plan de cada persona.

   Dos modos, elegidos solos:
   - "nube"  -> Firebase Authentication + Firestore (cuentas reales, funcionan en cualquier
                dispositivo). Se usa cuando js/config-firebase.js tiene tus datos.
   - "local" -> modo de prueba: las cuentas viven solo en este navegador.
                Se usa mientras Firebase no esté configurado (por ejemplo, abriendo el sitio en tu computador).

   Los PAGOS siguen siendo simulados: nunca se cobra ni se pide información de pago.

   Cómo se usa desde otras páginas (todo devuelve promesas):
     await Cuentas.sesion()                 -> usuario o null
     await Cuentas.registrar({...})         -> crea la cuenta e inicia sesión
     await Cuentas.entrar(usuario, clave)
     await Cuentas.salir()
     await Cuentas.actualizar({ plan })
     await Cuentas.marcarTarea(perfilId, mes, indice, true/false)
     await Cuentas.eliminar(clave)
     await Cuentas.entrarEjemplo(demo)      -> sesión de ejemplo (solo en este navegador)
   ========================================================== */

(function () {
  'use strict';

  const SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';
  const DOMINIO = '@recrea-demo.app';        // el "correo" interno: nunca se envía nada a esa dirección
  const K = {
    cuentas: 'recrea_cuentas',               // modo local: todas las cuentas de este navegador
    sesion: 'recrea_sesion',                 // modo local: usuario con sesión iniciada
    demo: 'recrea_demo',                     // sesión de ejemplo (usuario ficticio)
    menu: 'recrea_menu'                      // copia mínima para pintar el menú sin esperar
  };

  /* ---------- Utilidades ---------- */
  function leer(clave, porDefecto = null) {
    try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : porDefecto; } catch { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch { return false; }
  }
  function borrar(clave) { try { localStorage.removeItem(clave); } catch { /* sin acción */ } }

  function fallo(mensaje, codigo) { const e = new Error(mensaje); e.codigo = codigo || 'error'; return e; }
  const nuevoCodigo = () => 'SIM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const nuevoId = () => 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const correo = (usuario) => usuario + DOMINIO;
  const CAMPOS_EDITABLES = ['plan', 'perfilId', 'vivienda', 'progreso'];

  function validarUsuario(texto) {
    const u = String(texto || '').trim().toLowerCase();
    if (u.length < 3) return 'El usuario debe tener al menos 3 caracteres.';
    if (u.length > 20) return 'El usuario puede tener hasta 20 caracteres.';
    if (!/^[a-z0-9._-]+$/.test(u)) return 'Usa solo letras sin tilde, números, punto, guion o guion bajo (sin espacios).';
    if (u.replace(/\D/g, '').length >= 6) return 'Por seguridad, no uses teléfonos ni números largos en tu usuario.';
    return '';
  }
  function validarClave(texto) {
    if (String(texto || '').length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    if (String(texto).length > 60) return 'La contraseña es demasiado larga (máximo 60).';
    return '';
  }

  // Copia mínima para que el menú muestre "usuario · Plus" al instante en todas las páginas
  function publicar(u) {
    if (u) guardar(K.menu, { usuario: u.usuario, plan: u.plan }); else borrar(K.menu);
    window.dispatchEvent(new Event('recrea:sesion'));
    return u;
  }

  /* ======================================================
     MODO LOCAL (pruebas): cuentas guardadas en este navegador
     ====================================================== */
  async function hashClave(clave, sal) {
    if (!(window.crypto && crypto.subtle)) throw fallo('Este navegador no permite cuentas en modo de prueba. Usa la versión publicada del sitio.', 'sin-crypto');
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey('raw', enc.encode(clave), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(sal), iterations: 100000, hash: 'SHA-256' }, base, 256);
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function crearLocal() {
    const todas = () => leer(K.cuentas, {});
    const publico = (c) => c && { id: c.id, usuario: c.usuario, plan: c.plan, perfilId: c.perfilId, vivienda: c.vivienda,
                                  codigo: c.codigo, fecha: c.fecha, progreso: c.progreso || {} };
    return {
      modo: 'local',
      async sesion() {
        const nombre = leer(K.sesion);
        return nombre ? publico(todas()[nombre]) || null : null;
      },
      async registrar(d) {
        const cuentas = todas();
        if (cuentas[d.usuario]) throw fallo('Ese usuario ya existe. Elige otro o inicia sesión.', 'usuario-existe');
        const sal = nuevoId();
        const c = { id: nuevoId(), usuario: d.usuario, sal, hash: await hashClave(d.clave, sal), plan: d.plan, perfilId: d.perfilId,
                    vivienda: d.vivienda, codigo: nuevoCodigo(), fecha: new Date().toISOString(), progreso: d.progreso || {} };
        cuentas[d.usuario] = c;
        if (!guardar(K.cuentas, cuentas)) throw fallo('Tu navegador no permite guardar datos (¿modo privado?). Prueba en una ventana normal.', 'sin-almacenamiento');
        guardar(K.sesion, d.usuario);
        return publico(c);
      },
      async entrar(usuario, clave) {
        const c = todas()[usuario];
        if (!c || c.hash !== await hashClave(clave, c.sal)) throw fallo('Usuario o contraseña incorrectos.', 'credenciales');
        guardar(K.sesion, usuario);
        return publico(c);
      },
      async salir() { borrar(K.sesion); },
      async actualizar(cambios) {
        const nombre = leer(K.sesion), cuentas = todas();
        if (!nombre || !cuentas[nombre]) throw fallo('No hay una sesión iniciada.', 'sin-sesion');
        Object.assign(cuentas[nombre], cambios);
        guardar(K.cuentas, cuentas);
        return publico(cuentas[nombre]);
      },
      async eliminar(clave) {
        const nombre = leer(K.sesion), cuentas = todas(), c = cuentas[nombre];
        if (!c) throw fallo('No hay una sesión iniciada.', 'sin-sesion');
        if (c.hash !== await hashClave(clave, c.sal)) throw fallo('La contraseña no coincide.', 'credenciales');
        delete cuentas[nombre];
        guardar(K.cuentas, cuentas);
        borrar(K.sesion);
      }
    };
  }

  /* ======================================================
     MODO NUBE: Firebase Authentication + Firestore
     ====================================================== */
  function traducir(e) {
    const c = (e && e.code) || '';
    const mapa = {
      'auth/email-already-in-use': ['Ese usuario ya existe. Elige otro o inicia sesión.', 'usuario-existe'],
      'auth/invalid-credential': ['Usuario o contraseña incorrectos.', 'credenciales'],
      'auth/wrong-password': ['Usuario o contraseña incorrectos.', 'credenciales'],
      'auth/user-not-found': ['Usuario o contraseña incorrectos.', 'credenciales'],
      'auth/invalid-login-credentials': ['Usuario o contraseña incorrectos.', 'credenciales'],
      'auth/weak-password': ['La contraseña es muy débil: usa al menos 6 caracteres.', 'clave-debil'],
      'auth/too-many-requests': ['Demasiados intentos. Espera unos minutos e inténtalo de nuevo.', 'muchos-intentos'],
      'auth/network-request-failed': ['No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.', 'red'],
      'auth/operation-not-allowed': ['Falta activar "Correo y contraseña" en Firebase Authentication (ver la guía).', 'config'],
      'auth/configuration-not-found': ['Falta activar Authentication en Firebase (ver la guía).', 'config'],
      'permission-denied': ['El servidor rechazó la operación: faltan publicar las reglas de Firestore (ver la guía).', 'config']
    };
    const m = mapa[c];
    return m ? fallo(m[0], m[1]) : fallo('Ocurrió un problema inesperado (' + (c || e.message || 'sin detalle') + '). Inténtalo de nuevo.', 'desconocido');
  }

  async function crearNube(cfg) {
    const [mApp, A, F] = await Promise.all([
      import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')
    ]);
    const app = mApp.initializeApp(cfg, 'cuentas');
    const auth = A.getAuth(app), db = F.getFirestore(app);
    const primera = new Promise(res => { const off = A.onAuthStateChanged(auth, u => { off(); res(u); }); });

    const ref = (uid) => F.doc(db, 'usuarios', uid);
    async function cargar(uid) {
      const s = await F.getDoc(ref(uid));
      if (!s.exists()) return null;
      return { id: uid, ...s.data(), progreso: s.data().progreso || {} };
    }

    return {
      modo: 'nube',
      async sesion() {
        await primera;
        if (!auth.currentUser) return null;
        try { return await cargar(auth.currentUser.uid); } catch (e) { throw traducir(e); }
      },
      async registrar(d) {
        let cred;
        try { cred = await A.createUserWithEmailAndPassword(auth, correo(d.usuario), d.clave); } catch (e) { throw traducir(e); }
        const datos = { usuario: d.usuario, plan: d.plan, perfilId: d.perfilId, vivienda: d.vivienda,
                        codigo: nuevoCodigo(), fecha: new Date().toISOString(), progreso: d.progreso || {} };
        try { await F.setDoc(ref(cred.user.uid), datos); }
        catch (e) { try { await A.deleteUser(cred.user); } catch { /* sin acción */ } throw traducir(e); }
        return { id: cred.user.uid, ...datos };
      },
      async entrar(usuario, clave) {
        let cred;
        try { cred = await A.signInWithEmailAndPassword(auth, correo(usuario), clave); } catch (e) { throw traducir(e); }
        let u;
        try { u = await cargar(cred.user.uid); } catch (e) { throw traducir(e); }
        if (!u) { await A.signOut(auth); throw fallo('Esa cuenta no tiene datos de perfil. Crea una cuenta nueva.', 'sin-datos'); }
        return u;
      },
      async salir() { await A.signOut(auth); },
      async actualizar(cambios) {
        if (!auth.currentUser) throw fallo('No hay una sesión iniciada.', 'sin-sesion');
        try { await F.updateDoc(ref(auth.currentUser.uid), cambios); return await cargar(auth.currentUser.uid); }
        catch (e) { throw traducir(e); }
      },
      async eliminar(clave) {
        const user = auth.currentUser;
        if (!user) throw fallo('No hay una sesión iniciada.', 'sin-sesion');
        try {
          await A.reauthenticateWithCredential(user, A.EmailAuthProvider.credential(user.email, clave));
          await F.deleteDoc(ref(user.uid));
          await A.deleteUser(user);
        } catch (e) { throw traducir(e); }
      }
    };
  }

  /* ---------- Elegir el modo (una sola vez) ---------- */
  let promesaBackend = null;
  function backend() {
    if (!promesaBackend) {
      promesaBackend = import('./config-firebase.js').then(m => {
        const cfg = m.firebaseConfig || {};
        const configurado = !!cfg.apiKey && !String(cfg.apiKey).startsWith('PEGA_AQUI');
        return configurado ? crearNube(cfg) : crearLocal();
      }).catch(e => { promesaBackend = null; throw (e.codigo ? e : fallo('No se pudo conectar con el servicio de cuentas. Revisa tu internet e inténtalo de nuevo.', 'red')); });
    }
    return promesaBackend;
  }

  /* ======================================================
     API PÚBLICA
     ====================================================== */
  let actual = null;   // último usuario cargado (para marcar tareas sin volver a pedirlo)

  const Cuentas = {
    validarUsuario, validarClave,
    normalizar: (t) => String(t || '').trim().toLowerCase(),
    async modo() { return (await backend()).modo; },

    async sesion() {
      const demo = leer(K.demo);
      if (demo) { actual = demo; return publicar(demo); }
      actual = publicar(await (await backend()).sesion());
      return actual;
    },

    async registrar(d) {
      const e = validarUsuario(d.usuario) || validarClave(d.clave);
      if (e) throw fallo(e, 'validacion');
      borrar(K.demo);
      actual = publicar(await (await backend()).registrar({ ...d, usuario: Cuentas.normalizar(d.usuario) }));
      return actual;
    },

    async entrar(usuario, clave) {
      const e = validarUsuario(usuario) ? 'Usuario o contraseña incorrectos.' : '';
      if (e) throw fallo(e, 'credenciales');
      borrar(K.demo);
      actual = publicar(await (await backend()).entrar(Cuentas.normalizar(usuario), clave));
      return actual;
    },

    async salir() {
      borrar(K.demo);
      publicar(null);
      actual = null;
      try { await (await backend()).salir(); } catch { /* si el servicio no responde, igual cerramos la sesión de ejemplo */ }
    },

    async actualizar(cambios) {
      const limpios = {};
      CAMPOS_EDITABLES.forEach(k => { if (k in cambios) limpios[k] = cambios[k]; });
      const demo = leer(K.demo);
      if (demo) { Object.assign(demo, limpios); guardar(K.demo, demo); actual = demo; return publicar(demo); }
      actual = publicar(await (await backend()).actualizar(limpios));
      return actual;
    },

    tareasHechas(u, perfilId, mes) { return ((u && u.progreso) || {})[perfilId + '-' + mes] || []; },

    async marcarTarea(perfilId, mes, indice, marcada) {
      if (!actual) throw fallo('No hay una sesión iniciada.', 'sin-sesion');
      const clave = perfilId + '-' + mes;
      const progreso = { ...(actual.progreso || {}) };
      const set = new Set(progreso[clave] || []);
      if (marcada) set.add(indice); else set.delete(indice);
      progreso[clave] = Array.from(set).sort((a, b) => a - b);
      return Cuentas.actualizar({ progreso });
    },

    async eliminar(clave) {
      if (leer(K.demo)) { await Cuentas.salir(); return; }
      await (await backend()).eliminar(clave);
      borrar(K.demo); publicar(null); actual = null;
    },

    // Usuario de ejemplo: no se crea cuenta real; vive solo en este navegador
    entrarEjemplo(demo) {
      const progreso = {};
      Object.keys(demo.progresoInicial || {}).forEach(mes => { progreso[demo.perfilId + '-' + mes] = demo.progresoInicial[mes]; });
      const u = { id: demo.id, usuario: demo.apodo, plan: demo.plan, perfilId: demo.perfilId, vivienda: demo.vivienda,
                  codigo: 'EJEMPLO', fecha: new Date().toISOString(), progreso, ejemplo: true };
      guardar(K.demo, u);
      actual = u;
      publicar(u);
      return u;
    },

    esPlus: (u) => !!u && u.plan !== 'gratis'
  };

  window.Cuentas = Cuentas;
})();
