import { Button } from "primereact/button"
import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"
import { UnidadesCreateRequest } from "../../utils/apiObjects"
import { useEffect, useState } from "react"
import { apiGetAreas, apiGetUnidadeById, apiPostCreateUnidade, apiPutUpdateUnidade } from "../../services/Api"
import axios from "axios"
import { useCodigo } from "../../contexts/CodigoProvider"
import { InputNumber } from "primereact/inputnumber"
import InputMask from 'react-input-mask';
import { ToggleButton } from 'primereact/togglebutton';
import { toastError, toastSucess } from "../../utils/customToast"
import { MultiSelect } from "primereact/multiselect"


function UnidadeCadastro() {
    const { codigo } = useCodigo();
    const [request, setRequest] = useState<UnidadesCreateRequest>({} as UnidadesCreateRequest);
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [loading, setLoading] = useState(false);
    const [areasComerciais, setAreasComerciais] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return;
            try {
                const response = await apiGetUnidadeById(codigo);
                const unidade = response.data;
                setRequest(unidade);
                setSelectedAreas(unidade.areasComerciais.map((area: any) => area.aco_codigo));
                setChecked(unidade.loj_situacao === 1);

                const responseCidade = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${unidade.cid_codigo}`);
                setRua(unidade.loj_endereco.split(",")[0]);
                setNumero(unidade.loj_endereco.split(",")[1]);
                setCidade(responseCidade.data.nome);
            } catch (error) {
                console.error("Error fetching data:", error);
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
            }
        };
        fetchAreasComerciais();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleMultiSelectChange = (e: any) => {
        setSelectedAreas(e.value);
        setRequest(prevState => ({ ...prevState, areasComerciais: e.value }));
    };

    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            request.loj_endereco = `${rua}, ${numero}`;
            request.aco_codigo = selectedAreas.map(area => ({ aco_codigo: area }));
            request.loj_situacao = checked ? 1 : 0;

            let response;
            if (request.loj_codigo) {
                response = await apiPutUpdateUnidade(request, request.loj_codigo);
            } else {
                response = await apiPostCreateUnidade(request);
            }

            if (response.status === 200 || response.status === 201) {
                toastSucess("Unidade salva com sucesso");
            } else {
                toastError("Erro ao salvar a unidade");
            }
        } catch (error: any) {
            console.error("Error:", error);
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
    };

    const handleCepApi = async (e: React.FocusEvent<HTMLInputElement>) => {
        e.preventDefault();
        const cep = e.target.value.replace('-', '');
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setRua(data.logradouro);
                setCidade(data.localidade);
                setRequest(prevState => ({
                    ...prevState,
                    'cid_codigo': `${data.ibge}`,
                    'loj_bairro': `${data.bairro}`
                }));
            } catch (error) {
                console.error("Error fetching CEP data:", error);
            }
        }
    };


    return (
        <form onSubmit={handlerSubmit} >
            {/* AJUSTAR AQUI CONTABIL */}
            <div className="row mt-4">
                <div className="col-sm-3 mb-4">
                    <FloatLabel>
                        <label htmlFor="codigo">Código</label>
                        <InputText value={request.loj_codigo} onChange={handleChange} disabled id="loj_codigo" aria-describedby="codigo-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm-3 mb-4">
                    <FloatLabel>
                        <label htmlFor="serie_nf">Serie NF</label>
                        <InputText value={request.loj_serie} onChange={handleChange} id="loj_serie" aria-describedby="serie_nf-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm-3 mb-4">
                    <FloatLabel>
                        <label htmlFor="contabil">Contabil</label>
                        <InputText value={request.loj_serie} onChange={handleChange} id="contabil" aria-describedby="contabil-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm-3 mb-4">
                        <label style={{display:'block',marginTop:'-24px'}} htmlFor="situacao">Situação</label>
                        <ToggleButton
                            value={request.loj_situacao}
                            checked={checked}
                            onChange={(e) => setChecked(e.value)}
                            onLabel="ATIVO"   // Texto quando o botão está ativado
                            offLabel="INATIVO" // Texto quando o botão está desativado
                            onIcon="pi pi-check" // Você pode ajustar o ícone para representar "ATIVO"
                            offIcon="pi pi-times"
                            className="custom-toggle-button"
                        />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-4 mb-4">
                    <FloatLabel>
                        <label htmlFor="unidade_venda">Unidade Venda</label>
                        <InputText value={request.loj_descricao} onChange={handleChange} id="loj_descricao" aria-describedby="unidade_venda-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm-8 mb-4">
                    <FloatLabel>
                        <label htmlFor="responsavel">Responsável</label>
                        <InputText value={request.loj_responsavel} onChange={handleChange} id="loj_responsavel" aria-describedby="responsavel-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-5 mb-4">
                    <FloatLabel>
                        <label htmlFor="cep_codigo">CEP</label>
                        <InputMask
                            mask="99999-999"
                            value={request.cep_codigo || ''}
                            onChange={handleCepChange}
                            onBlur={handleCepApi}
                            id="cep_codigo"
                            aria-describedby="cep-help"
                            className="rounded"
                            style={{ width: '100%' }}
                        >
                            {(inputProps: any) => <InputText {...inputProps} />}
                        </InputMask>
                    </FloatLabel>
                </div>
                <div className="col-sm-5 mb-4">
                    <FloatLabel>
                        <label htmlFor="rua">Rua</label>
                        <InputText disabled value={rua} onChange={(e) => setRua(e.target.value as any)} id="rua" aria-describedby="rua-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm-2 mb-4">
                    <FloatLabel>
                        <label htmlFor="numero">Número</label>
                        <InputNumber inputStyle={{width:'100px'}} value={numero} onChange={(e) => setNumero(e.target.value as any)} id="numero" aria-describedby="numero-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col-sm mb-4">
                    <FloatLabel>
                        <label htmlFor="bairro">Bairro</label>
                        <InputText disabled value={request.loj_bairro} onChange={handleChange} id="loj_bairro" aria-describedby="cep-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm mb-4">
                    <FloatLabel>
                        <label htmlFor="cidade">Cidade</label>
                        <InputText disabled value={cidade} onChange={(e) => setCidade(e.target.value as any)} id="cidade" aria-describedby="cidade-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-5 mb-4">
                    <FloatLabel>
                        <label htmlFor="loj_fone">Fone</label>
                        <InputMask
                            mask="(99) 9 9999-9999"
                            value={request.loj_fone || ''}
                            onChange={handleFoneChange}
                            onBlur={handleCepApi}
                            id="loj_fone"
                            aria-describedby="cep-help"
                            className="rounded"
                            style={{ width: '100%' }}
                        >
                            {(inputProps: any) => <InputText {...inputProps} />}
                        </InputMask>
                    </FloatLabel>
                </div>
                <div className="col-sm-5 mb-4">
                    <FloatLabel>
                        <label htmlFor="fax">FAX</label>
                        <InputText value={request.loj_fax} onChange={handleChange} id="loj_fax" aria-describedby="fax-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm-2 mb-4">
                    <FloatLabel>
                        <label htmlFor="loj_cnpj">CNPJ</label>
                        <InputMask
                            mask="99.999.999/9999-99"
                            value={request.loj_cnpj|| ''}
                            onChange={handleCnpjChange}
                            id="loj_cnpj"
                            aria-describedby="cep-help"
                            className="rounded"
                            style={{ width: '100%' }}
                        >
                            {(inputProps: any) => <InputText {...inputProps} />}
                        </InputMask>
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col-sm mb-4">
                    <FloatLabel>
                        <label htmlFor="email_unidade">Email Unidade</label>
                        <InputText value={request.loj_emailloja} onChange={handleChange} id="loj_emailloja" aria-describedby="email_unidade-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm mb-4">
                    <FloatLabel>
                        <label htmlFor="email_financeiro">Email Financeiro</label>
                        <InputText value={request.loj_emailfinanceiro} onChange={handleChange} id="loj_emailfinanceiro" aria-describedby="email_financeiro-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col mb-4">
                    <FloatLabel>
                        <label htmlFor="email">Email</label>
                        <InputText value={request.loj_email} onChange={handleChange} id="loj_email" aria-describedby="email-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col mb-4">
                    <FloatLabel>
                        <label htmlFor="email_bloqueio">Email Bloqueio</label>
                        <InputText value={request.loj_emailbloqueio} onChange={handleChange} id="loj_emailbloqueio" aria-describedby="email_bloqueio-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            {/* AJUSTAR AQUI */}
            <div className="row">
                <div className="col-sm mb-4">
                    <FloatLabel>
                        <label htmlFor="unidade_financeiro">Unidade Financeiro</label>
                        <InputText id="unidade_financeiro" aria-describedby="unidade_financeiro-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm mb-4">
                    <FloatLabel>
                        <label htmlFor="area_comercial">Área Comercial</label>
                        <MultiSelect
                            value={selectedAreas}
                            options={areasComerciais}
                            onChange={handleMultiSelectChange}
                            placeholder="Selecione as Áreas Comerciais"
                            display="chip"
                            style={{width:'100%'}}
                        />
                    </FloatLabel>
                </div>
                <div className="col-sm mb-4">
                    <FloatLabel>
                        <label htmlFor="nota_empresa">Nota Empresa</label>
                        <InputText value={request.nem_codigo} onChange={handleChange} id="nem_codigo" aria-describedby="nota_empresa-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-3 mb-4">
                    <FloatLabel>
                        <label htmlFor="numero_venda_corte">N.Venda Corte</label>
                        <InputText value={request.loj_vendacorte} onChange={handleChange} id="loj_vendacorte" aria-describedby="numero_venda_corte-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-sm-3 mb-4">
                    <FloatLabel>
                        <label htmlFor="corte_vendedor">Corte Vendedor</label>
                        <InputText value={request.loj_cortevendedor} onChange={handleChange} id="loj_cortevendedor" aria-describedby="corte_vendedor-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row">
                <div className="col mb-4">
                    <FloatLabel>
                        <label htmlFor="texto_relatorio_cobranca">Texto Relatório de Cobrança</label>
                        <InputText value={request.loj_textorelatorio} onChange={handleChange} id="loj_textorelatorio" aria-describedby="texto_relatorio_cobranca-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-2">
                    <Button type="submit" loading={loading} label="Salvar" icon="pi pi-check" className="rounded p-button-success" style={{ width: '100%' }} />
                </div>
                <div className="col-2">
                    <Button onClick={handleReset} label="Limpar" icon="pi pi-refresh" className="rounded p-button-danger" style={{ width: '100%' }} />
                </div>
            </div>

        </form >
    )
}


export default UnidadeCadastro