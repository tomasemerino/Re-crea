/* ==========================================================
   Re-crea · planes-data.js
   AQUÍ ESTÁ TODO EL "CONTENIDO" DEL PRODUCTO. Se edita aquí, sin tocar la lógica:
     1) PLANES          -> nombres, precios y beneficios (¡precios ficticios!)
     2) PERFILES_PLUS   -> los 6 perfiles del cuestionario
     3) CONTENIDO_PLUS  -> el plan de cada mes para cada perfil
   Las páginas planes.html, inscripcion.html y miembros.html leen este archivo.
   ========================================================== */

/* ---------- 1) PLANES (precios ficticios, en pesos chilenos) ---------- */
const PLANES = [
  {
    id: 'gratis',
    nombre: 'Gratis',
    precio: 0,
    periodo: '',
    resumen: 'Para conocer Re-crea.',
    beneficios: [
      'Cuestionario de perfil con recomendaciones',
      'Guía de qué va en cada contenedor',
      'Muro de opiniones de la comunidad'
    ]
  },
  {
    id: 'mensual',
    nombre: 'Plus mensual',
    precio: 2990,
    periodo: 'al mes',
    resumen: 'Un plan nuevo cada mes, hecho para tu perfil.',
    destacado: true,
    beneficios: [
      'Todo lo del plan Gratis',
      'Plan mensual personalizado: un reto, el porqué y los pasos',
      'Lista de tareas con seguimiento de tu avance',
      'Consejos adaptados a tu tipo de vivienda',
      'Cancelas cuando quieras'
    ]
  },
  {
    id: 'anual',
    nombre: 'Plus anual',
    precio: 24990,
    periodo: 'al año',
    resumen: 'Lo mismo que el mensual, con descuento.',
    beneficios: [
      'Todo lo del plan Plus mensual',
      'Ahorras cerca de un 30% frente a pagar mes a mes',
      'Equivale a unos $2.083 por mes'
    ]
  }
];

function formatoCLP(n) {
  return n === 0 ? '$0' : '$' + n.toLocaleString('es-CL');
}

/* ---------- 2) PERFILES ---------- */
// El "id" debe coincidir con los ids de PERFILES en cuestionario.js
const PERFILES_PLUS = {
  'experto':    { nombre: 'Reciclador/a experto/a',     enfoque: 'Ya reciclas bien: tu plan va de reducir y contagiar el hábito.' },
  'sin-tiempo': { nombre: 'Con ganas, pero sin tiempo', enfoque: 'Tu plan usa rutinas cortas que caben en tu semana.' },
  'listo':      { nombre: 'Listo/a para partir',        enfoque: 'Tu plan te lleva paso a paso de cero a hábito.' },
  'constante':  { nombre: 'Reciclador/a constante',     enfoque: 'Tu plan afina detalles y da el siguiente paso.' },
  'esceptico':  { nombre: 'Escéptico/a curioso/a',      enfoque: 'Tu plan parte por beneficios concretos, como ahorrar.' },
  'camino':     { nombre: 'En camino',                  enfoque: 'Tu plan consolida lo que ya haces y suma de a poco.' }
};

/* ---------- 3) CONTENIDO MENSUAL ----------
   CONTENIDO_PLUS[perfil][mes] = {
     titulo, porque, pasos: [..], casa, depto, economia
   }
   Se muestran 3 meses de ejemplo por perfil. Para agregar el mes 4, copia un bloque y cámbiale el número. */
const CONTENIDO_PLUS = {

  'experto': {
    1: {
      titulo: 'Auditoría de tu basura',
      porque: 'Saber exactamente qué botas muestra dónde está lo que más puedes reducir. Reciclar bien es importante, pero lo que no se genera es lo que mejor cuida el medioambiente.',
      pasos: [
        'Durante 3 días, anota o fotografía lo que va a la basura común.',
        'Identifica los 3 residuos que más se repiten.',
        'Para cada uno, decide si se puede evitar, reutilizar o reciclar.',
        'Elige uno y elimínalo de tu rutina durante este mes.'
      ],
      casa: 'Pesa o mira la bolsa antes de sacarla: en casa suele ser más fácil notar qué se repite.',
      depto: 'Usa un solo basurero con tapa durante la auditoría, así no se te escapan residuos entre varios recipientes.',
      economia: 'Casi todo lo que botas lo pagaste. Anota cuánto cuesta al mes tu residuo más frecuente.'
    },
    2: {
      titulo: 'Reparar antes de reemplazar',
      porque: 'Alargar la vida de las cosas evita producir residuos nuevos y suele costar menos que comprar de nuevo.',
      pasos: [
        'Elige un objeto que tengas guardado por estar descompuesto (ropa, mochila, electrodoméstico pequeño).',
        'Busca un tutorial o un taller de reparación cercano.',
        'Arréglalo tú o llévalo a reparar.',
        'Compara lo que costó repararlo con lo que costaría comprarlo nuevo.'
      ],
      casa: 'Si tienes herramientas o un espacio de trabajo, arma una pequeña "caja de reparaciones" (hilo, pegamento, tornillos).',
      depto: 'No necesitas taller: muchas reparaciones de ropa o accesorios se hacen en una mesa con el material básico.',
      economia: 'Reparar versus reemplazar es una decisión de costo y beneficio: anota los dos números.'
    },
    3: {
      titulo: 'Contagia el hábito',
      porque: 'Tu hábito puede multiplicarse si lo compartes. Un cambio en tu curso, edificio o familia tiene más efecto que uno individual.',
      pasos: [
        'Enséñale a una persona a separar sus residuos.',
        'Comparte con alguien el cuestionario de Re-crea.',
        'Propón un acuerdo simple en tu edificio, curso o familia (por ejemplo, un contenedor visible).',
        'A las 2 semanas, cuenta cuántas personas lo siguen haciendo.'
      ],
      casa: 'Hablen en familia: un día fijo para vaciar los contenedores ayuda a que todos participen.',
      depto: 'Consulta con la administración o el comité si el edificio tiene recolección selectiva y cómo se usa.',
      economia: 'Mide el efecto: si cada persona que convences ahorra bolsas o envases, calcula el total.'
    }
  },

  'sin-tiempo': {
    1: {
      titulo: 'La rutina de los 5 minutos',
      porque: 'Reciclar no tiene que ser una tarea larga. Con pocos pasos bien ubicados en tu día, casi no notas el esfuerzo.',
      pasos: [
        'Elige un lugar fijo y visible para un recipiente de reciclaje.',
        'Enjuaga los envases justo al terminar de usarlos, cuando ya tienes la llave abierta.',
        'Define un día fijo de la semana para llevar o entregar lo acumulado.',
        'Ponte un recordatorio semanal en el celular.'
      ],
      casa: 'Deja el recipiente cerca de la puerta de salida, así lo llevas cuando sales.',
      depto: 'Una caja plegable bajo el lavaplatos o en el balcón ocupa poco y evita ir y venir.',
      economia: 'Tu tiempo también cuesta: anota cuánto te toma la rutina y si realmente son 5 minutos.'
    },
    2: {
      titulo: 'Compras que ahorran tiempo y basura',
      porque: 'Si compras con menos envases, hay menos que separar, limpiar y llevar. Reduces trabajo y residuos al mismo tiempo.',
      pasos: [
        'Haz una lista de compras semanal.',
        'Elige productos con menos envoltorios o en formatos más grandes.',
        'Deja una bolsa reutilizable junto a la puerta o dentro de tu mochila.',
        'Cuenta cuántas bolsas desechables dejaste de usar esta semana.'
      ],
      casa: 'Si tienes espacio, comprar en formato grande y guardar ahorra viajes y envases.',
      depto: 'Compra en formatos medianos que quepan en tu despensa, sin acumular de más.',
      economia: 'Compara el precio por unidad o por litro entre formato chico y grande: no siempre el grande conviene.'
    },
    3: {
      titulo: 'Automatiza tu hábito',
      porque: 'Un hábito dura más cuando se pega a algo que ya haces. Así no depende de acordarte ni de tener ganas.',
      pasos: [
        'Asocia reciclar a algo que ya haces (por ejemplo, sacar la basura).',
        'Reparte la tarea en turnos con las personas de tu casa.',
        'Revisa cuál paso te cuesta más y simplifícalo.',
        'Decide qué parte de tu rutina vas a mantener los próximos meses.'
      ],
      casa: 'Un cuadro de turnos en el refrigerador evita que la tarea caiga siempre en la misma persona.',
      depto: 'Dejen el recipiente justo al lado de la puerta para que sea imposible olvidarlo al salir.',
      economia: 'Repartir tareas es dividir el trabajo: observa cuánto tiempo ahorra el equipo en total.'
    }
  },

  'listo': {
    1: {
      titulo: 'Parte por un solo material',
      porque: 'Los hábitos nuevos funcionan mejor cuando son pequeños. Empezar con un solo material hace el cambio fácil de sostener.',
      pasos: [
        'Elige un material (papel y cartón, o botellas y latas).',
        'Sepáralo durante 7 días.',
        'Revisa en la guía de Re-crea qué sí y qué no se recicla.',
        'Al terminar la semana, llévalo a tu punto de reciclaje.'
      ],
      casa: 'Una caja de cartón en el patio o la cocina basta para empezar.',
      depto: 'Una bolsa colgada en la puerta de la cocina ocupa casi nada.',
      economia: 'Observa cuánto volumen de tu basura era realmente ese material.'
    },
    2: {
      titulo: 'Suma un segundo material y los orgánicos',
      porque: 'Con la base lista, es momento de ampliar. Los orgánicos suelen ser buena parte de la basura de un hogar.',
      pasos: [
        'Agrega un segundo material (vidrio o envases).',
        'Elige un método de compostaje según tu vivienda (revisa las recomendaciones del cuestionario).',
        'Empieza solo con restos de frutas y verduras.',
        'Anota cuántos días de la semana lo lograste.'
      ],
      casa: 'Una compostera de patio o un pozo de compost simple te permite aprovechar el abono en plantas o jardín.',
      depto: 'Un balde bokashi o una vermicompostera de balcón son opciones pensadas para espacios pequeños.',
      economia: 'El compost reemplaza abono comprado: anota cuánta tierra o abono ya no necesitas comprar.'
    },
    3: {
      titulo: 'Haz que dure',
      porque: 'El desafío no es empezar sino mantener. Este mes se trata de dejar el hábito instalado.',
      pasos: [
        'Define un día fijo de la semana para vaciar y llevar los contenedores.',
        'Ubica tus recipientes a la vista y a mano.',
        'Invita a alguien de tu casa a unirse.',
        'Revisa tu avance de los 3 meses y elige una meta para el próximo.'
      ],
      casa: 'Marca el día en el calendario familiar para que sea parte de la semana de todos.',
      depto: 'Si el edificio tiene retiro de reciclaje, aprende sus días y horarios para sincronizarte.',
      economia: 'Un hábito sostenido tiene "costo marginal" casi cero: compara el esfuerzo del primer mes con el de ahora.'
    }
  },

  'constante': {
    1: {
      titulo: 'Afina los detalles',
      porque: 'Reciclar bien importa tanto como reciclar seguido. Un envase sucio puede arruinar materiales que estaban bien separados.',
      pasos: [
        'Repasa la guía de contenedores de Re-crea.',
        'Revisa 3 errores comunes: envases con comida, cajas con grasa, vidrio roto o espejos.',
        'Ubica dónde llevar pilas, ampolletas y aparatos electrónicos, que no van en el contenedor común.',
        'Corrige lo que descubras que hacías mal.'
      ],
      casa: 'Deja una caja aparte para pilas y electrónicos pequeños hasta que puedas entregarlos.',
      depto: 'Guarda las pilas usadas en un frasco cerrado hasta llevarlas a un punto de recepción.',
      economia: 'Un material limpio vale más para quien lo recicla: la calidad también es un tema económico.'
    },
    2: {
      titulo: 'Reduce desde la compra',
      porque: 'Reciclar es la última etapa. Lo más eficiente es evitar el envase desde que compras.',
      pasos: [
        'Elige 3 productos que compras con exceso de envase.',
        'Busca alternativas: a granel, retornables o de mayor formato.',
        'Pruébalas durante un mes.',
        'Compara cuánto gastaste con antes.'
      ],
      casa: 'Si tienes espacio, compra a granel en frascos reutilizables.',
      depto: 'Elige productos concentrados o recargables, que ocupan menos lugar.',
      economia: 'Compara costo total del mes antes y después: ¿ahorraste o gastaste más?'
    },
    3: {
      titulo: 'Convierte tus orgánicos en abono',
      porque: 'Los restos de comida son una parte grande de la basura de casa. Compostarlos cierra el ciclo.',
      pasos: [
        'Elige un método de compostaje según tu vivienda.',
        'Empieza con restos de frutas y verduras.',
        'Usa el abono resultante en una planta o maceta.',
        'Mide cuánto menos basura orgánica generas.'
      ],
      casa: 'Una compostera de tambor o un pozo de compost en el jardín da buen resultado con poco mantenimiento.',
      depto: 'Una vermicompostera o bokashi de balcón es lo más práctico.',
      economia: 'El abono propio reemplaza compras: calcula cuánto ahorrarías en un año.'
    }
  },

  'esceptico': {
    1: {
      titulo: 'El reto de la botella',
      porque: 'Un cambio pequeño con beneficio visible convence más que mil argumentos. Una botella reutilizable ahorra plata y evita basura.',
      pasos: [
        'Elige una botella reutilizable que te guste.',
        'Úsala durante 7 días.',
        'Anota cuánto dinero no gastaste en bebidas o botellas nuevas.',
        'Decide si valió la pena.'
      ],
      casa: 'Llénala en casa antes de salir, así partes el día con ella.',
      depto: 'Déjala junto a las llaves para no olvidarla al salir.',
      economia: 'Multiplica lo ahorrado en la semana por 52: ese es el ahorro anual estimado.'
    },
    2: {
      titulo: 'Mira tu bolsillo',
      porque: 'Parte del precio de muchos productos es el envase. Notarlo cambia la forma de elegir.',
      pasos: [
        'Revisa 5 compras recientes y piensa cuánto de lo que pagaste era envase.',
        'Reutiliza frascos, cajas o tarros que ibas a botar.',
        'Evita una compra impulsiva esta semana.',
        'Anota cuánto ahorraste.'
      ],
      casa: 'Un frasco de vidrio limpio sirve para guardar alimentos, tornillos o lo que necesites.',
      depto: 'Dale un uso a los envases antes de reciclarlos: organizar cajones, almacenar o regalar.',
      economia: 'Ese ahorro es "costo de oportunidad": ¿en qué usarías ese dinero?'
    },
    3: {
      titulo: 'Separa solo una cosa',
      porque: 'Probar sin compromiso reduce la resistencia. Si no te convence, no hay problema.',
      pasos: [
        'Elige un material (latas, papel o botellas).',
        'Sepáralo durante 2 semanas.',
        'Observa cuánto volumen ocupa y cuánto menos basura sacas.',
        'Decide si lo mantienes.'
      ],
      casa: 'Guárdalo en una caja en el patio y mira cuánto espacio libera en la basura.',
      depto: 'Una bolsa grande detrás de la puerta es suficiente para ver el resultado.',
      economia: 'Si en tu comuna o edificio hay recolección selectiva, calcula cuántas veces menos sacas la basura común.'
    }
  },

  'camino': {
    1: {
      titulo: 'Define tu punto de partida',
      porque: 'Ya diste los primeros pasos. Ahora se trata de organizar lo que haces y elegir qué mejorar primero.',
      pasos: [
        'Repasa las recomendaciones de tu cuestionario.',
        'Elige 2 que te parezcan fáciles.',
        'Ponlas en práctica durante una semana.',
        'Anota qué te costó y qué fue sencillo.'
      ],
      casa: 'Parte por lo que ya tienes a mano, como cajas o bolsas, sin comprar nada nuevo.',
      depto: 'Escoge soluciones de poco espacio: una caja plegable o una bolsa colgante.',
      economia: 'Registra cuánto gastaste en implementarlo: lo ideal es que sea casi cero.'
    },
    2: {
      titulo: 'Haz fácil el hábito',
      porque: 'Cuando reciclar es tan fácil como botar, se vuelve automático.',
      pasos: [
        'Pon el recipiente de reciclaje junto al basurero normal.',
        'Define una rutina semanal para llevar lo acumulado.',
        'Suma un material nuevo a lo que ya separas.',
        'Programa recordatorios por las primeras semanas.'
      ],
      casa: 'Un lugar fijo en el patio o la entrada evita que todo se acumule dentro.',
      depto: 'Si hay punto limpio cerca, combínalo con otra salida que ya hagas.',
      economia: 'Reducir fricción es clave: anota cuánto tiempo te toma ahora frente a antes.'
    },
    3: {
      titulo: 'Da el siguiente paso',
      porque: 'Con la base lista, puedes sumar una acción de más impacto: compostar, reducir o compartir.',
      pasos: [
        'Prueba un método de compostaje según tu vivienda.',
        'Elige un residuo que quieras reducir este mes.',
        'Cuéntale a alguien lo que estás haciendo.',
        'Revisa tu avance de los 3 meses y escribe tu próxima meta.'
      ],
      casa: 'Una compostera de patio es un buen siguiente paso si tienes jardín.',
      depto: 'Prueba un balde bokashi: ocupa poco espacio y se maneja en pocos minutos.',
      economia: 'Anota qué hábitos te ahorran dinero y cuáles solo cuestan tiempo, para decidir cuáles priorizar.'
    }
  }
};

/* ---------- 4) USUARIOS DE EJEMPLO ----------
   Personas ficticias para que quien visite la demostración pueda "entrar" y ver cómo se ve cada plan,
   sin tener que crear una cuenta. Se activan desde "Mi cuenta".
   progresoInicial: { mes: [números de las tareas ya marcadas, empezando en 0] } */
const USUARIOS_EJEMPLO = [
  {
    id: 'ejemplo-valentina', apodo: 'Valentina', perfilId: 'sin-tiempo', vivienda: 'depto', plan: 'mensual',
    descripcion: 'Vive en departamento y tiene poco tiempo. Plan Plus mensual con el mes 1 avanzado.',
    progresoInicial: { 1: [0, 1, 2] }
  },
  {
    id: 'ejemplo-matias', apodo: 'Matías', perfilId: 'listo', vivienda: 'casa', plan: 'anual',
    descripcion: 'Vive en casa y quiere partir. Plus anual, con el mes 1 completo y el mes 2 recién empezado.',
    progresoInicial: { 1: [0, 1, 2, 3], 2: [0] }
  },
  {
    id: 'ejemplo-sofia', apodo: 'Sofía', perfilId: 'esceptico', vivienda: 'depto', plan: 'gratis',
    descripcion: 'Escéptica curiosa con plan Gratis. Sirve para ver qué se bloquea sin Plus.',
    progresoInicial: {}
  }
];
