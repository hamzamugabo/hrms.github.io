<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import Create from '@/components/payroll/salaryConfig/Create.vue';
import { employeeLevelsEnum } from '@/components/reuseables/enums.js';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const salaryConfigs = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const configData = ref(null);
const basicSalary = ref(0);
const employeeLevel = ref({ name: '', code: '' });
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const loadingUpdate = ref(false);

const getSalaryConfig = async () => {
    loading.value = true;
    const url = `${baseURL}/salary/config`;

    try {
        const { data } = await fetchData(url, loading);
        console.log(data);
        salaryConfigs.value = data;
        loading.value = false;
    } catch (error) {
        loading.value = false;
        console.log('error', error);
        salaryConfigs.value = [];
        showError('Failed to fetch salary configurations');
    }
};

const initFilters = () => {
    filters.value = {
        basicSalary: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        employeeLevel: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

// const clearFilter = () => {
//     initFilters();
// };

const updateSalaryConfig = async () => {
    updateError.value = '';
    try {
        loadingUpdate.value = true;
        const url = `${baseURL}/salary/config/update`;
        const formData = {
            id: configData.value?.id,
            basicSalary: basicSalary.value,
            employeeLevel: employeeLevel.value.code
        };

        const data = await postData(url, formData, loadingUpdate);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            showSuccess();
            await getSalaryConfig();
            visible.value = false;
        } else {
            showError();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed to update salary configuration');
        updateError.value = error?.message;
    } finally {
        loadingUpdate.value = false;
    }
};

const openModal = (salaryConfig) => {
    configData.value = salaryConfig;
    basicSalary.value = salaryConfig?.basicSalary;
    employeeLevel.value = { name: salaryConfig?.employeeLevel, code: salaryConfig?.employeeLevel };
    visible.value = true;
};

const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/salary/config/delete/${data?.id}`;
    await confirmDelete(url, async () => {
        await getSalaryConfig();
    });
};

const refresh = async () => {
    await getSalaryConfig();
};

onMounted(async () => {
    await getSalaryConfig();
});
initFilters();
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Salary Configuration" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="basicSalary">Basic Salary</label>
                <InputNumber v-model="basicSalary" inputId="basicSalary" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeLevel">Employee Level</label>
                <Dropdown id="employeeLevel" v-model="employeeLevel" :options="employeeLevelsEnum" optionLabel="name" placeholder="Select One"></Dropdown>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loadingUpdate" type="button" label="Update" @click="updateSalaryConfig"></Button>
                <SpinnerVue :loading="loadingUpdate" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        
        <div class="grid">
            <div class="col-12 xl:col-7">
                <DataTable v-model:filters="filters" :value="salaryConfigs" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
                   
                    <template #empty> No Salaries found. </template>
                    <template #loading> Loading Salaries data. Please wait. </template>

                    <Column :sortable="true" field="employeeLevel" header="Level" style="min-width: 10rem">
                        <template #body="{ data }"> {{ data.employeeLevel }}</template>
                    </Column>
                    <Column :sortable="true" field="basicSalary" header="Basic Salary" style="min-width: 10rem">
                        <template #body="{ data }"> {{ data?.basicSalary }}</template>
                    </Column>
                  

                    <Column style="min-width: 15rem">
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
                <Create @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
