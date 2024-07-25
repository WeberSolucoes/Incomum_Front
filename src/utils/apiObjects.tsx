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
    id: number;
    nome: string;
    sigla: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
    user?: any;
    ativo: boolean;
    permissoes?: any;
    permissoes_id?: number | null;
}
interface UnidadesCreateRequest {

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
    loj_homepage: string | null,
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
export type {
    LoginRequest,
    LoginResponse,
    PermissionsListResponse,
    UnidadesListResponse,
    UnidadesCreateRequest
}