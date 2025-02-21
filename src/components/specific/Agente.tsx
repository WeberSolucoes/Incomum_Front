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
import { useCodigo } from "../../contexts/CodigoProvider";
import { IconButton } from "@mui/material";
import Select from 'react-select';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { useDispatch, useSelector } from "react-redux";
import { addTab, setActiveTab } from '../../hooks/tabSlice';
import { RootState } from "../../hooks/store";
import { apiGetCep, apiGetCepId, apiGetCidade, apiGetCidadeId, } from "../../services/Api";


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
    const [agencias, setAgencias] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAgentes, setFilteredAgentes] = useState<Agente[]>([]);
    const [imagemBase64, setImagemBase64] = useState<string | null>(null);
    const { codigo } = useCodigo();
    const [editing, setEditing] = useState(false); // Novo estado para diferenciar criação e edição
    const [selectedAgente, setSelectedAgente] = useState<number | null>(null);
    const [agenteNome, setAgenteNome] = useState('');
    const [cidades, setCidades] = useState<{ label: string, value: number }[]>([]);
    const [ibge, setibge] = useState(0);
    const [uf, setUf] = useState("");
    const dispatch = useDispatch(); 

    const agenteColumns = [
        { header: 'Código', field: 'codigo' },
        { header: 'Descrição', field: 'descricao' },
        { header: 'CPF', field: 'cpf' },
        { header: 'Agência', field: 'agenciaCodigo' },
    ];

    // Função para carregar as agências do backend
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const fetchAgencias = async () => {
        try {
            const response = await axios.get('https://api.incoback.com.br/api/incomum/agencia/list-all/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAgencias(response.data);
        } catch (error) {
            console.error('Erro ao buscar agências:', error);
        }
    };
    
    const fetchAgentes = async (agenciaId: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.incoback.com.br/api/incomum/agente/${agenciaId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Dados dos agentes:', response.data);
    
            const mappedData = response.data.map((item: any) => ({
                codigo: item.agt_codigo,
                descricao: item.agt_descricao,
                cpf: item.agt_cpf,
                agenciaCodigo: item.age_codigo, // Corrigido para corresponder ao campo correto
                agt_cep: item.agt_cep || '',  // Adicionando o campo agt_cep
                agt_endereco: item.agt_endereco || '', // Adicionando o campo agt_endereco
                agt_numero: item.agt_numero || '', // Adicionando o campo agt_numero
                agt_bairro: item.agt_bairro || '', // Adicionando o campo agt_bairro
                cid_codigo: item.cid_codigo || '', // Adicionando o campo cid_codigo
                agt_fone: item.agt_fone || '', // Adicionando o campo agt_fone
                agt_celular: item.agt_celular || '', // Adicionando o campo agt_celular
                agt_comissao: item.agt_comissao || '', // Adicionando o campo agt_comissao
                agt_email: item.agt_email || '', // Adicionando o campo agt_email
                ban_codigo: item.ban_codigo || '', // Adicionando o campo ban_codigo
                agt_agencia: item.agt_agencia || '', // Adicionando o campo agt_agencia
                agt_contacorrente: item.agt_contacorrente || '',
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
        console.log('Código da agência:', codigo);
        console.log('Agentes filtrados:', filteredAgentes);
        const agenciaId = codigo; // Exemplo de ID de agência
        fetchAgencias();
        fetchAgentes(agenciaId);
    }, [codigo]);

     const handleCepApi = async (e: React.FocusEvent<HTMLInputElement>) => {
          const cep = e.target.value.replace('-', '');
          if (cep.length === 8) {
              try {
                  const response = await apiGetCepId(cep);
                  const data = response.data;
    
                  console.log(data);
    
                  setRua(data.cep_logradouro || '');
                  setIbge(data.ibge || '');
    
                  let cidadeSelecionada = null;
    
                  if (data.cid_codigo) {
                      // Busca a descrição da cidade pelo cid_codigo
                      const cidadeResponse = await apiGetCidadeId(data.cid_codigo);
                      const cidadeData = cidadeResponse.data;
    
                      if (cidadeData) {
                          cidadeSelecionada = { value: cidadeData.cid_codigo, label: cidadeData.cid_descricao };
                      }
                  }
    
                  setCidades(cidadeSelecionada ? [cidadeSelecionada] : []);
    
                  setRequest(prevState => ({
                      ...prevState,
                      agt_bairro: data.cep_bairro || '',
                      agt_endereco: data.cep_logradouro || '',
                      agt_cep: prevState.age_cep,
                      cid_codigo: cidadeSelecionada ? cidadeSelecionada.value : ''
                  }));
              } catch (error) {
                  console.error("Erro ao buscar dados do CEP:", error);
                  toastError("Erro ao buscar dados do CEP.");
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

    const handleEditAgente = (codigo: number) => {
        const agenteParaEditar = filteredAgentes.find(agente => agente.codigo === codigo);
        console.log('Agente para editar:', agenteParaEditar); // Debug: veja o objeto do agente
    
        if (agenteParaEditar) {
            setAgenteNome(agenteParaEditar.descricao);
            setRequest({
                agt_descricao: agenteParaEditar.descricao || '',
                agt_cpf: agenteParaEditar.cpf || '',
                age_codigo:'', // Verifique se a propriedade está correta
                agt_cep: agenteParaEditar.agt_cep || '',
                agt_endereco: agenteParaEditar.agt_endereco || '',
                agt_numero: agenteParaEditar.agt_numero || '',
                agt_bairro: agenteParaEditar.agt_bairro || '',
                cid_codigo: agenteParaEditar.cid_codigo || '',
                agt_fone: agenteParaEditar.agt_fone || '',
                agt_celular: agenteParaEditar.agt_celular || '',
                agt_comissao: agenteParaEditar.agt_comissao || '',
                agt_email: agenteParaEditar.agt_email || '',
                ban_codigo: agenteParaEditar.ban_codigo || '',
                agt_agencia: agenteParaEditar.agt_agencia || '',
                agt_contacorrente: agenteParaEditar.agt_contacorrente || '',
            });
            setSelectedAgente(codigo); // Armazena o ID do agente sendo editado
            setEditing(true); // Define que o dialog está em modo de edição
            setModalVisible(true); // Abre o modal
        } else {
            console.error('Agente não encontrado para edição:', codigo);
        }
    };
    // Função de submissão do formulário, diferenciando criação e edição
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                agt_descricao: request.agt_descricao,
                agt_cpf: request.agt_cpf,
                agt_cep: request.agt_cep,
                agt_endereco: request.agt_endereco,
                agt_numero: request.agt_numero,
                agt_bairro: request.agt_bairro,
                cid_codigo: request.cid_codigo,
                agt_fone: request.agt_fone,
                agt_celular: request.agt_celular,
                agt_comissao: request.agt_comissao,
                agt_email: request.agt_email,
                ban_codigo: request.ban_codigo,
                agt_agencia: request.agt_agencia,
                agt_contacorrente: request.agt_contacorrente,
                age_codigo: request.age_codigo || codigo,
            };

            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (editing && selectedAgente) {
                // Modo de edição: envia uma requisição PUT
                const response = await axios.put(
                    `https://api.incoback.com.br/api/incomum/agente/update/${selectedAgente}/`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            
                if (response.status === 200) {
                    toastSucess("Agente atualizado com sucesso");
                    fetchAgentes(codigo); // Atualiza a lista de agentes
                }
            } else {
                // Modo de criação: envia uma requisição POST
                const response = await axios.post(
                    'https://api.incoback.com.br/api/incomum/agente/create/',
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            
                if (response.status === 201) {
                    toastSucess("Agente salvo com sucesso");
                    fetchAgentes(codigo); // Atualiza a lista de agentes
                }
            }
            setModalVisible(false);
            handleClear(); // Limpa o formulário
        } catch (error: any) {
            console.error('Erro ao salvar ou atualizar agente:', error);
            toast.error('Erro ao salvar os dados do agente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para limpar os campos e redefinir o modo de criação
    const handleClear = () => {
        setRequest({
            agt_descricao: '',
            agt_cpf: '',
            age_codigo: '',
            agt_cep: '',
            agt_endereco: '',
            agt_numero: '',
            agt_bairro: '',
            cid_codigo: '',
            agt_fone: '',
            agt_celular: '',
            agt_comissao: '',
            agt_email: '',
            ban_codigo: '',
            agt_agencia: '',
            agt_contacorrente: '',
        });
        setEditing(false);
        setSelectedAgente(null);
    };


    const fetchUnidades = async (search: string) => {
        if (search.length < 3) {
            setCidades([]); // Limpa somente se o termo de pesquisa for muito curto
            return;
        }
    
        try {
            const response = await axios.get(
                `https://api.incoback.com.br/api/incomum/cidade/search/`,
                { params: { q: search } }
            );
            const data = response.data;
    
            console.log("Dados crus da API:", data); // Verificar dados crus
    
            if (Array.isArray(data) && data.length > 0) {
                setCidades(data); // Atualiza somente se houver resultados
                console.log("Estado atualizado com cidades:", data);
            } else {
                console.log("Nenhum dado encontrado");
                setCidades([]);
            }
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
            setCidades([]); // Limpa em caso de erro
        } finally {
            setLoading(false);
        }
    };

    const handleCidadeChange = (selectedOption) => {
        if (selectedOption) {
            setibge(selectedOption.value); // Armazena o código da cidade
            setUf(selectedOption.uf); // Atualiza o UF automaticamente
        } else {
            setibge(null);
            setUf(""); // Reseta o UF se nenhuma cidade for selecionada
        }
    };

    const existingTabs = useSelector((state: any) => state.tabs.tabs); // Pegamos apenas o array de abas

    console.log("Abas no Redux:", existingTabs); // Verifique se é um array antes de usar some()

    const handleClick = () => {
        const cidadeJaExiste = existingTabs.some(tab => tab.key === 'Cidade');

        if (!cidadeJaExiste) {
            dispatch(addTab({ key: 'Cidade', title: 'Cidade', state: {} })); // Adiciona apenas se não existir
        }

        dispatch(setActiveTab('Cidade')); // Troca para a aba "Cidade"

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Deixa a rolagem suave
        });
    };


    
    return (
        <>


            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', marginTop: '8px' }}>
                <Button
                    label="Criar"
                    icon="pi pi-plus"
                    style={{ marginLeft: 'auto', backgroundColor: '#0152a1', height: '34px', borderRadius: '10px'  }}
                    onClick={() => setModalVisible(true)}
                />
            </div>

            <GenericTable 
                emptyMessage="Nenhum agente encontrado"
                filteredItems={filteredAgentes}
                columns={agenteColumns}
                onCodeClick={handleEditAgente}
            />

            <Dialog 
                visible={modalVisible}
                style={{ width: '60vw' }} 
                onHide={() => {
                    setModalVisible(false);
                    setAgenteNome(''); // Limpa o nome ao fechar o modal, se necessário
                }}
            >   
                <h1 style={{ color: '#0152a1' }}>
                    {editing ? `Editar Agente: ${agenteNome}` : 'Cadastro Agente'}
                </h1>
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
                            <label htmlFor="agt_endereco">Rua</label>
                            <input
                                style= {{width:'524px'}}
                                type="text"
                                id="agt_endereco"
                                name="agt_endereco"
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
                        <div className="form-group" style={{ display: "block", alignItems: "center", gap: "8px" }}>
                            <label htmlFor="cid_codigo" style={{ whiteSpace: "nowrap" }}>Cidade</label>
                            <IconButton 
                                onClick={handleClick} 
                                sx={{ color: "#0152a1", backgroundColor: "transparent", padding: "5px",height:'30px', }}
                            >
                                <AddToPhotosIcon sx={{ fontSize: 30 }} />
                            </IconButton>
                            <Select
                                id="cid_codigo"
                                name="cid_codigo"
                                isClearable
                                isLoading={loading} // Indicador de carregamento
                                options={cidades} // Estado cidades atualizado com os dados crus da API
                                onInputChange={(inputValue, { action }) => {
                                    if (action === "input-change") {
                                        setSearchTerm(inputValue); // Atualiza o termo de pesquisa
                                        fetchUnidades(inputValue); // Faz a chamada à API
                                    }
                                }}
                                onChange={handleCidadeChange} // Lida com a mudança de valor selecionado
                                value={cidades.find((option) => option.value === ibge) || null} // Define o valor atual
                                placeholder="Selecione uma Cidade"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agt_uf">UF</label>
                            <input
                                style= {{width:'44px'}}
                                type="text"
                                id="agt_uf"
                                name="agt_uf"
                                value={uf}
                                readOnly
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
                            <label htmlFor="agt_comissao">Over</label>
                            <input
                                type="text"
                                id="agt_comissao"
                                name="agt_comissao"
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
                            <label htmlFor="agt_contacorrente">Conta Corrente</label>
                            <input
                                type="text"
                                id="agt_contacorrente"
                                name="agt_contacorrente"
                                value={request.agt_contacorrente || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        
                        <button
                            onClick={handleClear}
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
