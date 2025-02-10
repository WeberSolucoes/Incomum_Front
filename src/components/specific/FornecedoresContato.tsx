import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { ParceiroContatoCreateRequest} from "../../utils/apiObjects";
import {  apiCreateParceiroContato, apiDeleteParceiroContato, apiGetParceiroContato, apiUpdateParceiroContato } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import GenericTable from "../common/GenericTable";
import { Dialog } from "primereact/dialog";


const ForncedoresContato: React.FC = (onBackClick) => {
    const [request, setRequest] = useState<ParceiroContatoCreateRequest>({} as ParceiroContatoCreateRequest);
    const [agencias, setAgencias] = useState<{ id: number; nome: string }[]>([]); // Corrigido o nome do estado
    const [modalVisible, setModalVisible] = useState(false);
    const { codigo } = useCodigo(); // Presumo que esse hook retorna algum valor do código
    const [editing, setEditing] = useState(false); // Estado para diferenciar entre criação e edição
    const [agenteNome, setAgenteNome] = useState(''); // Nome do agente que está sendo editado
    const [pco_codigo, setVenCodigo] = useState<number | null>(null); // Código do parceir
    const [filteredAgentes, setFilteredAgentes] = useState<ParceiroContatoCreateRequest[]>([]); // Filtra os agentes que devem ser exibidos
    const [loading, setLoading] = useState(false); // Estado para indicar se há carregamento de dados
    const [registroEditar, setRegistroEditar] = useState<ParceiroContatoCreateRequest | null>(null); // Para armazenar o agente a ser editado
    const [selectedAgente, setSelectedAgente] = useState<number | null>(null);

    const agenteColumns = [
        { field: "pco_codigo", header: "Código Contato" },
        { field: "par_codigo", header: "Código Parceiro" },
        { field: "pco_descricao", header: "Descrição" },
        { field: "pco_observacao", header: "Observação" },
        { field: "pco_fone", header: "Telefone" },
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
                tco_codigo: codigo,
            }));
        }
    }, [codigo]);
    

    const fetchParceiroContatos = async () => {
        setLoading(true);
        try {
            const response = await apiGetParceiroContato();
            if (response.status === 200) {
                // Mapeia os dados retornados da API para o formato esperado pela GenericTable
                const data = Array.isArray(response.data) ? response.data : [];
                const mappedData = data.map((item) => ({
                    pco_codigo: item.pco_codigo, // Campo esperado pela tabela
                    par_codigo: item.par_codigo, // Adiciona o par_codigo
                    pco_descricao: item.pco_descricao, // Campo esperado pela tabela
                    pco_observacao: item.pco_observacao, // Campo esperado pela tabela
                    pco_fone: item.pco_fone // Campo esperado pela tabela
                }));
                setFilteredAgentes(mappedData); // Atualiza o estado com os dados transformados
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

    const fetchAddressByCep = async (cep: string) => {
        if (cep.length === 8) { // Verifica se o CEP tem 8 caracteres
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { logradouro, bairro, localidade, uf } = response.data;

                // Atualiza os campos de endereço no formulário
                setRequest((prev) => ({
                    ...prev,
                    agt_rua: logradouro,
                    agt_bairro: bairro,
                    agt_cidade: localidade,
                    agt_uf: uf,
                }));
            } catch (error) {
                console.error('Erro ao buscar endereço:', error);
                toast.error('Erro ao buscar endereço. Verifique o CEP.');
            }
        }
    };

    const handleDeleteClick = () => {
        if (pco_codigo !== null) { // Verifica se ven_codigo não é nulo
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
        if (pco_codigo !== null) { // Verifica se ven_codigo não é nulo
            setLoading(true);
            try {
                await apiDeleteParceiroContato(pco_codigo);
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

        // Se o campo for o CEP, chama a função para buscar o endereço
        if (name === 'agt_cep') {
            fetchAddressByCep(value.replace(/\D/g, '')); // Remove caracteres não numéricos
        }
    };

    // Função de submissão do formulário, diferenciando criação e edição
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        
        setLoading(true);
        try {
    
            let response;
            if (request.pco_codigo) {
                // Atualizar vendedor existente
                response = await apiUpdateParceiroContato(request.pco_codigo, request);
            } else {
                // Criar novo vendedor
                const { pco_codigo, ...newRequest } = request; // Remove ven_codigo
                response = await apiCreateParceiroContato(newRequest);
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
        setRequest({} as ParceiroContatoCreateRequest);
    };

    const closeDialog = () => setModalVisible(false);
    
    useEffect(() => {
        if (modalVisible && editing) {
            console.log('Dados atualizados para edição:', request);
        }
    }, [modalVisible, request]);
    
    const handleEditAgente = (codigo) => {
        const agenteParaEditar = filteredAgentes.find(agente => agente.codigo === codigo);
        console.log("Agente para editar:", agenteParaEditar);  // Verifique os dados do agente
    
        if (agenteParaEditar) {
            // Atualize o estado com os dados corretos do agente
            setRequest(prevState => ({
                ...prevState, // Certifique-se de manter o estado anterior
                pco_codigo: agenteParaEditar.codigo || '', // 'codigo' pode ser o campo correto no objeto
                pco_descricao: agenteParaEditar.descricao || '', 
                pco_fone: agenteParaEditar.email || '', // Se 'email' for o campo correto para telefone
                pco_celular: agenteParaEditar.responsavel || '', // 'responsavel' pode ser o celular
                pco_observacao: agenteParaEditar.responsavel || '', // Se 'responsavel' for a observação
            }));
            setAgenteNome(agenteParaEditar.descricao);
            setSelectedAgente(codigo);
            setEditing(true);
            setModalVisible(true);
        } else {
            console.error('Agente não encontrado para edição:', codigo);
        }
    };
    
    

    return (
        <>


            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', marginTop: '8px' }}>
                <Button
                    label="Adicionar"
                    icon="pi pi-plus"
                    style={{ marginLeft: 'auto', backgroundColor: '#0152a1',height: '34px', borderRadius: '10px' }}
                    onClick={() => setModalVisible(true)}
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
                    {editing ? `Editar Parceiro Contato: ${agenteNome}` : 'Cadastro Parceiro Contato'}
                </h1>
                <form className="erp-form" onSubmit={handleSubmit}>
                    {/* Primeira linha */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pco_codigo">Código</label>
                            <input
                                style={{width:'200px',height:'37.6px'}}
                                disabled
                                type="text"
                                id="pco_codigo"
                                name="pco_codigo"
                                value={request.pco_codigo || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Segunda linha */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pco_descricao">Nome Do Contato</label>
                            <input
                                type="text"
                                id="pco_descricao"
                                name="pco_descricao"
                                value={request.pco_descricao || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="par_datanascfund">Tipo</label>
                            <select>
                                <option value="">Teste</option>
                            </select>
                        </div>
                    </div>

                    {/* Terceira linha */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pco_fone">Fone</label>
                            <input
                                type="text"
                                id="pco_fone"
                                name="pco_fone"
                                value={request.pco_fone || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pco_celular">Celular</label>
                            <input
                                type="text"
                                id="pco_celular"
                                name="pco_celular"
                                value={request.pco_celular || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pco_observacao">Observação</label>
                            <textarea 
                                id="pco_observacao" 
                                name="pco_observacao" 
                                placeholder="Digite suas observações aqui..."
                                value={request.pco_observacao || ''}
                                onChange={handleInputChange}
                            >
                    
                            </textarea>
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
                        {request.pco_codigo && (
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
                            style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.pco_codigo ? '14px' : '0px',display: request.pco_codigo ? 'none' :''}}
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

export default ForncedoresContato;

