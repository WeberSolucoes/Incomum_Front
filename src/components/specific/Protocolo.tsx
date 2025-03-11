import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { ProtocoloCreateRequest } from "../../utils/apiObjects";
import { apiCreateProtocolo, apiDeleteMoeda, apiGetMoeda,apiGetParceiro, apiGetProtocoloId, apiGetUnidadeRelatorioByUser, apiUpdateProtocolo } from "../../services/Api";
import { confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import InputMask from "react-input-mask";
import { RootState } from "../../hooks/store";
import { useSelector } from "react-redux";


const Protocolo: React.FC = ({ onBackClick }) => {
    const { setCodigo,codigo } = useCodigo(); // Ajuste conforme a origem do código
    const [request, setRequest] = useState<ProtocoloCreateRequest>({} as ProtocoloCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [prt_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedMoeda, setSelectedMoeda] = useState(null);
    const [selectedParceiro, setSelectedParceiro] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [fornecedor, setParceiro] = useState([]);
    const [moeda, setMoeda] = useState([]);
    const [formState, setFormState] = useState({
        prt_emprestimo: false, // Estado inicial do checkbox
    });
    const [checkedEmprestimo, setCheckedEmprestimo] = useState(false);
    const [checkedCusto, setCheckedCusto] = useState(false);
    const [dateValue, setDateValue] = useState(request.prt_datacadastro || "");
    const [dateValue2, setDateValue2] = useState(request.prt_dataprogramado || "");
    const [dateValue3, setDateValue3] = useState(request.prt_datacompetencia || "");
    const [dateValue4, setDateValue4] = useState(request.prt_anomescompetencia || "");
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);



    const handleChange = (event) => {
        setDateValue(event.target.value); // Atualiza o estado local
        handleInputChange(event); // Dispara a função externa
    };

    const handleChange2 = (event) => {
        setDateValue2(event.target.value); // Atualiza o estado local
        handleInputChange(event); // Dispara a função externa
    };

    const handleChange3 = (event) => {
        setDateValue3(event.target.value); // Atualiza o estado local
        handleInputChange(event); // Dispara a função externa
    };

    const handleChange4 = (event) => {
        setDateValue4(event.target.value); // Atualiza o estado local
        handleInputChange(event); // Dispara a função externa
    };

    useEffect(() => {
        if (!activeTab || activeTab !== 'Protocolo') {
            // Reseta o código se a aba não for "Protocolo"
            setCodigo(null);
            return; // Não executa a consulta
        }
    
        if (!codigo) return; // Evita rodar com código inválido
    
        console.log("✅ Buscando dados para código:", codigo);
        
        const fetchData = async () => {
            try {
                const response = await apiGetProtocoloId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.prt_codigo); // Define o ID do vendedor
                
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
                toastError("Erro ao buscar dados.");
            } 
        };
        fetchData();
    }, [codigo, activeTab]);

    useEffect(() => {
        console.log("🔄 Aba ativa:", activeTab || 'Ainda indefinida', "| Código:", codigo || 'Nenhum');
    }, [activeTab, codigo]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));

        if (id === 'ven_cpf') {
            setCpfValido(cpf.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleDeleteClick = () => {
        if (prt_codigo !== null && !showModal) { // Verifica se o modal não está aberto
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
        if (prt_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteMoeda(prt_codigo);
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
    
        if (!request.prt_numerodocumento) {
            toastError("O campo Numero Documento é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.prt_codigo) {
                response = await apiUpdateProtocolo(request.prt_codigo, request);
            } else {
                const { prt_codigo, ...newRequest } = request;
                response = await apiCreateProtocolo(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Protocolo salva com sucesso");

                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.prt_codigo && response.data && response.data.prt_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        prt_codigo: response.data.prt_codigo
                    }));
                    setVenCodigo(response.data.prt_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar o Protocolo");
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
        setRequest({} as ProtocoloCreateRequest);
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

    const handleMoedaChange = (e: { value: any }) => {
        setRequest(prevState => ({ ...prevState, moeda: e.value }));
        setSelectedMoeda(e.value); // Atualiza o estado da moeda selecionada
    };

    const handleFornecedorChange = (e: { value: any }) => {
        setRequest(prevState => ({ ...prevState, fornecedor: e.value }));
        setSelectedParceiro(e.value); // Atualiza o estado da moeda selecionada
    };

        

    const handleUnidadeChange = async (e) => {
        const unidadeId = e ? e.value : null;  // Verifica se há unidade selecionada, caso contrário, null
        setSelectedUnidade(unidadeId);
    
        try {
            let areasResponse;
            let vendedoresResponse;
    
            // Se houver uma unidade selecionada, busca áreas e vendedores associados
            if (unidadeId) {
                areasResponse = await axios.get(`http://127.0.0.1:8000/api/incomum/relatorio/list-all-areas/`, {
                    params: { unidade: unidadeId }
                });
    
                vendedoresResponse = await axios.get(`http://127.0.0.1:8000/api/incomum/relatorio/vendedor-by-user/`, {
                    params: { unidade: unidadeId }
                });
            } else {
                // Caso não haja unidade, busca todas as áreas comerciais e vendedores
                areasResponse = await axios.get('http://127.0.0.1:8000/api/incomum/relatorio/list-all-areas/');
                vendedoresResponse = await axios.get('http://127.0.0.1:8000/api/incomum/relatorio/vendedor-by-user/');
            }
    
        } catch (error) {
            toastError('Erro ao carregar as áreas comerciais e vendedores.');
            console.error('Erro ao fazer a requisição:', error);
        }
    };

    useEffect(() => {
        loadDadosIniciais();
    }, []);

    const loadDadosIniciais = async () => {
        setLoading(true);
        try {
            // Tenta carregar as unidades
            const unidadesResponse = await apiGetUnidadeRelatorioByUser();
            setUnidades(unidadesResponse.data.map(item => ({ label: item.loj_descricao, value: item.loj_codigo })));
        } catch (error) {
            toastError('Erro ao carregar as unidades');
        } 
        try {
            // Tenta carregar as unidades
            const fornecedorResponse = await apiGetParceiro();
            setParceiro(fornecedorResponse.data.map(item => ({ label: item.par_descricao, value: item.par_codigo })));
        }catch (error) {
            toastError('Erro ao carregar as unidades');
        }  
        try {
            // Tenta carregar as unidades
            const fornecedorResponse = await apiGetMoeda();
            setMoeda(fornecedorResponse.data.map(item => ({ label: item.moe_descricao, value: item.moe_codigo })));
        }
        catch (error) {
            toastError('Erro ao carregar os Fornecedores');
        }finally {
            setLoading(false);
        }
    };


    return (
        <form className="erp-form" onSubmit={handleSubmit}>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="prt_codigo">Codigo</label>
                    <input
                        type="text"
                        id="prt_codigo"
                        name="prt_codigo"
                        value={request.prt_codigo || ''}
                        onChange={handleInputChange}
                        disabled
                        style={{width:'100%'}}
                    />
                </div>
                <div className="form-group" >
                    <label htmlFor="prt_datacadastro">Data Lançamento</label>
                    <InputMask
                        mask="99/99/9999"
                        value={dateValue}
                        onChange={handleChange}
                        disabled
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="par_datacadastro"
                                name="par_datacadastro"
                                style={{
                                    width: "200px",
                                    height: "37.6px",
                                    backgroundColor: "#f0f0f0", // Cinza claro
                                    color: "#888", // Cinza escuro no texto
                                    border: "1px solid #ccc", // Borda mais discreta
                                    pointerEvents: "none", // Impede interação
                                    opacity: 0.7, // Deixa um pouco mais apagado
                                }}
                                placeholder=""
                            />
                        )}
                    </InputMask>
                </div>
                <div className="form-group" >
                    <label htmlFor="usr_codigo">Usuario Liberador</label>
                    <input
                        type="text"
                        id="usr_codigo"
                        name="usr_codigo"
                        value={request.usr_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'100%'}}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cid_codigo">Unidade</label>
                    <Dropdown
                        value={selectedUnidade} 
                        options={unidades} 
                        onChange={handleUnidadeChange}    // Atualiza as áreas comerciais ao mudar a unidade
                        placeholder="Unidade"
                        style={{
                            width: "100%",
                            textAlign: 'left',
                            height: "37.6px",
                            backgroundColor: "#f0f0f0", // Cinza claro
                            color: "#888", // Cinza escuro no texto
                            border: "1px solid #ccc", // Borda mais discreta
                            pointerEvents: "none", // Impede interação
                            opacity: 0.7, // Deixa um pouco mais apagado
                        }}
                        panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                        showClear
                        disabled  
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="prt_status">Situação</label>
                    <select style={{
                            width: "100%",
                            textAlign: 'left',
                            height: "37.6px",
                            backgroundColor: "#f0f0f0", // Cinza claro
                            color: "#888", // Cinza escuro no texto
                            border: "1px solid #ccc", // Borda mais discreta
                            pointerEvents: "none", // Impede interação
                            opacity: 0.7, // Deixa um pouco mais apagado
                        }} 
                        disabled 
                        id="age_situacao" 
                        name="age_situacao" 
                        value={request.prt_status || ''} 
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
                    <label htmlFor="par_codigo">Fornecedor</label>
                    <Dropdown
                        value={selectedParceiro} 
                        options={fornecedor} 
                        onChange={handleFornecedorChange}    // Atualiza as áreas comerciais ao mudar a unidade
                        placeholder="Fornecedor"
                        style={{
                            width: "100%",
                            textAlign: 'left',
                            height: "37.6px",
                            backgroundColor: "#f0f0f0", // Cinza claro
                            color: "#888", // Cinza escuro no texto
                            border: "1px solid #ccc", // Borda mais discreta
                            pointerEvents: "none", // Impede interação
                            opacity: 0.7, // Deixa um pouco mais apagado
                        }}
                        panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                        showClear
                        disabled  
                    />
                </div>
                <div className="form-group" >
                    <label htmlFor="prt_numerodocumento">Numero Documento</label>
                    <input
                        type="text"
                        id="prt_numerodocumento"
                        name="prt_numerodocumento"
                        value={request.prt_numerodocumento || ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="form-group" >
                    <label htmlFor="prt_notafiscal">Nota Fiscal</label>
                    <input
                        type="text"
                        id="prt_notafiscal"
                        name="prt_notafiscal"
                        value={request.prt_notafiscal || ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="moe_codigo">Moeda</label>
                    <Dropdown
                        id='moe_codigo'
                        value={selectedMoeda} 
                        options={moeda} 
                        onChange={handleMoedaChange}    // Atualiza as áreas comerciais ao mudar a unidade
                        placeholder="Moeda"
                        style={{
                            width: "100%",
                            textAlign: 'left',
                            height: "37.6px",
                            backgroundColor: "#f0f0f0", // Cinza claro
                            color: "#888", // Cinza escuro no texto
                            border: "1px solid #ccc", // Borda mais discreta
                            pointerEvents: "none", // Impede interação
                            opacity: 0.7, // Deixa um pouco mais apagado
                        }}
                        panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                        showClear
                        disabled  
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="prt_dataprogramado">Data Previsão</label>
                    <InputMask
                        mask="99/99/9999"
                        value={dateValue2}
                        onChange={handleChange2}
                        disabled
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="par_dataprogramado"
                                name="par_dataprogramado"
                                style={{
                                    width: "200px",
                                    height: "37.6px",
                                    backgroundColor: "#f0f0f0", // Cinza claro
                                    color: "#888", // Cinza escuro no texto
                                    border: "1px solid #ccc", // Borda mais discreta
                                    pointerEvents: "none", // Impede interação
                                    opacity: 0.7, // Deixa um pouco mais apagado
                                }}
                                placeholder=""
                            />
                        )}
                    </InputMask>
                </div>
                <div className="form-group" >
                    <label htmlFor="prt_anomescompetencia">Mes/Ano Base</label>
                    <InputMask
                        mask="99/99/9999"
                        value={dateValue4}
                        onChange={handleChange4}
                        disabled
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="par_anomescompetencia"
                                name="par_anomescompetencia"
                                style={{
                                    width: "200px",
                                    height: "37.6px",
                                    backgroundColor: "#f0f0f0", // Cinza claro
                                    color: "#888", // Cinza escuro no texto
                                    border: "1px solid #ccc", // Borda mais discreta
                                    pointerEvents: "none", // Impede interação
                                    opacity: 0.7, // Deixa um pouco mais apagado
                                }}
                                placeholder=""
                            />
                        )}
                    </InputMask>
                </div>
                <div className="form-group" >
                    <label htmlFor="prt_cheque">Cheque</label>
                    <input
                        type="text"
                        id="prt_cheque"
                        name="prt_cheque"
                        value={request.prt_cheque || ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="prt_numeropagamento">Numero Pagamento</label>
                    <input
                        type="text"
                        id="prt_numeropagamento"
                        name="prt_numeropagamento"
                        value={request.prt_numeropagamento || ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
            </div>


            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="prt_datacompetencia">Data Competencia</label>
                    <InputMask
                        mask="99/99/9999"
                        value={dateValue3}
                        onChange={handleChange3}
                        disabled
                    >
                        {(inputProps) => (
                            <input
                                {...inputProps}
                                type="text"
                                id="par_datacompetencia"
                                name="par_datacompetencia"
                                style={{
                                    width: "200px",
                                    height: "37.6px",
                                    backgroundColor: "#f0f0f0", // Cinza claro
                                    color: "#888", // Cinza escuro no texto
                                    border: "1px solid #ccc", // Borda mais discreta
                                    pointerEvents: "none", // Impede interação
                                    opacity: 0.7, // Deixa um pouco mais apagado
                                }}
                                placeholder=""
                            />
                        )}
                    </InputMask>
                </div>
                <div className="form-group" style={{ display: "block", alignItems: "center" }}>
                    <Checkbox disabled onChange={e => setCheckedEmprestimo(e.checked)} checked={checkedEmprestimo} id="prt_emprestimo" name="prt_emprestimo" style={{marginTop:'36px', marginLeft:'14px'}} />
                    <label htmlFor="prt_emprestimo" style={{ marginLeft: "8px",display:'inline' }}>Demonst Emprestimo</label>
                </div>
                <div className="form-group" style={{ display: "block", alignItems: "center" }}>
                    <Checkbox disabled onChange={e => setCheckedCusto(e.checked)} checked={checkedCusto} id="prt_custoindireto" name="prt_custoindireto" style={{marginTop:'36px', marginLeft:'14px'}} />
                    <label htmlFor="prt_custoindireto" style={{ marginLeft: "8px",display:'inline' }}>Custo Indireto</label>
                </div>
                <div className="form-group" >
                    <label htmlFor="prt_valor">Valor Total</label>
                    <input
                        type="text"
                        id="prt_valor"
                        name="prt_valor"
                        value={request.prt_valor || ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="prt_observacao">Historico</label>
                    <input
                        type="text"
                        id="prt_observacao"
                        name="prt_observacao"
                        value={request.prt_observacao|| ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
            </div>


            <div className="form-row">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'908px',borderRadius:'4px' }}
                        onClick={onBackClick} // Chama a função passada como prop
                    />
            </div>
        </form>
    );
};

export default Protocolo;
