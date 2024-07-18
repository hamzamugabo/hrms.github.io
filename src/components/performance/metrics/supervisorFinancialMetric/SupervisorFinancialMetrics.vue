<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import Create from '@/components/performance/metrics/supervisorFinancialMetric/Create.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getSupervisorFinancialMetric } = usePerformanceUtils();

const performanceMetrics = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const selectedData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const expenses = ref(0);
const revenue = ref(0);

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        metricCategory: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        metricDescription: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};

const updateMetric = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/performance_metric/supervisor_financial/update`;
        const formData = {
            id: selectedData.value?.id,
            expenses: expenses.value,
            revenue: revenue.value
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            showSuccess(data?.message);
            success.value = true;
            loading.value = false;
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            await getSupervisorFinancialMetric(performanceMetrics);
        } else {
            showError();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError();
        loading.value = false;
    }
};

const openModal = (performanceMetric) => {
    selectedData.value = performanceMetric;
    expenses.value = performanceMetric?.expenses;
    revenue.value = performanceMetric?.revenue;
    visible.value = true;
};

onMounted(async () => {
    await getSupervisorFinancialMetric(performanceMetrics);
});
initFilters();

const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/performance_metric/supervisor_financial/delete/${data?.id}`;
    await confirmDelete(url, async () => {
        await getSupervisorFinancialMetric(performanceMetrics);
    });
    refresh();
};

const addModalVisibility = ref(false);
const handleAdd = () => {
    addModalVisibility.value = true;
};
const refresh = async () => {
    await getSupervisorFinancialMetric(performanceMetrics);
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Supervisor Financial Metric" :style="{ width: '30rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="flex align-items-center gap-3 mb-3">
                <label for="expenses">Expenses</label>
                <InputNumber v-model="expenses" inputId="integeronly" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="revenue">Revenue</label>
                <InputNumber v-model="revenue" inputId="integeronly" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateMetric"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>

        <Dialog v-model:visible="addModalVisibility" header="Add Supervisor Financial Metric">
            <Create />
        </Dialog>
    </div>

    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Supervisor Financial Metric'" @handleAdd="handleAdd" />
            </div>
        </div>

        <DataTable v-model:filters="filters" :value="performanceMetrics" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['metricCategory', 'metricDescription']">
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
            <template #empty> No Employee Customer Metrics found. </template>
            <template #loading> Loading Employee Customer Metric data. Please wait. </template>

            <Column :sortable="false" field="employee" header="employee" style="min-width: 12rem">
                <template #body="{ data }"> {{ data.employee }} </template>
            </Column>
            <Column :sortable="false" field="performanceMetricMetricCategory" header="Metric Category" style="min-width: 12rem">
                <template #body="{ data }"> {{ data.performanceMetricMetricCategory }} </template>
            </Column>
            <Column :sortable="false" field="expenses" header="Expenses" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.expenses }} </template>
            </Column>

            <Column :sortable="false" field="revenue" header="Revenue" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.revenue }} </template>
            </Column>

            <Column style="min-width: 15rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button type="button" icon="pi pi-pencil" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; margin-right: 5px; background-color: #0e9d6e">
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
</template>
