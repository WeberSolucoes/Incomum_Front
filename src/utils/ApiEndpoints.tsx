//ALGUNS ENDPOINTS PRECISAM PASSAR VALORES NA URL QUE É FEITO PELO ARQUIVO Api.tsx
//ESSES ENDPOINTS TERAO SUA VERSAO COMPLETA COMENTADA AO LADO
export enum ApiEndpoints {
    //#region auth_endpoints
    LOGIN = '/auth/token/login/',
    GET_USERID = '/auth/token/user-id/',
    LIST_USER_PERMISSIONS = '/auth/permissions/listPermissions-by-user/', // '/auth/permissions/listPermissions-by-user/${id}/'
    SEND_RECOVERY_EMAIL = '/auth/user/updatePassword/',
    UPDATE_PASSWORD_CONFIRM = '/auth/user/updatePassword-confirm/' // '/auth/user/updatePassword-confirm/${uid}/${token}/'

    //#endregion
}