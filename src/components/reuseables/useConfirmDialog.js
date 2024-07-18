// useConfirmDialog.js
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { fetchData } from '@/components/reuseables/FetchPostData'; // Adjust the import path as per your project structure

export function useConfirmDialog() {
    const confirm = useConfirm();
    const toast = useToast();

    const confirmDelete = async (url, onSuccess) => {
        confirm.require({
            message: 'Do you want to delete this record?',
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            acceptLabel: 'Delete',
            rejectClass: 'p-button-secondary p-button-outlined',
            acceptClass: 'p-button-danger',
            accept: async () => {
                try {
                    const response = await fetchData(url); // Call your delete function or API here
                    console.log('response', response);
                    if (response?.status === 200) {
                        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                        onSuccess();
                        console.log('Record deleted successfully:', response);
                    } else {
                        console.error('Failed to delete record:', response);
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 3000 });
                    }
                } catch (error) {
                    console.error('Error deleting record:', error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 3000 });
                }
            },
            reject: () => {
                toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Delete operation cancelled', life: 3000 });
            }
        });
    };

    return {
        confirmDelete
    };
}
