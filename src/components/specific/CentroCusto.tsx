import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { CentroCustoCreateRequest} from "../../utils/apiObjects";
import { apiCreateCentroCusto, apiDeleteCentroCusto, apiGetCentroCustoId, apiUpdateCentroCusto, apiGetDuplicata, apiGetSubgrupo, } from "../../services/Api";
import { confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { useSelector } from "react-redux";
import { RootState } from "../../hooks/store";


const CentroCusto: React.FC = ({ onBackClick }) => {
    const { setCodigo,codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<CentroCustoCreateRequest>({} as CentroCustoCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [duplicata, setDuplicata] = useState('');
    const [duplicatas, setDuplicatas] = useState<{ label: string, value: number }[]>([]);
    const [selectedDuplicata, setSelectedDuplicata] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [cta_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAreaComercial, setSelectedAreaComercial] = useState<number | null>(null);
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

    useEffect(() => {
        if (!activeTab || activeTab !== 'Centro Custo') {
            // Reseta o código se a aba não for "Agência"
            setCodigo(null);
            return; // Não executa a consulta
        }
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (activeTab !== 'Centro Custo') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetCentroCustoId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.cta_codigo); // Define o ID do vendedor
                
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
        if (cta_codigo !== null && !showModal) { // Verifica se o modal não está aberto
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
        if (cta_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteCentroCusto(cta_codigo);
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
    
        if (!request.cta_descricao) {
            toastError("O campo Centro Custo é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.cta_codigo) {
                response = await apiUpdateCentroCusto(request.cta_codigo, request);
            } else {
                const { cta_codigo, ...newRequest } = request;
                response = await apiCreateCentroCusto(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Cidade salva com sucesso");
    
                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.cta_codigo && response.data && response.data.cta_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        ban_codigo: response.data.cta_codigo
                    }));
                    setVenCodigo(response.data.cta_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar o Centro Custo");
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
        setRequest({} as CentroCustoCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
    };

    useEffect(() => {
        const fetchAreasComerciais = async () => {
            try {
                const response = await  apiGetSubgrupo();
                const data = response.data;
                setAreaComercial(data.sbc_codigo);
                setAreasComerciais(data.map((area: { sbc_descricao: string; sbc_codigo: number }) => ({
                    label: area.sbc_descricao,
                    value: area.sbc_codigo
                })));
            } catch (error) {
                console.error("Erro ao buscar áreas comerciais:", error);
                toastError("Erro ao buscar áreas comerciais.");
            }
        };
        fetchAreasComerciais();
    }, []);

    useEffect(() => {
        const fetchCentroCusto = async () => {
            try {
                const response = await  apiGetDuplicata();
                const data = response.data;
                setDuplicata(data.tdu_codigo);
                setDuplicatas(data.map((area: { tdu_descricao: string; tdu_codigo: number }) => ({
                    label: area.tdu_descricao,
                    value: area.tdu_codigo
                })));
            } catch (error) {
                console.error("Erro ao buscar áreas comerciais:", error);
                toastError("Erro ao buscar áreas comerciais.");
            }
        };
        fetchCentroCusto();
    }, []);


    return (
        <form className="erp-form" onSubmit={handleSubmit}>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cta_codigo">Codigo</label>
                    <input
                        type="text"
                        id="cta_codigo"
                        name="cta_codigo"
                        value={request.cta_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
                <div className="form-group" style={{marginLeft:'-550px'}}>
                    <label htmlFor="cta_tipo">Tipo</label>
                    <Dropdown
                        id="tdu_codigo"
                        name="tdu_codigo"
                        value={selectedDuplicata} // Valor selecionado
                        options={duplicatas} // Lista de opções vinda do banco
                        onChange={(e) => setSelectedDuplicata(e.value)} // Atualiza o estado ao selecionar
                        optionLabel="label" // Campo para exibir
                        optionValue="value" // Campo para o valor interno
                        placeholder="Selecione um Tipo De Custo"
                        filter // Ativa o campo de busca
                        showClear // Botão para limpar o campo
                        filterPlaceholder="Pesquisar..." // Placeholder para a busca
                        className="w-full" // Classe CSS opcional
                        style={{width:'300px'}}
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cta_descricao">Centro Custo</label>
                    <input
                        type="text"
                        id="cta_descricao"
                        name="cta_descricao"
                        value={request.cta_descricao || ''}
                        onChange={handleInputChange}
                        style={{width:'100%'}}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="sbc_codigo">SubGrupo</label>
                    <Dropdown
                        id="sbc_codigo"
                        name="sbc_codigo"
                        value={selectedAreaComercial} // Valor selecionado
                        options={areasComerciais} // Lista de opções vinda do banco
                        onChange={(e) => setSelectedAreaComercial(e.value)} // Atualiza o estado ao selecionar
                        optionLabel="label" // Campo para exibir
                        optionValue="value" // Campo para o valor interno
                        placeholder="Selecione um SubGrupo"
                        filter // Ativa o campo de busca
                        showClear // Botão para limpar o campo
                        filterPlaceholder="Pesquisar..." // Placeholder para a busca
                        className="w-full" // Classe CSS opcional
                    />
                </div>
            </div>


            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cta_contabil">Codigo Contabil</label>
                    <input
                        type="text"
                        id="cta_codigocontabil"
                        name="cta_codigocontabil"
                        value={request.cta_codigocontabil || ''}
                        onChange={handleInputChange}
                        style={{width:'100%'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cta_justificativa">Tipo De Custo</label>
                    <input
                        type="text"
                        id="cta_tipo"
                        name="cta_tipo"
                        value={request.cta_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group" style={{ display: "block", alignItems: "center" }}>
                    <Checkbox id="cta_exclusivo" name="cta_exclusivo" style={{marginTop:'36px', marginLeft:'14px'}} />
                    <label htmlFor="cta_exclusivo" style={{ marginLeft: "8px",display:'inline' }}>Exclusivo</label>
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
                {request.cta_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.cta_codigo ? '14px' : '0px',display: request.cta_codigo ? 'none' :''}}
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

export default CentroCusto;
