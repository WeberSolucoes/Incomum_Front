import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import {  AgenteCreateRequest } from "../../utils/apiObjects";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import GenericTable from "../common/GenericTable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { toastSucess } from "../../utils/customToast";

const bancos = [
    { label: 'Banco do Brasil', value: '1' },
    { label: 'Itaú', value: '2' },
    { label: 'Bradesco', value: '3' },
    { label: 'Santander', value: '4' },
    { label: 'Caixa Econômica Federal', value: '5' },
    { label: 'Banrisul', value: '6' },
    { label: 'Banco Safra', value: '7' },
    { label: 'Banco Original', value: '8' },
];



const Agente: React.FC = ({ }) => {
    const [request, setRequest] = useState<AgenteCreateRequest>({} as AgenteCreateRequest);
    const [loading, setLoading] = useState(false);
    const [setAgencias] = useState<{ id: number; nome: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAgentes, setFilteredAgentes] = useState<Agente[]>([]);

    const agenteColumns = [
        { header: 'Código', field: 'codigo' },
        { header: 'Descrição', field: 'descricao' },
        { header: 'CPF', field: 'cpf' },
        { header: 'Agência', field: 'agenciaCodigo' },
    ];

    // Função para carregar as agências do backend
    const fetchAgencias = async () => {
        try {
            const response = await axios.get('http://18.118.35.25:8443/api/incomum/agencia/list-all/');
            setAgencias(response.data);
        } catch (error) {
            console.error('Erro ao buscar agências:', error);
        }
    };

    // Função para buscar os agentes com base no termo de busca
    const fetchAgentes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://18.118.35.25:8443/api/incomum/agente/list-all/');
            console.log('Dados dos agentes:', response.data);

            const mappedData = response.data.map((item: any) => ({
                codigo: item.agt_codigo,
                descricao: item.agt_descricao,
                cpf: item.agt_cpf,
                agenciaCodigo: item.age_codigo,
            }));

            setFilteredAgentes(mappedData);
        } catch (error) {
            console.error('Erro ao buscar agentes:', error);
            toast.error('Erro ao carregar os dados dos agentes. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencias();
    }, []);

    const fetchAddressByCep = async (cep: string) => {
        if (cep.length === 8) { // Verifica se o CEP tem 8 caracteres
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { logradouro, bairro, localidade, uf } = response.data;

                // Atualiza os campos de endereço no formulário
                setRequest((prev) => ({
                    ...prev,
                    agt_rua: logradouro,
                    agt_bairro: bairro,
                    agt_cidade: localidade,
                    agt_uf: uf,
                }));
            } catch (error) {
                console.error('Erro ao buscar endereço:', error);
                toast.error('Erro ao buscar endereço. Verifique o CEP.');
            }
        }
    };

    // Função para lidar com mudanças nos inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRequest({ ...request, [name]: value });

        // Se o campo for o CEP, chama a função para buscar o endereço
        if (name === 'agt_cep') {
            fetchAddressByCep(value.replace(/\D/g, '')); // Remove caracteres não numéricos
        }
    };



    // Função de submissão do formulário de criação de agente
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                agt_descricao: request.agt_descricao,
                agt_cpf: request.agt_cpf,
                agt_cep: request.agt_cep,  // Adicionando campo 'agt_cep'
                agt_endereco: request.agt_endereco,    // Adicionando campo 'agt_rua'
                agt_numero: request.agt_numero,  // Adicionando campo 'agt_numero'
                agt_bairro: request.agt_bairro,  // Adicionando campo 'agt_bairro'
                cid_codigo: request.cid_codigo,  // Adicionando campo 'agt_cidade'
                agt_fone: request.agt_fone,    // Adicionando campo 'agt_fone'
                agt_celular: request.agt_celular,  // Adicionando campo 'agt_celular'
                agt_comissao: request.agt_comissao,     // Adicionando campo 'agt_over'
                agt_email: request.agt_email,   // Adicionando campo 'agt_email'
                ban_codigo: request.ban_codigo,   // Adicionando campo 'agt_banco'
                agt_agencia: request.agt_agencia,  // Adicionando campo 'agt_agencia'
                agt_contacorrente: request.agt_contacorrente, // Adicionando campo 'agt_conta_corrente'
                age_codigo: request.age_codigo || 1,
            };

            const response = await axios.post('http://18.118.35.25:8443/api/incomum/agente/create/', payload);

            if (response.status === 201) {
                toastSucess("Agente salvo com sucesso");
                setModalVisible(false);
            } else {
                toast.error('Erro ao criar o agente.');
            }
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            if (error.response && error.response.status === 400) {
                toast.error('Dados inválidos. Verifique os campos e tente novamente.');
            } else {
                toast.error('Erro ao salvar o agente. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', marginTop: '8px' }}>
                <Button
                    label="Criar"
                    icon="pi pi-plus"
                    style={{ marginLeft: 'auto', backgroundColor: '#0152a1' }}
                    onClick={() => setModalVisible(true)}
                />
            </div>

            <GenericTable 
                emptyMessage="Nenhum agente encontrado"
                filteredItems={filteredAgentes}
                columns={agenteColumns}
            />

            <Dialog 
                visible={modalVisible}
                style={{ width: '60vw' }} 
                onHide={() => setModalVisible(false)}
            >   
                <h1 style={{color:'#0152a1'}}>Cadastro Agente</h1>
                <form className="erp-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="agt_descricao">Nome</label>
                            <input
                                style= {{width:'400px'}}
                                type="text"
                                id="agt_descricao"
                                name="agt_descricao"
                                value={request.agt_descricao || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_cpf">CPF</label>
                            <input
                                style= {{width:'400px'}}
                                type="text"
                                id="agt_cpf"
                                name="agt_cpf"
                                value={request.agt_cpf || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="agt_cep">Cep</label>
                            <input
                                style= {{width:'200px'}}
                                type="text"
                                id="agt_cep"
                                name="agt_cep"
                                value={request.agt_cep || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_rua">Rua</label>
                            <input
                                style= {{width:'524px'}}
                                type="text"
                                id="agt_rua"
                                name="agt_rua"
                                value={request.agt_endereco || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_numero">Número</label>
                            <input
                                style= {{width:'70px'}}
                                type="text"
                                id="agt_numero"
                                name="agt_numero"
                                value={request.agt_numero || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="agt_bairro">Bairro</label>
                            <input
                                style= {{width:'250px'}}
                                type="text"
                                id="agt_bairro"
                                name="agt_bairro"
                                value={request.agt_bairro || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_cidade">Cidade</label>
                            <input
                                style= {{width:'474px'}}
                                type="text"
                                id="agt_cidade"
                                name="agt_cidade"
                                value={request.cid_codigo || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_uf">UF</label>
                            <input
                                style= {{width:'70px'}}
                                type="text"
                                id="agt_uf"
                                name="agt_uf"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="agt_fone">Telefone</label>
                            <input
                                type="text"
                                id="agt_fone"
                                name="agt_fone"
                                value={request.agt_fone || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_celular">Celular</label>
                            <input
                                type="text"
                                id="agt_celular"
                                name="agt_celular"
                                value={request.agt_celular || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_celular">Over</label>
                            <input
                                type="text"
                                id="agt_celular"
                                name="agt_celular"
                                value={request.agt_comissao || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="agt_email">Email</label>
                            <input
                                type="text"
                                id="agt_email"
                                name="agt_email"
                                value={request.agt_email || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="agt_banco">Banco</label>
                            <Dropdown
                                id="agt_banco"
                                name="ban_codigo"
                                value={request.ban_codigo}
                                options={bancos}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Selecione um banco"
                                className="w-full md:w-14rem" checkmark={true}
                                highlightOnSelect={false}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_agencia">Agência</label>
                            <input
                                type="text"
                                id="agt_agencia"
                                name="agt_agencia"
                                value={request.agt_agencia || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_conta_corrente">Conta Corrente</label>
                            <input
                                type="text"
                                id="agt_conta_corrente"
                                name="agt_conta_corrente"
                                value={request.agt_contacorrente || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        
                        <button
                            style={{
                                color: 'white',
                                backgroundColor: '#0152a1',
                                marginLeft: '600px',
                            }}
                            type="button"
                            className="reset-btn"
                        >
                            <i className="fas fa-trash-alt"></i> Limpar
                        </button>

                        <button
                            style={{ width: '100px', height: '34px', padding: 'inherit', marginLeft: '10px' }}
                            disabled={loading}
                            type="submit"
                            className="submit-btn"
                        >
                            <i style={{ marginRight: '10px' }} className="fas fa-save"></i>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default Agente;
