//ALGUNS ENDPOINTS PRECISAM PASSAR VALORES NA URL QUE É FEITO PELO ARQUIVO Api.tsx
//ESSES ENDPOINTS TERAO SUA VERSAO COMPLETA COMENTADA AO LADO
export enum ApiEndpoints {
    //#region auth_endpoints
    LOGIN = '/auth/token/login/',
    GET_USERID = '/auth/token/user-id/',
    LIST_USER_PERMISSIONS = '/auth/permissions/listPermissions-by-user/', // '/auth/permissions/listPermissions-by-user/${id}/'
    SEND_RECOVERY_EMAIL = '/auth/user/updatePassword/',
    UPDATE_PASSWORD_CONFIRM = '/auth/user/updatePassword-confirm/', // '/auth/user/updatePassword-confirm/${uid}/${token}/'
    //#endregion

    //#region unidades_endpoints
    LIST_UNIDADES = '/incomum/loja/list-all/',
    LIST_UNIDADES_BY_ID = '/incomum/loja/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_UNIDADES = '/incomum/loja/create/',
    UPDATE_UNIDADES = '/incomum/loja/update/', // '/incomum/loja/update/${id}/'
    DELETE_UNIDADES = '/unidades/delete/',
    //#endregion

    //#region relatorio_simplificado_endpoints
    LIST_UNIDADE_RELATORIO_BY_USER = '/incomum/relatorio/loja-by-user/', // '/incomum/relatorio/loja-by-user/${id}/'
    LIST_AREACOMERCIAL_RELATORIO_BY_USER = '/incomum/relatorio/area-by-user/', // '/incomum/relatorio/area-by-user/${id}/'
    LIST_VENDEDOR_RELATORIO_BY_USER = '/incomum/relatorio/vendedor-by-user/', // '/incomum/relatorio/vendedor-by-user/${id}/'
    LIST_AGENCIA_RELATORIO_BY_USER = '/incomum/relatorio/agencia-by-user/', // '/incomum/relatorio/agencia-by-user/${id}/'
    LIST_RELATORIO_FINDALL_BY_FILTERS = '/incomum/relatorio/list-all-by-filter/',
    TOTAL_RELATORIO = '/incomum/relatorio/total-by-filter/',
    EXCEL_RELATORIO = '/incomum/relatorio/download-relatorio/',
    LIST_AREAS = "incomum/relatorio/list-all-areas/", 
    //#endregion
}