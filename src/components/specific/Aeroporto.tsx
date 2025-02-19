import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AeroportoCreateRequest, UnidadesCreateRequest } from '../../utils/apiObjects';
import { useCodigo } from '../../contexts/CodigoProvider';
import { apiCreateAeroporto, apiDeleteUnidade, apiGetArea, apiGetAeroportoById, apiPostCreateUnidade, apiPutAeroporto, apiPutUpdateUnidade, apiGetCidade } from '../../services/Api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { cnpj } from 'cpf-cnpj-validator';
import { toastError, toastSucess } from '../../utils/customToast';
import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
import Select from 'react-select';
import { addTab, setActiveTab } from "../../hooks/tabSlice";
import { useSelector,useDispatch } from "react-redux";
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import IconButton from '@mui/material/IconButton';
import { RootState } from "../../hooks/store";

const Aeroporto: React.FC = ({ onBackClick }) => {
    const { setCodigo,codigo } = useCodigo();
    const [request, setRequest] = useState<AeroportoCreateRequest>({} as AeroportoCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [cep, setCep] = useState('');
    const [cnpjValido, setCnpjValido] = useState<boolean | null>(null);
    const [cidades, setCidades] = useState<{ label: string, value: number }[]>([]);
    const [aer_codigo, setVenCodigo] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const [uf, setUf] = useState("");
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);


    useEffect(() => {
        if (!activeTab || activeTab !== 'Aeroporto') {
            // Reseta o código se a aba não for "Agência"
            setCodigo(null);
            return; // Não executa a consulta
        }
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (activeTab !== 'Aeroporto') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);    
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetAeroportoById(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.aer_codigo); // Define o ID do vendedor

                if (unidade.loj_endereco) {
                    const enderecoParts = unidade.loj_endereco.split(",");
                    setRua(enderecoParts[0] || '');
                    setNumero(enderecoParts[1] || '');
                } else {
                    setRua('');
                    setNumero('');
                }

                setCidade(unidade.cid_codigo || '');
                setSelectedAreas(unidade.areasComerciais ? unidade.areasComerciais.map((area: any) => area.aco_codigo) : []);
                setChecked(unidade.loj_situacao === 1);

                const responseCidade = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${unidade.cid_codigo}`);
                setCidade(responseCidade.data.nome || '');
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                toastError("Erro ao buscar dados da unidade.");
            }
        };
        fetchData();
    }, [codigo, activeTab]);

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

    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));

        if (id === 'loj_cnpj') {
            setCnpjValido(cnpj.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleDeleteClick = () => {
        if (request.aer_codigo) {
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
        if (request.aer_codigo) {
            setLoading(true);
            try {
                await apiDeleteUnidade(request.aer_codigo);
                toastSucess("Cadastro excluído com sucesso.");
            } catch (error) {
                console.error('Erro ao excluir o cadastro:', error);
                toastError("Erro ao excluir o cadastro.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!request.aer_descricao) {
            toastError("O campo Sigla é obrigatório.");
            setLoading(false);
            return;
        }
        if (!request.cid_codigo) {
            toastError("O campo Cidade é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            const updatedRequest = {
                ...request, // Garante que `cid_codigo` esteja presente
            };
    
            let response;
            if (!updatedRequest.aer_codigo) {
                response = await apiCreateAeroporto(updatedRequest);
            } else {
                response = await apiPutAeroporto(updatedRequest.aer_codigo, updatedRequest);
            }
    
            if (response && (response.status === 200 || response.status === 201)) {
                toastSucess("Cadastro salvo com sucesso.");
                
                if (!updatedRequest.aer_codigo && response.data.aer_codigo) {
                    setRequest(prevState => ({ ...prevState, aer_codigo: response.data.aer_codigo }));
                }
            } else {
                toastError("Erro ao salvar o cadastro.");
            }
        } catch (error: any) {
            console.error("Erro:", error);
            toastError("Erro ao salvar o cadastro. Verifique os campos e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setRequest({} as AeroportoCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
        setCep('');
    };

    const handleSelectChange = (selectedOption: { label: string; value: number } | null) => {
        if (selectedOption) {
            console.log("Cidade selecionada:", selectedOption);
            setibge(selectedOption.value); // Atualiza o estado com o valor selecionado
        } else {
            setibge(null); // Reseta o valor se nada for selecionado
        }
    };

    const validCidades = cidades.filter((cidade) => cidade.label && cidade.value);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          if (searchTerm.length < 3) {
            e.preventDefault(); // Previne o submit se o termo for inválido
          }
        }
      };

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
        if (request.aer_codigo && request.cid_codigo) {
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
  }, [request.aer_codigo, request.cid_codigo]);



    return (
        <>
        <ToastContainer />
        <form className="erp-form" onSubmit={handleSubmit}>
            {/* Primeira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="aer_codigo">Código</label>
                    <input
                        disabled
                        type="text"
                        id="aer_codigo"
                        name="aer_codigo"
                        value={request.aer_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'120px'}} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="aer_descricao">Sigla Aeroporto</label>
                    <input
                        type="text"
                        id="aer_descricao"
                        name="aer_descricao"
                        value={request.aer_descricao || ''}
                        onChange={handleInputChange} 
                        style={{width:'499.4px'}}/>
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
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
                <div className="form-group" >
                    <label htmlFor="cid_estado">UF</label>
                    <input
                        style={{width:'60px'}}
                        type="text"
                        id="cid_estado"
                        name="cid_estado"
                        value={uf}
                        readOnly />
                </div>
            </div>

            {/* Terceira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="aer_fone">Fone</label>
                    <input
                        type="text"
                        id="aer_fone"
                        name="aer_fone"
                        value={request.aer_fone || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="aer_email">E-mail</label>
                    <input
                        type="text"
                        id="aer_email"
                        name="aer_email"
                        value={request.aer_email || ''}
                        onChange={handleInputChange} />
                </div>

            </div>

            {/* Quarta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="aer_observacao">Observação</label>
                    <input
                        type="text"
                        id="aer_observacao"
                        name="aer_observacao"
                        value={request.aer_observacao || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Botões */}
            <div className="form-row">
                <Button
                    label="Voltar"
                    icon="pi pi-arrow-left"
                    style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'680px',borderRadius:'4px' }}
                    onClick={onBackClick} // Chama a função passada como prop
                    type="button"
                />
                {/* Condição para renderizar o botão de exclusão */}
                {request.aer_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.aer_codigo ? '14px' : '0px',display: request.aer_codigo ? 'none' :''}}
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
        </>
    );
};

export default Aeroporto;
