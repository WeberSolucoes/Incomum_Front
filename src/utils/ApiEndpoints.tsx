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
    DELETE_UNIDADES = 'incomum/loja/delete/',
    LIST_LOJAS_VINCULADAS = '/incomum/loja/find-vinculadas/',
    //#endregion

    //#region relatorio_simplificado_endpoints
    LIST_LOJACOMERCIAL = '/incomum/lojaComercial/list-all/',
    LIST_LOJACOMERCIAL_BY_ID = '/incomum/lojaComercial/find-byid/',
    CREATE_LOJACOMERCIAL = '/incomum/lojaComercial/create/',
    EDIT_LOJACOMERCIAL = '/incomum/lojaComercial/update/',
    DELETE_LOJACOMERCIAL = '/incomum/lojaComercial/delete/',
    
    //#region relatorio_simplificado_endpoints
    LIST_UNIDADE_RELATORIO_BY_USER = '/incomum/relatorio/loja-by-user/', // '/incomum/relatorio/loja-by-user/${id}/'
    LIST_AREACOMERCIAL_RELATORIO_BY_USER = '/incomum/relatorio/area-by-user/', // '/incomum/relatorio/area-by-user/${id}/'
    LIST_VENDEDOR_RELATORIO_BY_USER = '/incomum/relatorio/vendedor-by-user/', // '/incomum/relatorio/vendedor-by-user/${id}/'
    LIST_AGENCIA_RELATORIO_BY_USER = '/incomum/relatorio/agencia-by-user/', // '/incomum/relatorio/agencia-by-user/${id}/'
    LIST_RELATORIO_FINDALL_BY_FILTERS = '/incomum/relatorio/list-all-by-filter/',
    TOTAL_RELATORIO = '/incomum/relatorio/total-by-filter/',
    EXCEL_RELATORIO = '/incomum/relatorio/download-relatorio/',
    EXPORT_TO_EXCEL = "EXPORT_TO_EXCEL",
    LIST_AREAS = "incomum/relatorio/list-all-areas/", 
    LIST_AREA = "incomum/relatorio/list-all-area/",
    //#endregion

    LIST_AGENCIA = 'incomum/agencia/list-all/',
    CREATE_AGENCIA = 'incomum/agencia/create/',
    DELETE_AGENCIA = 'incomum/agencia/delete/',
    LIST_AGENCIA_BY_ID = 'incomum/agencia/find-byid/',
    EDIT_AGENCIA = 'incomum/agencia/update/',


    LIST_VENDEDOR = 'incomum/vendedor/list-all/',
    CREATE_VENDEDOR = 'incomum/vendedor/create/',
    LIST_VENDEDOR_BY_ID = 'incomum/vendedor/find-byid/',
    EDIT_VENDEDOR = 'incomum/vendedor/update/',
    DELETE_VENDEDOR = 'incomum/vendedor/delete/',

    LIST_AEROPORTO = 'incomum/aeroporto/list-all/',
    CREATE_AEROPORTO = 'incomum/aeroporto/create/',
    LIST_AEROPORTO_BY_ID = 'incomum/aeroporto/find-byid/',
    EDIT_AEROPORTO = 'incomum/aeroporto/update/',
    DELETE_AEROPORTO = 'incomum/aeroporto/delete/',

    LIST_AREACOMERCIAL = 'incomum/areacomercial/list-all/',
    CREATE_AREACOMERCIAL = 'incomum/areacomercial/create/',
    LIST_AREACOMERCIAL_BY_ID = 'incomum/areacomercial/find-byid/',
    EDIT_AREACOMERCIAL = 'incomum/areacomercial/update/',
    DELETE_AREACOMERCIAL = 'incomum/areacomercial/delete/'
}
