// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBIPq1WQc58ava2j_FsXMHvvYXJ3i8ANU",
  authDomain: "appaudiometry-19d27.firebaseapp.com",
  projectId: "appaudiometry-19d27",
  storageBucket: "appaudiometry-19d27.firebasestorage.app",
  messagingSenderId: "102174300579",
  appId: "1:102174300579:web:042c782551978502a36216"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa auth y firestore
const auth = getAuth(app);   // Autenticación
const db = getFirestore(app); // Firestore

// Configura la persistencia en Firestore (modo offline)
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Cuando el navegador tiene varias pestañas abiertas, solo una puede tener persistencia habilitada
      console.log("Persistence failed: Multiple tabs open.");
    } else if (err.code === 'unimplemented') {
      // Cuando el navegador no soporta la persistencia
      console.log("Persistence not supported on this browser.");
    }
  });

// Exporta las variables para que puedan ser utilizadas en otros archivos
export { auth, db }; // Exportación correcta
