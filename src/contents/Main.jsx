import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../db/configFirebase'
import { useNavigate } from "react-router-dom"
import './styles/main.css'
import './styles/reset.css'



const Main = () => {
    const [formLogin, setFormLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // register 
    const [registerName, setRegisterName] = useState("")
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

    // messages
    const[messages, setMessages] = useState('')

    // view passord 
    const[viewPassword, setViewPassword] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        // verification log
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate("/home")
            } else {
                navigate("/")
            }
        })
    }, [])


    // Login
    const handleLogin = () => {


        signInWithEmailAndPassword(auth, email.trim(), password).then((credential) => {
           
            const user = credential.user

            if (user) {
                navigate("/home")
            } else{
               
            }

        }).catch((error) => {
            console.log(error.code)
            
                setMessages("Email não cadastrado")
            
            setMessages("Email ou senha incorreto !")
        })
        setMessages("")
    }


    // Register
    const handleRegister = () => {

        if (password === registerConfirmPassword) {
            createUserWithEmailAndPassword(auth, email.trim(), password).then((credential) => {
                const user = credential.user;
                if (user) {
                    // Adding name in firebase
                    updateProfile(user, {
                        displayName: registerName,
                    }).then(() => {
                        navigate("/home")
                    })
                }
            }).catch((error) => {   
                console.log(error.message)
                
                if(password.length < 6 || registerConfirmPassword.length < 6){
                setMessages('Por favor digite uma senha com mais de 6 caracteres!')
                } 

                setMessages('Email já cadastrado!')
            })
        } else {
             setMessages('Senhas divergentes!')
        }
    }

    return (
        <div className="body-main">
            <div className="content-main">
                <div className="body-cover">
                    <div className="img-cover">
                    </div>

                    <div className="legend-cover">
                        <p className="welcome-legend">Seja bem-vindo ao</p>
                        <div className="name-legend">
                            <p>To do List</p>
                        </div>
                    </div>
                </div>

                {
                    formLogin ?

                        <div className="body-form">
                            <h1 className="form-login-title">Login</h1>

                            <div className="form-login-content">
                                <div className="input input-width-login">
                                    <label htmlFor="email-login">E-mail</label>
                                    <input type="text" name="email-login" onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="input input-width-password">
                                    <label htmlFor="password-login">Senha</label>
                                    <div className="input-password">
                                        <input type="password" id="login-input-password" name="password-login" onChange={e => setPassword(e.target.value)} />
                                        <div className="img-body">
                                            {/* view password */
                                            viewPassword?(
                                                 
                                                <div id="img-open-eye" title="Esconder senha" className="img-eye" onClick={_=>{
                                                    setViewPassword(false)
                                                    document.querySelector('#login-input-password').type='password'
                                                }}></div>
                                            ):(
                                                <div id="img-close-eye" title="Ver senha" className="img-eye" onClick={_=>{
                                                    setViewPassword(true)
                                                    document.querySelector('#login-input-password').type='text'

                                                }}></div>
                                                )
                                            
                                            }
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="messages">
                                    <p>{messages}</p>
                                </div>
                                <div className="form-button">
                                    <button className="button-login" onClick={_ => { handleLogin() }}>Login</button>
                                    <p className="form-legend">Não possui cadastro? <span className="form-login-span" onClick={_ => {
                                        setFormLogin(false)
                                        setMessages('')
                                        }}>Cadastrar</span></p>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="body-form">
                            <h1 className="form-register-title">Cadastro</h1>

                            <div className="form-register-content">

                                <div className="input">
                                    <label htmlFor="nome-user">Nome</label>
                                    <input type="text" className="input" name="name-user" onChange={e => setRegisterName(e.target.value)} />
                                </div>
                                <div className="input">
                                    <label htmlFor="email-user">E-mail</label>
                                    <input type="email" className="input" name="email-user" onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="input">
                                    <label htmlFor="password">Senha</label>
                                    <input type="password" className="input" name="password" onChange={e => setPassword(e.target.value)} />
                                </div>
                                <div className="input">
                                    <label htmlFor="checkpassword">Confirmar senha</label>
                                    <input type="password" className="input" name="checkpassword" onChange={e => setRegisterConfirmPassword(e.target.value)} />
                                </div>

                                <div className="messages">
                                    <p>{messages}</p>
                                </div>


                            </div>
                            <div className="form-button">
                                <button className="button-login" onClick={_ => { handleRegister() }}>Cadastrar e entrar</button>
                                <p>Já possui cadastro?<span className="form-login-span" onClick={() => {
                                     setFormLogin(true)  
                                     setMessages('')
                                     }}> Login</span></p>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}


export default Main