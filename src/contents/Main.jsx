import { useEffect, useState } from "react"
import {createUserWithEmailAndPassword,  signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from'../db/configFirebase'
import { useNavigate } from "react-router-dom"


    
const Main = () =>{
    const[formLogin, setFormLogin] = useState(true)
    const[email, setEmail] = useState("jr@gmail.com")
    const[password, setPassword] = useState("123456")

    // register 
    const[registerName, setRegisterName] = useState("")
    const[registerConfirmPassword, setRegisterConfirmPassword] = useState("")
   
    const navigate = useNavigate()


    useEffect(()=>{
        // verification log
        auth.onAuthStateChanged((user)=>{           
            if(user){
                navigate("/home")
            }else{
                navigate("/")
            }
        })
    },[])


    // login
    const handleLogin = ()=>{
        signInWithEmailAndPassword(auth, email, password).then((credential)=>{
            const user  = credential.user

            if(user){
                navigate("/home")
            }else{
                alert("Dados incorretos")
            }
            
        }).catch((error)=>{
            console.log(error.message)
        })
       
    }

    // register
    const handleRegister = ()=>{
            createUserWithEmailAndPassword(auth, email, password).then((credential)=>{
                
                navigate('/home')
            })
    }
    
    return(
        <div className="body-main">
            <div className="content-main">

                 {
                 formLogin?

                        <div className="body-form">
                             <h1 className="form-login-title">Login</h1>
                            
                             <div className="form-login-content">

                                <input type="text" placeholder="E-mail" onChange={e=>setEmail(e.target.value)} />
                                <input type="password" placeholder="Senha" onChange={e=>setPassword(e.target.value)}/>
                                <button onClick={()=>{handleLogin()}}>Login</button>
                                <button onClick={ _ => setFormLogin(false) }>Não possui cadastro? Cadastrar</button>
                             </div>
                        
                        </div>
                        :
                        <div className="body-form">
                            <h1>Cadastro</h1>

                            <div className="form-register-content">

                                <input type="text" placeholder="Nome" onChange={e=>setRegisterName(e.target.value)}/>
                                <input type="email" placeholder="E-mail" onChange={e=>setEmail(e.target.value)} />
                                <input type="password" placeholder="Senha" onChange={e=>setPassword(e.target.value)} />
                                <input type="password" placeholder="Cofirmar senha" onChange={e=>setRegisterConfirmPassword(e.target.value)} />
                                <button onClick={()=>{handleRegister()}}>Cadastrar e entrar</button>
                            </div>

                        <button onClick={_=>setFormLogin(true)}>Já possui cadastro? Login</button>
                    </div>
                    
                 }
                 </div>
        </div>
    )
}


export default Main