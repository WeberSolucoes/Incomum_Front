import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { ProtocoloCreateRequest, UnidadesListResponse } from "../../utils/apiObjects";
import { apiCreateProtocolo, apiDeleteMoeda, apiGetArea, apiGetCentroCusto, apiGetDuplicata, apiGetFormaPagamento, apiGetMoeda,apiGetParceiro, apiGetProtocolo, apiGetProtocoloId, apiGetUnidadeRelatorioByUser, apiUpdateProtocolo } from "../../services/Api";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import GenericTable from "../common/GenericTable";
import { InputNumber } from "primereact/inputnumber";


const GeracaoFatura: React.FC = ({ onBackClick }) => {
    const { codigo,setCodigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<ProtocoloCreateRequest>({} as ProtocoloCreateRequest);
    const [rua, setRua] = useState('');
    const [view, setView] = useState<'list' | 'create' | 'uploadImage'>('list'); // Adiciona 'uploadImage'
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [loading, setLoading] = useState(false);
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [moeda, setMoeda] = useState<{ label: string, value: number }[]>([]);
    const [pagamento, setPagamento] = useState<{ label: string, value: number }[]>([]);
    const [duplicata, setDuplicata] = useState<{ label: string, value: number }[]>([]);
    const [centroCusto, setCentroCusto] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [prt_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [showModal, setShowModal] = useState(false);
    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedPagamento, setSelectedPagamento] = useState(null);
    const [selectedCentroCusto, setSelectedCentroCusto] = useState(null);
    const [selectedMoeda, setSelectedMoeda] = useState(null);
    const [selectedParceiro, setSelectedParceiro] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [fornecedor, setParceiro] = useState([]);
    const [checkedEmprestimo, setCheckedEmprestimo] = useState(false);
    const [checkedCusto, setCheckedCusto] = useState(false);
    const [checkedDocumentos, setCheckedDocumentos] = useState(false);
    const [checkedStatus, setCheckedStatus] = useState(false);
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    const [editedItems, setEditedItems] = useState<any[]>([]);
    const [showViewButton, setShowViewButton] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Estado de carregament



    const columns = [
        { field: 'prt_numerodocumento', header: 'Fatura', style: { width: '6rem', textAlign: 'left' } },
        { field: 'prt_parcelatotal', header: 'Parcela' },
        { field: 'prt_datacadastro', header: 'Emissão' },
        { field: 'prt_datavencimento', header: 'Vencimento' },
        { field: 'prt_datacompetencia', header: 'Mes/Ano' },
        { field: 'for_codigo', header: 'Forma De Pagamento', type: 'dropdown', options: pagamento },
        { field: 'cta_codigo', header: 'Conta', type: 'dropdown', options: centroCusto },
        { field: 'prt_cambiopagamento', header: 'Cambio' },
        { field: 'prt_valor', header: 'Valor' },
    ];

    const handleNumberChange = (name: string, value: any) => {
        setRequest((prevRequest) => ({
            ...prevRequest,
            [name]: value !== null && !isNaN(value) ? value : null, // Armazena como número ou null
        }));
    };

    

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
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
    }, [codigo]);


    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
    
        // Se o campo for "prt_cambiopagamento", trata como número
        if (name === "prt_cambiopagamento") {
            setRequest((prevRequest) => ({
                ...prevRequest,
                [name]: value !== null && !isNaN(value) ? value : null, // Armazena como número ou null
            }));
        } else {
            setRequest((prevRequest) => ({
                ...prevRequest,
                [name]: value,
            }));
        }
    };

    const handleCodeClick = (codigo: number) => {
        setCodigo(codigo);
        setView('create'); // Muda para a visualização de edição
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

    const handleReset = () => {
        // Limpa o estado do formulário
        setRequest({
            prt_codigo: '',
            prt_numerodocumento: '',
            prt_datacadastro: '',
            prt_datavencimento: '',
            prt_datacompetencia: '',
            prt_numero: null,
            prt_dias_entre_vencimento: '',
            par_codigo: '',
            cta_codigo: '',
            moe_codigo: '',
            tdu_codigo: '',
            tpa_codigopagamento: '',
            aco_codigo: '',
            loj_codigo: '',
            prt_parcelatotal: '',
            prt_cambiopagamento: null, // Use null para campos numéricos
            prt_valor: '',
            prt_observacao: '',
        });
    
        // Limpa outros estados
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
        setSelectedUnidade(null);
        setSelectedParceiro(null);
        setSelectedTipo(null);
        setSelectedCentroCusto(null);
        setSelectedMoeda(null);
        setSelectedPagamento(null);
        setCheckedEmprestimo(false);
        setCheckedCusto(false);
        setCheckedDocumentos(false);
        setCheckedStatus(false);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };

    const handleMoedaChange = (e: { value: any }) => {
        setSelectedMoeda(e.value);
        setRequest((prevState) => ({
            ...prevState,
            moe_codigo: e.value,
        }));
    };

    const handleTipoChange = (e: { value: any }) => {
        setSelectedTipo(e.value);
        setRequest((prevState) => ({
            ...prevState,
            tdu_codigo: e.value,
        }));
    };


    const handlePagamentoChange = (e: { value: any }) => {
        setSelectedPagamento(e.value);
        setRequest((prevState) => ({
            ...prevState,
            tpa_codigopagamento: e.value,
        }));
    };

    const handleCentroCustoChange = (e: { value: any }) => {
        setSelectedCentroCusto(e.value);
        setRequest((prevState) => ({
            ...prevState,
            cta_codigo: e.value,
        }));
    };



    const handleFornecedorChange = (e: { value: any }) => {
        setSelectedParceiro(e.value);
        setRequest((prevState) => ({
            ...prevState,
            par_codigo: e.value,
        }));
    };

    
    const handleUnidadeChange = (e: { value: any }) => {
        setSelectedUnidade(e.value);
        setRequest((prevState) => ({
            ...prevState,
            loj_codigo: e.value,
        }));
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
        }  
        try {
            // Tenta carregar as unidades
            const fornecedorResponse = await apiGetDuplicata();
            setDuplicata(fornecedorResponse.data.map(item => ({ label: item.tdu_descricao, value: item.tdu_codigo })));
        }
        catch (error) {
            toastError('Erro ao carregar os Fornecedores');
        }  
        try {
            // Tenta carregar as unidades
            const fornecedorResponse = await apiGetFormaPagamento();
            setPagamento(fornecedorResponse.data.map(item => ({ label: item.for_descricao, value: item.for_codigo })));
        }
        catch (error) {
            toastError('Erro ao carregar os Fornecedores');
        }  
        try {
            // Tenta carregar as unidades
            const fornecedorResponse = await apiGetCentroCusto();
            setCentroCusto(fornecedorResponse.data.map(item => ({ label: item.cta_descricao, value: item.cta_codigo })));
        }
        catch (error) {
            toastError('Erro ao carregar os Fornecedores');
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAreasComerciais = async () => {
            try {
                const response = await apiGetArea();
                const data = response.data.associacoes; // Acesse o array dentro do objeto
    
                if (Array.isArray(data)) {
                    setAreasComerciais(data.map((area: { aco_descricao: string; aco_codigo: number }) => ({
                        label: area.aco_descricao,
                        value: area.aco_codigo
                    })));
                } else {
                    console.error("Dados inesperados para áreas comerciais:", data);
                    toastError("Erro: dados de áreas comerciais em formato inesperado.");
                }
            } catch (error) {
                console.error("Erro ao buscar áreas comerciais:", error);
                toastError("Erro ao buscar áreas comerciais.");
            }
        };
        fetchAreasComerciais();
    }, []);


    const formatarData = (data: Date): string => {
        const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        const numeroDeVezes = parseInt(request?.prt_numero, 10) || 0;
        const diasEntreVencimento = request?.prt_dias_entre_vencimento
            ? parseInt(request.prt_dias_entre_vencimento, 10)
            : 0; // Se não for informado, assume 0
    
        if (!numeroDeVezes || numeroDeVezes <= 0) {
            toastError("O campo 'Número de Vezes' é obrigatório e deve ser maior que zero.");
            return;
        }

        if (!request.prt_numerodocumento){
            toastError("O campo Fatura e obrigatorio.")
            return;
        }

        if (!request.par_codigo){
            toastError("O campo Fornecedor e obrigatorio.")
            return;
        }

        if (!request.cta_codigo){
            toastError("O campo Centro Custo e obrigatorio.")
            return;
        }

        if (!request.moe_codigo){
            toastError("O campo Moeda e obrigatorio.")
            return;
        }

        if (!request.tdu_codigo){
            toastError("O campo Tipo e obrigatorio.")
            return;
        }

        if (!request.tpa_codigopagamento){
            toastError("O campo Forma Pagamento e obrigatorio.")
            return;
        }

        if (!request.aco_codigo){
            toastError("O campo Area Comercial e obrigatorio.")
            return;
        }

        if (!request.loj_codigo){
            toastError("O campo Unidade e obrigatorio.")
            return;
        }

        if (!request.prt_parcelatotal){
            toastError("O campo Valor Total e obrigatorio.")
            return;
        }

        if (request.prt_cambiopagamento === null || request.prt_cambiopagamento === undefined || isNaN(request.prt_cambiopagamento)) {
            toastError("O campo Valor Cambio é obrigatório.");
            return;
        }

        if (!request.prt_valor){
            toastError("O campo Valor Fatura e obrigatorio.")
            return;
        }

        
    
        // Valida e converte a data de vencimento inicial
        const dataVencimentoInicial = request?.prt_datavencimento
            ? new Date(request.prt_datavencimento + "T12:00:00")
            : null;
    
        if (!dataVencimentoInicial || isNaN(dataVencimentoInicial.getTime())) {
            toastError("O campo 'Vencimento' é obrigatório");
            return;
        }
    
        const novosRegistros = Array.from({ length: numeroDeVezes }, (_, index) => {
            // Calcula a data de vencimento com base no intervalo de dias (se for maior que 0)
            let dataVencimento = new Date(dataVencimentoInicial);
            if (checkedStatus) {
                // Adiciona o número de meses ao mês atual
                const novoMes = dataVencimentoInicial.getMonth() + index;
                const novoAno = dataVencimentoInicial.getFullYear() + Math.floor(novoMes / 12); // Ajusta o ano se necessário
                const mesAjustado = novoMes % 12; // Mantém o mês dentro do intervalo 0-11

                // Usa Date.UTC para evitar problemas com fuso horário
                dataVencimento = new Date(Date.UTC(novoAno, mesAjustado, dataVencimentoInicial.getDate(), 12, 0, 0));
            } else {
                // Mantém a mesma data de vencimento
                dataVencimento = new Date(dataVencimentoInicial);
            }

            
            if (diasEntreVencimento > 0) {
                dataVencimento.setDate(dataVencimento.getDate() + index * diasEntreVencimento);
            }
    
            // Valida e converte a data de cadastro
            const dataCadastro = request?.prt_datacadastro
                ? new Date(request.prt_datacadastro + "T12:00:00")
                : null;
    
            if (!dataCadastro || isNaN(dataCadastro.getTime())) {
                toastError("O campo 'Emissão' é obrigatório");
                return;
            }
    
            // Valida e converte a data de competência
            const dataCompetencia = request?.prt_datacompetencia
                ? new Date(request.prt_datacompetencia + "T12:00:00")
                : null;
    
            if (!dataCompetencia || isNaN(dataCompetencia.getTime())) {
                toastError("O campo 'Competencia' é obrigatório.");
                return;
            }
    
            return {
                ...request,
                id: `${request.prt_numerodocumento || "ID"}-${index + 1}`,
                prt_descricao: request.prt_numerodocumento || "Sem descrição",
                prt_datacadastro: formatarData(dataCadastro),
                prt_datavencimento: formatarData(dataVencimento),
                prt_datacompetencia: formatarData(dataCompetencia),
                for_codigo: selectedPagamento,
                cta_codigo: selectedCentroCusto,
                par_codigo: selectedParceiro,
                salvo: false,
            };
        }).filter(Boolean); // Remove registros nulos
    
        if (novosRegistros.length === 0) {
            toastError("Erro ao processar os registros.");
            return;
        }
    
        setEditedItems(novosRegistros);
        setItems(prevItems => [...prevItems, ...novosRegistros]);
    
        toastSucess(`${numeroDeVezes} registro(s) adicionado(s) à tabela.`);
    };

        
    
    const handleSaveTableData = async () => {
        if (editedItems.length === 0) {
            toastError("Nenhum registro editado para salvar.");
            return;
        }

        setIsSaving(true); // Inicia o estado de salvamento
    
        try {
            const response = await Promise.all(editedItems.map(apiCreateProtocolo));
    
            if (response.every(res => res)) {
                toastSucess("Registros editados salvos com sucesso!");
                setShowViewButton(true); // Mostrar o botão "Visualizar" após salvar
    
                // Atualiza os itens na tabela marcando-os como salvos
                setItems(prevItems =>
                    prevItems.map(item => {
                        const editedItem = editedItems.find(edited => edited.id === item.id);
                        return editedItem ? { ...editedItem, salvo: true } : item;
                    })
                );
    
                // Limpa a tabela visualmente
                handleReset()
                setItems([]); // Define o estado `items` como um array vazio
                setIsSaving(false);
    
                setEditedItems([]); // Limpa os itens editados
            } else {
                toastError("Erro ao salvar alguns registros.");
                setIsSaving(false);
            }
        } catch (error) {
            console.error("Erro ao salvar registros:", error);
            toastError("Erro ao salvar registros.");
            setIsSaving(false);
        }
    };

    console.log(pagamento,selectedPagamento)

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
                            style={{width:'30%'}}
                            disabled
                        />
                    </div>
                    <div className="form-group" style={{marginLeft:'-426px'}}>
                        <label htmlFor="prt_numerodocumento">Fatura</label>
                        <input
                            type="text"
                            id="prt_numerodocumento"
                            name="prt_numerodocumento"
                            value={request.prt_numerodocumento || ''}
                            onChange={handleInputChange}
                            style={{width:'30%'}}
                        />
                    </div>
                    <div className="form-group" style={{marginLeft:'-426px'}}>
                        <label htmlFor="cid_codigo">Unidade</label>
                        <Dropdown
                            value={selectedUnidade} 
                            options={unidades} 
                            onChange={handleUnidadeChange}    // Atualiza as áreas comerciais ao mudar a unidade
                            placeholder="Unidade"
                            style={{
                                width: "40%",
                                textAlign: 'left',
                                height: "37.6px",
                            }}
                            panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                            showClear
                        />
                    </div>
                </div>

                {/* Segunda linha */}
                <div className="form-row">
                    <div className="form-group" >
                        <label htmlFor="prt_numerodocumento">Emissão</label>
                        <input
                            type="date"
                            id="prt_datacadastro"
                            name="prt_datacadastro"
                            value={request.prt_datacadastro || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="prt_datavencimento">Vencimento</label>
                        <input
                            type="date"
                            id="prt_datavencimento"
                            name="prt_datavencimento"
                            value={request.prt_datavencimento || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="prt_datacompetencia">Competencia</label>
                        <input
                            type="date"
                            id="prt_datacompetencia"
                            name="prt_datacompetencia"
                            value={request.prt_datacompetencia || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                


                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="par_codigo">Fornecedor</label>
                        <Dropdown
                            value={selectedParceiro} 
                            options={fornecedor} 
                            filter
                            onChange={handleFornecedorChange}    // Atualiza as áreas comerciais ao mudar a unidade
                            placeholder="Fornecedor"
                            style={{
                                width: "100%",
                                textAlign: 'left',
                                height: "37.6px",
                            }}
                            panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                            showClear
                        />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="prt_tipo">Tipo</label>
                        <Dropdown
                            value={selectedTipo} 
                            options={duplicata} 
                            onChange={handleTipoChange}    // Atualiza as áreas comerciais ao mudar a unidade
                            placeholder="Tipo"
                            style={{
                                textAlign: 'left',
                                height: "37.6px",
                            }}
                            panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                            showClear
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group" >
                        <label htmlFor="cta_codigo">Centro Custo</label>
                        <Dropdown
                            value={selectedCentroCusto} 
                            options={centroCusto} 
                            onChange={handleCentroCustoChange}    // Atualiza as áreas comerciais ao mudar a unidade
                            placeholder="Centro De Custo"
                            style={{
                                textAlign: 'left',
                                height: "37.6px",
                            }}
                            panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                            showClear
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="aco_codigo">Area Comercial</label>
                        <select
                            id="aco_codigo"
                            name="aco_codigo"
                            value={request.aco_codigo || ''}
                            onChange={handleSelectChange} 
                            >
                            <option value="">Selecione uma área comercial</option>
                            {areasComerciais.map((area) => (
                                <option key={area.value} value={area.value}>
                                {area.label}
                                </option>
                            ))}
                        </select>
                    </div>       
                </div>

                <div className="form-row">
                    <div className="form-group" >
                        <label htmlFor="moe_codigo">Moeda</label>
                        <Dropdown
                            value={selectedMoeda} 
                            options={moeda} 
                            onChange={handleMoedaChange}    // Atualiza as áreas comerciais ao mudar a unidade
                            placeholder="Moeda"
                            style={{
                                textAlign: 'left',
                                height: "37.6px",
                            }}
                            panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                            showClear
                        />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="prt_datacompetencia">Forma Pagamento</label>
                            <Dropdown
                                value={selectedPagamento}  
                                options={pagamento} 
                                onChange={handlePagamentoChange}    // Atualiza as áreas comerciais ao mudar a unidade
                                placeholder="Forma Pagamento"
                                style={{
                                    textAlign: 'left',
                                    height: "37.6px",
                                }}
                                panelStyle={{ width: '10%',textAlign: 'left' }} // Largura do painel
                                showClear
                            />
                    </div>   
                </div>

                <div className="form-row">
                    <div className="form-group" >
                        <label htmlFor="prt_parcelatotal">Valor Total</label>
                        <InputNumber
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            placeholder="R$ 0,00"
                            type="text"
                            id="prt_parcelatotal"
                            name="prt_parcelatotal"
                            value={request.prt_parcelatotal || null}
                            onChange={(e) => handleNumberChange("prt_parcelatotal", e.value)} // Passa o valor diretamente
                        />
                    </div>
                    <div className="form-group" >
                        <label htmlFor="prt_cambiopagamento">Valor Cambio</label>
                        <InputNumber
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            placeholder="R$ 0,00"
                            id="prt_cambiopagamento"
                            name="prt_cambiopagamento"
                            value={request.prt_cambiopagamento || null} // Usa null como valor padrão
                            onChange={(e) => handleNumberChange("prt_cambiopagamento", e.value)} // Passa o valor diretamente
                        />
                    </div>    
                    <div className="form-group" >
                        <label htmlFor="moe_codigo">Valor Fatura</label>
                        <InputNumber
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            placeholder="R$ 0,00"    
                            type="text"
                            id="prt_valor"
                            name="prt_valor"
                            value={request.prt_valor || null} // Usa null como valor padrão
                            onChange={(e) => handleNumberChange("prt_valor", e.value)}
                        />
                    </div> 
                </div>

                <div className="form-row">
                    <div className="form-group" >
                        <label htmlFor="moe_codigo">Historico</label>
                        <input
                            type="text"
                            id="prt_observacao"
                            name="prt_observacao"
                            value={request.prt_observacao|| ''}
                            onChange={handleInputChange}
                        />
                    </div>        
                </div>

                <div className="form-row" style={{display: 'ruby-text'}}>
                    <div className="form-group" style={{ display: "block", alignItems: "center" }}>
                        <Checkbox onChange={e => setCheckedEmprestimo(e.checked)} checked={checkedEmprestimo} id="prt_emprestimo" name="prt_emprestimo" style={{marginTop:'36px', marginLeft:'14px'}} />
                        <label htmlFor="prt_emprestimo" style={{ marginLeft: "8px",display:'inline' }}>Previsão</label>
                    </div>
                    <div className="form-group" style={{ display: "block", alignItems: "center" }}>
                        <Checkbox onChange={e => setCheckedCusto(e.checked)} checked={checkedCusto} id="prt_custoindireto" name="prt_custoindireto" style={{marginTop:'36px', marginLeft:'14px'}} />
                        <label htmlFor="prt_custoindireto" style={{ marginLeft: "8px",display:'inline' }}>Custo Indireto</label>
                    </div>
                    <div className="form-group" style={{ display: "block", alignItems: "center" }}>
                        <Checkbox onChange={e => setCheckedDocumentos(e.checked)} checked={checkedDocumentos} id="prt_custoindireto" name="prt_custoindireto" style={{marginTop:'36px', marginLeft:'14px'}} />
                        <label htmlFor="prt_custoindireto" style={{ marginLeft: "8px",display:'inline' }}>Documentos</label>
                    </div>
                </div>

                <div className="form-row">
                    
                </div>
                


                <div className="form-row">
                    <div className="form-group" >
                        <label htmlFor="prt_numero">Numero De Vezes</label>
                        <input
                            type="number"
                            id="prt_numero"
                            name="prt_numero"
                            onChange={handleInputChange}
                            style={{ width: '150px' }}
                            min="1"
                            required
                        />
                    </div> 
                    <div className="form-group">
                        <label htmlFor="prt_dias_entre_vencimento">Dias Entre o Vencimento</label>
                        <input
                            type="number"
                            id="prt_dias_entre_vencimento"
                            name="prt_dias_entre_vencimento"
                            value={request.prt_dias_entre_vencimento || ''}
                            onChange={handleInputChange}
                            style={{ width: '150px' }}
                            min="1" // Garante que o valor seja maior que zero
                        />
                    </div>
                    <div className="form-group" style={{ display: "block", alignItems: "center" }}>
                        <Checkbox
                            onChange={e => setCheckedStatus(e.checked)}
                            checked={checkedStatus}
                            id="prt_status"
                            name="prt_status"
                            style={{ marginTop: '36px', marginLeft: '14px' }}
                        />
                        <label htmlFor="prt_status" style={{ marginLeft: "8px", display: 'inline' }}>Mensal</label>
                    </div> 
                        <Button
                            label="Voltar"
                            icon="pi pi-arrow-left"
                            style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginTop:'26px',borderRadius:'4px',marginRight:'10px' }}
                            onClick={onBackClick} // Chama a função passada como prop
                        />
                    {/* Condição para renderizar o botão de exclusão */}
                    {request.prt_codigo && (
                    <button
                        style={{marginLeft:'0px',color:'white',marginTop:'26px',width:'100px',marginRight:'10px'}}
                        type="button"
                        className="reset-btn"
                        onClick={handleDeleteClick}
                        disabled={loading}
                    >
                        <i className="fas fa-trash-alt"></i>{loading ? "Excluindo..." : "Excluir"}
                    </button>
                    )}
                    
                    <button
                        style={{marginRight:'10px',marginTop:'26px',color:'white',backgroundColor:'#0152a1',marginLeft: request.prt_codigo ? '14px' : '0px',display: request.prt_codigo ? 'none' :''}}
                        type="button"
                        className="reset-btn"
                        onClick={handleReset}
                    >
                        <i className="fas fa-trash-alt"></i> Limpar
                    </button>
                    <button style={{marginRight:'10px',width:'100px',height:'34px',padding:'inherit',marginTop:'26px'}} disabled={loading} className="submit-btn"><i style={{marginRight:'10px'}}className="fas fa-save"></i>{loading ? 'Gerando...' : 'Gerar'}</button>
                </div>

                <div className='form-row'>
                    <GenericTable
                        filteredItems={items} 
                        editedItems={editedItems} 
                        setEditedItems={setEditedItems} 
                        onSave={handleSaveTableData} 
                        emptyMessage={""}
                        columns={columns}  
                        isEditable={true}
                        onCodeClick={handleCodeClick}
                        showEditButton = {false}       
                    />
                </div>
            </form>
    );
};

export default GeracaoFatura;
