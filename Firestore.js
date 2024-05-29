// Firestore.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {   
  apiKey: "AIzaSyCPNgc6YSVkA_PP5xdndZnI7WkFm_eRoZY",
  authDomain: "sutstore-55959.firebaseapp.com",
  projectId: "sutstore-55959",
  storageBucket: "sutstore-55959.appspot.com",
  messagingSenderId: "845352577375",
  appId: "1:845352577375:web:1a744f68c19a46dd262eea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
