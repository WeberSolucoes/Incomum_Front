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
    DELETE_AREACOMERCIAL = 'incomum/areacomercial/delete/',

    LIST_PAIS = '/incomum/pais/list-all/',
    LIST_PAIS_BY_ID = '/incomum/pais/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_PAIS = '/incomum/pais/create/',
    UPDATE_PAIS = '/incomum/pais/update/', // '/incomum/loja/update/${id}/'
    DELETE_PAIS = 'incomum/pais/delete/',

    LIST_CIDADE = '/incomum/cidade/list-all/',
    LIST_CIDADE_BY_ID = '/incomum/cidade/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_CIDADE = '/incomum/cidade/create/',
    UPDATE_CIDADE = '/incomum/cidade/update/', // '/incomum/loja/update/${id}/'
    DELETE_CIDADE = 'incomum/cidade/delete/',

    LIST_MOEDA = '/incomum/moeda/list-all/',
    LIST_MOEDA_BY_ID = '/incomum/moeda/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_MOEDA = '/incomum/moeda/create/',
    UPDATE_MOEDA = '/incomum/moeda/update/', // '/incomum/loja/update/${id}/'
    DELETE_MOEDA = 'incomum/moeda/delete/',

    LIST_CEP = '/incomum/cep/list-all/',
    LIST_CEP_BY_ID = '/incomum/cep/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_CEP = '/incomum/cep/create/',
    UPDATE_CEP = '/incomum/cep/update/', // '/incomum/loja/update/${id}/'
    DELETE_CEP = 'incomum/cep/delete/',

    LIST_DEPARTAMENTO = '/incomum/departamento/list-all/',
    LIST_DEPARTAMENTO_BY_ID = '/incomum/departamento/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_DEPARTAMENTO = '/incomum/departamento/create/',
    UPDATE_DEPARTAMENTO = '/incomum/departamento/update/', // '/incomum/loja/update/${id}/'
    DELETE_DEPARTAMENTO = 'incomum/departamento/delete/',

    LIST_COMPANHIA = '/incomum/companhia/list-all/',
    LIST_COMPANHIA_BY_ID = '/incomum/companhia/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_COMPANHIA = '/incomum/companhia/create/',
    UPDATE_COMPANHIA = '/incomum/companhia/update/', // '/incomum/loja/update/${id}/'
    DELETE_COMPANHIA = 'incomum/companhia/delete/',

    LIST_ASSINATURA = '/incomum/assinatura/list-all/',
    LIST_ASSINATURA_BY_ID = '/incomum/assinatura/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_ASSINATURA = '/incomum/assinatura/create/',
    UPDATE_ASSINATURA = '/incomum/assinatura/update/', // '/incomum/loja/update/${id}/'
    DELETE_ASSINATURA = 'incomum/assinatura/delete/',

    LIST_CLASSE = '/incomum/classe/list-all/',
    LIST_CLASSE_BY_ID = '/incomum/classe/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_CLASSE = '/incomum/classe/create/',
    UPDATE_CLASSE = '/incomum/classe/update/', // '/incomum/loja/update/${id}/'
    DELETE_CLASSE = 'incomum/classe/delete/',

    LIST_ACOMODACAO = '/incomum/acomodacao/list-all/',
    LIST_ACOMODACAO_BY_ID = '/incomum/acomodacao/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_ACOMODACAO = '/incomum/acomodacao/create/',
    UPDATE_ACOMODACAO = '/incomum/acomodacao/update/', // '/incomum/loja/update/${id}/'
    DELETE_ACOMODACAO = 'incomum/acomodacao/delete/',

    LIST_PADRAO = '/incomum/padrao/list-all/',
    LIST_PADRAO_BY_ID = '/incomum/padrao/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_PADRAO = '/incomum/padrao/create/',
    UPDATE_PADRAO = '/incomum/padrao/update/', // '/incomum/loja/update/${id}/'
    DELETE_PADRAO = 'incomum/padrao/delete/',

    LIST_REGIME = '/incomum/regime/list-all/',
    LIST_REGIME_BY_ID = '/incomum/regime/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_REGIME = '/incomum/regime/create/',
    UPDATE_REGIME = '/incomum/regime/update/', // '/incomum/loja/update/${id}/'
    DELETE_REGIME = 'incomum/regime/delete/',

    LIST_SITUACAOTURISTICO = '/incomum/situacaoturistico/list-all/',
    LIST_SITUACAOTURISTICO_BY_ID = '/incomum/situacaoturistico/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_SITUACAOTURISTICO = '/incomum/situacaoturistico/create/',
    UPDATE_SITUACAOTURISTICO = '/incomum/situacaoturistico/update/', // '/incomum/loja/update/${id}/'
    DELETE_SITUACAOTURISTICO = 'incomum/situacaoturistico/delete/',
    
    LIST_SERVICOTURISTICO = '/incomum/servicoturistico/list-all/',
    LIST_SERVICOTURISTICO_BY_ID = '/incomum/servicoturistico/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_SERVICOTURISTICO = '/incomum/servicoturistico/create/',
    UPDATE_SERVICOTURISTICO = '/incomum/servicoturistico/update/', // '/incomum/loja/update/${id}/'
    DELETE_SERVICOTURISTICO = 'incomum/servicoturistico/delete/',

    LIST_BANDEIRA = '/incomum/bandeira/list-all/',
    LIST_BANDEIRA_BY_ID = '/incomum/bandeira/find-byid/', // '/incomum/loja/list-byid/${id}/'
    CREATE_BANDEIRA = '/incomum/bandeira/create/',
    UPDATE_BANDEIRA = '/incomum/bandeira/update/', // '/incomum/loja/update/${id}/'
    DELETE_BANDEIRA = 'incomum/bandeira/delete/',
    
}
