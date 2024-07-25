interface LoginRequest{
    email: string
    password: string
}
interface LoginResponse{
    access: string
    refresh: string
}
interface PermissionsListResponse{
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
export type {
    LoginRequest, 
    LoginResponse,
    PermissionsListResponse,
    UnidadesListResponse
}