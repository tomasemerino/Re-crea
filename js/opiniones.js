/* ==========================================================
   Re-crea · muro de opiniones
   - Con Firebase configurado: las opiniones se guardan en Firestore y las aprobadas se ven para todos.
   - Sin configurar (modo de prueba): se guardan solo en el navegador de quien las escribe.
   ========================================================== */

import { firebaseConfig } from './config-firebase.js';

const formulario = document.getElementById('formOpinion');
const lista = document.getElementById('opLista');
const estado = document.getElementById('opEstado');
const aviso = document.getElementById('opAviso');
const boton = document.getElementById('opEnviar');
const mensajeCampo = document.getElementById('opMensaje');
const contador = document.getElementById('opContador');

const CONFIGURADO = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PEGA_AQUI');
const ESPERA_SEGUNDOS = 30;   // tiempo mínimo entre un envío y otro desde el mismo navegador
const CLAVE_LOCAL = 'recrea_opiniones_prueba';
const CLAVE_ULTIMO_ENVIO = 'recrea_ultimo_envio';

let db = null, fb = null;

/* ---------- Utilidades ---------- */
function mostrarEstado(texto, tipo) {
  estado.textContent = texto;
  estado.className = 'estado' + (tipo ? ' estado--' + tipo : '');
}

function leerLocal() {
  try { return JSON.parse(localStorage.getItem(CLAVE_LOCAL)) || []; } catch { return []; }
}

function formatoFecha(fecha) {
  if (!fecha) return '';
  const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Dibuja las opiniones usando textContent (nunca innerHTML) para que nadie pueda insertar código malicioso
function dibujar(opiniones) {
  lista.innerHTML = '';
  if (!opiniones.length) {
    const li = document.createElement('li');
    li.className = 'opinion opinion--vacia';
    li.textContent = 'Aún no hay opiniones publicadas. ¡Sé la primera persona en compartir una idea!';
    lista.appendChild(li);
    return;
  }
  opiniones.forEach(o => {
    const li = document.createElement('li');
    li.className = 'opinion';
    const cab = document.createElement('div');
    cab.className = 'opinion__cabecera';
    const nombre = document.createElement('span');
    nombre.className = 'opinion__nombre';
    nombre.textContent = o.nombre;
    const tema = document.createElement('span');
    tema.className = 'opinion__tema';
    tema.textContent = o.categoria;
    cab.append(nombre, tema);
    const texto = document.createElement('p');
    texto.className = 'opinion__texto';
    texto.textContent = o.mensaje;
    const fecha = document.createElement('small');
    fecha.textContent = formatoFecha(o.fecha);
    li.append(cab, texto, fecha);
    lista.appendChild(li);
  });
}

/* ---------- Carga inicial ---------- */
async function iniciar() {
  if (!CONFIGURADO) {
    aviso.hidden = false;
    aviso.textContent = 'Modo de prueba: Firebase aún no está configurado, así que las opiniones solo se guardan en este navegador y nadie más las ve.';
    dibujar(leerLocal());
    return;
  }
  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    fb = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
    const app = appMod.initializeApp(firebaseConfig);
    db = fb.getFirestore(app);
    await cargarPublicas();
  } catch (err) {
    console.error(err);
    lista.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'opinion opinion--vacia';
    li.textContent = 'No pudimos cargar las opiniones en este momento. Intenta de nuevo más tarde.';
    lista.appendChild(li);
  }
}

async function cargarPublicas() {
  const q = fb.query(fb.collection(db, 'opiniones'), fb.where('approved', '==', true), fb.limit(60));
  const snap = await fb.getDocs(q);
  const datos = snap.docs.map(d => d.data());
  datos.sort((a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0));   // más nuevas primero
  dibujar(datos);
}

/* ---------- Contador de caracteres ---------- */
mensajeCampo.addEventListener('input', () => { contador.textContent = mensajeCampo.value.length; });

/* ---------- Envío del formulario ---------- */
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarEstado('', '');

  // Campo trampa: si un bot lo llenó, ignoramos el envío en silencio
  if (document.getElementById('opWeb').value) return;

  const nombre = document.getElementById('opNombre').value.trim();
  const categoria = document.getElementById('opCategoria').value;
  const mensaje = mensajeCampo.value.trim();

  if (!nombre || !categoria || mensaje.length < 5) {
    mostrarEstado('Completa tu nombre, el tema y escribe al menos 5 caracteres.', 'error');
    return;
  }

  // Límite de frecuencia (anti-spam simple)
  const ultimo = Number(localStorage.getItem(CLAVE_ULTIMO_ENVIO) || 0);
  const faltan = Math.ceil(ESPERA_SEGUNDOS - (Date.now() - ultimo) / 1000);
  if (faltan > 0) {
    mostrarEstado(`Espera ${faltan} segundos antes de enviar otra opinión.`, 'error');
    return;
  }

  boton.disabled = true;
  try {
    if (CONFIGURADO && db) {
      await fb.addDoc(fb.collection(db, 'opiniones'), {
        nombre, categoria, mensaje,
        fecha: fb.serverTimestamp(),
        approved: false          // las reglas de Firestore exigen false al crear; ustedes la aprueban en la consola
      });
      mostrarEstado('¡Gracias! Tu opinión será revisada antes de aparecer en el muro.', 'ok');
    } else {
      const guardadas = leerLocal();
      guardadas.unshift({ nombre, categoria, mensaje, fecha: Date.now() });
      localStorage.setItem(CLAVE_LOCAL, JSON.stringify(guardadas.slice(0, 50)));
      dibujar(guardadas);
      mostrarEstado('¡Gracias! (modo de prueba: solo tú ves este mensaje).', 'ok');
    }
    localStorage.setItem(CLAVE_ULTIMO_ENVIO, String(Date.now()));
    formulario.reset();
    contador.textContent = '0';
  } catch (err) {
    console.error(err);
    mostrarEstado('No pudimos enviar tu opinión. Intenta de nuevo en unos minutos.', 'error');
  } finally {
    boton.disabled = false;
  }
});

iniciar();
