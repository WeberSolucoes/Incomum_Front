import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { VendedorCreateRequest } from "../../utils/apiObjects";
import { apiDeleteVendedor, apiGetAreas, apiGetVendedorById, apiPostCreateVendedor, apiPutUpdateVendedor } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { InputTextarea } from "primereact/inputtextarea";

const Vendedor: React.FC = () => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<VendedorCreateRequest>({} as VendedorCreateRequest);
    const [rua, setRua] = useState(''); 
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [loading, setLoading] = useState(false);
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [ven_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetVendedorById(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.ven_codigo); // Define o ID do vendedor

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
                toastError("Erro ao buscar dados da unidade.");
            }
        };
        fetchData();
    }, [codigo]);

    useEffect(() => {
        const fetchAreasComerciais = async () => {
            try {
                const response = await apiGetAreas();
                const data = response.data;
                setAreasComerciais(data.map((area: { aco_descricao: string; aco_codigo: number }) => ({
                    label: area.aco_descricao,
                    value: area.aco_codigo
                })));
            } catch (error) {
                console.error("Erro ao buscar áreas comerciais:", error);
                toastError("Erro ao buscar áreas comerciais.");
            }
        };
        fetchAreasComerciais();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));

        // Validação dinâmica
        if (id === 'ven_cpf') {
        setCpfValido(cpf.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setRequest(prevState => ({ ...prevState, 'cep_codigo': value }));
    };

    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setRequest(prevState => ({ ...prevState, 'loj_cnpj': value }));
    };

    const handleFoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setRequest(prevState => ({ ...prevState, 'loj_fone': value }));
    };

    const handleMultiSelectChange = (e: { value: number[] }) => {
        setSelectedAreas(e.value);
        setRequest(prevState => ({ ...prevState, areasComerciais: e.value }));
    };

    const handleDeleteClick = () => {
        if (ven_codigo !== null) { // Verifica se ven_codigo não é nulo
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
        if (ven_codigo !== null) { // Verifica se ven_codigo não é nulo
            setLoading(true);
            try {
                await apiDeleteVendedor(ven_codigo);
                toast.success('Cadastro excluído com sucesso.');
            } catch (error) {
                toastError('Erro ao excluir o cadastro.');
                console.error('Erro ao excluir o cadastro:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    const campoMapeamento: Record<keyof VendedorCreateRequest, string> = {
        ven_numero: 'Número',
        ven_contacorrente: 'Conta',
        ven_agencia: 'Agência',
        ven_cep: 'Cep',
        ven_descricao: "",
        loj_codigo: "",
        ven_endereco: "",
        ven_bairro: "",
        cid_codigo: "",
        ven_fone: "",
        ven_celular: "",
        ven_cpf: "",
        ven_situacao: "",
        aco_codigo: "",
        ven_descricaoweb: "",
        ven_descricaoauxiliar: "",
        ven_codigoimportacao: "",
        ban_codigo: "",
        ven_observacao: "",
        ven_email: "",
        sve_codigo: ""
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const camposNumericos: Array<keyof VendedorCreateRequest> = ['ven_codigo', 'ven_cep', 'ven_numero','ven_contacorrente','ven_agencia'];

        for (const campo of camposNumericos) {
            const value = request[campo] as string; // Asserção de tipo
            const isNumber = /^\d*$/.test(value);
            if (value && !isNumber) {
                toastError(`O campo '${campoMapeamento[campo]}' deve conter apenas números.`);
                return; // Interrompe o envio do formulário
            }
        }

        setLoading(true);
        try {
            const cpfNumerico = request.ven_cpf?.replace(/\D/g, '') || ''; // Garante que será uma string

            if (!cpf.isValid(cpfNumerico)) {
                toastError("CPF inválido.");
                setCpfValido(false);
                return;
            }

            const enderecoCompleto = `${rua}, ${numero}`;
            request.ven_endereco = enderecoCompleto;
            request.aco_codigo = selectedAreas; // Envie apenas a lista de ids
            request.ven_situacao = checked ? 1 : 0;

            let response;
             if (request.ven_codigo) {
                // Atualizar agência
                await apiPutUpdateVendedor(request.ven_codigo, request);
            } else {
                // Criar nova agência
                await apiPostCreateVendedor(request);
            }

            if (response.status === 200 || response.status === 201) {
                toastSucess("Unidade salva com sucesso");
            } else {
                toastError("Erro ao salvar a unidade");
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
        setRequest({} as VendedorCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
    };

    const handleCepApi = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace('-', '');
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setRua(data.logradouro || '');
                setCidade(data.localidade || '');
                setRequest(prevState => ({
                    ...prevState,
                    'cid_codigo': `${data.localidade}`,
                    'ven_bairro': `${data.bairro}`,
                    'ven_endereco': `${data.logradouro}`
                    
                }));
            } catch (error) {
                console.error("Erro ao buscar dados do CEP:", error);
                toastError("Erro ao buscar dados do CEP.");
            }
        }
    };

    return (
        <form className="erp-form" onSubmit={handleSubmit}>
            {/* Primeira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_codigo">Código</label>
                    <input
                        style={{width:'120px'}}
                        disabled
                        type="text"
                        id="ven_codigo"
                        name="ven_codigo"
                        value={request.ven_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{marginLeft:'-174px'}} htmlFor="salario">Importação</label>
                    <input
                        style={{width:'120px',marginLeft:'-176px'}}
                        type="text"
                        id="ven_codigoimportacao" 
                        name="ven_codigoimportacao"
                        value={request.ven_codigoimportacao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{marginLeft:'-354px'}} htmlFor="ven_situacao">Situação</label>
                    <select
                        style={{width:'194px',marginLeft:'-356px'}}
                        id="ven_situacao"
                        name="ven_situacao"
                        value={request.ven_situacao || ''}
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
                    <label htmlFor="ven_descricao">Vendedor</label>
                    <input
                        type="text"
                        id="ven_descricao"
                        name="ven_descricao"
                        value={request.ven_descricao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_cpf">CPF</label>
                    <input
                        type="text"
                        id="ven_cpf"
                        name="ven_cpf"
                        value={request.ven_cpf || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Terceira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_fone">Vendedor Site 1</label>
                    <input
                        type="text"
                        id="ven_fone"
                        name="ven_fone"
                        value={request.ven_fone || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_descricaoauxiliar">Vendedor Site 2</label>
                    <input
                        type="text"
                        id="ven_descricaoauxiliar"
                        name="ven_descricaoauxiliar"
                        value={request.ven_descricaoauxiliar || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Quarta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_cep">CEP</label>
                    <input
                        type="text"
                        id="ven_cep"
                        name="ven_cep"
                        value={request.ven_cep || ''}
                        onChange={handleInputChange}
                        onBlur={handleCepApi}
                        maxLength={8} // Adicionado para limitar a quantidade de caracteres
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cid_codigo">Cidade</label>
                    <input
                        type="text"
                        id="cid_codigo"
                        name="cid_codigo"
                        value={request.cid_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Quinta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_bairro">Bairro</label>
                    <input
                        type="text"
                        id="ven_bairro"
                        name="ven_bairro"
                        value={request.ven_bairro || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_numero">Número</label>
                    <input
                        type="text"
                        id="ven_numero"
                        name="ven_numero"
                        value={request.ven_numero || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Sexta linha */}
            <div className="form-row">
                <div className="form-group full-width">
                    <label htmlFor="ven_endereco">Endereço</label>
                    <input
                        type="text"
                        id="ven_endereco"
                        name="ven_endereco"
                        value={request.ven_endereco || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Sétima linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_fone">Fone</label>
                    <input
                        type="text"
                        id="ven_fone"
                        name="ven_fone"
                        value={request.ven_fone || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_celular">Celular</label>
                    <input
                        type="text"
                        id="ven_celular"
                        name="ven_celular"
                        value={request.ven_celular || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Oitava linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ban_codigo">Banco</label>
                    <input
                        type="text"
                        id="ban_codigo"
                        name="ban_codigo"
                        value={request.ban_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_agencia">Agência</label>
                    <input
                        type="text"
                        id="ven_agencia"
                        name="ven_agencia"
                        value={request.ven_agencia || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ven_contacorrente">Conta Corrente</label>
                    <input
                        type="text"
                        id="ven_contacorrente"
                        name="ven_contacorrente"
                        value={request.ven_contacorrente || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ven_observacao">Observação</label>
                    <input
                        id="ven_observacao"
                        value={request.ven_observacao || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                {/* Condição para renderizar o botão de exclusão */}
                {request.ven_codigo && (
                <button
                style={{marginLeft:'700px',color:'white',width:'100px'}}
                type="button"
                className="reset-btn"
                onClick={handleDeleteClick}
                disabled={loading}
                >
                    <i className="fas fa-trash-alt"></i>{loading ? "Excluindo..." : "Excluir"}
                </button>
                )}
                
                <button
                    style={{color:'white',backgroundColor:'red',marginLeft: request.ven_codigo ? '460px' : '700px',display: request.ven_codigo ? 'none' :''}}
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

export default Vendedor;

