import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { VendedorCreateRequest } from "../../utils/apiObjects";
import { apiDeleteVendedor, apiGetArea, apiGetVendedorById, apiPostCreateVendedor, apiPutUpdateVendedor } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from 'primereact/button';
import Select from 'react-select';
import { addTab, setActiveTab } from "../../hooks/tabSlice";
import { useDispatch, useSelector } from "react-redux";
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import IconButton from '@mui/material/IconButton';
import { RootState } from "../../hooks/store";

const Vendedor: React.FC = ({onBackClick}) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<VendedorCreateRequest>({} as VendedorCreateRequest);
    const [rua, setRua] = useState(''); 
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [ven_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cidades, setCidades] = useState<{ label: string, value: number }[]>([]);
    const dispatch = useDispatch();
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

    useEffect(() => {
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (!activeTab) return; // 🔍 Espera até `activeTab` estar definido
        if (activeTab !== 'Vendedor') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetVendedorById(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.ven_codigo); // Define o ID do vendedor
                
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
    }, [codigo]);

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
        if (ven_codigo !== null) { // Verifica se ven_codigo não é nulo
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
        if (ven_codigo !== null) { // Verifica se ven_codigo não é nulo
            setLoading(true);
            try {
                await apiDeleteVendedor(ven_codigo);
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
    
        const camposNumericos: Array<keyof VendedorCreateRequest> = ['ven_cep', 'ven_numero','ven_contacorrente','ven_agencia'];
    
        for (const campo of camposNumericos) {
            const value = request[campo] as string; // Asserção de tipo
            const isNumber = /^\d*$/.test(value);
            if (value && !isNumber) {
                toastError(`O campo '${campoMapeamento[campo]}' deve conter apenas números.`);
                return; // Interrompe o envio do formulário
            }
        }
    
        setLoading(true);
        try {
            const cpfNumerico = request.ven_cpf?.replace(/\D/g, '') || ''; // Garante que será uma string
    
            if (!cpf.isValid(cpfNumerico)) {
                toastError("CPF inválido.");
                setCpfValido(false);
                return;
            }
    
            const enderecoCompleto = `${rua}, ${numero}`;
            request.ven_endereco = enderecoCompleto;
            request.ven_situacao = checked ? 1 : 0;
            cid_codigo: request.cid_codigo;
            request.aco_codigo = areacomercial;

            console.log("Dados do request antes do envio:", request); 
    
            let response;
            if (request.ven_codigo) {
                // Atualizar vendedor existente
                response = await apiPutUpdateVendedor(request.ven_codigo, request);
                
            } else {
                // Criar novo vendedor
                const { ven_codigo, ...newRequest } = request; // Remove ven_codigo
                response = await apiPostCreateVendedor(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Vendedor salvo com sucesso");
            } else {
                toastError("Erro ao salvar o vendedor");
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
        setRequest({} as VendedorCreateRequest);
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
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setRua(data.logradouro || '');
                setCidade(data.localidade || '');
                setibge(data.ibge || '');
                setRequest(prevState => ({
                    ...prevState,
                    'cid_codigo': `${data.localidade}`,
                    'ven_bairro': `${data.bairro}`,
                    'ven_endereco': `${data.logradouro}`
                    
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
            if (request.ven_codigo && request.cid_codigo) {
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
      }, [request.ven_codigo, request.cid_codigo]);
  

    return (
        <form className="erp-form" onSubmit={handleSubmit}>
            {/* Primeira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_codigo">Código</label>
                    <input
                        style={{width:'120px'}}
                        disabled
                        type="text"
                        id="ven_codigo"
                        name="ven_codigo"
                        value={request.ven_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{marginLeft:'-174px'}} htmlFor="salario">Importação</label>
                    <input
                        style={{width:'120px',marginLeft:'-176px'}}
                        type="text"
                        id="ven_codigoimportacao" 
                        name="ven_codigoimportacao"
                        value={request.ven_codigoimportacao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{marginLeft:'-354px'}} htmlFor="ven_situacao">Situação</label>
                    <select
                        style={{width:'194px',marginLeft:'-356px'}}
                        id="ven_situacao"
                        name="ven_situacao"
                        value={request.ven_situacao || ''}
                        onChange={handleSelectChange}
                    >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_descricao">Vendedor</label>
                    <input
                        type="text"
                        id="ven_descricao"
                        name="ven_descricao"
                        value={request.ven_descricao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_cpf">CPF</label>
                    <input
                        type="text"
                        id="ven_cpf"
                        name="ven_cpf"
                        value={request.ven_cpf || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Terceira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_descricaoweb">Vendedor Site 1</label>
                    <input
                        type="text"
                        id="ven_descricaoweb"
                        name="ven_descricaoweb"
                        value={request.ven_descricaoweb || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_descricaoauxiliar">Vendedor Site 2</label>
                    <input
                        type="text"
                        id="ven_descricaoauxiliar"
                        name="ven_descricaoauxiliar"
                        value={request.ven_descricaoauxiliar || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Quarta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_cep">CEP</label>
                    <input
                        type="text"
                        id="ven_cep"
                        name="ven_cep"
                        value={request.ven_cep || ''}
                        onChange={handleInputChange}
                        onBlur={handleCepApi}
                        maxLength={8} // Adicionado para limitar a quantidade de caracteres
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
                    />
                </div>
            </div>

            {/* Quinta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_bairro">Bairro</label>
                    <input
                        type="text"
                        id="ven_bairro"
                        name="ven_bairro"
                        value={request.ven_bairro || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_numero">Número</label>
                    <input
                        type="text"
                        id="ven_numero"
                        name="ven_numero"
                        value={request.ven_numero || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Sexta linha */}
            <div className="form-row">
                <div className="form-group full-width">
                    <label htmlFor="ven_endereco">Endereço</label>
                    <input
                        type="text"
                        id="ven_endereco"
                        name="ven_endereco"
                        value={request.ven_endereco || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Sétima linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_fone">Fone</label>
                    <input
                        type="text"
                        id="ven_fone"
                        name="ven_fone"
                        value={request.ven_fone || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_celular">Celular</label>
                    <input
                        type="text"
                        id="ven_celular"
                        name="ven_celular"
                        value={request.ven_celular || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Oitava linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ban_codigo">Banco</label>
                    <input
                        type="text"
                        id="ban_codigo"
                        name="ban_codigo"
                        value={request.ban_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_agencia">Agência</label>
                    <input
                        type="text"
                        id="ven_agencia"
                        name="ven_agencia"
                        value={request.ven_agencia || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_contacorrente">Conta Corrente</label>
                    <input
                        type="text"
                        id="ven_contacorrente"
                        name="ven_contacorrente"
                        value={request.ven_contacorrente || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_observacao">Observação</label>
                    <input
                        id="ven_observacao"
                        value={request.ven_observacao || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'680px',borderRadius:'4px' }}
                        onClick={onBackClick} // Chama a função passada como prop
                    />
                {/* Condição para renderizar o botão de exclusão */}
                {request.ven_codigo && (
                <Button
                    label="Excluir"
                    icon="pi pi-trash"
                    style={{marginLeft:'0px',color:'white',width:'100px'}}
                    type="button"
                    className="reset-btn"
                    onClick={handleDeleteClick}
                  />
                )}
                
                <button
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.ven_codigo ? '14px' : '0px',display: request.ven_codigo ? 'none' :''}}
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

export default Vendedor;

