// useConfirmDialog.js
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { fetchData, putData } from '@/components/reuseables/FetchPostData'; // Adjust the import path as per your project structure
// import { putData } from './FetchPostData';

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

    const confirmRemove = async (url, onSuccess) => {
        confirm.require({
            message: 'Do you want to remove this record?',
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            acceptLabel: 'Remove',
            rejectClass: 'p-button-secondary p-button-outlined',
            acceptClass: 'p-button-danger',
            accept: async () => {
                try {
                    // const response = await fetchData(url); // Call your delete function or API here
                    const response = await putData(url, {}, false);
                    console.log('response', response);
                    if (response?.status === 200) {
                        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Record removed', life: 3000 });
                        onSuccess();
                        console.log('Record removed successfully:', response);
                    } else {
                        console.error('Failed to remove record:', response);
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove record', life: 3000 });
                    }
                } catch (error) {
                    console.error('Error deleting record:', error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove record', life: 3000 });
                }
            },
            reject: () => {
                toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Remove operation cancelled', life: 3000 });
            }
        });
    };
    const confirmDisable = async (url, onSuccess) => {
        confirm.require({
            message: 'Do you want to disable this record?',
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            acceptLabel: 'Disable',
            rejectClass: 'p-button-secondary p-button-outlined',
            acceptClass: 'p-button-danger',
            accept: async () => {
                try {
                    // const response = await fetchData(url); // Call your delete function or API here
                    const response = await putData(url, {}, false);
                    console.log('response', response);
                    if (response) {
                        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Record disabled', life: 3000 });
                        onSuccess();
                        console.log('Record disabled successfully:', response);
                    } else {
                        console.error('Failed to remove record:', response);
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to disable record', life: 3000 });
                    }
                } catch (error) {
                    console.error('Error deleting record:', error);
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to disable record', life: 3000 });
                }
            },
            reject: () => {
                toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'disable operation cancelled', life: 3000 });
            }
        });
    };
    return {
        confirmDelete,
        confirmRemove,
        confirmDisable
    };
}
