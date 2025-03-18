import axios from 'axios';
import { ApiEndpoints } from '../utils/ApiEndpoints';
import { PermissionsListResponse, LoginRequest, UnidadesCreateRequest, AgenciaCreateRequest, VendedorCreateRequest, AeroportoCreateRequest, AreaComercialCreateRequest, LojaComercialCreateRequest, PaisCreateRequest, CidadeCreateRequest, MoedaCreateRequest, CepCreateRequest, DepartamentoCreateRequest, CompanhiaCreateRequest, AssinaturaCreateRequest, ClasseCreateRequest, AcomodacaoCreateRequest, PadraoCreateRequest, RegimeCreateRequest,SituacaoTuristicoCreateRequest, BandeiraCreateRequest, FormaDePagamentoCreateRequest, ParceiroCreateRequest, BancoCreateRequest, DespesasCreateRequest, CentroCustoCreateRequest, DespesasGeralCreateRequest, SubGrupoCreateRequest,ProtocoloCreateRequest  } from '../utils/apiObjects';

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


export const apiGetSituacaoProtocolo = () => axiosInstance.get(ApiEndpoints.LIST_SITUACAO_PROTOCOLO);

export const apiGetAgenciaBancaria = () => 
    axiosInstance.get(ApiEndpoints.LIST_AGENCIA_BANCARIA);


export const apiGetProtocolo = () => axiosInstance.get(ApiEndpoints.LIST_PROTOCOLO);

export const apiGetProtocoloRelatorio = (params = {}) => axiosInstance.get(ApiEndpoints.LIST_PROTOCOLO_RELATORIO, {
    params: params,
});

export const apiGetProtocoloId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_PROTOCOLO_BY_ID}${id}/`);

export const apiCreateProtocolo = (data: ProtocoloCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_PROTOCOLO, data);

export const apiUpdateProtocolo = (id: number, data: ProtocoloCreateRequest) => axiosInstance.put(`${ApiEndpoints.EDIT_PROTOCOLO}${id}/`, data);

export const apiDeleteProtocolo = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_PROTOCOLO}${id}/`)


export const apiGetDuplicata = () => axiosInstance.get(ApiEndpoints.LIST_DUPLICATA);

export const apiGetDuplicataById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_DUPLICATA_BY_ID}${id}/`);


export const apiGetDespesasGeral = () => axiosInstance.get(ApiEndpoints.LIST_DESPESASGERAL);

export const apiGetDespesasGeralId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_DESPESASGERAL_BY_ID}${id}/`);

export const apiCreateDespesasGeral = (data: DespesasGeralCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_DESPESASGERAL, data);

export const apiUpdateDespesasGeral = (id: number, data: DespesasGeralCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_DESPESASGERAL}${id}/`, data);

export const apiDeleteDespesasGeral = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_DESPESASGERAL}${id}/`)


export const apiGetSubgrupo = () => axiosInstance.get(ApiEndpoints.LIST_SUBGRUPO);

export const apiGetSubgrupoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_SUBGRUPO_BY_ID}${id}/`);

export const apiCreateSubgrupo = (data: SubGrupoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_SUBGRUPO, data);

export const apiUpdateSubgrupo = (id: number, data: SubGrupoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_SUBGRUPO}${id}/`, data);

export const apiDeleteSubgrupo = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_SUBGRUPO}${id}/`)


export const apiGetCentroCusto = () => axiosInstance.get(ApiEndpoints.LIST_CENTROCUSTO);

export const apiGetCentroCustoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_CENTROCUSTO_BY_ID}${id}/`);

export const apiCreateCentroCusto = (data: CentroCustoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_CENTROCUSTO, data);

export const apiUpdateCentroCusto = (id: number, data: CentroCustoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_CENTROCUSTO}${id}/`, data);

export const apiDeleteCentroCusto = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_CENTROCUSTO}${id}/`)




export const apiGetDespesas = () => axiosInstance.get(ApiEndpoints.LIST_DESPESAS);

export const apiGetDespesasId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_DESPESAS_BY_ID}${id}/`);

export const apiCreateDespesas = (data: DespesasCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_DESPESAS, data);

export const apiUpdateDespesas = (id: number, data: DespesasCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_DESPESAS}${id}/`, data);

export const apiDeleteDespesas = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_DESPESAS}${id}/`)



export const apiGetBanco = () => axiosInstance.get(ApiEndpoints.LIST_BANCO);

export const apiGetBancoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_BANCO_BY_ID}${id}/`);

export const apiCreateBanco = (data: BancoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_BANCO, data);

export const apiUpdateBanco = (id: number, data: BancoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_BANCO}${id}/`, data);

export const apiDeleteBanco = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_BANCO}${id}/`)


export const apiGetParceiroContato = () => axiosInstance.get(ApiEndpoints.LIST_PARCEIROCONTATO);

export const apiGetParceiroContatoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_PARCEIROCONTATO_BY_ID}${id}/`);

export const apiCreateParceiroContato = (data: ParceiroContatoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_PARCEIROCONTATO, data);

export const apiUpdateParceiroContato = (id: number, data: ParceiroContatoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_PARCEIROCONTATO}${id}/`, data);

export const apiDeleteParceiroContato = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_PARCEIROCONTATO}${id}/`)


export const apiGetParceiro = () => axiosInstance.get(ApiEndpoints.LIST_PARCEIRO);

export const apiGetParceiroId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_PARCEIRO_BY_ID}${id}/`);

export const apiCreateParceiro = (data: ParceiroCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_PARCEIRO, data);

export const apiUpdateParceiro = (id: number, data: ParceiroCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_PARCEIRO}${id}/`, data);

export const apiDeleteParceiro = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_PARCEIRO}${id}/`)

export const apiGetParceiroSearch = ({ search = '', limit = 100 }) => 
    axiosInstance.get(ApiEndpoints.LIST_PARCEIRO_SEARCH, {
        params: {
            search,
            limit,
        },
    });




export const apiGetFormaPagamento = () => axiosInstance.get(ApiEndpoints.LIST_FORMAPAGAMENTO);

export const apiGetFormaPagamentoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_FORMAPAGAMENTO_BY_ID}${id}/`);

export const apiCreateFormaPagamento = (data: FormaDePagamentoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_FORMAPAGAMENTO, data);

export const apiUpdateFormaPagamento = (id: number, data: FormaDePagamentoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_FORMAPAGAMENTO}${id}/`, data);

export const apiDeleteFormaPagamento = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_FORMAPAGAMENTO}${id}/`)


export const apiGetBandeira = () => axiosInstance.get(ApiEndpoints.LIST_BANDEIRA);

export const apiGetBandeiraId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_BANDEIRA_BY_ID}${id}/`);

export const apiCreateBandeira = (data: BandeiraCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_BANDEIRA, data);

export const apiUpdateBandeira = (id: number, data: BandeiraCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_BANDEIRA}${id}/`, data);

export const apiDeleteBandeira = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_BANDEIRA}${id}/`)


export const apiGetServicoTuristico = () => axiosInstance.get(ApiEndpoints.LIST_SERVICOTURISTICO);

export const apiGetServicoTuristicoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_SERVICOTURISTICO_BY_ID}${id}/`);

export const apiCreateServicoTuristico = (data: SituacaoTuristicoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_SERVICOTURISTICO, data);

export const apiUpdateServicoTuristico = (id: number, data: SituacaoTuristicoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_SERVICOTURISTICO}${id}/`, data);

export const apiDeleteServicoTuristico = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_SERVICOTURISTICO}${id}/`)


export const apiGetSituacaoTuristico = () => axiosInstance.get(ApiEndpoints.LIST_SITUACAOTURISTICO);

export const apiGetSituacaoTuristicoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_SITUACAOTURISTICO_BY_ID}${id}/`);

export const apiCreateSituacaoTuristico = (data: SituacaoTuristicoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_SITUACAOTURISTICO, data);

export const apiUpdateSituacaoTuristico = (id: number, data: SituacaoTuristicoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_SITUACAOTURISTICO}${id}/`, data);

export const apiDeleteSituacaoTuristico = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_SITUACAOTURISTICO}${id}/`)


export const apiGetRegime = () => axiosInstance.get(ApiEndpoints.LIST_REGIME);

export const apiGetRegimeId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_REGIME_BY_ID}${id}/`);

export const apiCreateRegime = (data: RegimeCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_REGIME, data);

export const apiUpdateRegime = (id: number, data: RegimeCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_REGIME}${id}/`, data);

export const apiDeleteRegime = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_REGIME}${id}/`)

export const apiGetPadrao = () => axiosInstance.get(ApiEndpoints.LIST_PADRAO);

export const apiGetPadraoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_PADRAO_BY_ID}${id}/`);

export const apiCreatePadrao = (data: PadraoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_PADRAO, data);

export const apiUpdatePadrao = (id: number, data: PadraoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_PADRAO}${id}/`, data);

export const apiDeletePadrao = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_PADRAO}${id}/`)


export const apiGetAcomodacao = () => axiosInstance.get(ApiEndpoints.LIST_ACOMODACAO);

export const apiGetAcomodacaoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_ACOMODACAO_BY_ID}${id}/`);

export const apiCreateAcomodacao = (data: AcomodacaoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_ACOMODACAO, data);

export const apiUpdateAcomodacao = (id: number, data: AcomodacaoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_ACOMODACAO}${id}/`, data);

export const apiDeleteAcomodacao = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_ACOMODACAO}${id}/`)

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

export const apiGetAeroporto = () => axiosInstance.get(ApiEndpoints.LIST_AEROPORTO);

export const apiGetAeroportoById = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_AEROPORTO_BY_ID}${id}/`);


export const apiGetFornecedorTipo = () => axiosInstance.get(ApiEndpoints.LIST_FORNECEDOR_TIPO );

export const apiGetFornecedorTipoId = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_FORNECEDOR_TIPO_BY_ID}${id}/`);

export const apiCreateFornecedorTipo = (data: FornecedorTipoCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_FORNECEDOR_TIPO, data);

export const apiUpdateFornecedorTipo = (id: number, data: FornecedorTipoCreateRequest) => axiosInstance.put(`${ApiEndpoints.UPDATE_FORNECEDOR_TIPO}${id}/`, data);

export const apiDeleteFornecedorTipo = (id: number) => axiosInstance.delete(`${ApiEndpoints.DELETE_FORNECEDOR_TIPO}${id}/`)


export const apiGetUserId = () => axiosInstance.get(ApiEndpoints.GET_USERID);

export const apiGetPermissions = (id: number) => axiosInstance.get(`${ApiEndpoints.LIST_USER_PERMISSIONS}${id}/`);

export const apiPostlogin = (data: LoginRequest) => axiosInstance.post(ApiEndpoints.LOGIN, data);

export const apiPostSendRecoveryEmail = (email: string) => axiosInstance.post(ApiEndpoints.SEND_RECOVERY_EMAIL, { email: email });

export const apiPostMudarSenha = (password: string, uid: string | undefined, token: string | undefined) => axiosInstance.post(`${ApiEndpoints.UPDATE_PASSWORD_CONFIRM}${uid}/${token}/`, { new_password: password });

export const apiPostCreateUnidade = (data: UnidadesCreateRequest) => axiosInstance.post(ApiEndpoints.CREATE_UNIDADES, data);

export const apiPutUpdateUnidade = (data: UnidadesCreateRequest, id: number) => axiosInstance.put(`${ApiEndpoints.UPDATE_UNIDADES}${id}/`, data);

export const apiGetUnidades = () => axiosInstance.get(ApiEndpoints.LIST_UNIDADES);

export const apiGetGraficoAgencia = () => axiosInstance.get(ApiEndpoints.LIST_GRAFICO_AGENCIA);

export const apiGetGraficoUnidade = () => axiosInstance.get(ApiEndpoints.LIST_GRAFICO_UNIDADE);

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

export const apiGetAreaComercialRelatorioByUser = (params = {}) => 
    axiosInstance.get(ApiEndpoints.LIST_AREACOMERCIAL_RELATORIO_BY_USER, {
        params: params,
    });

export const apiGetVendedorRelatorioByUser = (params = {}) => 
    axiosInstance.get(ApiEndpoints.LIST_VENDEDOR_RELATORIO_BY_USER, {
        params: params,
    });

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
