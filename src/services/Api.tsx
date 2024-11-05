import axios from 'axios';
import { ApiEndpoints } from '../utils/ApiEndpoints';
import { PermissionsListResponse, LoginRequest, UnidadesCreateRequest, AgenciaCreateRequest, VendedorCreateRequest } from '../utils/apiObjects';

//#region Axios_configs
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_API_URL, // substitua pela URL base da sua API
    timeout: 1500000,
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

export const apiDeleteUnidade = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_UNIDADES}${id}/`)

export const apiGetAgencia = () => axiosInstance.get(ApiEndpoints.LIST_AGENCIA)

export const apiPostCreateAgencia = (data: AgenciaCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_AGENCIA, data);

export const apiDeleteAgencia = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_AGENCIA}${id}/`)

export const apiGetAgenciaById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_AGENCIA_BY_ID}${id}/`)

export const apiPutUpdateAgencia = (id: number,data: AgenciaCreateRequest) => axiosInstance.put(`${ApiEndpoints.EDIT_AGENCIA}${id}/`, data)

export const apiGetVendedor = () => axiosInstance.get(ApiEndpoints.LIST_VENDEDOR)

export const apiPostCreateVendedor = (data: VendedorCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_VENDEDOR, data);

export const apiGetVendedorById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_VENDEDOR_BY_ID}${id}/`)

export const apiPutUpdateVendedor = (id: number) => axiosInstance.put(`${ApiEndpoints.EDIT_VENDEDOR}${id}/`)

export const apiDeleteVendedor = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_VENDEDOR}${id}/`)

export const apiGetAreas = () => axiosInstance.get(ApiEndpoints.LIST_AREAS);

export const apiGetArea = () => axiosInstance.get(ApiEndpoints.LIST_AREA);
 
export const apiGetUnidadeById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_UNIDADES_BY_ID}${id}/`);

export const apiGetUnidadeRelatorioByUser = () => 
    axiosInstance.get(ApiEndpoints.LIST_UNIDADE_RELATORIO_BY_USER);

export const apiGetAreaComercialRelatorioByUser = () => 
    axiosInstance.get(ApiEndpoints.LIST_AREACOMERCIAL_RELATORIO_BY_USER);


export const apiGetVendedorRelatorioByUser = () => 
    axiosInstance.get(ApiEndpoints.LIST_VENDEDOR_RELATORIO_BY_USER);

export const apiGetAgenciaRelatorioByUser = () => 
    axiosInstance.get(ApiEndpoints.LIST_AGENCIA_RELATORIO_BY_USER);

export const apiGetRelatorioFindByFilter = (data) => {
    const areaUrl = data.areasComerciais?.map((area) => `areasComerciais=${area}`).join('&') || '';
    const agenciaUrl = data.agencias?.map((agencia) => `agencias=${agencia}`).join('&') || '';
    const vendedorUrl = data.vendedores?.map((vendedor) => `vendedores=${vendedor}`).join('&') || '';
    const unidadeUrl = data.unidades?.map((unidade) => `unidades=${unidade}`).join('&') || '';
    
    const dataRange = (data.dataInicio && data.dataFim) 
        ? `dataInicio=${data.dataInicio}&dataFim=${data.dataFim}` 
        : '';

    // Construa a URL
    const url = [dataRange, areaUrl, agenciaUrl, vendedorUrl, unidadeUrl]
        .filter(Boolean) // Remove entradas vazias
        .join('&');

    console.log('URL construída:', `${ApiEndpoints.LIST_RELATORIO_FINDALL_BY_FILTERS}?${url}`);

    return axiosInstance.get(`${ApiEndpoints.LIST_RELATORIO_FINDALL_BY_FILTERS}?${url}`);
};

export const apiGetTotalRelatorio = (data: any) => {
    const areaUrl = data.areasComerciais?.map((area: number) => `areaComercial=${area}`).join('&') || '';
    const agenciaUrl = data.agencias?.map((agencia: number) => `agencia=${agencia}`).join('&') || '';
    const vendedorUrl = data.vendedores?.map((vendedor: number) => `vendedor=${vendedor}`).join('&') || '';
    const unidadeUrl = data.unidades?.map((unidade: number) => `unidade=${unidade}`).join('&') || '';
    const usuario = data.usuario_id ? `usuario_id=${data.usuario_id}` : '';
    const dataRange = data.dataInicio && data.dataFim ? `dataInicio=${data.dataInicio}&dataFim=${data.dataFim}` : '';
    
    const url = [areaUrl, agenciaUrl, vendedorUrl, unidadeUrl, usuario, dataRange].filter(Boolean).join('&');
    
    return axiosInstance.get(`${ApiEndpoints.TOTAL_RELATORIO}?${url}`);
};

export const apiGetDownloadRelatorio = (data: any) => {
    const areaUrl = data.areasComerciais?.map((area: number) => `areaComercial=${area}`).join('&') || '';
    const agenciaUrl = data.agencias?.map((agencia: number) => `agencia=${agencia}`).join('&') || '';
    const vendedorUrl = data.vendedores?.map((vendedor: number) => `vendedor=${vendedor}`).join('&') || '';
    const unidadeUrl = data.unidades?.map((unidade: number) => `unidade=${unidade}`).join('&') || '';
    const usuario = data.usuario_id ? `usuario_id=${data.usuario_id}` : '';
    const dataRange = data.dataInicio && data.dataFim ? `dataInicio=${data.dataInicio}&dataFim=${data.dataFim}` : '';
    
    const url = [areaUrl, agenciaUrl, vendedorUrl, unidadeUrl, usuario, dataRange].filter(Boolean).join('&');
    
    return axiosInstance.get(`${ApiEndpoints.EXCEL_RELATORIO}?${url}`, { responseType: 'blob' });
};
