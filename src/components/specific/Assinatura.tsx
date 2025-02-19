import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { AssinaturaCreateRequest, CepCreateRequest, CidadeCreateRequest, CompanhiaCreateRequest, MoedaCreateRequest } from "../../utils/apiObjects";
import { apiCreateAssinatura, apiCreateCompanhia, apiCreateMoeda, apiDeleteAssinatura, apiDeleteCep, apiDeleteCompanhia, apiDeleteMoeda, apiGetAssinaturaId, apiGetCompanhia, apiGetCompanhiaId, apiGetMoedaId, apiGetUnidades, apiUpdateAssinatura, apiUpdateCompanhia, apiUpdateMoeda } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";
import { RootState } from "../../hooks/store";



const Assinatura: React.FC = ({ onBackClick }) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<AssinaturaCreateRequest>({} as AssinaturaCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [Unidades, setUnidades] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [ass_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const activeTab = useSelector((state: RootState) => state.tabs.activeTab);


    const tiposVencimento = [
        { label: "Semanal", value: "s" },
        { label: "Mensal", value: "m" },
        { label: "Quinzenal", value: "q" },
        { label: "Anual", value: "a" },
    ];

    useEffect(() => {
        if (!activeTab || activeTab !== 'Assinatura') {
            // Reseta o código se a aba não for "Agência"
            setCodigo(null);
            return; // Não executa a consulta
        }
        if (!codigo) return; // 🔍 Evita rodar com código inválido
        if (activeTab !== 'Assinatura') return; // 🔍 Só roda na aba certa

        console.log("✅ Buscando dados para código:", codigo);
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetAssinaturaId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.ass_codigo); // Define o ID do vendedor
                
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

    useEffect(() => {
        const fetchAreasComerciais = async () => {
            try {
                const response = await apiGetCompanhia();
                const data = response.data;
                setAreasComerciais(data.map((area: { com_descricao: string; com_codigo: number }) => ({
                    label: area.com_descricao,
                    value: area.com_codigo
                })));
            } catch (error) {
                console.error("Erro ao buscar áreas comerciais:", error);
                toastError("Erro ao buscar áreas comerciais.");
            }
        };
        fetchAreasComerciais();
    }, []);

    useEffect(() => {
        const fetchUnidades = async () => {
            try {
                const response = await apiGetUnidades();
                const data = response.data;
                setUnidades(data.map((area: { loj_descricao: string; loj_codigo: number }) => ({
                    label: area.loj_descricao,
                    value: area.loj_codigo
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
        if (ass_codigo !== null && !showModal) { // Verifica se o modal não está aberto
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
        if (ass_codigo !== null) {
            setLoading(true);
            try {
                await apiDeleteAssinatura(ass_codigo);
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

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        if (!request.ass_descricao) {
            toastError("O campo Logradouro é obrigatório.");
            setLoading(false);
            return;
        }
    
        try {
            let response;
            if (request.ass_codigo) {
                response = await apiUpdateAssinatura(request.ass_codigo, request);
            } else {
                const { ass_codigo, ...newRequest } = request;
                response = await apiCreateAssinatura(newRequest);
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Assinatura salva com sucesso");

                // Atualize o `cid_codigo` no estado após criação bem-sucedida
                if (!request.ass_codigo && response.data && response.data.ass_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        ass_codigo: response.data.ass_codigo
                    }));
                    setVenCodigo(response.data.ass_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar a Assinatura");
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
        setRequest({} as AssinaturaCreateRequest);
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
                    <label htmlFor="ass_codigo">Codigo</label>
                    <input
                        type="text"
                        id="ass_codigo"
                        name="ass_codigo"
                        value={request.ass_codigo || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        disabled
                    />
                </div>
                <div className="form-group" style={{marginLeft:'-490px'}}>
                    <label htmlFor="ass_codigocontabil">Codigo Contabil</label>
                    <input
                        type="text"
                        id="ass_codigocontabil"
                        name="ass_codigocontabil"
                        value={request.ass_codigocontabil || ''}
                        onChange={handleInputChange}
                        style={{width:'200px'}}
                        
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ass_descricao">Assinatura</label>
                    <input
                        type="text"
                        id="ass_descricao"
                        name="ass_descricao"
                        value={request.ass_descricao || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="com_codigo">Companhia</label>
                    <Dropdown
                        id="com_codigo"
                        name="com_codigo"
                        value={request.com_codigo || null} // Valor selecionado
                        options={areasComerciais} // Dados para o Dropdown
                        onChange={(e) => handleSelectChange(e)} // Ação ao selecionar uma opção
                        optionLabel="label" // Campo para exibir
                        optionValue="value" // Campo para o valor interno
                        placeholder="Selecione uma Companhia"
                        filter // Ativa o campo de busca
                        showClear // Botão para limpar o campo
                        filterPlaceholder="Pesquisar..." // Placeholder para a busca
                        className="w-full" // Classe CSS opcional
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="ass_tipoassinatura">Tipo Vencimento</label>
                    <Dropdown
                        id="ass_tipoassinatura"
                        value={request.ass_tipoassinatura || null} // Valor selecionado
                        options={tiposVencimento} // Opções estáticas
                        onChange={(e) => handleSelectChange(e)} // Callback ao alterar valor
                        optionLabel="label" // Nome exibido no dropdown
                        optionValue="value" // Valor interno enviado
                        placeholder="Selecione um tipo de vencimento"
                        showClear // Botão para limpar
                        filter // Ativa a busca
                        className="w-full"
                    />
                </div>
                <div className="form-group" >
                    <label htmlFor="loj_codigobase">Unidade Responsavel</label>
                    <Dropdown
                        id="loj_codigobase"
                        name="loj_codigobase"
                        value={request.loj_codigobase || null} // Valor selecionado
                        options={Unidades} // Dados para o Dropdown
                        onChange={(e) => handleSelectChange(e)} // Ação ao selecionar uma opção
                        optionLabel="label" // Campo para exibir
                        optionValue="value" // Campo para o valor interno
                        placeholder="Selecione uma Unidade"
                        filter // Ativa o campo de busca
                        showClear // Botão para limpar o campo
                        filterPlaceholder="Pesquisar..." // Placeholder para a busca
                        className="w-full" // Classe CSS opcional
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="cta_codigobase">Centro de Custo - Debito</label>
                    <input
                        type="text"
                        id="cta_codigobase"
                        name="cta_codigobase"
                        value={request.cta_codigobase || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" >
                    <label htmlFor="cta_codigosaida">Centro de Custo - Credito</label>
                    <input
                        type="text"
                        id="cta_codigosaida"
                        name="cta_codigosaida"
                        value={request.cta_codigosaida || ''}
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
                {request.ass_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.ass_codigo ? '14px' : '0px',display: request.ass_codigo ? 'none' :''}}
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

export default Assinatura;
