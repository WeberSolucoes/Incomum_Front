import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

import GenericTextInput from '../common/GenericTextInput';
import { toastSucess, toastError } from '../../utils/customToast';
import { useAuth } from '../../contexts/AuthProvider';

const LoginForm: React.FC = () => {
    useEffect(() => {
        auth.logout();
    },[])
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate()
    const auth = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await auth.login(email, senha, checked);
            toastSucess('Login efetuado com sucesso');
            navigate('/');
        } catch (error) {
            toastError('Email ou senha inválidos');
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg border-round w-full lg:w-4">
                    <div className="text-center mb-4">
                        <img src="https://incoback.com.br/static/img/logo.png" alt="logo" height={50} className="mb-3" />
                        <img src="https://incoback.com.br/static/img/25anos.jpg" alt="logo" height={50} className="mb-3" />
                        <h2 className="text-900 font-medium mb-3">Bem vindo!</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <p>{import.meta.env.VITE_REACT_API_URL}</p>
                        <GenericTextInput icon='at' value={email} label='Email' id='email' onChange={(e) => setEmail(e.target.value)} />
                        <GenericTextInput icon='lock' type='password' value={senha} label='Senha' id='senha' onChange={(e) => setSenha(e.target.value)} />
                        <div className="d-flex justify-content-between mb-4 gap-3">
                            <div className="flex align-items-center justify-content-between mb-6">
                                <div className="flex align-items-center">
                                    <Checkbox onChange={e => setChecked(e.checked ?? false)} checked={checked} className="mr-2" />
                                    <label style={{ marginLeft: '10px' }} htmlFor="rememberme">Lembrar de mim</label>
                                </div>
                            </div>
                            <Link to='/recuperar-senha'>Esqueceu sua senha?</Link>
                        </div>
                        <Button type='submit' label='Entrar' loading={loading} icon="pi pi-sign-in" className='w-100' />
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginForm
