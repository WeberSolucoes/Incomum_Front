import axios from 'axios';
import { ApiEndpoints } from '../utils/ApiEndpoints';
import { PermissionsListResponse, LoginRequest, UnidadesCreateRequest } from '../utils/apiObjects';

//#region Axios_configs
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_API_URL, // substitua pela URL base da sua API
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
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
    if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) return null;
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
    return `Bearer ${token}`;
}
export function setToken(token: string, rememberme: boolean) {
    if (token) {
        if (!rememberme) {
            sessionStorage.setItem('token', token);
        }
        else {
            localStorage.setItem('token', token);
        }
    }
}
//#endregion

//#region permissions_config_cache
export function getPermissions() {
    if (!localStorage.getItem('permissions') && !sessionStorage.getItem('permissions')) return [];
    const permissions = localStorage.getItem('permissions') ? localStorage.getItem('permissions') : sessionStorage.getItem('permissions');
    if (!permissions) return [];
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

export const apiPostSendRecoveryEmail = (email: string) => axiosInstance.post(ApiEndpoints.SEND_RECOVERY_EMAIL, { email: email });

export const apiPostMudarSenha = (password: string, uid: string | undefined, token: string | undefined) => axiosInstance.post(`${ApiEndpoints.UPDATE_PASSWORD_CONFIRM}${uid}/${token}/`, { new_password: password });

export const apiPostCreateUnidade = (data: UnidadesCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_UNIDADES, data);

export const apiPutUpdateUnidade = (data: UnidadesCreateRequest, id: number) => axiosInstance.put(`${ApiEndpoints.UPDATE_UNIDADES}${id}/`, data);

export const apiGetUnidades = () => axiosInstance.get(ApiEndpoints.LIST_UNIDADES);

export const apiGetUnidadeById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_UNIDADES_BY_ID}${id}/`);

export const apiGetUnidadeRelatorioByUser = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_UNIDADE_RELATORIO_BY_USER}${id}/`);

export const apiGetAreaComercialRelatorioByUser = (id: number, unidades: number[] | null) => {
    let unidadeUrl = '';
    if (unidades)
        for (let unidade of unidades) {
            unidadeUrl += `unidade=${unidade}&`;
        }
    unidadeUrl = unidadeUrl.slice(0, -1);
    return axiosInstance.get(`${ApiEndpoints.LIST_AREACOMERCIAL_RELATORIO_BY_USER}${id}/?${unidadeUrl}`);
};

export const apiGetVendedorRelatorioByUser = (id: number, unidades: number[] | null) => {
    let unidadeUrl = '';
    if (unidades)
        for (let unidade of unidades) {
            unidadeUrl += `unidade=${unidade}&`;
        }
    unidadeUrl = unidadeUrl.slice(0, -1);
    return axiosInstance.get(`${ApiEndpoints.LIST_VENDEDOR_RELATORIO_BY_USER}${id}/?${unidadeUrl}`);
};

export const apiGetAgenciaRelatorioByUser = (id: number, areas: number[] | null) => {
    let areaUrl = '';
    if (areas)
        for (let area of areas) {
            areaUrl += `areaComercial=${area}&`;
        }
    areaUrl = areaUrl.slice(0, -1);
    return axiosInstance.get(`${ApiEndpoints.LIST_AGENCIA_RELATORIO_BY_USER}${id}/?${areaUrl}`);
};

export const apiGetRelatorioFindByFilter = (data: any) => {
    let url = '';
    if (data.areasComerciais)
        for (let area of data.areasComerciais) {
            url += `areaComercial=${area}&`;
        }
    if (data.agencias)
        for (let agencia of data.agencias) {
            url += `agencia=${agencia}&`;
        }
    if (data.vendedores)
        for (let vendedor of data.vendedores) {
            url += `vendedor=${vendedor}&`;
        }
    if (data.unidades)
        for (let unidade of data.unidades) {
            url += `unidade=${unidade}&`;
        }
    if (data.page && data.pageSize) {
        url += `page=${data.page}&pageSize=${data.pageSize}&`
    }
    if (data.dataInicio && data.dataFim) {
        url += `dataInicio=${data.dataInicio}&dataFim=${data.dataFim}`;
    }
    return axiosInstance.get(`${ApiEndpoints.LIST_RELATORIO_FINDALL_BY_FILTERS}?${url}`);
};
//#endregion
