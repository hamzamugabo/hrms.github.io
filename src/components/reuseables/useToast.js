import { useToast } from 'primevue/usetoast';
export function useToastPopup() {
    const toast = useToast();

    const showSuccess = (message) => {
        toast.add({ severity: 'success', summary: 'Info', detail: message || 'Success', life: 3000 });
    };
    const showError = (message, summary) => {
        toast.add({ severity: 'error', summary: summary || 'Error Message', detail: message ? message : 'Error', life: 3000 });
    };
    return {
        showSuccess,
        showError
    };
}
