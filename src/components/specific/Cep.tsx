import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { CepCreateRequest, CidadeCreateRequest, MoedaCreateRequest } from "../../utils/apiObjects";
import { apiCreateMoeda, apiDeleteCep, apiDeleteMoeda, apiGetMoedaId, apiUpdateMoeda } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import Select from 'react-select';
import { addTab, setActiveTab } from "../../hooks/tabSlice";
import { useDispatch } from "react-redux";


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

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetMoedaId(codigo);
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
            if (request.cep_codigo) {
                response = await apiUpdateMoeda(request.cep_codigo, request);
            } else {
                const { cep_codigo, ...newRequest } = request;
                response = await apiCreateMoeda(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Cep salvo com sucesso");

                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.cep_codigo && response.data && response.data.cep_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        cid_codigo: response.data.cep_codigo
                    }));
                    setVenCodigo(response.data.cep_codigo); // Atualize também o estado `cid_codigo`
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
                `http://127.0.0.1:8000/api/incomum/cidade/search/`,
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
  
  
    const handleCidadeChange = (selectedOption: { label: string; value: number } | null) => {
      if (selectedOption) {
          console.log("Cidade selecionada:", selectedOption);
          setibge(selectedOption.value); // Atualiza o estado com o valor selecionado
      } else {
          setibge(null); // Reseta o valor se nada for selecionado
      }
    };


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
                    <label htmlFor="cep_logradouro">Cep</label>
                    <input
                        type="text"
                        id="cep_logradouro"
                        name="cep_logradouro"
                        value={request.cep_logradouro || ''}
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
                <div className="align-items-center mb-2">
                    <label htmlFor="cid_codigo" className="mr-2">
                    Cidade
                    </label>
                    <button
                    type="button"
                    className="btn btn-link p-0 ml-1"
                    onClick={() => {
                        // Adiciona a aba Cidade e troca para ela
                        dispatch(setActiveTab('Cidade')); // Troca para a aba Cidade
                        dispatch(addTab({ key: 'Cidade', title: 'Cidade', state: {} })); // Adiciona a aba no Redux
                    }}
                    style={{
                        fontSize: "1.5rem",
                        color: "#007bff",
                        textDecoration: "none",
                        border: "none",
                        background: "none",
                        height:'20px',
                        marginTop:'-22px',
                    }}
                    >
                    +
                    </button>
                    <Select
                    id="cid_codigo"
                    name="cid_codigo"
                    isClearable
                    isLoading={loading}
                    options={cidades}
                    onInputChange={(inputValue, { action }) => {
                        if (action === "input-change" && inputValue.length >= 3) {
                        fetchUnidades(inputValue);
                        } else if (inputValue.length < 3) {
                        setCidades([]);
                        }
                    }}
                    onChange={handleCidadeChange}
                    value={cidades.find((option) => option.value === ibge) || null}
                    placeholder="Selecione uma Cidade"
                    styles={{width:'300px'}}
                    />
                </div>
                {/* Campo UF */}
                <div className="form-group">
                    <label htmlFor="cep_uf">Uf</label>
                    <input
                    type="text"
                    id="cep_uf"
                    name="cep_uf"
                    onChange={handleInputChange}
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
                    <i className="fas fa-trash-alt"></i>{loading ? "Excluindo..." : "Excluir"}
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
