import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { ParceiroCreateRequest, VendedorCreateRequest } from "../../utils/apiObjects";
import { apiCreateParceiro, apiDeleteParceiro, apiDeleteVendedor, apiGetArea, apiGetCidade, apiGetParceiroId, apiGetVendedorById, apiPostCreateVendedor, apiPutUpdateVendedor, apiUpdateParceiro, apiGetCepId,apiGetCidadeId } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import Select from 'react-select';
import { addTab, setActiveTab } from "../../hooks/tabSlice";
import { useDispatch, useSelector } from "react-redux";
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import IconButton from '@mui/material/IconButton';
import InputMask from "react-input-mask";
import { RootState } from "../../hooks/store";

const Fornecedores: React.FC = ({onBackClick, onCadastroConcluido}) => {
    const { setCodigo,codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<ParceiroCreateRequest>({} as ParceiroCreateRequest);
    const [rua, setRua] = useState(''); 
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [par_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cidades, setCidades] = useState<{ label: string, value: number }[]>([]);
    const dispatch = useDispatch();
    const [uf, setUf] = useState("");
    const [dateValue, setDateValue] = useState(request.par_datanascfund || "");
    const [dateValue2, setDateValue2] = useState(request.par_dataatualizacao|| "");
    const [dateValue3, setDateValue3] = useState(request.par_datacadastro || "");
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

    const handleChange = (event) => {
        setDateValue(event.target.value); // Atualiza o estado local
        handleInputChange(event); // Dispara a função externa
    };

    const handleChange2 = (event) => {
        setDateValue2(event.target.value);
        handleInputChange(event);
    };

    // Função para atualizar apenas "par_datacadastro"
    const handleChange3 = (event) => {
        setDateValue3(event.target.value);
        handleInputChange(event);
    };

    const exampleData = [
        { coluna1: 'Item 1', coluna2: 'Descrição 1' },
        { coluna1: 'Item 2', coluna2: 'Descrição 2' },
        { coluna1: 'Item 3', coluna2: 'Descrição 3' },
    ];

    useEffect(() => {
        if (!activeTab || activeTab !== 'Fornecedores') {
            // Reseta o código se a aba não for "Agência"
            setCodigo(null);
            return; // Não executa a consulta
        }
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (activeTab !== 'Fornecedores') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetParceiroId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.par_codigo); // Define o ID do vendedor
                
                // Verifica se o endereco está definido e não é null antes de usar split
                if (unidade.loj_endereco) {
                    const enderecoParts = unidade.loj_endereco.split(",");
                    setRua(enderecoParts[0] || '');
                    setNumero(enderecoParts[1] || '');
                } else {
                    setRua('');
                    setNumero('');
                }

                setCidade(unidade.cid_codigo || '');
                // Verifica se areasComerciais está definido e é um array antes de usar map
                if (Array.isArray(unidade.areasComerciais)) {
                    setSelectedAreas(unidade.areasComerciais.map((area: any) => area.aco_codigo));
                } else {
                    setSelectedAreas([]);
                }
                setChecked(unidade.loj_situacao === 1);

                // Buscar nome da cidade pelo código
                const responseCidade = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${unidade.cid_codigo}`);
                setCidade(responseCidade.data.nome || '');
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                toastError("Erro ao buscar dados da unidade.");
            }
        };
        fetchData();
    }, [codigo, activeTab]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));

        // Validação dinâmica
        if (id === 'ven_cpf') {
        setCpfValido(cpf.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setRequest(prevState => ({ ...prevState, 'cep_codigo': value }));
    };

    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setRequest(prevState => ({ ...prevState, 'loj_cnpj': value }));
    };

    const handleFoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setRequest(prevState => ({ ...prevState, 'loj_fone': value }));
    };

    const handleMultiSelectChange = (e: { value: number[] }) => {
        setSelectedAreas(e.value);
        setRequest(prevState => ({ ...prevState, areasComerciais: e.value }));
    };

    const handleDeleteClick = () => {
        if (par_codigo !== null) { // Verifica se ven_codigo não é nulo
            confirmDialog({
                message: 'Tem certeza de que deseja excluir este cadastro?',
                header: 'Confirmar Exclusão',
                icon: 'pi pi-exclamation-triangle',
                accept: handleConfirmDelete,
                reject: () => console.log('Exclusão cancelada'),
                acceptLabel: 'Sim, desejo excluir',
                rejectLabel: 'Cancelar',
                className: 'custom-confirm-dialog',
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (par_codigo !== null) { // Verifica se ven_codigo não é nulo
            setLoading(true);
            try {
                await apiDeleteParceiro(par_codigo);
                toast.success('Cadastro excluído com sucesso.');
            } catch (error) {
                toastError('Erro ao excluir o cadastro.');
                console.error('Erro ao excluir o cadastro:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const campoMapeamento: Record<keyof VendedorCreateRequest, string> = {
        ven_numero: 'Número',
        ven_contacorrente: 'Conta',
        ven_agencia: 'Agência',
        ven_cep: 'Cep',
        ven_descricao: "",
        loj_codigo: "",
        ven_endereco: "",
        ven_bairro: "",
        cid_codigo: "",
        ven_fone: "",
        ven_celular: "",
        ven_cpf: "",
        ven_situacao: "",
        aco_codigo: "",
        ven_descricaoweb: "",
        ven_descricaoauxiliar: "",
        ven_codigoimportacao: "",
        ban_codigo: "",
        ven_observacao: "",
        ven_email: "",
        sve_codigo: ""
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const cpfNumerico = request.par_cnpjcpf?.replace(/\D/g, '') || ''; // Garante que será uma string
    
            if (!cpf.isValid(cpfNumerico)) {
                toastError("CPF inválido.");
                setCpfValido(false);
                setLoading(false);
                return;
            }
    
            const enderecoCompleto = `${rua}, ${numero}`;
            const updatedRequest = {
                ...request,
                par_endereco: enderecoCompleto,
                cid_codigo: request.cid_codigo, // Atualiza corretamente o cid_codigo
            };
    
            let response;
            if (request.par_codigo) {
                // Atualizar parceiro existente
                response = await apiUpdateParceiro(request.par_codigo, updatedRequest);
                onCadastroConcluido();
            } else {
                // Criar novo parceiro
                const { par_codigo, ...newRequest } = updatedRequest; // Remove par_codigo
                response = await apiCreateParceiro(newRequest);
                onCadastroConcluido();
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Parceiro salvo com sucesso");
    
                localStorage.setItem('par_codigo', response.data.par_codigo.toString());
    
                setRequest(prev => ({
                    ...prev,
                    par_codigo: response.data.par_codigo,
                    cid_codigo: response.data.cid_codigo || prev.cid_codigo, // Garante que o cid_codigo seja atualizado corretamente
                }));
            } else {
                toastError("Erro ao salvar o Parceiro");
            }
        } catch (error: any) {
            console.error("Erro:", error);
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 400) {
                    toastError("Dados inválidos. Verifique os campos e tente novamente.");
                } else if (status === 401) {
                    toastError("Não autorizado. Verifique suas credenciais.");
                } else if (status === 500) {
                    toastError("Erro interno do servidor. Tente novamente mais tarde.");
                } else {
                    toastError(`Erro desconhecido: ${data.detail || "Verifique os campos e tente novamente"}`);
                }
            } else {
                toastError("Erro de conexão. Verifique sua rede e tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };


    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setRequest({} as ParceiroCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
    };

    const handleCepApi = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace('-', '');
        if (cep.length === 8) {
            try {
                const response = await apiGetCepId(cep);
                const data = response.data;
  
                console.log(data);
  
                setRua(data.cep_logradouro || '');
  
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
                    par_bairro: data.cep_bairro || '',
                    par_endereco: data.cep_logradouro || '',
                    cid_codigo: cidadeSelecionada ? cidadeSelecionada.value : ''
                }));
            } catch (error) {
                console.error("Erro ao buscar dados do CEP:", error);
                toastError("Erro ao buscar dados do CEP.");
            }
        }
    };

    const fetchUnidades = async (search: string) => {
        if (search.length < 3) {
            setCidades([]); // Limpa o estado se o termo de pesquisa for muito curto
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
  
  
    useEffect(() => {
        console.log("Cidades após a atualização:", cidades); // Verifique o estado
    }, [cidades]); 
  
      // Efetua a busca quando o valor do termo de busca mudar
    useEffect(() => {
        if (searchTerm.length >= 3) {
          fetchUnidades(searchTerm); // Realiza a consulta para termos com 3 ou mais caracteres
        } else {
          setCidades([]); // Limpa as cidades se o termo for menor que 3
        }
    }, [searchTerm]); // A busca será chamada sempre que `searchTerm` mudar
  
  
    const handleCidadeChange = (selectedOption: any) => {
        if (selectedOption) {
            setRequest({
                ...request,
                cid_codigo: selectedOption.value, // Atualiza o cid_codigo com a seleção atual
            });
            setUf(selectedOption.uf); // Atualiza o UF com a seleção atual
        } else {
            setRequest({
                ...request,
                cid_codigo: null, // Limpa o cid_codigo se o usuário desmarcar
            });
            setUf(''); // Limpa o UF se o usuário desmarcar
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

    const fetchCidadeById = async (cid_codigo: number) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
            const response = await axios.get(
                `https://api.incoback.com.br/api/incomum/cidade/find-byid/${cid_codigo}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Erro ao buscar cidade por ID:", error);
        }
        return null;
    };
    
      useEffect(() => {
        const carregarCidade = async () => {
            if (request.par_codigo && request.cid_codigo) {
                const cidade = await fetchCidadeById(request.cid_codigo);
                if (cidade) {
                  setUf(cidade.cid_estado); // Atualiza o estado "uf" com o valor do "cid_estado"
                }
                if (cidade) {
                    setRequest(prev => ({
                        ...prev,
                        cid_codigo: cidade.cid_codigo
                    }));
    
                    // Verifica se a cidade já está na lista, se não, adiciona
                    setCidades(prev => {
                        if (!prev.some(c => c.value === cidade.cid_codigo)) {
                            return [...prev, { label: cidade.cid_descricao, value: cidade.cid_codigo }];
                        }
                        return prev;
                    });
                }
            }
        };
    
        carregarCidade();
      }, [request.par_codigo, request.cid_codigo]);
    

    return (
        <form className="erp-form" onSubmit={handleSubmit}>
            {/* Primeira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_codigo">Código</label>
                    <input
                        style={{width:'200px',height:'37.6px'}}
                        disabled
                        type="text"
                        id="par_codigo"
                        name="par_codigo"
                        value={request.par_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_datacadastro">Data Cadastro</label>
                    <InputMask
                        mask="99/99/9999"
                        value={dateValue3}
                        onChange={handleChange3}
                        disabled
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="par_datacadastro"
                                name="par_datacadastro"
                                style={{
                                    width: "200px",
                                    height: "37.6px",
                                    backgroundColor: "#f0f0f0", // Cinza claro
                                    color: "#888", // Cinza escuro no texto
                                    border: "1px solid #ccc", // Borda mais discreta
                                    pointerEvents: "none", // Impede interação
                                    opacity: 0.7, // Deixa um pouco mais apagado
                                }}
                                placeholder=""
                            />
                        )}
                    </InputMask>
                </div>
                <div className="form-group">
                    <label htmlFor="par_codigocontabil">Codigo Contabil</label>
                    <input
                        style={{width:'180px',height:'37.6px'}}
                        type="text"
                        id="par_codigocontabil"
                        name="par_codigocontabil"
                        value={request.par_codigocontabil || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_codigoimportacao">Codigo Importação</label>
                    <input
                        style={{width:'180px',height:'37.6px'}}
                        type="text"
                        id="par_codigoimportacao"
                        name="par_codigoimportacao"
                        value={request.par_codigoimportacao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_dataatualizacao">Ultima Atualização</label>
                    <InputMask
                        mask="99/99/9999"
                        value={dateValue2}
                        onChange={handleChange2}
                        disabled
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="par_dataatualizacao"
                                name="par_dataatualizacao"
                                style={{
                                    width: "200px",
                                    height: "37.6px",
                                    backgroundColor: "#f0f0f0", // Cinza claro
                                    color: "#888", // Cinza escuro no texto
                                    border: "1px solid #ccc", // Borda mais discreta
                                    pointerEvents: "none", // Impede interação
                                    opacity: 0.7, // Deixa um pouco mais apagado
                                }}
                                placeholder=""
                            />
                        )}
                    </InputMask>
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_descricao">Nome Fantasia</label>
                    <input
                        type="text"
                        id="par_descricao"
                        name="par_descricao"
                        value={request.par_descricao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_datanascfund">Data Fundação</label>
                    <InputMask
                        mask="99/99/9999"
                        value={dateValue}
                        onChange={handleChange}
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="par_datanascfund"
                                name="par_datanascfund"
                                style={{ width: "200px", height: "37.6px" }}
                                placeholder=""
                            />
                        )}
                    </InputMask>
                </div>
            </div>

            {/* Terceira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_razaosocial">Razão Social</label>
                    <input
                        type="text"
                        id="par_razaosocial"
                        name="par_razaosocial"
                        value={request.par_razaosocial || ''}
                        onChange={handleInputChange}
                        style={{width:'398px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_tipopessoa">Tipo Pessoa</label>
                    <select
                        id="par_tipopessoa"
                        name="par_tipopessoa"
                        value={request.par_tipopessoa || ''}
                        onChange={handleSelectChange}
                    >
                        <option value="1">Física</option>
                        <option value="2">Jurídica</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="par_cnpjcpf">CPF/CNPJ/NIF</label>
                    <input
                        type="text"
                        id="par_cnpjcpf"
                        name="par_cnpjcpf"
                        value={request.par_cnpjcpf || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_rgie">R.G/I.E</label>
                    <input
                        type="text"
                        id="par_rgie"
                        name="par_rgie"
                        value={request.par_rgie || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_fone1">Fone 1</label>
                    <input
                        type="text"
                        id="par_fone1"
                        name="par_fone1"
                        value={request.par_fone1 || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_fone2">Fone 2</label>
                    <input
                        type="text"
                        id="par_fone2"
                        name="par_fone2"
                        value={request.par_fone2 || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_celular">Celular</label>
                    <input
                        type="text"
                        id="par_celular"
                        name="par_celular"
                        value={request.par_celular || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_fax">Fax</label>
                    <input
                        type="text"
                        id="par_fax"
                        name="par_fax"
                        value={request.par_fax || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_whatsapp">Whatsapp</label>
                    <input
                        type="text"
                        id="par_whatsapp"
                        name="par_whatsapp"
                        value={request.par_whatsapp || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Quarta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_cep">CEP</label>
                    <input
                        type="text"
                        id="par_cep"
                        name="par_cep"
                        value={request.par_cep || ''}
                        onChange={handleInputChange}
                        onBlur={handleCepApi}
                        maxLength={8} // Adicionado para limitar a quantidade de caracteres
                        style={{width:'150px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_endereco">Endereço</label>
                    <input
                        type="text"
                        id="par_endereco"
                        name="par_endereco"
                        value={request.par_endereco || ''}
                        onChange={handleInputChange}
                        style={{width:'450px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_numero">Numero</label>
                    <input
                        type="text"
                        id="par_numero"
                        name="par_numero"
                        value={request.par_numero || ''}
                        onChange={handleInputChange}
                        style={{width:'100px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_complemento">Complemento</label>
                    <input
                        type="text"
                        id="par_complemento"
                        name="par_complemento"
                        value={request.par_complemento || ''}
                        onChange={handleInputChange}
                        style={{width:'280px'}}
                    />
                </div>
            </div>

            {/* Quinta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_bairro">Bairro</label>
                    <input
                        type="text"
                        id="par_bairro"
                        name="par_bairro"
                        value={request.par_bairro || ''}
                        onChange={handleInputChange}
                        style={{width:'450px'}}
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
                      value={cidades.find(cidade => cidade.value === request.cid_codigo) || null}
                      placeholder="Selecione uma Cidade"
                        styles={{
                            control: (base) => ({
                                ...base,
                                width: '450px', // Ajusta a largura
                                minHeight: '34px', // Define a altura mínima
                                height: '34px', // Força a altura
                                lineHeight: '34px', // Ajusta a altura do texto interno
                            }),
                            container: (base) => ({
                                ...base,
                                width: '450px', // Ajusta o tamanho do contêiner externo
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                height: '34px', // Ajusta a altura do contêiner interno
                                padding: '0', // Remove espaçamento extra
                            }),
                            input: (base) => ({
                                ...base,
                                margin: '0', // Remove margens extras
                                padding: '0', // Remove preenchimento
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 9999, // Evita problemas de sobreposição do dropdown
                            }),
                        }}
                    />
                </div>
                <div className="form-group" style={{marginLeft:'10px'}}>
                    <label htmlFor="ven_descricaoauxiliar">UF</label>
                    <input
                        type="text"
                        id="ven_descricaoauxiliar"
                        name="ven_descricaoauxiliar"
                        readOnly
                        value={uf}
                        style={{width:'78px'}}
                    />
                </div>
            </div>

            {/* Sexta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_email">E-mail</label>
                    <input
                        type="text"
                        id="par_email"
                        name="par_email"
                        value={request.par_email || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_site">Site</label>
                    <input
                        type="text"
                        id="par_site"
                        name="par_site"
                        value={request.par_site || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_obs">Observação</label>
                    <textarea 
                        id="par_obs" 
                        name="par_obs" 
                        placeholder="Digite suas observações aqui..."
                        value={request.par_obs || ''}
                        onChange={handleInputChange}
                    >
            
                    </textarea>
                </div>
            </div>

            <div className="form-row">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'680px',borderRadius:'4px' }}
                        onClick={onBackClick} // Chama a função passada como prop
                        type="button"
                    />
                {/* Condição para renderizar o botão de exclusão */}
                {request.par_codigo && (
                <button
                    style={{marginLeft:'0px',color:'white',width:'100px'}}
                    type="button"
                    className="reset-btn"
                    onClick={handleDeleteClick}
                    disabled={loading}
                >
                    <i className="fas fa-trash-alt"></i>Excluir
                </button>
                )}
                
                <button
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.par_codigo ? '14px' : '0px',display: request.par_codigo ? 'none' :''}}
                    type="button"
                    className="reset-btn"
                    onClick={handleReset}
                >
                    <i className="fas fa-trash-alt"></i> Limpar
                </button>
                <button style={{width:'100px',height:'34px',padding:'inherit'}} disabled={loading} type="submit" className="submit-btn"><i style={{marginRight:'10px'}}className="fas fa-save"></i>{loading ? 'Salvando...' : 'Salvar'}</button>
                <ConfirmDialog/>
            </div>
        </form>
    );
};

export default Fornecedores;

