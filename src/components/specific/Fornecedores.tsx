import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { ParceiroCreateRequest, VendedorCreateRequest } from "../../utils/apiObjects";
import { apiCreateParceiro, apiDeleteParceiro, apiDeleteVendedor, apiGetArea, apiGetCidade, apiGetParceiroId, apiGetVendedorById, apiPostCreateVendedor, apiPutUpdateVendedor, apiUpdateParceiro } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cpf } from 'cpf-cnpj-validator';
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import Select from 'react-select';
import { addTab, setActiveTab } from "../../hooks/tabSlice";
import { useDispatch } from "react-redux";

const Fornecedores: React.FC = ({onBackClick, onCadastroConcluido}) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<ParceiroCreateRequest>({} as ParceiroCreateRequest);
    const [rua, setRua] = useState(''); 
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState('');
    const [loading, setLoading] = useState(false);
    const [areacomercial, setAreaComercial] = useState('');
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [par_codigo, setVenCodigo] = useState<number | null>(null); // Inicialmente nulo ou 
    const [cpfValido, setCpfValido] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cidades, setCidades] = useState<{ label: string, value: number }[]>([]);
    const dispatch = useDispatch();

    const exampleData = [
        { coluna1: 'Item 1', coluna2: 'Descrição 1' },
        { coluna1: 'Item 2', coluna2: 'Descrição 2' },
        { coluna1: 'Item 3', coluna2: 'Descrição 3' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetParceiroId(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setVenCodigo(unidade.par_codigo); // Define o ID do vendedor
                
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
        if (par_codigo !== null) { // Verifica se ven_codigo não é nulo
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
        if (par_codigo !== null) { // Verifica se ven_codigo não é nulo
            setLoading(true);
            try {
                await apiDeleteParceiro(par_codigo);
                toast.success('Cadastro excluído com sucesso.');
            } catch (error) {
                toastError('Erro ao excluir o cadastro.');
                console.error('Erro ao excluir o cadastro:', error);
            } finally {
                setLoading(false);
            }
        }
    };

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
    
        
        setLoading(true);
        try {
            const cpfNumerico = request.par_cnpjcpf?.replace(/\D/g, '') || ''; // Garante que será uma string
    
            if (!cpf.isValid(cpfNumerico)) {
                toastError("CPF inválido.");
                setCpfValido(false);
                return;
            }
    
            const enderecoCompleto = `${rua}, ${numero}`;
            request.par_endereco = enderecoCompleto;
            request.cid_codigo = ibge;
    
            let response;
            if (request.par_codigo) {
                // Atualizar vendedor existente
                response = await apiUpdateParceiro(request.par_codigo, request);
                onCadastroConcluido();
            } else {
                // Criar novo vendedor
                const { par_codigo, ...newRequest } = request; // Remove ven_codigo
                response = await apiCreateParceiro(newRequest);
                onCadastroConcluido();
            }
    
            if (response.status === 200 || response.status === 201) {
                toastSucess("Parceiro salvo com sucesso");
                localStorage.setItem('par_codigo', request.par_codigo.toString());
                if (!request.par_codigo && response.data && response.data.par_codigo) {
                    setRequest(prev => ({
                        ...prev,
                        par_codigo: response.data.par_codigo
                    }));
                    setVenCodigo(response.data.par_codigo); // Atualize também o estado `cid_codigo`
                }
            } else {
                toastError("Erro ao salvar o Parceiro");
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
        setRequest({} as ParceiroCreateRequest);
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
                setibge(data.ibge || '');
                setRequest(prevState => ({
                    ...prevState,
                    'cid_codigo': `${data.localidade}`,
                    'par_bairro': `${data.bairro}`,
                    'par_endereco': `${data.logradouro}`
                    
                }));
            } catch (error) {
                console.error("Erro ao buscar dados do CEP:", error);
                toastError("Erro ao buscar dados do CEP.");
            }
        }
    };

    const fetchUnidades = async (search: string) => {
        if (search.length < 3) {
            setCidades([]); // Limpa o estado se o termo de pesquisa for muito curto
            return;
        }
  
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/incomum/cidade/search/`,
                { params: { q: search } }
            );
            const data = response.data;
  
            console.log("Dados crus da API:", data); // Verificar dados crus
  
            if (Array.isArray(data) && data.length > 0) {
                setCidades(data); // Atualiza somente se houver resultados
                console.log("Estado atualizado com cidades:", data);
            } else {
                console.log("Nenhum dado encontrado");
                setCidades([]);
            }
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
            setCidades([]); // Limpa em caso de erro
        } finally {
            setLoading(false);
        }
    };
  
  
    useEffect(() => {
        console.log("Cidades após a atualização:", cidades); // Verifique o estado
    }, [cidades]); 
  
      // Efetua a busca quando o valor do termo de busca mudar
    useEffect(() => {
        if (searchTerm.length >= 3) {
          fetchUnidades(searchTerm); // Realiza a consulta para termos com 3 ou mais caracteres
        } else {
          setCidades([]); // Limpa as cidades se o termo for menor que 3
        }
    }, [searchTerm]); // A busca será chamada sempre que `searchTerm` mudar
  
  
    const handleCidadeChange = (selectedOption: { label: string; value: number } | null) => {
      if (selectedOption) {
          console.log("Cidade selecionada:", selectedOption);
          setibge(selectedOption.value); // Atualiza o estado com o valor selecionado
      } else {
          setibge(null); // Reseta o valor se nada for selecionado
      }
    };
    

    return (
        <form className="erp-form" onSubmit={handleSubmit}>
            {/* Primeira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_codigo">Código</label>
                    <input
                        style={{width:'200px',height:'37.6px'}}
                        disabled
                        type="text"
                        id="par_codigo"
                        name="par_codigo"
                        value={request.par_codigo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_datacadastro">Data Cadastro</label>
                    <input
                        style={{width:'200px',height:'37.6px'}}
                        type="date"
                        id="par_datacadastro" 
                        name="par_datacadastro"
                        value={request.par_datacadastro || ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_codigocontabil">Codigo Contabil</label>
                    <input
                        style={{width:'180px',height:'37.6px'}}
                        type="text"
                        id="par_codigocontabil"
                        name="par_codigocontabil"
                        value={request.par_codigocontabil || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_codigoimportacao">Codigo Importação</label>
                    <input
                        style={{width:'180px',height:'37.6px'}}
                        type="text"
                        id="par_codigoimportacao"
                        name="par_codigoimportacao"
                        value={request.par_codigoimportacao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_dataatualizacao">Ultima Atualização</label>
                    <input
                        style={{width:'200px',height:'37.6px'}}
                        type="date"
                        id="par_dataatualizacao"
                        name="par_dataatualizacao"
                        value={request.par_dataatualizacao || ''}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_descricao">Nome Fantasia</label>
                    <input
                        type="text"
                        id="par_descricao"
                        name="par_descricao"
                        value={request.par_descricao || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_datanascfund">Data Fundação</label>
                    <input
                        type="date"
                        style={{width:'200px',height:'37.6px'}}
                        id="par_datanascfund"
                        name="par_datanascfund"
                        value={request.par_datanascfund || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Terceira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_razaosocial">Razão Social</label>
                    <input
                        type="text"
                        id="par_razaosocial"
                        name="par_razaosocial"
                        value={request.par_razaosocial || ''}
                        onChange={handleInputChange}
                        style={{width:'398px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_tipopessoa">Tipo Pessoa</label>
                    <select
                        id="par_tipopessoa"
                        name="par_tipopessoa"
                        value={request.par_tipopessoa || ''}
                        onChange={handleSelectChange}
                    >
                        <option value="1">Teste</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="par_cnpjcpf">CPF/CNPJ/NIF</label>
                    <input
                        type="text"
                        id="par_cnpjcpf"
                        name="par_cnpjcpf"
                        value={request.par_cnpjcpf || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_rgie">R.G/I.E</label>
                    <input
                        type="text"
                        id="par_rgie"
                        name="par_rgie"
                        value={request.par_rgie || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_fone1">Fone 1</label>
                    <input
                        type="text"
                        id="par_fone1"
                        name="par_fone1"
                        value={request.par_fone1 || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_fone2">Fone 2</label>
                    <input
                        type="text"
                        id="par_fone2"
                        name="par_fone2"
                        value={request.par_fone2 || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_celular">Celular</label>
                    <input
                        type="text"
                        id="par_celular"
                        name="par_celular"
                        value={request.par_celular || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_fax">Fax</label>
                    <input
                        type="text"
                        id="par_fax"
                        name="par_fax"
                        value={request.par_fax || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_whatsapp">Whatsapp</label>
                    <input
                        type="text"
                        id="par_whatsapp"
                        name="par_whatsapp"
                        value={request.par_whatsapp || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Quarta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_cep">CEP</label>
                    <input
                        type="text"
                        id="par_cep"
                        name="par_cep"
                        value={request.par_cep || ''}
                        onChange={handleInputChange}
                        onBlur={handleCepApi}
                        maxLength={8} // Adicionado para limitar a quantidade de caracteres
                        style={{width:'150px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_endereco">Endereço</label>
                    <input
                        type="text"
                        id="par_endereco"
                        name="par_endereco"
                        value={request.par_endereco || ''}
                        onChange={handleInputChange}
                        style={{width:'450px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_numero">Numero</label>
                    <input
                        type="text"
                        id="par_numero"
                        name="par_numero"
                        value={request.par_numero || ''}
                        onChange={handleInputChange}
                        style={{width:'100px'}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_complemento">Complemento</label>
                    <input
                        type="text"
                        id="par_complemento"
                        name="par_complemento"
                        value={request.par_complemento || ''}
                        onChange={handleInputChange}
                        style={{width:'280px'}}
                    />
                </div>
            </div>

            {/* Quinta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_bairro">Bairro</label>
                    <input
                        type="text"
                        id="par_bairro"
                        name="par_bairro"
                        value={request.par_bairro || ''}
                        onChange={handleInputChange}
                        style={{width:'450px'}}
                    />
                </div>
                <div className="align-items-center mb-2">
                    <label htmlFor="cid_codigo" className="mr-2">
                    Cidade
                    </label>
                    <button
                    type="button"
                    className="btn btn-link p-0 ml-1"
                    onClick={() => {
                        // Adiciona a aba Cidade e troca para ela
                        dispatch(setActiveTab('Cidade')); // Troca para a aba Cidade
                        dispatch(addTab({ key: 'Cidade', title: 'Cidade', state: {} })); // Adiciona a aba no Redux
                    }}
                    style={{
                        fontSize: "1.5rem",
                        color: "#007bff",
                        textDecoration: "none",
                        border: "none",
                        background: "none",
                        height:'20px',
                        marginTop:'-22px',
                    }}
                    >
                    +
                    </button>
                    <Select
                    id="cid_codigo"
                    name="cid_codigo"
                    isClearable
                    isLoading={loading}
                    options={cidades}
                    onInputChange={(inputValue, { action }) => {
                        if (action === "input-change") {
                            setSearchTerm(inputValue); // Atualiza o termo de pesquisa
                            fetchUnidades(inputValue.toUpperCase()); // Faz a chamada à API
                        }
                    }}
                    onChange={handleCidadeChange}
                    value={cidades.find((option) => option.value === ibge) || null}
                    placeholder="Selecione uma Cidade"
                    styles={{
                        control: (base) => ({
                            ...base,
                            width: '450px', // Ajusta a largura
                            minHeight: '34px', // Define a altura mínima
                            height: '34px', // Força a altura
                            lineHeight: '34px', // Ajusta a altura do texto interno
                        }),
                        container: (base) => ({
                            ...base,
                            width: '450px', // Ajusta o tamanho do contêiner externo
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            height: '34px', // Ajusta a altura do contêiner interno
                            padding: '0', // Remove espaçamento extra
                        }),
                        input: (base) => ({
                            ...base,
                            margin: '0', // Remove margens extras
                            padding: '0', // Remove preenchimento
                        }),
                        menu: (base) => ({
                            ...base,
                            zIndex: 9999, // Evita problemas de sobreposição do dropdown
                        }),
                    }}
                    />
                </div>
                <div className="form-group" style={{marginLeft:'158px'}}>
                    <label htmlFor="ven_descricaoauxiliar">UF</label>
                    <input
                        type="text"
                        id="ven_descricaoauxiliar"
                        name="ven_descricaoauxiliar"
                        onChange={handleInputChange}
                        style={{width:'90px'}}
                    />
                </div>
            </div>

            {/* Sexta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_email">E-mail</label>
                    <input
                        type="text"
                        id="par_email"
                        name="par_email"
                        value={request.par_email || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="par_site">Site</label>
                    <input
                        type="text"
                        id="par_site"
                        name="par_site"
                        value={request.par_site || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="par_obs">Observação</label>
                    <textarea 
                        style={{width:'500px',height:'200px'}} 
                        id="par_obs" 
                        name="par_obs" 
                        placeholder="Digite suas observações aqui..."
                        value={request.par_obs || ''}
                        onChange={handleInputChange}
                    >
            
                    </textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="par_obs">Tipo De Parceiro</label>
                    <DataTable value={exampleData} style={{ borderCollapse: 'collapse', width: '500px',backgroundColor:'white' }}>
                        <Column field="coluna1" header="Tipo" />
                        <Column field="coluna2" header="Descrição" />
                    </DataTable>
                </div>
            </div>

            <div className="form-row">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'680px',borderRadius:'4px' }}
                        onClick={onBackClick} // Chama a função passada como prop
                        type="button"
                    />
                {/* Condição para renderizar o botão de exclusão */}
                {request.par_codigo && (
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
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.par_codigo ? '14px' : '0px',display: request.par_codigo ? 'none' :''}}
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

export default Fornecedores;

