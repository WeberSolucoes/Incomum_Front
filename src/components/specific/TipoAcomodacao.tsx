import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { AcomodacaoCreateRequest, CepCreateRequest, CidadeCreateRequest, CompanhiaCreateRequest, MoedaCreateRequest } from "../../utils/apiObjects";
import { apiCreateAcomodacao, apiCreateCompanhia, apiCreateMoeda, apiDeleteAcomodacao, apiDeleteCep, apiDeleteCompanhia, apiDeleteMoeda, apiGetAcomodacaoId, apiGetCompanhiaId, apiGetMoedaId, apiUpdateAcomodacao, apiUpdateCompanhia, apiUpdateMoeda } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { RootState } from "../../hooks/store";

const TipoAcomodacao: React.FC = ({ onBackClick }) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<AcomodacaoCreateRequest>({} as AcomodacaoCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [tac_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

    useEffect(() => {
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (!activeTab) return; // 🔍 Espera até `activeTab` estar definido
        if (activeTab !== 'Tipo Acomodação') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);
        
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetAcomodacaoId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.tac_codigo); // Define o ID do vendedor
                
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
    }, [codigo, activeTab]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));

        if (id === 'ven_cpf') {
            setCpfValido(cpf.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleDeleteClick = () => {
        if (tac_codigo !== null && !showModal) { // Verifica se o modal não está aberto
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
        if (tac_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteAcomodacao(tac_codigo);
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
    
        if (!request.tac_descricao) {
            toastError("O campo Tipo Acomodação é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.tac_codigo) {
                response = await apiUpdateAcomodacao(request.tac_codigo, request);
            } else {
                const { tac_codigo, ...newRequest } = request;
                response = await apiCreateAcomodacao(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Acomodação salva com sucesso");

                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.tac_codigo && response.data && response.data.tac_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        tac_codigo: response.data.tac_codigo
                    }));
                    setVenCodigo(response.data.tac_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar a Acomodação");
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
        setRequest({} as AcomodacaoCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
    };


    return (
        <form className="erp-form" onSubmit={handleSubmit}>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tac_codigo">Codigo</label>
                    <input
                        type="text"
                        id="tac_codigo"
                        name="tac_codigo"
                        value={request.tac_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
                <div className="form-group" style={{marginLeft:'500px'}}>
                    <label htmlFor="tac_qtde">Qtde Hospedes</label>
                    <input
                        type="text"
                        id="tac_qtde"
                        name="tac_qtde"
                        value={request.tac_qtde || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tac_descricao">Tipo Acomodação</label>
                    <input
                        type="text"
                        id="tac_descricao"
                        name="tac_descricao"
                        value={request.tac_descricao || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="tac_descricaoportugues">Descrição Portugues</label>
                    <input
                        type="text"
                        id="tac_descricaoportugues"
                        name="tac_descricaoportugues"
                        value={request.tac_descricaoportugues || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="tac_descricaoingles">Descrição Ingles</label>
                    <input
                        type="text"
                        id="tac_descricaoingles"
                        name="tac_descricaoingles"
                        value={request.tac_descricaoingles || ''}
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
                {request.tac_codigo && (
                <button
                    style={{marginLeft:'0px',color:'white',width:'100px'}}
                    type="button"
                    className="reset-btn"
                    onClick={handleDeleteClick}
                    disabled={loading}
                >
                    <i className="fas fa-trash-alt"></i>{' '}
                    {loading ? <span>Excluir</span> : "Excluir"}
                </button>
                )}
                
                <button
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.tac_codigo ? '14px' : '0px',display: request.tac_codigo ? 'none' :''}}
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

export default TipoAcomodacao;
