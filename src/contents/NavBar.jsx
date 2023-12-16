import './styles/navbar.css'
import './styles/reset.css'
import { auth } from '../db/configFirebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'


const NavBar = ({handleCreateTask}) => {
    const navigate = useNavigate();

    const handleSignOut = () => {

        signOut(auth).then(() => {
            navigate("/");      
        });
    };
    
   

    

    return (
        <div className="navbar-body">
            
            <div className="component-navbar-button" onClick={handleSignOut}>
                <div className="navbar-img" id='img-signout'></div>
                <div className="navbar-legend">
                    <p>Sair</p>
                </div>
            </div>
            <div className="component-navbar-button" onClick={()=>handleCreateTask()}>
                <div className="navbar-img" id='img-addtask'></div>
                <div className="navbar-legend" id="legend-create-home">
                    <p>Criar tarefa</p>
                </div>
            </div>
            

        </div>
    );
};

export default NavBar;
