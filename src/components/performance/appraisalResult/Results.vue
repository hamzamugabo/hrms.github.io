<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { baseAUTHURL } from '../../reuseables/FetchPostData';
import Create from '@/components/performance/appraisalResult/Create.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getAppraisalResults } = usePerformanceUtils();
// const router = useRouter();
const appraisalResults = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const appraisalResultData = ref('');
// const departmentUpdatedName = ref('');
const feedback = ref('');
const recommendation = ref('');
const date = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const update = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseAUTHURL}/appraisal/result/update`;
        const formData = {
            recommendation: recommendation.value || appraisalResultData.value.recommendation,
            date: changeDateFormat(new Date()) || appraisalResultData?.value?.date,
            id: appraisalResultData?.value?.id,
            feedback: feedback.value || appraisalResultData.value.feedback
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess(data?.message);
            loading.value = false;
            await getAppraisalResults(appraisalResults);
        } else {
            showError();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError();

        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (appraisal) => {
    appraisalResultData.value = appraisal;

    recommendation.value = appraisal.recommendation;
    date.value = appraisal.date;

    feedback.value = appraisal.feedback;
    visible.value = true;
};

onMounted(async () => {
    await getAppraisalResults(appraisalResults);

    // console.log( getStatusColor('PENDING'))
});
initFilters();
const deleteObjective = async (id) => {
    // const url = `${baseURL}/appraisal/appeal/delete/${id}`;
    const url = `${baseAUTHURL}/appraisal/result/delete/${id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getAppraisalResults(appraisalResults);
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getAppraisalResults(appraisalResults);
};

const serverError = ref('');
const AddLoading = ref(false);
const submitForm = async () => {
    serverError.value = '';
    AddLoading.value = true;
    console.log('payload', payload.value);
    const formData = { ...payload.value };
     

    const url = `${baseAUTHURL}/appraisal/result/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            AddLoading.value = false;
            showSuccess(data?.message);
            await getAppraisalResults(appraisalResults);
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            AddLoading.value = false;
        }
    } catch (error) {
        showError();

        AddLoading.value = false;
        console.log(error?.error);
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
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Appraisal Result" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="feedback">feedback</label>
                                <InputText required id="feedback" type="text" v-model="feedback" />
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="recommendation">recommendation</label>
                                <InputText required id="recommendation" type="text" v-model="recommendation" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button v-if="!loading" type="button" label="Update" @click="update"></Button>
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="visibleAdd" header="Create Appraisal Result" :style="{ width: '50%' }">
            <Create @handleData="handleData" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleAdd = false"></Button>
                <Button v-if="!AddLoading" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="AddLoading" size="3rem" />
            </div>
        </Dialog>
    </div>

    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Appraisal Result'" @handleAdd="add" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="appraisalResults" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
            <template #header>
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No appraisalResults found. </template>
            <template #loading> Loading appraisalResults data. Please wait. </template>

            <Column :sortable="true" field="supervisor" header="Supervisor" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.supervisor }}</template>
            </Column>
            <Column :sortable="true" field="employee" header="Employee" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.employee }}</template>
            </Column>
            <Column :sortable="true" field="appraisal" header="Appraisal" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.appraisal }}</template>
            </Column>
            <Column :sortable="true" field="recommendation" header="Recommendation" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.recommendation }}</template>
            </Column>
            <Column :sortable="false" field="feedback" header="feedback" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.feedback }} </template>
            </Column>
            <Column :sortable="true" field="performanceAgreement" header="Performance Agreement" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.performanceAgreement }}</template>
            </Column>
            <!-- <Column :sortable="false" field="date" header="Due Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.date[0] }}-{{ data.date[1] }}-{{ data.date[2] }}</template>
            </Column> -->

            <Column style="min-width: 15rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                            <span class="text-sm">Update</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteObjective(data?.id)" style="width: 5rem">
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
