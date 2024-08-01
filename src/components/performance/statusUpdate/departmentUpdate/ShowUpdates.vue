<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import CreateStatusUpdate from '@/components/performance/statusUpdate/departmentUpdate/Create.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { ProgressStatus } from '@/components/reuseables/enums';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';

// import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getDepartmentObjectivById } = usePerformanceUtils();

const statusUpdates = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const updateStatusData = ref('');
// const departmentUpdatedName = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const getDepartmentUpdates = async () => {
    const url = `${baseURL}/progress_update/department`;

    try {
        const { data } = await fetchData(url, loading);
         
        if (Array.isArray(data) && data.length > 0) {
            let allUpdates = await Promise.all(
                data.map(async (element) => {
                    const department = await getDepartmentObjectivById(element?.departmentObjectiveId);

                    return {
                        ...element,
                        departmentObjectiveName: department?.name,
                        departmentObjectiveDescription: department?.description
                    };
                })
            );

            statusUpdates.value = allUpdates;
        } else {
            statusUpdates.value = []; // Handle case where data is not an array or is empty
        }
        // statusUpdates.value = data;
    } catch (error) {
        statusUpdates.value = [];
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};
const progressStatus = ref({ name: '', code: '' });
const updateStatus = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/progress_update/update`;
        const formData = {
            id: updateStatusData.value?.id,
            progressStatus: progressStatus?.value?.name,
            updateDate: changeDateFormat(new Date())
        };

        // Perform form submission logic (e.g., send data to backend)
         
        // loading.value = false;

        const data = await postData(url, formData, loading);
         
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            loading.value = false;
            await getDepartmentUpdates();
            showSuccess();
        } else {
            showError();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (status) => {
    updateStatusData.value = status;
    (progressStatus.value = { name: status?.progressStatus, code: status?.progressStatus }), (visible.value = true);
};

onMounted(async () => {
    await getDepartmentUpdates();
});
initFilters();
const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/progress_update/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getDepartmentUpdates();
    });
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getDepartmentUpdates();
};
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Status" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="field col-12 md:col-12">
                <label for="progressStatus">Progress Status</label>
                <Dropdown id="progressStatus" v-model="progressStatus" :options="ProgressStatus" optionLabel="name" placeholder="Select Status"></Dropdown>
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateStatus"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <!-- <Dialog v-model:visible="addModalVisibility" header="Department">
            <CreateDepartment @refresh="refresh" />
        </Dialog> -->
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-7">
                <DataTable v-model:filters="filters" :value="statusUpdates" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                            <IconField iconPosition="left">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No statusUpdates found. </template>
                    <template #loading> Loading statusUpdates data. Please wait. </template>
                    <Column :sortable="true" field="departmentObjectiveName" header=" Objective Name" style="min-width: 18rem">
                        <template #body="{ data }"> {{ data.departmentObjectiveName }} </template>
                    </Column>
                    <Column :sortable="true" field="progressStatus" header="progressStatus" style="min-width: 12rem">
                        <template #body="{ data }"> {{ data.progressStatus }} </template>
                    </Column>

                    <Column style="min-width: 12rem">
                        <template #header>
                            <div class="flex justify-center">Actions</div>
                        </template>
                        <template #body="{ data }">
                            <div class="flex justify-center space-x-2">
                                <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                                    <span class="text-sm">Update</span>
                                </Button>
                                <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleConfirmDelete(data)" style="width: 5rem">
                                    <span class="text-sm">Delete</span>
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="col-12 xl:col-5">
                <CreateStatusUpdate @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
