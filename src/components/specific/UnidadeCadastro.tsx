import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { UnidadesCreateRequest } from '../../utils/apiObjects';
import { useCodigo } from '../../contexts/CodigoProvider';
import { apiDeleteUnidade, apiGetArea, apiGetUnidadeById, apiPostCreateUnidade, apiPutUpdateUnidade } from '../../services/Api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { cnpj } from 'cpf-cnpj-validator';
import { toastError, toastSucess } from '../../utils/customToast';
import { Button } from 'primereact/button';

const Unidade: React.FC = ({onBackClick}) => {
    const { codigo } = useCodigo(); // Assumindo que useCodigo fornece o código da unidade
    const [request, setRequest] = useState<UnidadesCreateRequest>({} as UnidadesCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [ibge, setibge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
    const [areacomercial, setAreaComercial] = useState('');
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [checked, setChecked] = useState(false);
    const [cep, setCep] = useState('');
    const [cnpjValido, setCnpjValido] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetUnidadeById(codigo);
                const unidade = response.data;
                setRequest(unidade);

                if (unidade.loj_endereco) {
                    const enderecoParts = unidade.loj_endereco.split(",");
                    setRua(enderecoParts[0] || '');
                    setNumero(enderecoParts[1] || '');
                } else {
                    setRua('');
                    setNumero('');
                }

                setCidade(unidade.cid_codigo || '');
                setSelectedAreas(unidade.areasComerciais ? unidade.areasComerciais.map((area: any) => area.aco_codigo) : []);
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
                const response = await apiGetArea();
                const data = response.data;
                setAreaComercial(data.aco_codigo);
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


        if (id === 'loj_cnpj') {
            setCnpjValido(cnpj.isValid(value.replace(/\D/g, '')));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setCep(value); // Atualiza o estado cep
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
        if (request.loj_codigo) {
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
        if (request.loj_codigo) {
            setLoading(true);
            try {
                await apiDeleteUnidade(request.loj_codigo);
                toastSucess("Cadastro excluído com sucesso.");
            } catch (error) {
                console.error('Erro ao excluir o cadastro:', error);
                toastError("Erro ao excluir o cadastro.");
            } finally {
                setLoading(false);
            }
        }
    };
    const campoMapeamento: Record<keyof UnidadesCreateRequest, string> = {
        loj_cep: 'CEP',
        loj_numero: 'Número',
        nem_codigo: 'Código NEM',
        loj_vendacorte: 'Venda Corte',
        loj_contrato: 'Contrato',
        loj_codigofinanceiro: 'Código Financeiro',
        loj_codigoempresa: 'Código Empresa',
        loj_serie: 'Série NF',
        loj_cortevendedor: 'Corte Vendedor',
        cid_codigo: '',
        aco_codigo: '',
        loj_cnpj: '',
        cep_codigo: '',
        loj_fone: '',
        loj_descricao: '',
        loj_responsavel: '',
        loj_email: '',
        loj_endereco: '',
        loj_bairro: '',
        loj_fax: '',
        loj_emailloja: '',
        loj_emailfinanceiro: '',
        loj_textorelatorio: '',
        loj_emailbloqueio: '',
        loj_situacao: ''
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const camposNumericos: Array<keyof UnidadesCreateRequest> = ['loj_codigo', 'loj_cep', 'loj_numero','nem_codigo','loj_vendacorte','loj_contrato','loj_codigofinanceiro','loj_codigoempresa','loj_serie','loj_cortevendedor'];

        for (const campo of camposNumericos) {
            const value = request[campo] as string; // Asserção de tipo
            const isNumber = /^\d*$/.test(value);
            if (value && !isNumber) {
                toastError(`O campo '${campoMapeamento[campo]}' deve conter apenas números.`);
                return; // Interrompe o envio do formulário
            }
        }

        const cnpjNumerico = request.loj_cnpj?.replace(/\D/g, '') || ''; // Garante que será uma string
        console.log(request.loj_descricao);
        if (!request.loj_descricao) {
            toastError("Campo Unidade Venda inválido.");
            setLoading(false);
            return;
        }

        /*if (!cnpj.isValid(cnpjNumerico)) {
            toastError("CNPJ inválido.");
            setCnpjValido(false);
            return;
        }*/
        if (request.loj_email && !/\S+@\S+\.\S+/.test(request.loj_email)) {
            toastError("Campo E-mail inválido.");
            setLoading(false);
            return;
        }
        if (request.loj_emailfinanceiro && !/\S+@\S+\.\S+/.test(request.loj_emailfinanceiro)) {
            toastError("Campo E-mail Financeiro inválido.");
            setLoading(false);
            return;
        }
        if (request.loj_emailbloqueio && !/\S+@\S+\.\S+/.test(request.loj_emailbloqueio)) {
            toastError("Campo E-mail Bloqueio inválido.");
            setLoading(false);
            return;
        }
        if (request.loj_emailloja && !/\S+@\S+\.\S+/.test(request.loj_emailloja)) {
            toastError("Campo E-mail Unidade inválido.");
            setLoading(false);
            return;
        }

        e.preventDefault();
        setLoading(true);
        try {
            const enderecoCompleto = `${rua}, ${numero}`;
            request.loj_endereco = enderecoCompleto;
            request.loj_situacao = checked ? 1 : 0;
            request.cid_codigo = ibge;
            request.aco_codigo = areacomercial;

            let response;
            if (request.loj_codigo) {
                console.log(request.loj_codigo||"1");
                response = await apiPutUpdateUnidade(request, request.loj_codigo);
            } else {
                console.log(request.loj_codigo||"2");
                response = await apiPostCreateUnidade(request);
            }

            if (response.status ===  200 || response.status === 201) {
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
        setRequest({} as UnidadesCreateRequest);
        setSelectedAreas([]);
        setRua('');
        setNumero('');
        setCidade('');
        setChecked(false);
        setCep(''); // Limpa o estado do CEP também
    };

    const handleCepApi = async (e) => {
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
                cid_codigo: data.localidade || '',
                loj_bairro: data.bairro || '',
                loj_endereco: data.logradouro || '',
                loj_cep: prevState.loj_cep // Mantém o valor anterior do CEP
            }));
        } catch (error) {
            console.error("Erro ao buscar dados do CEP:", error);
            toastError("Erro ao buscar dados do CEP.");
        }
    }
};

    return (
        <>
        <ToastContainer />
        <form className="erp-form" onSubmit={handleSubmit}>
            {/* Primeira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_codigo">Código</label>
                    <input
                        disabled
                        type="text"
                        id="loj_codigo"
                        name="loj_codigo"
                        value={request.loj_codigo || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label style={{marginLeft:'-78px'}} htmlFor="loj_serie">Série NF</label>
                    <input
                        style={{marginLeft:'-80px'}}
                        type="text"
                        id="loj_serie"
                        name="loj_serie"
                        value={request.loj_serie || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label style={{marginLeft:'-158px'}} htmlFor="contabil">Contabil</label>
                    <input
                        style={{marginLeft:'-160px'}}
                        type="text"
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label style={{marginLeft:'-238px'}} htmlFor="loj_situacao">Situação</label>
                    <select
                        style={{marginLeft:'-240px', width:'105%'}}
                        id="loj_situacao"
                        name="loj_situacao"
                        value={request.loj_situacao || ''}
                        onChange={handleSelectChange}>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>
            </div>

            {/* Segunda linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_descricao">Unidade Venda</label>
                    <input
                        type="text"
                        id="loj_descricao"
                        name="loj_descricao"
                        value={request.loj_descricao || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="loj_responsavel">Responsável</label>
                    <input
                        type="text"
                        id="loj_responsavel"
                        name="loj_responsavel"
                        value={request.loj_responsavel || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Terceira linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_fone">Fone</label>
                    <input
                        type="text"
                        id="loj_fone"
                        name="loj_fone"
                        value={request.loj_fone || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="loj_fax">Fax</label>
                    <input
                        type="text"
                        id="loj_fax"
                        name="loj_fax"
                        value={request.loj_fax || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="loj_cnpj">CNPJ</label>
                    <input
                        type="text"
                        id="loj_cnpj"
                        name="loj_cnpj"
                        value={request.loj_cnpj || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Quarta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_cep">CEP</label>
                    <input
                        type="text"
                        id="loj_cep"
                        name="loj_cep"
                        value={request.loj_cep || ''}
                        onChange={(e) => setRequest(prevState => ({ ...prevState, loj_cep: e.target.value }))}
                        onBlur={handleCepApi} />
                </div>
                <div className="form-group">
                    <label htmlFor="cid_codigo">Cidade</label>
                    <input
                        type="text"
                        id="cid_codigo"
                        name="cid_codigo"
                        value={cidade || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Quinta linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_bairro">Bairro</label>
                    <input
                        type="text"
                        id="loj_bairro"
                        name="loj_bairro"
                        value={request.loj_bairro || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="loj_numero">Número</label>
                    <input
                        type="text"
                        id="loj_numero"
                        name="loj_numero"
                        value={request.loj_numero || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Sexta linha */}
            <div className="form-row">
                <div className="form-group full-width">
                    <label htmlFor="loj_endereco">Endereço</label>
                    <input
                        type="text"
                        id="loj_endereco"
                        name="loj_endereco"
                        value={request.loj_endereco || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Sétima linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_emailloja">E-mail Unidade</label>
                    <input
                        type="text"
                        id="loj_emailloja"
                        name="loj_emailloja"
                        value={request.loj_emailloja || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="loj_emailfinanceiro">E-mail Financeiro</label>
                    <input
                        type="text"
                        id="loj_emailfinanceiro"
                        name="loj_emailfinanceiro"
                        value={request.loj_emailfinanceiro || ''}
                        onChange={handleInputChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_email">E-mail</label>
                    <input
                        type="text"
                        id="loj_email"
                        name="loj_email"
                        value={request.loj_email || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="loj_emailbloqueio">E-mail Bloqueio</label>
                    <input
                        type="text"
                        id="loj_emailbloqueio"
                        name="loj_emailbloqueio"
                        value={request.loj_emailbloqueio || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Oitava linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="loj_codigofinanceiro">Unidade Financeiro</label>
                    <input
                        type="text"
                        id="loj_codigofinanceiro"
                        name="loj_codigofinanceiro"
                        value={request.loj_codigofinanceiro || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="aco_codigo">Área Comercial</label>
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
                <div className="form-group">
                    <label htmlFor="nem_codigo">Nota Empresa</label>
                    <input
                        type="text"
                        id="nem_codigo"
                        name="nem_codigo"
                        value={request.nem_codigo || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Nona linha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="departamento">N Venda Corte</label>
                    <input
                        type="text"
                        id="loj_codigo"
                        name="loj_codigo"
                        value={request.loj_codigo || ''}
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="loj_cortevendedor">Corte Vendedor</label>
                    <input
                        type="text"
                        id="loj_cortevendedor"
                        name="loj_cortevendedor"
                        value={request.loj_cortevendedor || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Décima linha */}
            <div className="form-row">
                <div className="form-group full-width">
                    <label htmlFor="loj_textorelatorio">Texto Relatório Cobrança</label>
                    <input
                        type="text"
                        id="loj_textorelatorio"
                        name="loj_textorelatorio"
                        value={request.loj_textorelatorio || ''}
                        onChange={handleInputChange} />
                </div>
            </div>

            {/* Botões */}
            <div className="form-row">
                <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'580px',borderRadius:'4px' }}
                        onClick={onBackClick} // Chama a função passada como prop
                    />
                {/* Condição para renderizar o botão de exclusão */}
                {request.loj_codigo && (
                <Button
                    label="Excluir"
                    icon="pi pi-trash"
                    style={{marginLeft:'0px',color:'white',width:'100px'}}
                    type="button"
                    className="reset-btn"
                    onClick={handleDeleteClick}
                  />
                )}
                
                <button
                    style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.loj_codigo ? '14px' : '0px',display: request.loj_codigo ? 'none' :''}}
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
        </>
    );
};

export default Unidade;

