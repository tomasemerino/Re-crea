/* ==========================================================
   Re-crea · cuestionario
   Este archivo tiene 3 partes:
     1) PREGUNTAS   -> el texto de las preguntas y sus alternativas
     2) PERFILES    -> los "tipos de persona" (se elige el primero que calce)
     3) CONSEJOS    -> recomendaciones; se muestran todas las que calcen
   Para cambiar textos o agregar recomendaciones, edita SOLO las partes 1, 2 y 3.
   ========================================================== */

/* ---------- 1) PREGUNTAS ----------
   "id" es el nombre interno de la pregunta.
   Cada alternativa tiene un "valor" (interno) y un "texto" (lo que ve la persona). */
const PREGUNTAS = [
  { id: 'vivienda', texto: '¿Vives en casa o en departamento?', opciones: [
    { valor: 'casa', texto: 'En una casa' },
    { valor: 'depto', texto: 'En un departamento' } ] },

  { id: 'espacio', texto: '¿Tienes algún espacio cercano para reciclar?', opciones: [
    { valor: 'hogar', texto: 'Sí, en mi casa o edificio (contenedores, patio o balcón)' },
    { valor: 'barrio', texto: 'Sí, cerca de mi barrio (punto limpio o contenedores públicos)' },
    { valor: 'no', texto: 'No, no tengo ninguno cerca' },
    { valor: 'nose', texto: 'No lo sé' } ] },

  { id: 'conocimiento', texto: '¿Cuánto sabes de reciclaje?', opciones: [
    { valor: 'nada', texto: 'Nada' },
    { valor: 'poco', texto: 'Poco' },
    { valor: 'bastante', texto: 'Bastante' },
    { valor: 'mucho', texto: 'Mucho' } ] },

  { id: 'interes', texto: '¿Qué tan interesado/a estás en el reciclaje?', opciones: [
    { valor: 'nada', texto: 'No me interesa mucho' },
    { valor: 'algo', texto: 'Me interesa algo' },
    { valor: 'mucho', texto: 'Me interesa mucho' } ] },

  { id: 'habito', texto: '¿Reciclas habitualmente?', opciones: [
    { valor: 'nunca', texto: 'Nunca' },
    { valor: 'aveces', texto: 'A veces' },
    { valor: 'siempre', texto: 'Siempre o casi siempre' } ] },

  { id: 'tiempo', texto: '¿Crees que tienes tiempo suficiente para reciclar?', opciones: [
    { valor: 'si', texto: 'Sí, tengo tiempo' },
    { valor: 'poco', texto: 'Un poco justo' },
    { valor: 'no', texto: 'No, casi no tengo tiempo' } ] }
];

/* ---------- Cómo leer las reglas ----------
   cuando: { pregunta: [valores permitidos], ... }
   Una regla calza si TODAS las condiciones que escribiste se cumplen.
   Ejemplo: { vivienda: ['casa'], tiempo: ['si','poco'] } = vive en casa Y tiene tiempo "sí" o "poco". */

/* ---------- 2) PERFILES (gana el primero que calce, de arriba hacia abajo) ---------- */
const PERFILES = [
  { cuando: { habito: ['siempre'], conocimiento: ['bastante', 'mucho'] },
    nombre: 'Reciclador/a experto/a',
    texto: 'Ya reciclas y sabes cómo hacerlo bien. Tu desafío ahora es ir un paso más allá: reducir lo que desechas y motivar a otros.' },

  { cuando: { interes: ['algo', 'mucho'], tiempo: ['poco', 'no'] },
    nombre: 'Con ganas, pero sin tiempo',
    texto: 'Te importa el medioambiente, pero la rutina te gana. Para ti sirven las soluciones simples, rápidas y que no te quiten más de 5 minutos al día.' },

  { cuando: { interes: ['mucho'], habito: ['nunca', 'aveces'] },
    nombre: 'Listo/a para partir',
    texto: 'Tienes la motivación y el tiempo para empezar. Solo falta convertir las ganas en un hábito: te dejamos un plan paso a paso.' },

  { cuando: { habito: ['siempre'] },
    nombre: 'Reciclador/a constante',
    texto: 'Reciclas con regularidad. Afinar algunos detalles hará que tu esfuerzo rinda todavía más.' },

  { cuando: { interes: ['nada'] },
    nombre: 'Escéptico/a curioso/a',
    texto: 'Quizás no te entusiasma el tema, y está bien. Te mostramos acciones pequeñas con beneficios concretos, como ahorrar dinero y espacio en casa.' },

  { cuando: {},   // regla vacía = calza siempre (perfil por defecto)
    nombre: 'En camino',
    texto: 'Ya diste los primeros pasos. Con algunos ajustes simples puedes aportar mucho más.' }
];

/* ---------- 3) CONSEJOS (se muestran todos los que calcen, de arriba hacia abajo) ----------
   "tema" es solo una etiqueta que se muestra debajo del consejo. */
const CONSEJOS = [
  // --- Dónde reciclar ---
  { cuando: { espacio: ['hogar'] }, tema: 'Dónde reciclar',
    titulo: 'Aprovecha el espacio que ya tienes',
    texto: 'Pon tres recipientes o bolsas separadas (papel y cartón, envases, vidrio) en un lugar visible de la casa. Si tu edificio o comuna tiene recolección selectiva, ya tienes lo más difícil resuelto.' },
  { cuando: { espacio: ['barrio'] }, tema: 'Dónde reciclar',
    titulo: 'Junta en casa y lleva cada cierto tiempo',
    texto: 'Reúne tus materiales limpios y secos en cajas o bolsas, y llévalos al punto de reciclaje cuando salgas a hacer otras cosas. Así no necesitas hacer un viaje especial.' },
  { cuando: { espacio: ['no', 'nose'] }, tema: 'Dónde reciclar',
    titulo: 'Ubica tu punto de reciclaje más cercano',
    texto: 'Revisa el mapa oficial de puntos limpios en la sección "Dónde reciclar" de esta página. Mientras encuentras uno, parte reduciendo y reutilizando: lo que no compras no se convierte en basura.' },
  { cuando: { vivienda: ['casa'], espacio: ['no'] }, tema: 'Dónde reciclar',
    titulo: 'Pregunta en tu municipalidad',
    texto: 'Muchas comunas ofrecen retiro de reciclaje a casas. Consulta si existe en tu comuna y qué materiales reciben.' },

  // --- Compostaje según vivienda y tiempo ---
  { cuando: { vivienda: ['casa'], tiempo: ['si'] }, tema: 'Compostaje',
    titulo: 'Haz una compostera de patio',
    texto: 'Con un cajón o tambor en el jardín puedes convertir cáscaras, restos de verduras, café y hojas secas en abono para tus plantas. Mezcla restos de cocina con hojas secas y revuelve cada semana.' },
  { cuando: { vivienda: ['casa'], tiempo: ['poco'] }, tema: 'Compostaje',
    titulo: 'Compostera de tambor o bokashi',
    texto: 'Si andas justo de tiempo, elige una compostera cerrada tipo tambor, o un balde bokashi: solo agregas los restos y la fermentación hace el resto, con muy poco mantenimiento.' },
  { cuando: { vivienda: ['casa'], tiempo: ['no'] }, tema: 'Compostaje',
    titulo: 'Entierra tus restos de frutas y verduras',
    texto: 'La opción más simple: cava un hoyo en una zona del jardín, echa tus restos de frutas y verduras, tápalos con tierra y cambia de lugar cada cierto tiempo. Cero mantención.' },
  { cuando: { vivienda: ['depto'], tiempo: ['si'] }, tema: 'Compostaje',
    titulo: 'Prueba una vermicompostera de balcón',
    texto: 'Las lombrices californianas transforman tus restos de cocina en un abono excelente y caben en un balcón o terraza. No generan mal olor si se manejan bien.' },
  { cuando: { vivienda: ['depto'], tiempo: ['poco'] }, tema: 'Compostaje',
    titulo: 'Un balde bokashi en tu cocina',
    texto: 'Es un balde con tapa hermética donde echas tus restos de comida con un activador. Ocupa poco espacio y toma menos de 5 minutos al día. Luego el resultado se entierra en una maceta grande o se entrega a un punto de compostaje.' },
  { cuando: { vivienda: ['depto'], tiempo: ['no'] }, tema: 'Compostaje',
    titulo: 'Congela tus restos orgánicos',
    texto: 'Guarda cáscaras y restos de frutas y verduras en una bolsa en el congelador (sin olor) y llévalos cuando puedas a un punto de compostaje comunitario, o compártelos con algún vecino que tenga compostera.' },

  // --- Conocimiento ---
  { cuando: { conocimiento: ['nada', 'poco'] }, tema: 'Aprender',
    titulo: 'Aprende las 3 reglas básicas',
    texto: 'Todo lo que recicles debe estar vacío, enjuagado y seco, y aplastado. Revisa la guía "¿Qué va en cada contenedor?" de esta página: con eso ya reciclas mejor que mucha gente.' },
  { cuando: { conocimiento: ['bastante', 'mucho'], habito: ['nunca', 'aveces'] }, tema: 'Aprender',
    titulo: 'Ya sabes mucho: úsalo',
    texto: 'Tu conocimiento es tu mayor ventaja. Lo que falta es convertirlo en rutina: deja los recipientes en un lugar cómodo y define un día fijo para vaciarlos.' },

  // --- Interés y hábito ---
  { cuando: { interes: ['nada'] }, tema: 'Motivación',
    titulo: 'Empieza por lo que te conviene',
    texto: 'Reutilizar una botella en lugar de comprar una nueva, llevar tu bolsa al supermercado o comprar solo lo que vas a consumir también ahorra plata. Parte por una sola acción y mira cómo te resulta.' },
  { cuando: { interes: ['mucho'], habito: ['nunca'] }, tema: 'Motivación',
    titulo: 'Reto de 7 días',
    texto: 'Durante una semana separa solo una cosa (por ejemplo, botellas y latas). Si te funciona, suma otro material la semana siguiente. Partir de a poco hace que el hábito dure.' },
  { cuando: { habito: ['aveces'] }, tema: 'Hábito',
    titulo: 'Haz que reciclar sea lo más fácil',
    texto: 'Pon el recipiente de reciclaje al lado del basurero normal. Cuando es igual de fácil que botar, reciclas más seguido.' },
  { cuando: { habito: ['siempre'] }, tema: 'Siguiente nivel',
    titulo: 'Reduce, repara y reutiliza',
    texto: 'Reciclar es la última opción de la cadena. Antes, prueba reparar, regalar o reutilizar lo que ya tienes, y comparte lo que sabes con tu familia, tu curso o tus vecinos.' },

  // --- Tiempo ---
  { cuando: { tiempo: ['poco', 'no'] }, tema: 'Poco tiempo',
    titulo: 'La rutina de los 5 minutos',
    texto: 'Enjuaga los envases al terminar de usarlos (cuando ya tienes la llave abierta), déjalos secar y guárdalos en el recipiente. Una vez por semana, vacía todo en el punto de reciclaje.' },

  // --- Para todos (regla vacía = siempre aparece) ---
  { cuando: {}, tema: 'Para todos',
    titulo: 'Pilas, ampolletas y electrónicos van aparte',
    texto: 'No los botes a la basura común ni al contenedor de reciclaje. Busca puntos de recepción especiales de pilas y aparatos electrónicos.' }
];

/* ==========================================================
   A PARTIR DE AQUÍ ESTÁ EL "MOTOR" DEL CUESTIONARIO.
   No necesitas tocarlo para cambiar preguntas o recomendaciones.
   ========================================================== */

const MAX_CONSEJOS = 7;   // cantidad máxima de recomendaciones a mostrar

(function () {
  const contenedor = document.getElementById('quiz');
  if (!contenedor) return;

  let paso = 0;
  const respuestas = {};

  // ¿Calzan todas las condiciones de la regla con las respuestas?
  function calza(regla, resp) {
    return Object.keys(regla.cuando).every(k => regla.cuando[k].includes(resp[k]));
  }

  function mostrarPregunta() {
    const p = PREGUNTAS[paso];
    const porcentaje = Math.round((paso / PREGUNTAS.length) * 100);
    contenedor.innerHTML = `
      <div class="quiz__progreso" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje}">
        <div class="quiz__barra" style="width:${porcentaje}%"></div>
      </div>
      <p class="quiz__paso">Pregunta ${paso + 1} de ${PREGUNTAS.length}</p>
      <fieldset class="quiz__opciones">
        <legend class="quiz__pregunta">${p.texto}</legend>
        ${p.opciones.map(o => `
          <label class="opcion">
            <input type="radio" name="${p.id}" value="${o.valor}" ${respuestas[p.id] === o.valor ? 'checked' : ''}>
            <span>${o.texto}</span>
          </label>`).join('')}
      </fieldset>
      <div class="quiz__acciones">
        <button type="button" class="boton boton--secundario" id="quizAtras" ${paso === 0 ? 'disabled' : ''}>Atrás</button>
        <button type="button" class="boton boton--primario" id="quizSiguiente" disabled>
          ${paso === PREGUNTAS.length - 1 ? 'Ver mi resultado' : 'Siguiente'}
        </button>
      </div>`;

    const siguiente = document.getElementById('quizSiguiente');
    if (respuestas[p.id]) siguiente.disabled = false;

    contenedor.querySelectorAll('input[type=radio]').forEach(r =>
      r.addEventListener('change', () => { respuestas[p.id] = r.value; siguiente.disabled = false; }));

    document.getElementById('quizAtras').addEventListener('click', () => { paso--; mostrarPregunta(); });
    siguiente.addEventListener('click', () => {
      if (paso < PREGUNTAS.length - 1) { paso++; mostrarPregunta(); } else { mostrarResultado(); }
    });
  }

  function mostrarResultado() {
    const perfil = PERFILES.find(r => calza(r, respuestas));
    const consejos = CONSEJOS.filter(r => calza(r, respuestas)).slice(0, MAX_CONSEJOS);

    // Resumen de lo que respondió la persona
    const resumen = PREGUNTAS.map(p => {
      const o = p.opciones.find(x => x.valor === respuestas[p.id]);
      return o ? o.texto : '';
    }).join(' · ');

    contenedor.innerHTML = `
      <div class="resultado">
        <div class="resultado__perfil">
          <span class="etiqueta">Tu perfil</span>
          <h3>${perfil.nombre}</h3>
          <p>${perfil.texto}</p>
        </div>
        <h3>Recomendaciones para ti</h3>
        <ul class="consejos">
          ${consejos.map(c => `
            <li class="consejo-item">
              <h4>${c.titulo}</h4>
              <p>${c.texto}</p>
              <small>${c.tema}</small>
            </li>`).join('')}
        </ul>
        <p class="resultado__resumen"><strong>Tus respuestas:</strong> ${resumen}</p>
        <div class="compartir">
          <p><strong>Comparte tu perfil</strong> :</p>
          <div class="compartir__botones">
            <a class="boton boton--secundario" id="compWhatsapp" href="#" target="_blank" rel="noopener">WhatsApp</a>
            <button type="button" class="boton boton--secundario" id="compCopiar">Copiar mensaje y link</button>
            <button type="button" class="boton boton--secundario" id="compNativo" hidden>Más opciones…</button>
          </div>
          <p class="estado" id="compEstado" role="status"></p>
        </div>
        <div class="quiz__acciones">
          <button type="button" class="boton boton--secundario" id="quizRepetir">Repetir cuestionario</button>
          <a href="#opiniones" class="boton boton--primario">Compartir mi idea</a>
        </div>
      </div>`;

    // --- Compartir el resultado ---
    const urlPagina = location.origin + location.pathname + '#cuestionario';
    const mensaje = `Mi perfil de reciclaje en Re-crea es "${perfil.nombre}". ¿Cuál es el tuyo? Descúbrelo aquí: ${urlPagina}`;
    document.getElementById('compWhatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(mensaje);
    const estadoComp = document.getElementById('compEstado');
    document.getElementById('compCopiar').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(mensaje); estadoComp.textContent = 'Copiado. Ya puedes pegarlo donde quieras.'; estadoComp.className = 'estado estado--ok'; }
      catch { estadoComp.textContent = 'No se pudo copiar automáticamente. Copia el link de la barra del navegador.'; estadoComp.className = 'estado estado--error'; }
    });
    if (navigator.share) {
      const nativo = document.getElementById('compNativo');
      nativo.hidden = false;
      nativo.addEventListener('click', () => navigator.share({ title: 'Re-crea', text: mensaje, url: urlPagina }).catch(() => {}));
    }

    document.getElementById('quizRepetir').addEventListener('click', () => {
      paso = 0;
      Object.keys(respuestas).forEach(k => delete respuestas[k]);
      mostrarPregunta();
      document.getElementById('cuestionario').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('cuestionario').scrollIntoView({ behavior: 'smooth' });
  }

  mostrarPregunta();
})();
