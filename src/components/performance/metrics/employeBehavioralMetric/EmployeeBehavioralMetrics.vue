<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import Create from '@/components/performance/metrics/employeBehavioralMetric/Create.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getEmployeeBehavioralMetric } = usePerformanceUtils();

const performanceMetrics = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const performanceMetricData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const employeeCustomerCare = ref('');
const employeeInnovation = ref('');
const employeeIntegrity = ref('');
const employeeProfessionalism = ref('');
const employeeQualityOfService = ref('');
const employeeRiskManagement = ref('');
const employeeTeamwork = ref('');

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
        const url = `${baseURL}/performance_metric/employee_behavioral/update`;
        const formData = {
            id: performanceMetricData.value?.id,
            employeeCustomerCare: employeeCustomerCare.value,
            employeeInnovation: employeeInnovation.value,
            employeeIntegrity: employeeIntegrity.value,
            employeeProfessionalism: employeeProfessionalism.value,
            employeeQualityOfService: employeeQualityOfService.value,
            employeeRiskManagement: employeeRiskManagement.value,
            employeeTeamwork: employeeTeamwork.value
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
            await getEmployeeBehavioralMetric(performanceMetrics);
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
    performanceMetricData.value = performanceMetric;
    employeeCustomerCare.value = performanceMetric?.employeeCustomerCare;
    employeeInnovation.value = performanceMetric?.employeeInnovation;
    employeeIntegrity.value = performanceMetric?.employeeIntegrity;
    employeeProfessionalism.value = performanceMetric?.employeeProfessionalism;
    employeeQualityOfService.value = performanceMetric?.employeeQualityOfService;
    employeeRiskManagement.value = performanceMetric?.employeeRiskManagement;
    employeeTeamwork.value = performanceMetric?.employeeTeamwork;
    visible.value = true;
};

onMounted(async () => {
    await getEmployeeBehavioralMetric(performanceMetrics);
});
initFilters();

const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/performance_metric/employee_behavioral/${data?.id}`;
    await confirmDelete(url, async () => {
        await getEmployeeBehavioralMetric(performanceMetrics);
    });
    refresh();
};

const addModalVisibility = ref(false);
const handleAdd = () => {
    addModalVisibility.value = true;
};
const refresh = async () => {
    await getEmployeeBehavioralMetric(performanceMetrics);
};
</script>

<template>
    <div class=" flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Employee Behavioral Metric" :style="{ width: '30rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeCustomerCare" class="font-semibold w-10rem">Customer Care</label>
                <InputText id="employeeCustomerCare" v-model="employeeCustomerCare" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeInnovation" class="font-semibold w-10rem">Innovation</label>
                <InputText id="employeeInnovation" v-model="employeeInnovation" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeIntegrity" class="font-semibold w-10rem">Integrity</label>
                <InputText id="employeeIntegrity" v-model="employeeIntegrity" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeProfessionalism" class="font-semibold w-10rem">Professionalism</label>
                <InputText id="employeeProfessionalism" v-model="employeeProfessionalism" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeQualityOfService" class="font-semibold w-10rem">Quality of Service</label>
                <InputText id="employeeQualityOfService" v-model="employeeQualityOfService" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeRiskManagement" class="font-semibold w-10rem">Risk Management</label>
                <InputText id="employeeRiskManagement" v-model="employeeRiskManagement" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="employeeTeamwork" class="font-semibold w-10rem">Teamwork</label>
                <InputText id="employeeTeamwork" v-model="employeeTeamwork" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateMetric"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>

        <Dialog v-model:visible="addModalVisibility" header="Add Employee Behavioral Metric">
            <Create />
        </Dialog>
    </div>

    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Employee Behavioral Metric'" @handleAdd="handleAdd" />
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
            <template #empty> No Employee Behavioral Metrics found. </template>
            <template #loading> Loading Employee Behavioral Metric data. Please wait. </template>

            <Column :sortable="false" field="employee" header="employee" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.employee }} </template>
            </Column>
            <Column :sortable="false" field="performanceMetricMetricCategory" header="Metric Category" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.performanceMetricMetricCategory }} </template>
            </Column>
            <Column :sortable="false" field="employeeCustomerCare" header="employee CustomerCare" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.employeeCustomerCare }} </template>
            </Column>

            <Column :sortable="false" field="employeeIntegrity" header="employee Integrity" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.employeeIntegrity }} </template>
            </Column>

            <Column :sortable="false" field="employeeProfessionalism" header="employee Professionalism" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.employeeProfessionalism }} </template>
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
