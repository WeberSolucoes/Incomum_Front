import { Button } from "primereact/button";
import GenericTextInput from "../components/common/GenericTextInput";
import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { toastError, toastSucess } from "../utils/customToast";
import { useNavigate, useParams } from "react-router-dom";
import { mudarSenha } from "../services/Api";

export default function RedefinirSenha() {
    const { uid, token } = useParams<{ uid: string, token: string }>();
    const [senha, setSenha] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    async function handleRecoverySenha(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        setLoading(true);
        if (senha !== confirmarSenha) {
            toastError('As senhas precisam ser iguais');
            setLoading(false);
            return;
        }
        await mudarSenha(senha, uid, token)
            .then((response) => {
                toastSucess(response.data.message);
                alert(response.data.message);
                navigate('/login');
            }).catch((error) => {
                toastError(error.data);
                toastError('Algo deu errado')
            }).finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg border-round w-full lg:w-4">
                    <div className="text-center mb-4">
                        <img src="https://incoback.com.br/static/img/logo.png" alt="logo" height={50} className="mb-3" />
                        <img src="https://incoback.com.br/static/img/25anos.jpg" alt="logo" height={50} className="mb-3" />
                        <h2 className="text-900 font-medium mb-3">Esqueci minha senha</h2>
                    </div>
                    <form onSubmit={handleRecoverySenha}>
                        <GenericTextInput type='password' icon='lock' value={senha} label='Senha' id='senha' onChange={(e) => setSenha(e.target.value)} />
                        <GenericTextInput type='password' icon='lock' value={confirmarSenha} label='Confirmar senha' id='confirmar-senha' onChange={(e) => setConfirmarSenha(e.target.value)} />
                        <p>Senhas devem conter:</p>
                        <ul>
                            <li>8 ou mais caracteres</li>
                            <li>1 caractere maiúsculo</li>
                            <li>1 caractere minúsculo</li>
                            <li>1 caractere especial</li>
                        </ul>
                        <Button type='submit' label='Definir Nova Senha' icon="pi pi-key" className='w-100' />
                    </form>
                    {loading && (
                        <div className="d-flex justify-content-center align-items-center mt-3">
                            <ProgressSpinner />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}