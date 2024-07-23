import axios from 'axios';
import { ApiEndpoints } from '../utils/ApiEndpoints';
import { PermissionsListResponse, LoginRequest } from '../utils/ApiObjects';

//#region Axios_configs
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api', // substitua pela URL base da sua API
    timeout: 5000,
    headers: { 'Content-Type': 'application/json'}
});
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
//#endregion

//#region token_config_cache
export function getToken() {
    if(!localStorage.getItem('token')&&!sessionStorage.getItem('token')) return null;
    const token = localStorage.getItem('token')? localStorage.getItem('token') : sessionStorage.getItem('token');
    return `Bearer ${token}`;
}
export function setToken(token: string, rememberme: boolean) {
    if(token){
        if(!rememberme){
            sessionStorage.setItem('token', token);
        }
        else{
            localStorage.setItem('token', token);
        }
    }
}
//#endregion

//#region permissions_config_cache
export function getPermissions() {
    console.log("LOCAL"+ localStorage.getItem('permissions'), "SESSION"+ sessionStorage.getItem('permissions'))
    if(!localStorage.getItem('permissions')&&!sessionStorage.getItem('permissions')) return [];
    const permissions = localStorage.getItem('permissions')? localStorage.getItem('permissions') : sessionStorage.getItem('permissions');
    if(!permissions) return [];
    return JSON.parse(permissions);
}
export function setPermissions(permissions: PermissionsListResponse[], rememberme: boolean) {
    if (permissions) {
        if (!rememberme) {
            sessionStorage.setItem('permissions', JSON.stringify(permissions));
        } else {
            localStorage.setItem('permissions', JSON.stringify(permissions));
        }
    }
}
//#endregion

export const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
};

//#region Apis_endpoints
export const userId = () => axiosInstance.get(ApiEndpoints.GET_USERID);

export const permissions = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_USER_PERMISSIONS}${id}/`);

export const login = (data: LoginRequest) => axiosInstance.post(ApiEndpoints.LOGIN, data);

export const sendRecoveryEmail = (email: string) => axiosInstance.post(ApiEndpoints.SEND_RECOVERY_EMAIL, {email: email});

export const mudarSenha = (password: string, uid: string | undefined, token: string | undefined) => axiosInstance.post(`${ApiEndpoints.UPDATE_PASSWORD_CONFIRM}${uid}/${token}/`, {new_password: password});

//#endregion