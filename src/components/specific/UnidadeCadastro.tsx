import { Button } from "primereact/button"
import { FloatLabel } from "primereact/floatlabel"
import { InputText } from "primereact/inputtext"

const UnidadeCadastro: React.FC = () => {
    return (
        <form onSubmit={(e) => {e.preventDefault(); alert('submit')}} >
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
                        <InputText id="serie_nf" aria-describedby="serie_nf-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="contabil">Contabil</label>
                        <InputText id="contabil" aria-describedby="contabil-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="situacao">Situação</label>
                        <InputText id="situacao" aria-describedby="situacao-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-4">
                    <FloatLabel>
                        <label htmlFor="unidade_venda">Unidade Venda</label>
                        <InputText id="unidade_venda" aria-describedby="unidade_venda-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-8">
                    <FloatLabel>
                        <label htmlFor="responsavel">Responsável</label>
                        <InputText id="responsavel" aria-describedby="responsavel-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-5">
                    <FloatLabel>
                        <label htmlFor="cep">CEP</label>
                        <InputText id="cep" aria-describedby="cep-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-5">
                    <FloatLabel>
                        <label htmlFor="rua">Rua</label>
                        <InputText id="rua" aria-describedby="rua-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col-2">
                    <FloatLabel>
                        <label htmlFor="numero">Número</label>
                        <InputText id="numero" aria-describedby="numero-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="bairro">Bairro</label>
                        <InputText id="bairro" aria-describedby="cep-help" className="rounded" style={{ width: '100%' }} />
                    </FloatLabel>
                </div>
                <div className="col">
                    <FloatLabel>
                        <label htmlFor="cidade">Cidade</label>
                        <InputText id="cidade" aria-describedby="cidade-help" className="rounded" style={{ width: '100%' }} />
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
                    <Button onClick={(e) => { e.preventDefault(); alert("limpar")}} label="Limpar" icon="pi pi-refresh" className="rounded p-button-danger" style={{ width: '80%' }} />
                </div>
            </div>

        </form >
    )
}


export default UnidadeCadastro