
import { initializeApp } from "firebase/app";

// ! Biblioteca para autenticação
import {getAuth} from "firebase/auth"
import { getDatabase } from "firebase/database";



const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const auth = getAuth() // !importante 

