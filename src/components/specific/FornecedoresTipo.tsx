import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { FornecedorTipoCreateRequest, ParceiroContatoCreateRequest} from "../../utils/apiObjects";
import {  apiCreateFornecedorTipo, apiDeleteFornecedorTipo, apiGetFornecedorTipo, apiUpdateFornecedorTipo } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import GenericTable from "../common/GenericTable";
import { Dialog } from "primereact/dialog";


const ForncedoresTipo: React.FC = (onBackClick) => {
    const [request, setRequest] = useState<FornecedorTipoCreateRequest>({} as FornecedorTipoCreateRequest);
    const [agencias, setAgencias] = useState<{ id: number; nome: string }[]>([]); // Corrigido o nome do estado
    const [modalVisible, setModalVisible] = useState(false);
    const { codigo } = useCodigo(); // Presumo que esse hook retorna algum valor do código
    const [editing, setEditing] = useState(false); // Estado para diferenciar entre criação e edição
    const [agenteNome, setAgenteNome] = useState(''); // Nome do agente que está sendo editado
    const [tpa_codigo, setVenCodigo] = useState<number | null>(null); // Código do parceir
    const [filteredAgentes, setFilteredAgentes] = useState<FornecedorTipoCreateRequest[]>([]); // Filtra os agentes que devem ser exibidos
    const [loading, setLoading] = useState(false); // Estado para indicar se há carregamento de dados
    const [registroEditar, setRegistroEditar] = useState<FornecedorTipoCreateRequest | null>(null); // Para armazenar o agente a ser editado
    const [selectedAgente, setSelectedAgente] = useState<number | null>(null);

    console.log("Código obtido:", codigo);
    
    const agenteColumns = [
        { field: "tpa_codigo", header: "Código" },
        { field: "tpa_descricao", header: "Descrição" },
    ];

    useEffect(() => {
        console.log('Código da agência:', codigo);
        console.log('Agentes filtrados:', filteredAgentes);
        const parceiroId = codigo; // Exemplo de ID de agência
    }, [codigo]);

    useEffect(() => {
        if (codigo !== null) {
            setRequest((prev) => ({
                ...prev,
                par_codigo: codigo, // Insere o código no request
                tpa_codigo: codigo,
            }));
        }
    }, [codigo]);
    

    const fetchParceiroContatos = async () => {
        setLoading(true);
        try {
            const response = await apiGetFornecedorTipo();
            if (response.status === 200) {
                // Mapeia os dados retornados da API para o formato esperado pela GenericTable
                const data = Array.isArray(response.data) ? response.data : [];
                console.log("Dados retornados da API:", data);
                setFilteredAgentes(data);
            } else {
                toastError("Erro ao carregar os dados.");
            }
        } catch (error) {
            console.error("Erro:", error);
            toastError("Erro ao buscar os dados.");
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchParceiroContatos();
    }, []);


    const handleDeleteClick = () => {
        if (tpa_codigo !== null) { // Verifica se ven_codigo não é nulo
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
        if (tpa_codigo !== null) { // Verifica se ven_codigo não é nulo
            setLoading(true);
            try {
                await apiDeleteFornecedorTipo(tpa_codigo);
                toast.success('Cadastro excluído com sucesso.');
            } catch (error) {
                toastError('Erro ao excluir o cadastro.');
                console.error('Erro ao excluir o cadastro:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Função para lidar com mudanças nos inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRequest({ ...request, [name]: value });

    };

    // Função de submissão do formulário, diferenciando criação e edição
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        
        setLoading(true);
        try {
    
            let response;
            if (request.tpa_codigo) {
                // Atualizar vendedor existente
                response = await apiUpdateFornecedorTipo(request.tpa_codigo, request);
            } else {
                // Criar novo vendedor
                const { tpa_codigo, ...newRequest } = request; // Remove ven_codigo
                response = await apiCreateFornecedorTipo(newRequest);
            }
    
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Parceiro Contato salvo com sucesso");
            } else {
                toastError("Erro ao salvar o Parceiro Contato");
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
        setRequest({} as FornecedorTipoCreateRequest);
    };

    const closeDialog = () => setModalVisible(false);
    
    useEffect(() => {
        if (modalVisible && editing) {
            console.log('Dados atualizados para edição:', request);
        }
    }, [modalVisible, request]);
    
    const handleEditAgente = (codigo) => {
        if (codigo === undefined || codigo === null) {
            console.error("❌ Código inválido para edição:", codigo);
            return;
        }
    
        console.log("Lista de Agentes:", filteredAgentes);
        console.log("Código recebido para edição:", codigo);
    
        const agenteParaEditar = filteredAgentes.find((agente) => agente.tpa_codigo === Number(codigo));
    
        if (agenteParaEditar) {
            console.log("✅ Agente encontrado:", agenteParaEditar);
            setRequest({
                tpa_codigo: agenteParaEditar.tpa_codigo || '',
                tpa_descricao: agenteParaEditar.tpa_descricao || '',
            });
            setEditing(true);
            setModalVisible(true);
        } else {
            console.error('❌ Agente não encontrado para edição:', codigo);
        }
    };

    const handleCreateClick = () => {
        // Resetando os campos e estados relacionados à edição
        setRequest({
            tpa_codigo: '',  // Resetando o código
            tpa_descricao: '',  // Resetando a descrição
        });
        setAgenteNome('');  // Limpar o nome do agente
        setSelectedAgente(null);  // Limpando a seleção do agente
        setEditing(false);  // Desmarcando o modo de edição
        setModalVisible(true);  // Abrindo o modal
    };
    
    
    

    return (
        <>


            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', marginTop: '8px' }}>
                <Button
                    label="Criar"
                    icon="pi pi-plus"
                    style={{ marginLeft: 'auto', backgroundColor: '#0152a1' }}
                    onClick={handleCreateClick}
                />
            </div>

            <GenericTable 
                emptyMessage="Nenhum Parceiro Contato encontrado"
                filteredItems={filteredAgentes}
                columns={agenteColumns}
                onCodeClick={handleEditAgente}
            />

            <Dialog 
                visible={modalVisible}
                style={{ width: '60vw' }} 
                onHide={() => {
                    setModalVisible(false);
                    setAgenteNome(''); // Limpa o nome ao fechar o modal, se necessário
                }}
            >   
                <h1 style={{ color: '#0152a1' }}>
                    {editing ? `Editar Fornecedor Tipo: ${agenteNome}` : 'Cadastro Fornecedor Tipo'}
                </h1>
                <form className="erp-form" onSubmit={handleSubmit}>
                    {/* Primeira linha */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="tpa_codigo">Código</label>
                            <input
                                style={{width:'200px',height:'37.6px'}}
                                disabled
                                type="text"
                                id="tpa_codigo"
                                name="tpa_codigo"
                                value={request.tpa_codigo || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Segunda linha */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="tpa_descricao">Fornecedor Tipo</label>
                            <input
                                type="text"
                                id="tpa_descricao"
                                name="tpa_descricao"
                                value={request.tpa_descricao || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                            <Button
                                label="Voltar"
                                icon="pi pi-arrow-left"
                                style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'500px',borderRadius:'4px' }}
                                onClick={closeDialog} // Chama a função passada como prop
                                type="button"
                            />
                        {/* Condição para renderizar o botão de exclusão */}
                        {request.tpa_codigo && (
                        <button
                            style={{marginLeft:'0px',color:'white',width:'100px'}}
                            type="button"
                            className="reset-btn"
                            onClick={handleDeleteClick}
                            disabled={loading}
                        >
                            <i className="fas fa-trash-alt"></i>{loading ? "Excluindo..." : "Excluir"}
                        </button>
                        )}
                        
                        <button
                            style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.tpa_codigo ? '14px' : '0px',display: request.tpa_codigo ? 'none' :''}}
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
            </Dialog>
        </>
    );
};

export default ForncedoresTipo;
