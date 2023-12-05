import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../db/configFirebase"
import { navigate} from "react-router-dom"

const Form = (props) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    

    
    // register function 
    const handleRegister = () =>{

            createUserWithEmailAndPassword( auth, email, password).then((credential) =>{
                 const user = credential.user
                 console.log(user)
            }).catch((error) =>{
                const err = error.code
                console.log(err)
                console.log("message: ", error.message)
            })
    }

    // login function 
    const handleLogin = ()=>{
            signInWithEmailAndPassword(auth, email, password).then((credencial)=>{
                const user  = credencial.user

                if(user){
                    navigate("/home")
                }else{
                    alert("Dados incorretos")
                }
                
            }).catch((error)=>{
                console.log(error.message)
            })
    }

    return (
    <div className="body login">
    Login

    <div className="content-login">
    
        <div className="form-login">
            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="text" placeholder="Senha" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Entrar</button>
        </div>
    </div>
    </div>)
}


export default Form