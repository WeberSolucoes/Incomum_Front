import { Button } from "primereact/button";
import GenericTextInput from "../components/common/GenericTextInput";
import { useState } from "react";
import { toastError, toastSucess } from "../utils/customToast";
import { useNavigate, useParams } from "react-router-dom";
import { apiPostMudarSenha } from "../services/Api";
import incoback from "../../assets/images/incoback.jpg";

export default function RedefinirSenha() {
    const { uid, token } = useParams<{ uid: string, token: string }>();
    const [senha, setSenha] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    async function handleRecoverySenha(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        setLoading(true);
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

        if(regex.test(senha) === false) {
            toastError('A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um caractere especial');
            setLoading(false);
            return;
        }
        if (senha !== confirmarSenha) {
            toastError('As senhas precisam ser iguais');
            setLoading(false);
            return;
        }
        await apiPostMudarSenha(senha, uid, token)
            .then((response) => {
                toastSucess(response.data.message);
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
                        <img src={incoback} alt="logo" height={50} className="mb-3" />
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
                        <Button type='submit' label='Definir Nova Senha' loading={loading} icon="pi pi-key" className='w-100' style={{backgroundColor:'#0152a1'}} />
                    </form>
                </div>
            </div>
        </>
    )
}
