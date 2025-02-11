import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { ServicoTuristicoCreateRequest, SituacaoTuristicoCreateRequest } from "../../utils/apiObjects";
import { apiCreateServicoTuristico, apiCreateSituacaoTuristico, apiDeleteServicoTuristico, apiDeleteSituacaoTuristico,apiGetCidade,apiGetServicoTuristicoId,apiGetSituacaoTuristicoId, apiUpdateServicoTuristico } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";


const ServicoTuristico: React.FC = ({ onBackClick }) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<ServicoTuristicoCreateRequest>({} as ServicoTuristicoCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [ser_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [Cidade, setCidades] = useState<{ label: string, value: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetServicoTuristicoId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.ser_codigo); // Define o ID do vendedor
                
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
    }, [codigo]);

    
    useEffect(() => {
        const fetchUnidades = async () => {
            try {
                const response = await apiGetCidade();
                const data = response.data;
                setCidades(data.map((area: { cid_descricao: string; cid_codigo: number }) => ({
                    label: area.cid_descricao,
                    value: area.cid_codigo
                })));
            } catch (error) {
                console.error("Erro ao buscar áreas comerciais:", error);
                toastError("Erro ao buscar áreas comerciais.");
            }
        };
        fetchUnidades();
    }, []);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));

        if (id === 'ven_cpf') {
            setCpfValido(cpf.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleDeleteClick = () => {
        if (ser_codigo !== null && !showModal) { //Verifica se o modal não está aberto
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
        if (ser_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteServicoTuristico(ser_codigo);
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
    
        if (!request.ser_descricao) {
            toastError("O campo Descrição é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.ser_codigo) {
                response = await apiUpdateServicoTuristico(request.ser_codigo, request);
            } else {
                const { ser_codigo, ...newRequest } = request;
                response = await apiCreateServicoTuristico(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Serviço Turistico salvo com sucesso");
    
                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.ser_codigo && response.data && response.data.ser_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        ser_codigo: response.data.ser_codigo
                    }));
                    setVenCodigo(response.data.ser_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar Serviço Turistico");
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
        setRequest({} as ServicoTuristicoCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };

    return (
        <form className="erp-form" onSubmit={handleSubmit}>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ser_codigo">Codigo</label>
                    <input
                        type="text"
                        id="ser_codigo"
                        name="ser_codigo"
                        value={request.ser_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ser_descricao">Situação Turistico</label>
                    <input
                        type="text"
                        id="ser_descricao"
                        name="ser_descricao"
                        value={request.ser_descricao || ''}
                        onChange={handleInputChange}
                        style={{width:'100%'}}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cid_codigo">Cidade</label>
                    <Dropdown
                        id="cid_codigo"
                        value={request.cid_codigo || null} // Valor selecionado
                        options={Cidade} // Opções estáticas
                        onChange={(e) => handleSelectChange(e)} // Callback ao alterar valor
                        optionLabel="label" // Nome exibido no dropdown
                        optionValue="value" // Valor interno enviado
                        placeholder="Selecione uma Cidade"
                        showClear // Botão para limpar
                        filter // Ativa a busca
                        className="w-full"
                        style={{width:'500px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ser_livre">UF</label>
                    <input
                        type="text"
                        id="ser_livre"
                        name="ser_livre"
                        value={request.ser_livre || ''}
                        onChange={handleInputChange}
                        style={{width:'80px'}}
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
                {request.ser_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.ser_codigo ? '14px' : '0px',display: request.ser_codigo ? 'none' :''}}
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

export default ServicoTuristico;
