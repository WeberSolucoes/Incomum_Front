import { useState } from "react";
import GenericTextInput from "../components/common/GenericTextInput";
import { Button } from "primereact/button";
import { toastError, toastSucess } from "../utils/customToast";
import { apiPostSendRecoveryEmail } from "../services/Api";
import incoback from '../assets/images/incoback.jpg';

export default function RecuperarSenha() {

    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    async function handleEmail(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        setLoading(true);
        try {
            await apiPostSendRecoveryEmail(email);
            toastSucess('Email para recuperação de senha enviado com sucesso');
        } catch (error) {
            toastError('Email desconhecido');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg border-round w-full lg:w-4">
                    <div className="text-center mb-4">
                        <img src={incoback} alt="logo" height={50} className="mb-3" />
                        <h2 className="text-900 font-medium mb-3">Esqueci minha senha</h2>
                    </div>
                    <form onSubmit={handleEmail}>
                        <GenericTextInput icon='at' value={email} label='Email' id='email' onChange={(e) => setEmail(e.target.value)} />
                        <Button type='submit' label='Enviar email' loading={loading} icon="pi pi-send" className='w-100' style={{backgroundColor:'#0152a1'}} />
                    </form>
                </div>
            </div>
        </>
    )

}
