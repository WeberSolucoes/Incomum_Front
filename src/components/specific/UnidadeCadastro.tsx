import { Button } from "primereact/button"
import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"
import { UnidadesCreateRequest } from "../../utils/apiObjects"
import { useEffect, useState } from "react"
import { apiGetUnidadeById, apiPostCreateUnidade, apiPutUpdateUnidade } from "../../services/Api"
import { toastError, toastSucess } from "../../utils/customToast"
import axios from "axios"
import { useCodigo } from "../../contexts/CodigoProvider"

function UnidadeCadastro() {
    const { codigo } = useCodigo()
    const [request, setRequest] = useState<UnidadesCreateRequest>({} as UnidadesCreateRequest)
    const [rua, setRua] = useState()
    const [numero, setNumero] = useState()
    const [cidade, setCidade] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!codigo) return
            const response = await apiGetUnidadeById(codigo)
            const unidade: any = response.data
            setRequest(({ ...response.data }));
            const responseCidade = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${response.data['cid_codigo']}`);
            setRua(unidade.loj_endereco.split(",")[0])
            setNumero(unidade.loj_endereco.split(",")[1])
            setCidade(responseCidade.data.nome)
        }
        fetchData();

    }, [codigo])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };
    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            request.loj_endereco = `${rua}, ${numero}`
            setRequest(prevState => ({ ...prevState }));
            if (request.loj_codigo) {
                await apiPutUpdateUnidade(request, request.loj_codigo)
                toastSucess("Unidade atualizada com sucesso");
            }
            else {
                await apiPostCreateUnidade(request);
                toastSucess("Unidade criada com sucesso");
            }
        } catch (error: any) {
            console.log(error)
            if (error.response.code = 0) {
                toastError("Algo de errado com o servidor, tente novamente mais tarde");
                return
            }
            toastError("Verifique os campos e tente novamente");
        }
        finally {
            setLoading(false)
        }
    }
    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setRequest({} as UnidadesCreateRequest)
    }

    const handleCepApi = async (e: React.FocusEvent<HTMLInputElement>) => {
        e.preventDefault();
        const cep = e.target.value
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        setRua(data.logradouro);
        setCidade(data.localidade);
        setRequest(prevState => ({ ...prevState, 'cid_codigo': `${data.ibge}` }));
        setRequest(prevState => ({ ...prevState, 'loj_bairro': `${data.bairro}` }))
    }

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
                    <FloatLabel>
                        <label htmlFor="situacao">Situação</label>
                        <InputText value={request.loj_situacao} onChange={handleChange} id="loj_situacao" aria-describedby="situacao-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
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
                        <label htmlFor="cep">CEP</label>
                        <InputText value={request.cep_codigo} onBlur={handleCepApi} onChange={handleChange} id="cep_codigo" aria-describedby="cep-help" className="rounded" style={{ width: '100%' }} />
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
                        <InputText value={numero} onChange={(e) => setNumero(e.target.value as any)} id="numero" aria-describedby="numero-help" className="rounded" style={{ width: '100%' }} />
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
                        <label htmlFor="fone">Fone</label>
                        <InputText value={request.loj_fone} onChange={handleChange} id="loj_fone" aria-describedby="fone-help" className="rounded" style={{ width: '100%' }} />
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
                        <label htmlFor="cnpj">CNPJ</label>
                        <InputText value={request.loj_cnpj} onChange={handleChange} id="loj_cnpj" aria-describedby="cnpj-help" className="rounded" style={{ width: '100%' }} />
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
                        <InputText id="area_comercial" aria-describedby="area_comercial-help" className="rounded" style={{ width: '100%' }} />
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