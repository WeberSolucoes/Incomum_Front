import axios from 'axios';
import { ApiEndpoints } from '../utils/ApiEndpoints';
import { PermissionsListResponse, LoginRequest, UnidadesCreateRequest, AgenciaCreateRequest, VendedorCreateRequest, AeroportoCreateRequest, AreaComercialCreateRequest, LojaComercialCreateRequest, PaisCreateRequest, CidadeCreateRequest, MoedaCreateRequest, CepCreateRequest, DepartamentoCreateRequest, CompanhiaCreateRequest, AssinaturaCreateRequest, ClasseCreateRequest } from '../utils/apiObjects';

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

export const apiGetClasse = () => axiosInstance.get(ApiEndpoints.LIST_CLASSE);

export const apiGetClasseId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_CLASSE_BY_ID}${id}/`);

export const apiCreateClasse = (data: ClasseCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_CLASSE, data);

export const apiUpdateClasse = (id: number, data: ClasseCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_CLASSE}${id}/`, data);

export const apiDeleteClasse = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_CLASSE}${id}/`)

export const apiGetAssinatura = () => axiosInstance.get(ApiEndpoints.LIST_ASSINATURA);

export const apiGetAssinaturaId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_ASSINATURA_BY_ID}${id}/`);

export const apiCreateAssinatura = (data: AssinaturaCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_ASSINATURA, data);

export const apiUpdateAssinatura = (id: number, data: AssinaturaCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_ASSINATURA}${id}/`, data);

export const apiDeleteAssinatura = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_ASSINATURA}${id}/`)

export const apiGetCompanhia = () => axiosInstance.get(ApiEndpoints.LIST_COMPANHIA);

export const apiGetCompanhiaId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_COMPANHIA_BY_ID}${id}/`);

export const apiCreateCompanhia = (data: CompanhiaCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_COMPANHIA, data);

export const apiUpdateCompanhia = (id: number, data: CompanhiaCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_COMPANHIA}${id}/`, data);

export const apiDeleteCompanhia = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_COMPANHIA}${id}/`)

export const apiGetDepartamento = () => axiosInstance.get(ApiEndpoints.LIST_DEPARTAMENTO);

export const apiGetDepartamentoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_DEPARTAMENTO_BY_ID}${id}/`);

export const apiCreateDepartamento = (data: DepartamentoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_DEPARTAMENTO, data);

export const apiUpdateDepartamento = (id: number, data: DepartamentoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_DEPARTAMENTO}${id}/`, data);

export const apiDeleteDepartamento = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_DEPARTAMENTO}${id}/`)

export const apiGetCep = () => axiosInstance.get(ApiEndpoints.LIST_CEP);

export const apiGetCepId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_CEP_BY_ID}${id}/`);

export const apiCreateCep = (data: CepCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_CEP, data);

export const apiUpdateCep = (id: number, data: CepCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_CEP}${id}/`, data);

export const apiDeleteCep = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_CEP}${id}/`)

export const apiGetPais = () => axiosInstance.get(ApiEndpoints.LIST_PAIS);

export const apiGetPaisId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_PAIS_BY_ID}${id}/`);

export const apiCreatePais = (data: PaisCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_PAIS, data);

export const apiUpdatePais = (id: number, data: PaisCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_PAIS}${id}/`, data);

export const apiDeletePais = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_PAIS}${id}/`)

export const apiGetCidade = () => axiosInstance.get(ApiEndpoints.LIST_CIDADE);

export const apiGetCidadeId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_CIDADE_BY_ID}${id}/`);

export const apiCreateCidade = (data: CidadeCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_CIDADE, data);

export const apiUpdateCidade = (id: number, data: CidadeCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_CIDADE}${id}/`, data);

export const apiDeleteCidade = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_CIDADE}${id}/`);

export const apiGetMoeda = () => axiosInstance.get(ApiEndpoints.LIST_MOEDA);

export const apiGetMoedaId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_MOEDA_BY_ID}${id}/`);

export const apiCreateMoeda = (data: MoedaCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_MOEDA, data);

export const apiUpdateMoeda = (id: number, data: MoedaCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_MOEDA}${id}/`, data);

export const apiDeleteMoeda = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_MOEDA}${id}/`);

export const apiCreateAeroporto = (data: AeroportoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_AEROPORTO, data);

export const apiPutAeroporto = (id: number, data: AeroportoCreateRequest) => axiosInstance.put(`${ApiEndpoints.EDIT_AEROPORTO}${id}/`, data);

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

export const apiPutUpdateVendedor = (id: number,data: VendedorCreateRequest) => axiosInstance.put(`${ApiEndpoints.EDIT_VENDEDOR}${id}/`, data)

export const apiDeleteVendedor = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_VENDEDOR}${id}/`)

export const apiGetAreas = () => axiosInstance.get(ApiEndpoints.LIST_AREAS);

export const apiGetArea = () => axiosInstance.get(ApiEndpoints.LIST_AREA);
 
export const apiGetUnidadeById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_UNIDADES_BY_ID}${id}/`);

export const apiGetAreaComercial = () => axiosInstance.get(ApiEndpoints.LIST_AREACOMERCIAL)

export const apiPostCreateAreaComercial = (data: AreaComercialCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_AREACOMERCIAL, data)

export const apiDeleteAreaComercial = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_AREACOMERCIAL}${id}/`)

export const apiGetAreaComercialById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_AREACOMERCIAL_BY_ID}${id}/`)

export const apiPutUpdateAreaComercial = (id: number, data: AreaComercialCreateRequest) => axiosInstance.put(`${ApiEndpoints.EDIT_AREACOMERCIAL}${id}/`,data)

export const apiGetLojaComercial = () => axiosInstance.get(ApiEndpoints.LIST_LOJACOMERCIAL)

export const apiPostCreateLojaComercial = (data: LojaComercialCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_LOJACOMERCIAL,data)

export const apiGetLojaComercialById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_LOJACOMERCIAL_BY_ID}${id}/`)

export const apiPutUpdateLojaComercial = (id: number, data: LojaComercialCreateRequest) => axiosInstance.put(`${ApiEndpoints.EDIT_LOJACOMERCIAL}${id}/`,data) 

export const apiDeletLojaComercial = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_LOJACOMERCIAL}${id}/`)

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

export const apiGetLojaByAreaComercial = (acoCodigo: number) => {
    return axiosInstance.get(`${ApiEndpoints.LIST_LOJAS_VINCULADAS}${acoCodigo}/`);
};
