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

}

