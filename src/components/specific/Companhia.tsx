import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { CepCreateRequest, CidadeCreateRequest, CompanhiaCreateRequest, MoedaCreateRequest } from "../../utils/apiObjects";
import { apiCreateCompanhia, apiCreateMoeda, apiDeleteCep, apiDeleteCompanhia, apiDeleteMoeda, apiGetCompanhiaId, apiGetMoedaId, apiUpdateCompanhia, apiUpdateMoeda } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { RootState } from "../../hooks/store";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from 'primereact/checkbox';


const Companhia: React.FC = ({ onBackClick }) => {
    const { setCodigo,codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<CompanhiaCreateRequest>({} as CompanhiaCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState<boolean | null>(null);
    const [com_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedDuplicata, setSelectedDuplicata] = useState<number[]>([]);
    const [duplicatas, setDuplicatas] = useState<{ label: string, value: number }[]>([]);
    const [duplicata, setDuplicata] = useState('');
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);


    useEffect(() =>{
        if (request.com_divisao){
            setChecked(request.com_divisao === 'S');
        }
    },[request.com_divisao]);


    useEffect(() => {
        if (!activeTab || activeTab !== 'Companhia') {
            // Reseta o código se a aba não for "Agência"
            setCodigo(null);
            return; // Não executa a consulta
        }
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (activeTab !== 'Companhia') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetCompanhiaId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.com_codigo); // Define o ID do vendedor
                
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
                setChecked(unidade.com_divisao === 'S');

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
        if (com_codigo !== null && !showModal) { // Verifica se o modal não está aberto
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
        if (com_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteCompanhia(com_codigo);
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
    
        if (!request.com_descricao) {
            toastError("O campo Companhia Aerea é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.com_codigo) {
                response = await apiUpdateCompanhia(request.com_codigo, request);
            } else {
                const { com_codigo, ...newRequest } = request;
                response = await apiCreateCompanhia({...newRequest, com_divisao: checked ? 'S' : 'N'});
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Companhia salva com sucesso");

                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.com_codigo && response.data && response.data.com_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        com_codigo: response.data.com_codigo
                    }));
                    setVenCodigo(response.data.com_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar a Companhia");
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
        setRequest({} as CompanhiaCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
    };

    useEffect(() => {
        const fetchCentroCusto = async () => {
            try {
                const response = await  apiGetParceiro();
                const data = response.data;
                setDuplicata(data.par_codigo);
                setDuplicatas(data.map((area: { par_descricao: string; par_codigo: number }) => ({
                    label: area.par_descricao,
                    value: area.par_codigo
                })));
            } catch (error) {
                console.error("Erro ao buscar Fornecedor:", error);
                toastError("Erro ao buscar Fornecedor.");
            }
        };
        fetchCentroCusto();
    }, []);


    return (
        <form className="erp-form" onSubmit={handleSubmit}>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="com_codigo">Codigo</label>
                    <input
                        type="text"
                        id="com_codigo"
                        name="com_codigo"
                        value={request.com_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="com_divisao">Divisão de Taxa/Tarifa</label>
                    <Checkbox
                        id="com_divisao"
                        name="com_divisao"
                        value={request.com_divisao || ''}
                        onChange={e => setChecked(e.checked)} 
                        checked={checked}
                        style={{ width: '200px' }}
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="com_descricao">Companhia Aerea</label>
                    <input
                        type="text"
                        id="com_descricao"
                        name="com_descricao"
                        value={request.com_descricao || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="com_parcelaminima">Valor Parcela Minima</label>
                    <input
                        type="text"
                        id="com_parcelaminima"
                        name="com_parcelaminima"
                        value={request.com_parcelaminima || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group" >
                    <label htmlFor="cep_bairro">Codigo Companhia</label>
                    <input
                        type="text"
                        id="cep_bairro"
                        name="cep_bairro"
                        value={request.cep_bairro || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group" >
                    <label htmlFor="com_sigla">Sigla</label>
                    <input
                        type="text"
                        id="com_sigla"
                        name="com_sigla"
                        value={request.com_sigla || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="cep_uf">Fornecedor</label>
                    <Dropdown
                        id="par_codigo"
                        name="par_codigo"
                        value={selectedDuplicata} // Valor selecionado
                        options={duplicatas} // Lista de opções vinda do banco
                        onChange={(e) => setSelectedDuplicata(e.value)} // Atualiza o estado ao selecionar
                        optionLabel="label" // Campo para exibir
                        optionValue="value" // Campo para o valor interno
                        placeholder="Selecione um Fornecedor"
                        filter // Ativa o campo de busca
                        showClear // Botão para limpar o campo
                        filterPlaceholder="Pesquisar..." // Placeholder para a busca
                        className="w-full" // Classe CSS opcional
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
                {request.com_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.com_codigo ? '14px' : '0px',display: request.com_codigo ? 'none' :''}}
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

export default Companhia;
