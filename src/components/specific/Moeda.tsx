import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { CidadeCreateRequest, MoedaCreateRequest } from "../../utils/apiObjects";
import { apiCreateMoeda, apiDeleteMoeda, apiGetMoedaId, apiUpdateMoeda } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";


const Moeda: React.FC = ({ onBackClick }) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<MoedaCreateRequest>({} as MoedaCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [moe_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetMoedaId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.moe_codigo); // Define o ID do vendedor
                
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
                toastError("Erro ao buscar dados da Moeda.");
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
        if (moe_codigo !== null && !showModal) { // Verifica se o modal não está aberto
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
        if (moe_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteMoeda(moe_codigo);
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
    
        if (!request.moe_descricao) {
            toastError("O campo Descrição é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.moe_codigo) {
                response = await apiUpdateMoeda(request.moe_codigo, request);
            } else {
                const { moe_codigo, ...newRequest } = request;
                response = await apiCreateMoeda(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Moeda salva com sucesso");

                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.moe_codigo && response.data && response.data.moe_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        cid_codigo: response.data.moe_codigo
                    }));
                    setVenCodigo(response.data.moe_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar a Moeda");
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
        setRequest({} as MoedaCreateRequest);
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
                    <label htmlFor="moe_codigo">Codigo</label>
                    <input
                        type="text"
                        id="moe_codigo"
                        name="moe_codigo"
                        value={request.moe_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
                <div className="form-group" style={{marginLeft:'-600px'}}>
                    <label htmlFor="moe_codigogeral">Codigo Internacional</label>
                    <input
                        type="text"
                        id="moe_codigogeral"
                        name="moe_codigogeral"
                        value={request.moe_codigogeral || ''}
                        onChange={handleInputChange}
                        style={{width:'40%'}}
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="moe_descricao">Descrição</label>
                    <input
                        type="text"
                        id="moe_descricao"
                        name="moe_descricao"
                        value={request.moe_descricao || ''}
                        onChange={handleInputChange}
                        style={{width:'100%'}}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="moe_abreviacao">Abreviação</label>
                    <input
                        type="text"
                        id="moe_abreviacao"
                        name="moe_abreviacao"
                        value={request.moe_abreviacao || ''}
                        onChange={handleInputChange}
                        style={{width:'250px'}}
                    />
                </div>
                <div className="form-group" style={{marginLeft:'-500px'}}>
                    <label htmlFor="moe_simbolo">Simbolo</label>
                    <input
                        type="text"
                        id="moe_simbolo"
                        name="moe_simbolo"
                        value={request.moe_simbolo || ''}
                        onChange={handleInputChange}
                        style={{width:'250px'}}
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
                {request.moe_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.moe_codigo ? '14px' : '0px',display: request.moe_codigo ? 'none' :''}}
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

export default Moeda;
