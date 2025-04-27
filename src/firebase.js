// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDfl2naX3wupRCZPm_eiv_qqHWNUZDtJ8U",
  authDomain: "audiometriapp.firebaseapp.com",
  projectId: "audiometriapp",
  storageBucket: "audiometriapp.firebasestorage.app",
  messagingSenderId: "89950245262",
  appId: "1:89950245262:web:a4b4b6fb23bce6799614df",
  measurementId: "G-C8QQKV1N6D"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa auth y firestore
const auth = getAuth(app);   // Autenticación
const db = getFirestore(app); // Firestore

// Exporta las variables para que puedan ser utilizadas en otros archivos
export { auth, db }; // Exportación correcta
