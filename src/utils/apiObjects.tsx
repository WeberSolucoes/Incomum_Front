interface LoginRequest {
    email: string | null
    password: string
}

interface LoginResponse {
    access: string
    refresh: string
}

interface PermissionsListResponse {
    id: number
    name: string
}

interface UnidadesListResponse {
    "codigo": number,
    "descricao": string,
    "responsavel": string | null,
    "email": string | null,
}

interface AgenciaListResponse {
    "codigo": number,
    "descricao": string,
    "responsavel": string | null,
    "email": string | null,
}

interface VendedorListResponse {
    "codigo": number,
    "descricao": string,
    "responsavel": string | null,
    "email": string | null,
}

interface AreaComercialResponse {
    "codigo": number,
    "descricao": string,
    "situacao": number,
    "rateio": number,
}

interface LojaComercialResponse{
    "lojcodigo": number,
    "acocodigo": number,
}

interface LojaComercialCreateRequest {
    loj_codigo: number,
    aco_codigo: number,
}

interface UnidadesCreateRequest {
    loj_cep: string,
    loj_numero: number,
    loj_descricao: string | null,
    loj_responsavel: string | null,
    loj_email: string | null,
    loj_endereco: string | null,
    loj_bairro: string | null,
    cep_codigo: number | any,
    cid_codigo: number | any,
    loj_fone: string | null,
    loj_fax: string | null,
    loj_emailloja: string | null,
    loj_emailfinanceiro: string | null,
    loj_textorelatorio: string | null,
    loj_cnpj: string | null,
    loj_serie: number | any,
    loj_codigoempresa: number | any,
    loj_emailbloqueio: string | null,
    loj_situacao: number | any,
    loj_codigofinanceiro: number | any,
    loj_vendacorte: number | any,
    loj_contrato: number | any,
    loj_cortevendedor: number | any,
    nem_codigo: number | any,
    aco_codigo: number | any,

}

interface UnidadesByIdResponse {
    loj_descricao: string | null,
    loj_responsavel: string | null,
    loj_email: string | null,
    loj_endereco: string | null,
    loj_bairro: string | null,
    cep_codigo: number | any,
    cid_codigo: number | any,
    loj_fone: string | null,
    loj_fax: string | null,
    loj_emailloja: string | null,
    loj_emailfinanceiro: string | null,
    loj_textorelatorio: string | null,
    loj_cnpj: string | null,
    loj_serie: number | any,
    loj_codigoempresa: number | any,
    loj_emailbloqueio: string | null,
    loj_situacao: number | any,
    loj_codigofinanceiro: number | any,
    loj_vendacorte: number | any,
    loj_contrato: number | any,
    loj_cortevendedor: number | any,
    nem_codigo: number | any,
    aco_codigo: number | any
}

interface AgenciaCreateRequest{
    age_celular: string
    age_codigoprincipal: string
    ban_codigo: string
    age_codigocontabil: string
    age_codigoimportacao: string
    age_cep: string
    age_numero: string
    age_descricao: string | null,
    age_endereco: string | null,
    age_bairro: string | null,
    cid_codigo: number | any,
    age_fone: string | null,
    age_fax: string | null,
    age_cnpj: string | null,
    age_situacao: number | any,
    aco_codigo: number | any,
    age_observacao: string | null,
    age_agencia: string | null,
    age_contacorrente: string | null,
    age_comissao: string | null,
    age_over: string | null,
    age_descricaosite: string | null,
    age_inscricaomunicipal: string | null,
    age_markup: string | null,
    age_razaosocial: string | null,
}

interface VendedorCreateRequest{
    ven_descricao: string
    ven_cep: string
    ven_numero: number
    loj_codigo: number | any,
    ven_endereco: string | null,
    ven_bairro: string | null,
    cid_codigo: number | any,
    ven_fone: string | null,
    ven_celular: string | null,
    ven_cpf: string | null,
    ven_situacao: number | any,
    aco_codigo: number | any,
    ven_descricaoweb: string | null,
    ven_agencia: number | null,
    ven_descricaoauxiliar: string | null,
    ven_codigoimportacao: string | null,
    ven_contacorrente: number | null,
    ban_codigo: string | null,
    ven_observacao: string | null,
    ven_email: string | null,
    sve_codigo: string | null,
}

interface AgenteCreateRequest{
    agt_descricao: string
    agt_cpf: number
    age_codigo: number
    agt_cep: string,  // Adicionando campo 'agt_cep'
    agt_endereco: String,    // Adicionando campo 'agt_rua'
    agt_numero: string,  // Adicionando campo 'agt_numero'
    agt_bairro: string,  // Adicionando campo 'agt_bairro'
    cid_codigo: string,  // Adicionando campo 'agt_cidade'
    agt_fone: number,    // Adicionando campo 'agt_fone'
    agt_celular: number,  // Adicionando campo 'agt_celular'
    agt_comissao: number,     // Adicionando campo 'agt_over'
    agt_email: string,   // Adicionando campo 'agt_email'
    ban_codigo: number,   // Adicionando campo 'agt_banco'
    agt_contacorrente: number, // Adicionando campo 'agt_conta_corrente  
}
interface AeroportoCreateRequest{
    aer_descricao: string;
    cid_codigo: number;
    aer_observacao: string;
    aer_fone: string;
    aer_email: string;
}

interface AreaComercialCreateRequest{
    aco_codigo: number | any;
    aco_descricao: string;
    aco_situacao: number;
    aco_rateio: number; 
}

interface MoedaCreateRequest{
    moe_descricao: string,
    moe_abreviacao: string,
    moe_simbolo: string,
    moe_codigogeral: number
}

interface CepCreateRequest{
    cep_logradouro: string,
    cep_bairro: string,
    cid_codigo: number,
    cep_numero: string,
    tlo_codigo: number
}

interface CompanhiaCreateRequest{
    com_descricao: string,
    com_divisao: string,
    com_parcelaminima: number,
    com_sequencial: number,
    com_sigla: string,
    par_codigo: number
}

interface AssinaturaCreateRequest{
    ass_descricao: string,
    com_codigo: number,
    ass_tipoassinatura: number,
    ass_codigocontabil: number,
    loj_codigobase: string,
    cta_codigobase: number,
    cta_codigosaida: number
}

interface PaisCreateRequest{
    pai_descricao: string
}

interface DepartamentoCreateRequest{
    dep_descricao: string
}

interface ClasseCreateRequest{
    cla_descricao: string
    cla_observacao: string
}

interface CidadeCreateRequest{
    cid_descricao: string
    cid_estado: string
    reg_codigo: number
    cid_pais: string 
    cid_sigla: string 
    pai_codigo: string
}

interface AcomodacaoCreateRequest{
    tac_descricao: string,
    tac_qtde: number,
    tac_descricaoportugues: string,
    tac_descricaoingles: string,
}

interface PadraoCreateRequest{
    tpa_descricao: string,
    tpa_principal: number,
    tpa_descricaoportugues: string,
    tpa_descricaoingles: string,
}

interface RegimeCreateRequest{
    tre_descricao: string,
    tre_descricaoportugues: string,
    tre_descricaoingles: string,
}

interface SituacaoTuristicoCreateRequest{
    stu_descricao: string
}

interface ServicoTuristicoCreateRequest{
    ser_descricao: string
    cid_codigo: number
    ser_livre: string

}

interface BandeiraCreateRequest{
    ban_descricao: string,
    ban_codigocielo: number
}

interface FormaDePagamentoCreateRequest{
    for_descricao: string
}

interface ParceiroCreateRequest{
    par_descricao: string,
    par_tipopessoa: string,
    par_cnpjcpf: string,
    par_rgie: string,
    par_datanascfund: Date,
    par_fone1: string,
    par_fone2: string,
    par_celular: string,
    par_fax: string,
    par_endereco: string,
    par_bairro: string,
    par_numero: string,
    par_complemento: string,
    cid_codigo: string,
    par_cep: string,
    par_obs: string,
    par_email: string,
    par_site: string,
    par_datacadastro: Date,
    par_dataatualizacao: Date,
    spa_codigo: number,
    tcr_codigo: number,
    par_percentualdesconto: number,
    par_diasprazo: number,
    par_codigocontabil: number,
    par_atualiza: string,
    par_pagamentoentrada: number,
    par_pagamentosaida: number,
    cta_codigo: number,
    par_razaosocial: string,
    par_whatsapp: string,
    par_codigoimportacao: number,
}

interface ParceiroContatoCreateRequest{
    par_codigo: number,
    tco_codigo: number,
    pco_descricao: string,
    pco_fone: string,
    pco_celular: string,
    pco_observacao:string,
    pco_datacadastro:string,
}

interface BancoCreateRequest{
    ban_descricao: string
    ban_codigobancario: number
}

interface DespesasGeralCreateRequest{
    grc_descricao: string
    mgr_codigo: number
}

interface SubGrupoCreateRequest{
    sbc_descricao: string
    grc_codigo: number
}

interface DespesasCreateRequest{
    mgr_descricao: string
}

interface CentroCustoCreateRequest{
    cta_descricao: string
    sbc_codigo: number
    tdu_codigo: number
    cta_codigocontabil: string
    cta_exclusivo: number
    cta_tipo:string
    cta_rateio: number
    cta_justificativa: string
}

export type {
    LoginRequest,
    LoginResponse,
    PermissionsListResponse,
    UnidadesListResponse,
    UnidadesCreateRequest,
    UnidadesByIdResponse,
    AgenciaListResponse,
    VendedorListResponse,
    AgenciaCreateRequest,
    VendedorCreateRequest,
    AgenteCreateRequest,
    AeroportoCreateRequest,
    AreaComercialCreateRequest,
    AreaComercialResponse,
    LojaComercialCreateRequest,
    LojaComercialResponse,
    PaisCreateRequest,
    CidadeCreateRequest,
    MoedaCreateRequest,
    CepCreateRequest,
    DepartamentoCreateRequest,
    CompanhiaCreateRequest,
    AssinaturaCreateRequest,
    ClasseCreateRequest,
    AcomodacaoCreateRequest,
    PadraoCreateRequest,
    RegimeCreateRequest,
    SituacaoTuristicoCreateRequest,
    ServicoTuristicoCreateRequest,
    BandeiraCreateRequest,
    FormaDePagamentoCreateRequest,
    ParceiroCreateRequest,
    ParceiroContatoCreateRequest,
    BancoCreateRequest,
    DespesasCreateRequest,
    DespesasGeralCreateRequest,
    SubGrupoCreateRequest,
    CentroCustoCreateRequest,

}

