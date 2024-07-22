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
export type {
    LoginRequest, 
    LoginResponse,
    PermissionsListResponse
}