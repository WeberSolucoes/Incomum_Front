import { Button } from "primereact/button"
import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"
import { UnidadesCreateRequest } from "../../utils/ApiObjects"
import { useState } from "react"
import { apiPostCreateUnidade } from "../../services/Api"
import { toastError } from "../../utils/customToast"
import axios from "axios"

const UnidadeCadastro: React.FC = () => {
    const [request,setRequest] = useState<UnidadesCreateRequest>({} as UnidadesCreateRequest)
    const [rua,setRua] = useState()
    const [numero,setNumero] = useState()
    const [cidade, setCidade] = useState()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRequest(prevState => ({ ...prevState, [id]: value }));
    };

    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setRequest(prevState => ({ ...prevState, 'loj_endereco': `${rua}, ${numero}` }));
            console.log(request);
            const response = await apiPostCreateUnidade(request);
            alert('Unidade criada com sucesso!');
            console.log(response.data);
        } catch (error:any) {
            console.log(error.data);
            toastError('Erro ao criar unidade:');
            console.error('Erro ao criar unidade:', error);
            alert('Erro ao criar unidade!');
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
            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="codigo">Código</label>
                        <InputText disabled id="codigo" aria-describedby="codigo-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="serie_nf">Serie NF</label>
                        <InputText value={request.loj_serie} onChange={handleChange} id="serie_nf" aria-describedby="serie_nf-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="contabil">Contabil</label>
                        <InputText value={request.loj_serie} onChange={handleChange} id="contabil" aria-describedby="contabil-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="situacao">Situação</label>
                        <InputText value={request.loj_situacao} onChange={handleChange} id="situacao" aria-describedby="situacao-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-4">
                    <FloatLabel>
                        <label htmlFor="unidade_venda">Unidade Venda</label>
                        <InputText value={request.loj_descricao} onChange={handleChange} id="unidade_venda" aria-describedby="unidade_venda-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-8">
                    <FloatLabel>
                        <label htmlFor="responsavel">Responsável</label>
                        <InputText value={request.loj_responsavel} onChange={handleChange} id="responsavel" aria-describedby="responsavel-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-5">
                    <FloatLabel>
                        <label htmlFor="cep">CEP</label>
                        <InputText value={request.cep_codigo} onBlur={handleCepApi} onChange={handleChange} id="cep_codigo" aria-describedby="cep-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-5">
                    <FloatLabel>
                        <label htmlFor="rua">Rua</label>
                        <InputText disabled value={rua} onChange={(e) => setRua(e.target.value as any)} id="rua" aria-describedby="rua-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-2">
                    <FloatLabel>
                        <label htmlFor="numero">Número</label>
                        <InputText value={numero} onChange={(e) => setNumero(e.target.value as any)} id="numero" aria-describedby="numero-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="bairro">Bairro</label>
                        <InputText disabled value={request.loj_bairro} onChange={handleChange} id="bairro" aria-describedby="cep-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="cidade">Cidade</label>
                        <InputText disabled value={cidade} onChange={(e) => setCidade(e.target.value as any)} id="cidade" aria-describedby="cidade-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-5">
                    <FloatLabel>
                        <label htmlFor="fone">Fone</label>
                        <InputText id="fone" aria-describedby="fone-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-5">
                    <FloatLabel>
                        <label htmlFor="fax">FAX</label>
                        <InputText id="fax" aria-describedby="fax-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-2">
                    <FloatLabel>
                        <label htmlFor="cnpj">CNPJ</label>
                        <InputText id="cnpj" aria-describedby="cnpj-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="email_unidade">Email Unidade</label>
                        <InputText id="email_unidade" aria-describedby="email_unidade-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="email_financeiro">Email Financeiro</label>
                        <InputText id="email_financeiro" aria-describedby="email_financeiro-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="email">Email</label>
                        <InputText id="email" aria-describedby="email-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="email_bloqueio">Email Bloqueio</label>
                        <InputText id="email_bloqueio" aria-describedby="email_bloqueio-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="unidade_financeiro">Unidade Financeiro</label>
                        <InputText id="unidade_financeiro" aria-describedby="unidade_financeiro-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="area_comercial">Área Comercial</label>
                        <InputText id="area_comercial" aria-describedby="area_comercial-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="nota_empresa">Nota Empresa</label>
                        <InputText id="nota_empresa" aria-describedby="nota_empresa-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-3">
                    <FloatLabel>
                        <label htmlFor="numero_venda_corte">N.Venda Corte</label>
                        <InputText id="numero_venda_corte" aria-describedby="numero_venda_corte-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-3">
                    <FloatLabel>
                        <label htmlFor="corte_vendedor">Corte Vendedor</label>
                        <InputText id="corte_vendedor" aria-describedby="corte_vendedor-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="texto_relatorio_cobranca">Texto Relatório de Cobrança</label>
                        <InputText id="texto_relatorio_cobranca" aria-describedby="texto_relatorio_cobranca-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row justify-content-center mt-4">
                <div className="col-2">
                    <Button type="submit" label="Salvar" icon="pi pi-check" className="rounded p-button-success" style={{ width: '80%' }} />
                </div>
                <div className="col-2">
                    <Button onClick={handleReset} label="Limpar" icon="pi pi-refresh" className="rounded p-button-danger" style={{ width: '80%' }} />
                </div>
            </div>

        </form >
    )
}


export default UnidadeCadastro