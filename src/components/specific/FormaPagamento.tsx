import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { CidadeCreateRequest, DepartamentoCreateRequest, FormaDePagamentoCreateRequest } from "../../utils/apiObjects";
import { apiCreateCidade, apiCreateDepartamento, apiCreateFormaPagamento, apiDeleteCidade, apiDeleteDepartamento, apiDeleteFormaPagamento, apiGetCidadeId, apiGetDepartamentoId, apiGetFormaPagamentoId, apiUpdateCidade, apiUpdateDepartamento, apiUpdateFormaPagamento } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { RootState } from "../../hooks/store";


const FormaPagamento: React.FC = ({ onBackClick }) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<FormaDePagamentoCreateRequest>({} as FormaDePagamentoCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [for_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

    useEffect(() => {
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (!activeTab) return; // 🔍 Espera até `activeTab` estar definido
        if (activeTab !== 'Forma Pagamento') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetFormaPagamentoId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.for_codigo); // Define o ID do vendedor
                
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
                toastError("Erro ao buscar dados do Cidade.");
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
        if (for_codigo !== null && !showModal) { // Verifica se o modal não está aberto
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
        if (for_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteFormaPagamento(for_codigo);
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
    
        if (!request.for_descricao) {
            toastError("O campo Forma De Pagamento é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.for_codigo) {
                response = await apiUpdateFormaPagamento(request.for_codigo, request);
            } else {
                const { for_codigo, ...newRequest } = request;
                response = await apiCreateFormaPagamento(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Forma de Pagamento salva com sucesso");
    
                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.for_codigo && response.data && response.data.for_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        for_codigo: response.data.for_codigo
                    }));
                    setVenCodigo(response.data.for_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar a Forma de Pagamento");
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
        setRequest({} as FormaDePagamentoCreateRequest);
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
                    <label htmlFor="for_codigo">Codigo</label>
                    <input
                        type="text"
                        id="for_codigo"
                        name="for_codigo"
                        value={request.for_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="for_descricao">Forma Pagamento</label>
                    <input
                        type="text"
                        id="for_descricao"
                        name="for_descricao"
                        value={request.for_descricao || ''}
                        onChange={handleInputChange}
                        style={{width:'100%'}}
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
                {request.for_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.for_codigo ? '14px' : '0px',display: request.for_codigo ? 'none' :''}}
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

export default FormaPagamento;
