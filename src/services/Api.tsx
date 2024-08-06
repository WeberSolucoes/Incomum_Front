import axios from 'axios';
import { ApiEndpoints } from '../utils/ApiEndpoints';
import { PermissionsListResponse, LoginRequest, UnidadesCreateRequest } from '../utils/apiObjects';

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
    localStorage.removeItem('permissions');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('permissions');
};

//#region Apis_endpoints
export const apiGetUserId = () => axiosInstance.get(ApiEndpoints.GET_USERID);

export const apiGetPermissions = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_USER_PERMISSIONS}${id}/`);

export const apiPostlogin = (data: LoginRequest) => axiosInstance.post(ApiEndpoints.LOGIN, data);

export const apiPostSendRecoveryEmail = (email: string) => axiosInstance.post(ApiEndpoints.SEND_RECOVERY_EMAIL, {email: email});

export const apiPostMudarSenha = (password: string, uid: string | undefined, token: string | undefined) => axiosInstance.post(`${ApiEndpoints.UPDATE_PASSWORD_CONFIRM}${uid}/${token}/`, {new_password: password});

export const apiPostCreateUnidade = (data: UnidadesCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_UNIDADES, data);

export const apiPutUpdateUnidade = (data: UnidadesCreateRequest, id: number) => axiosInstance.put(`${ApiEndpoints.UPDATE_UNIDADES}${id}/`, data);

export const apiGetUnidades = () => axiosInstance.get(ApiEndpoints.LIST_UNIDADES);

export const apiGetUnidadeById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_UNIDADES_BY_ID}${id}/`);
//#endregion

export const fetchAreaComercial = async () => {
    try {
        const response = await axiosInstance.get('/incomum/areacomercial/list-all/');
        console.log('Dados recebidos da API:', response.data); // Log
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar áreas comerciais:', error);
        throw error;
    }
};

export const fetchRelatorioList = async (params) => {
    try {
        const response = await axiosInstance.get('/incomum/relatorio/list-all/', { params });
        console.log('Dados recebidos da API:', response.data); // Verifique se os dados são recebidos aqui
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        throw error;
    }
};

export const fetchFiltraUnidade = async () => {
    try {
      // Substitua '/api/filtraunidade/' pelo endpoint real que retorna as áreas comerciais
      const response = await axiosInstance.get('/incomum/relatorio/unidade');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de unidades:', error);
      throw error;
    }
  };