import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { CepCreateRequest, CidadeCreateRequest, MoedaCreateRequest } from "../../utils/apiObjects";
import { apiCreateCep, apiDeleteCep, apiGetCepId, apiUpdateCep } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import Select from 'react-select';
import { addTab, setActiveTab } from "../../hooks/tabSlice";
import { useDispatch, useSelector } from "react-redux";
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import IconButton from '@mui/material/IconButton';


const Cep: React.FC = ({ onBackClick }) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<CepCreateRequest>({} as CepCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [cep_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cidades, setCidades] = useState<{ label: string, value: number }[]>([]);
    const dispatch = useDispatch();
    const [uf, setUf] = useState(""); 

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetCepId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.cep_codigo); // Define o ID do vendedor
                
                if (unidade.loj_endereco) {
                    const enderecoParts = unidade.loj_endereco.split(",");
                    setRua(enderecoParts[0] || '');
                    setNumero(enderecoParts[1] || '');
                } else {
                    setRua('');
                    setNumero('');
                }

                setCidade(unidade.cid_codigo || '');
                if (Array.isArray(unidade.areasComerciais)) {
                    setSelectedAreas(unidade.areasComerciais.map((area: any) => area.aco_codigo));
                } else {
                    setSelectedAreas([]);
                }
                setChecked(unidade.loj_situacao === 1);

                const responseCidade = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${unidade.cid_codigo}`);
                setCidade(responseCidade.data.nome || '');
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                toastError("Erro ao buscar dados do Cep.");
            }
        };
        fetchData();
    }, [codigo]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));

        if (id === 'ven_cpf') {
            setCpfValido(cpf.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleDeleteClick = () => {
        if (cep_codigo !== null && !showModal) { // Verifica se o modal não está aberto
            setShowModal(true); // Abre o modal
            confirmDialog({
                message: 'Tem certeza de que deseja excluir este cadastro?',
                header: 'Confirmar Exclusão',
                icon: 'pi pi-exclamation-triangle',
                accept: handleConfirmDelete,
                reject: () => {
                    setShowModal(false); // Fecha o modal se a exclusão for cancelada
                    console.log('Exclusão cancelada');
                },
                acceptLabel: 'Sim, desejo excluir',
                rejectLabel: 'Cancelar',
                className: 'custom-confirm-dialog',
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (cep_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteCep(cep_codigo);
                toast.success('Cadastro excluído com sucesso.');

                // Limpa os campos do formulário após exclusão
                handleReset();
            } catch (error) {
                toastError('Erro ao excluir o cadastro.');
                console.error('Erro ao excluir o cadastro:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        if (!request.cep_logradouro) {
            toastError("O campo Logradouro é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            let newRequest = { ...request };
    
            if (!request.cid_codigo) {
                toastError("O campo Cidade é obrigatório.");
                setLoading(false);
                return;
            }
    
            if (request.cep_codigo) {
                response = await apiUpdateCep(request.cep_codigo, newRequest);
            } else {
                // Remove `cep_codigo` ao criar um novo registro
                const { cep_codigo, ...requestData } = newRequest;
                response = await apiCreateCep(requestData);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Cep salvo com sucesso");
    
                if (!request.cep_codigo && response.data) {
                    setRequest(prev => ({
                        ...prev,
                        cep_codigo: response.data.cep_codigo, // Certifique-se de salvar o novo CEP
                        cid_codigo: response.data.cid_codigo || prev.cid_codigo, // Corrige a atualização do cid_codigo
                    }));
    
                    setVenCodigo(response.data.cid_codigo || ""); // Atualize também o estado de cidade
                }
            } else {
                toastError("Erro ao salvar o Cep");
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

    const handleReset = () => {
        setRequest({} as CepCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
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
            const response = await axios.get(`https://api.incoback.com.br/api/incomum/cidade/find-byid/${cid_codigo}/`);
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
            if (request.cep_codigo && request.cid_codigo) {
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
      }, [request.cep_codigo, request.cid_codigo]);


    return (
        <form className="erp-form" onSubmit={handleSubmit}>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cep_codigo">Codigo</label>
                    <input
                        type="text"
                        id="cep_codigo"
                        name="cep_codigo"
                        value={request.cep_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cep_numero">Cep</label>
                    <input
                        type="text"
                        id="cep_numero"
                        name="cep_numero"
                        value={request.cep_numero || ''}
                        onChange={handleInputChange}
                        style={{width:'40%'}}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="cep_logradouro">Logradouro</label>
                    <input
                        type="text"
                        id="cep_logradouro"
                        name="cep_logradouro"
                        value={request.cep_logradouro || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="cep_bairro">Bairro</label>
                    <input
                        type="text"
                        id="cep_bairro"
                        name="cep_bairro"
                        value={request.cep_bairro || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                {/* Label e Botão alinhados horizontalmente */}
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
                    isLoading={loading}
                    options={cidades}
                    onInputChange={(inputValue, { action }) => {
                        if (action === "input-change") {
                            setSearchTerm(inputValue); // Atualiza o termo de pesquisa
                            fetchUnidades(inputValue.toUpperCase()); // Faz a chamada à API
                        }
                    }}
                    onChange={handleCidadeChange}
                    value={cidades.find(cidade => cidade.value === request.cid_codigo) || null}
                    placeholder="Selecione uma Cidade"
                    styles={{width:'300px'}}
                    />
                </div>
                {/* Campo UF */}
                <div className="form-group" style={{marginLeft:'10px'}}>
                    <label htmlFor="cep_uf">Uf</label>
                    <input
                    type="text"
                    id="cep_uf"
                    name="cep_uf"
                    value={uf}    
                    readOnly
                    style={{ width: "80px" }}
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
                {request.cep_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.cep_codigo ? '14px' : '0px',display: request.cep_codigo ? 'none' :''}}
                    type="button"
                    className="reset-btn"
                    onClick={handleReset}
                >
                    <i className="fas fa-trash-alt"></i> Limpar
                </button>
                <button style={{width:'100px',height:'34px',padding:'inherit'}} disabled={loading} type="submit" className="submit-btn"><i style={{marginRight:'10px'}}className="fas fa-save"></i>{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
        </form>
    );
};

export default Cep;
