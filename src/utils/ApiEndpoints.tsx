//ALGUNS ENDPOINTS PRECISAM PASSAR VALORES NA URL QUE É FEITO PELO ARQUIVO Api.tsx
//ESSES ENDPOINTS TERAO SUA VERSAO COMPLETA COMENTADA AO LADO
export enum ApiEndpoints {
    //#region auth_endpoints
    LOGIN = '/auth/token/login/',
    GET_USERID = '/auth/token/user-id/',
    LIST_USER_PERMISSIONS = '/incomum/user/permission/listPermissions/', // '/incomum/user/permission/listPermissions/${id}/'
    SEND_RECOVERY_EMAIL = '/incomum/user/updatePassword/',
    UPDATE_PASSWORD_CONFIRM = '/incomum/user/updatePassword-confirm/' // '/incomum/user/updatePassword-confirm/${uid}/${token}/'

    //#endregion
}