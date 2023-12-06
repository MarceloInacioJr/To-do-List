import './styles/navbar.css'
import './styles/reset.css'
import { auth } from '../db/configFirebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const NavBar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {

        signOut(auth).then(() => {
            navigate("/");  
        });
    };

    

    return (
        <div className="navbar-body">
            <div className="component" onClick={handleSignOut}>
                <div className="navbar-img"></div>
                <p className="navbar-leg">sair</p>
            </div>
        </div>
    );
};

export default NavBar;
