
import { initializeApp } from "firebase/app";

// ! Biblioteca para autenticação
import {getAuth} from "firebase/auth"
import { getDatabase } from "firebase/database";



const firebaseConfig = {
  apiKey: "AIzaSyB0CbLF6P2vNk7L-BSY5L-nZ7LvwX9SkR4",
  authDomain: "todolist-1a4d1.firebaseapp.com",
  projectId: "todolist-1a4d1",
  storageBucket: "todolist-1a4d1.appspot.com",
  messagingSenderId: "418275952972",
  appId: "1:418275952972:web:9dffca7e422c812ea267e9",
  measurementId: "G-ZX4X8D10BS"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const auth = getAuth() // !importante 

