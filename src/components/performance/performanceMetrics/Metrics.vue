<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import Create from '@/components/performance/performanceMetrics/Create.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getPerformanceMetrics } = usePerformanceUtils();
// const router = useRouter();
const metrics = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const metricsData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');
const metricCategory = ref({});
const metricDescription = ref('');
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const updateAgreement = async () => {
    try {
        loading.value = true;
        const url = `${baseURL}/performance-metrics/update`;
        const formData = {
            id: metricsData.value.id,
            metricCategory: metricCategory.value || metricsData?.value?.metricCategory,
            metricDescription: metricDescription.value || metricsData?.value?.metricDescription
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            await getPerformanceMetrics(metrics);
        } else {
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (metric) => {
    metricsData.value = metric;
    (metricCategory.value = metric.metricCategory), (metricDescription.value = metric.metricDescription);
    visible.value = true;
};

const deleteMetric = async (id) => {
   
    const url = `${baseURL}/performance-metrics/delete/${id}`;
    await confirmDelete(url, async () => {
        await getPerformanceMetrics(metrics);
    });
};

onMounted(async () => {
    await getPerformanceMetrics(metrics);

    // console.log( getStatusColor('PENDING'))
});
initFilters();


const serverError = ref('');
const AddLoading = ref(false);
const submitForm = async () => {
    AddLoading.value = true;
    serverError.value = '';
    const formData = {
        ...payload.value
    };
    console.log('form data', formData);
       const url = `${baseURL}/performance-metrics/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            success.value = true;
            AddLoading.value = false;
            showSuccess(data?.message);
            await getPerformanceMetrics(metrics);
        } else {
            showError(data?.error || data?.message);
            AddLoading.value = false;
            serverError.value = data?.error || data?.message;
        }
    } catch (error) {
        showError();
        AddLoading.value = false;

        serverError.value = error?.message;
    } finally {
        AddLoading.value = false;
    }
};
const visibleAdd = ref(false);
const add = () => {
    visibleAdd.value = true;
};
const payload = ref({});
const handleData = (data) => {
    payload.value = data;
};
</script>

<template>
    <div class=" flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Agreement" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="metricCategory">Metric Category</label>
                                <Dropdown id="metricCategory" v-model="metricCategory.name" :options="MetricCategory" optionLabel="name" placeholder="Select metricCategory"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="metricDescription">Metric Description</label>
                                <InputText required id="metricDescription" type="text" v-model="metricDescription" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateAgreement"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
         <Dialog v-model:visible="visibleAdd" header="Create performance Metric" :style="{ width: '50%' }">
            <Create @handleData="handleData" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleAdd = false"></Button>
                <Button v-if="!AddLoading" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="AddLoading" size="2rem" />
            </div>
        </Dialog>
    </div>

    <div class="card">
         <div class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-12">
                        <AddButton :label="'Agreement'" @handleAdd="add" />
                        <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
                    </div>
                </div>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="metrics" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
            <template #header>
               
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No metrics found. </template>
            <template #loading> Loading metrics data. Please wait. </template>

            <Column :sortable="true" field="performanceAgreementId" header="Performance Agreement" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.agreement?.metricCategory }}</template>
            </Column>
            <Column :sortable="true" field="appraisalId" header="Appraisal" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.appraisal?.appraisalPhase }}</template>
            </Column>
            <Column :sortable="true" field="metricCategory" header="Metric Category" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.metricCategory }}</template>
            </Column>
            <Column :sortable="false" field="metricDescription" header="Metric Description" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.metricDescription }} </template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteMetric(data?.id)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>
@media (max-width: 768px) {
    .flex-column-sm {
        flex-direction: column;
    }
    .gap-3-sm > * {
        margin-bottom: 1rem;
    }
}
</style>
