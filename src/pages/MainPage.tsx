import { Button } from "primereact/button";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const logout = () => {
        auth.logout();
        navigate('/login');
    
    }
    return (
        <>
            <h1>Main Page</h1>
            <Button label="Logout" icon="pi pi-sign-in" className="p-button-secondary" onClick={logout}/>
        </>
    )
}