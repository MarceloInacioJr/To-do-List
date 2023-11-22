import { useState } from "react"


const Main = () =>{
    const[formLogin, setFormLogin] = useState(true)
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")

    // register 
    const[name, setName] = useState("")
   
 


    // login
    const handleLogin = ()=>{

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
                                <button onClick={handleLogin()}>Login</button>
                                <button onClick={ _ => setFormLogin(false) }>Não possui cadastro? Cadastrar</button>
                             </div>
                        
                        </div>
                        :
                        <div className="body-form">
                            <h1>Cadastro</h1>

                            <div className="form-register-content">

                                <input type="text" placeholder="Nome" onChange={e=>setName(e.target.value)}/>
                            </div>

                        <button onClick={_=>setFormLogin(true)}>cadastro</button>
                    </div>
                    
                 }
                 </div>
        </div>
    )
}


export default Main