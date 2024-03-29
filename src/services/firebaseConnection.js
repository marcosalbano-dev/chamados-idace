import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAgHzNQC9su1PRJj3NrLcu7zPiGyGRkbec",
    authDomain: "chamados-idace.firebaseapp.com",
    projectId: "chamados-idace",
    storageBucket: "chamados-idace.appspot.com",
    messagingSenderId: "320206362726",
    appId: "1:320206362726:web:7690c6ab9ffc6d2bb235a7",
    measurementId: "G-Z05PZJZFKK"
  };

// const firebaseConfig = {
//   apiKey: "AIzaSyCFXWDRXZzpNm1gg-X0qEYHnTxLu-7z81M",
//   authDomain: "idace-chamados.firebaseapp.com",
//   projectId: "idace-chamados",
//   storageBucket: "idace-chamados.appspot.com",
//   messagingSenderId: "776208892941",
//   appId: "1:776208892941:web:694eb3adb0fa2104658144",
//   measurementId: "G-FL96XLCCLP"
// };

  const firebaseApp = initializeApp(firebaseConfig)
  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  export { auth, db, storage }