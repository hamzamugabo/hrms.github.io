<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import Create from '@/components/performance/metrics/supervisorInternalProcessMetric/Create.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';
import { baseAUTHURL } from '../../../reuseables/FetchPostData';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getInternalProcessMetric } = usePerformanceUtils();

const performanceMetrics = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const selectedData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const errorsDetected = ref(0);
const totalOrdersProcessed = ref(0);

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
        const url = `${baseAUTHURL}/performance_metric/supervisor_internal_process/update`;
        const formData = {
            id: selectedData.value?.id,
            errorsDetected: errorsDetected.value,
            totalOrdersProcessed: totalOrdersProcessed.value
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
            await getInternalProcessMetric(performanceMetrics);
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
    errorsDetected.value = performanceMetric?.errorsDetected;
    totalOrdersProcessed.value = performanceMetric?.totalOrdersProcessed;
    visible.value = true;
};

onMounted(async () => {
    await getInternalProcessMetric(performanceMetrics);
});
initFilters();

const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/performance_metric/supervisor_internal_process/delete/${data?.id}`;
    await confirmDelete(url, async () => {
        await getInternalProcessMetric(performanceMetrics);
    });
    refresh();
};

const addModalVisibility = ref(false);
const handleAdd = () => {
    addModalVisibility.value = true;
};
const refresh = async () => {
    await getInternalProcessMetric(performanceMetrics);
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Supervisor Financial Metric" :style="{ width: '30rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="flex align-items-center gap-3 mb-3">
                <label for="errorsDetected">Errors Detected</label>
                <InputNumber v-model="errorsDetected" inputId="integeronly" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="totalOrdersProcessed">Total Orders Processed</label>
                <InputNumber v-model="totalOrdersProcessed" inputId="integeronly" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateMetric"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>

        <Dialog v-model:visible="addModalVisibility" header="Add Supervisor Internal Process Metric">
            <Create />
        </Dialog>
    </div>

    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Supervisor Internal Process Metric'" @handleAdd="handleAdd" />
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
            <template #empty> No Supervisor Internal Processes found. </template>
            <template #loading> Loading Supervisor Internal Process data. Please wait. </template>

            <Column :sortable="false" field="employee" header="employee" style="min-width: 12rem">
                <template #body="{ data }"> {{ data.employee }} </template>
            </Column>
            <Column :sortable="false" field="performanceMetricMetricCategory" header="Metric Category" style="min-width: 12rem">
                <template #body="{ data }"> {{ data.performanceMetricMetricCategory }} </template>
            </Column>
            <Column :sortable="false" field="errorsDetected" header="Errors Detected" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.errorsDetected }} </template>
            </Column>

            <Column :sortable="false" field="totalOrdersProcessed" header="Total Orders Processed" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.totalOrdersProcessed }} </template>
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
