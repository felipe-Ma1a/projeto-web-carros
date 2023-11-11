import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgGtitV019Rh4TIJFnWbq812PnVX4JmuU",
  authDomain: "webcarros-eb3be.firebaseapp.com",
  projectId: "webcarros-eb3be",
  storageBucket: "webcarros-eb3be.appspot.com",
  messagingSenderId: "610073036440",
  appId: "1:610073036440:web:9fbcb686616ac286da72ed",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
