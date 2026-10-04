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
  apiKey: "AIzaSyBM5CxgyyBkvPbuB63I9bYR5enDTEEmUpg",
  authDomain: "re-crea-de9c0.firebaseapp.com",
  projectId: "re-crea-de9c0",
  storageBucket: "re-crea-de9c0.firebasestorage.app",
  messagingSenderId: "435187308670",
  appId: "1:435187308670:web:4a37e5780a11e08da3e02f"
};

// Nota: todas las opiniones nuevas quedan "pendientes" hasta que ustedes las aprueben en Firebase
// (cambiando approved a true). Así evitan comentarios ofensivos en una página con menores de edad.
