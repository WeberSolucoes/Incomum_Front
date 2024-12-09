import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import GenericTextInput from '../common/GenericTextInput';
import { toastSucess, toastError } from '../../utils/customToast';
import { useAuth } from '../../contexts/AuthProvider';
import incoback from "../../assets/images/incoback.jpg";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false); // "Lembrar de mim" checkbox
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const auth = useAuth();

    // Redireciona se já estiver autenticado
    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate('/'); // Redireciona para a página inicial se já estiver autenticado
        }
    }, [auth.isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Chama o login do contexto, passando os parâmetros necessários
            await auth.login(email, senha, checked);
            toastSucess('Login efetuado com sucesso');
            navigate('/'); // Redireciona para a página principal após o login
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            toastError('Usuário ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    if (auth.isAuthenticated) {
        return null; // Ou um componente de loading
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-lg border-round w-full lg:w-4">
                <div className="text-center mb-4">
                    <img src={incoback} alt="logo" height={60} className="mb-3" />
                </div>
                <form onSubmit={handleLogin}>
                    <GenericTextInput
                        icon='at'
                        value={email}
                        label='Email'
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <GenericTextInput
                        icon='lock'
                        type='password'
                        value={senha}
                        label='Senha'
                        id='senha'
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <div className="d-flex justify-content-between mb-4 gap-3">
                        <div className="flex align-items-center justify-content-between mb-6">
                            <div className="flex align-items-center">
                                <Checkbox onChange={e => setChecked(e.checked ?? false)} checked={checked} className="mr-2" />
                                <label style={{ marginLeft: '5px', marginBottom: '0px' }} htmlFor="rememberme">Lembrar de mim</label>
                            </div>
                        </div>
                        <Link to='/recuperar-senha'>Esqueceu sua senha?</Link>
                    </div>
                    <Button type='submit' label='Entrar' loading={loading} icon="pi pi-sign-in" className='w-100' />
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
