/* ==========================================================
   Re-crea · configuración de Firebase (el "muro" de opiniones)

   Mientras no pegues tus datos aquí, el muro funciona en MODO DE PRUEBA:
   las opiniones solo se guardan en tu propio computador y nadie más las ve.

   Cómo obtener estos datos (paso a paso en la guía):
   Firebase consola -> tu proyecto -> Configuración del proyecto -> "Tus apps" -> app web (</>) -> "firebaseConfig"
   Copia los valores y reemplaza los textos "PEGA_AQUI...".
   Estos datos NO son contraseñas: es normal que queden públicos.
   La seguridad la dan las "reglas" del archivo firestore.rules.
   ========================================================== */

export const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI.firebaseapp.com",
  projectId: "PEGA_AQUI_TU_PROJECT_ID",
  storageBucket: "PEGA_AQUI.appspot.com",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI"
};

// Nota: todas las opiniones nuevas quedan "pendientes" hasta que ustedes las aprueben en Firebase
// (cambiando approved a true). Así evitan comentarios ofensivos en una página con menores de edad.
