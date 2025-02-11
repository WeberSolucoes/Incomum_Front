import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { PaisCreateRequest } from "../../utils/apiObjects";
import { apiCreatePais, apiDeletePais, apiDeleteVendedor, apiGetArea, apiGetPais, apiGetPaisId, apiGetVendedorById, apiPostCreateVendedor, apiPutUpdateVendedor, apiUpdatePais } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";

const Pais: React.FC = ({onBackClick}) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<PaisCreateRequest>({} as PaisCreateRequest);
    const [rua, setRua] = useState(''); 
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [pai_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetPaisId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.pai_codigo); // Define o ID do vendedor
                
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
                toastError("Erro ao buscar dados do País.");
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



    const handleDeleteClick = () => {
        if (pai_codigo !== null) { // Verifica se ven_codigo não é nulo
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
        if (pai_codigo !== null) { // Verifica se ven_codigo não é nulo
            setLoading(true);
            try {
                await apiDeletePais(pai_codigo);
                toast.success('Cadastro excluído com sucesso.');
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
    
        // Verificação se o campo pai_descricao está preenchido
        if (!request.pai_descricao) {
            toastError("O campo Países é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.pai_codigo) {
                // Atualizar registro existente
                response = await apiUpdatePais(request.pai_codigo, request);
            } else {
                // Criar novo registro
                const { pai_codigo, ...newRequest } = request; // Remove pai_codigo
                response = await apiCreatePais(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("País salvo com sucesso");
    
                // Atualiza o estado do `pai_codigo` com o valor retornado na resposta
                if (!request.pai_codigo && response.data && response.data.pai_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        pai_codigo: response.data.pai_codigo
                    }));
                }
            } else {
                toastError("Erro ao salvar o País");
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
        setRequest({} as PaisCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
    };


    return (
        <form className="erp-form" onSubmit={handleSubmit}>
            {/* Primeira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="pai_codigo">Código</label>
                    <input
                        style={{width:'120px'}}
                        disabled
                        type="text"
                        id="pai_codigo"
                        name="pai_codigo"
                        value={request.pai_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="pai_descricao">Países</label>
                    <input
                        type="text"
                        id="pai_descricao"
                        name="pai_descricao"
                        value={request.pai_descricao || ''}
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
                {request.pai_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.pai_codigo ? '14px' : '0px',display: request.pai_codigo ? 'none' :''}}
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

export default Pais;
