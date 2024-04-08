
import { initializeApp } from "firebase/app";

// ! Biblioteca para autenticação
import {getAuth} from "firebase/auth"
import { getDatabase } from "firebase/database";



const firebaseConfig = {
  apiKey: "4",
  authDomain: "todolist-1a4d1.firebaseapp.com",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const auth = getAuth() // !importante 

