// src/utils/customToast.ts
import { Toast } from 'primereact/toast';

let toast: Toast | null = null;

export const setToast = (toastInstance: Toast) => {
    toast = toastInstance;
};

export const toastSucess = (message: string) => {
    if (toast) {
        toast.show({ severity: 'success', summary: 'Sucesso!', detail: message, life: 2000 });
    }
};

export const toastError = (message: string) => {
    if (toast) {
        toast.show({ severity: 'error', summary: 'Algo deu errado!', detail: message, life: 2000 });
    }
};

export const toastWarning = (message: string) => {
    if (toast) {
        toast.show({ severity: 'warn', summary: 'Aviso!', detail: message, life: 2000 });
    }
};

export const toastInfo = (message: string) => {
    if (toast) {
        toast.show({ severity: 'info', summary: 'Info', detail: message, life: 2000 });
    }
};
