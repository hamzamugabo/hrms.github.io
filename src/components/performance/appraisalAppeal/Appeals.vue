<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { baseURL } from '@/components/reuseables/FetchPostData';
import { AppealStatus } from '@/components/reuseables/enums';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import CreateAppeal from '@/components/performance/appraisalAppeal/Create.vue';

import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getAppraisalAppeals } = usePerformanceUtils();
// const router = useRouter();
const appraisalAppeals = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const appraisalResultData = ref('');
const reason = ref('');
const appealStatus = ref({ name: '', code: '' });
const date = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        reason: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};
const visibleAdd = ref(false);
const addObjective = () => {
    visibleAdd.value = true;
};
const update = async () => {
    try {
        updateError.value = '';
        loading.value = true;
        const url = `${baseURL}/appraisal/appeal/update`;
        const formData = {
            appealStatus: appealStatus.value.name || appraisalResultData.value.appealStatus,
            date: changeDateFormat(new Date()) || appraisalResultData?.value?.date,
            id: appraisalResultData?.value?.id,
            reason: reason.value || appraisalResultData.value.reason
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            showSuccess(data?.message);
            await getAppraisalAppeals(appraisalAppeals);
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

    appealStatus.value.name = appraisal.appealStatus;
    date.value = appraisal.date;

    reason.value = appraisal.reason;
    visible.value = true;
};

// const deleteObjective = async (appraisalAppealId) => {
//     if (!appraisalAppealId) {
//         generalError.value = 'No appraisal Appeal selected';
//         return;
//     }
//     // console.log('designation');
//     const url = `${baseURL}/appraisal/appeal/delete/${appraisalAppealId}`;

//     try {
//         const data = await fetchData(url);
//         if (!data?.data) {
//             getAppraisalAppeals(appraisalAppeals);
//         }
//         getAppraisalAppeals(appraisalAppeals);

//         console.log(data);
//     } catch (error) {
//         // Handle errors here
//     }
// };

onMounted(async () => {
    await getAppraisalAppeals(appraisalAppeals);

    // console.log( getStatusColor('PENDING'))
});
initFilters();
const deleteObjective = async (id) => {
    const url = `${baseURL}/appraisal/appeal/delete/${id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getAppraisalAppeals(appraisalAppeals);
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getAppraisalAppeals(appraisalAppeals);
};
const serverError = ref('');
const submitForm = async () => {
    loading.value = true;
    serverError.value = '';
    const formData = {
        ...appraisalPayload.value
    };

    // console.log('form data', formData);
    const url = `${baseURL}/appraisal/appeal/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            showSuccess(data?.message);
            await getAppraisalAppeals(appraisalAppeals);
        } else {
            showError();
            serverError.value = data?.error || data?.message;
        }
        console.log('created response', data);
    } catch (error) {
        showError();

        serverError.value = error?.message;
    } finally {
        loading.value = false;
    }
};
const appraisalPayload = ref({});
const handleData = (data) => {
    appraisalPayload.value = data;
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Appraisal Appeal" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="appealStatus">Appeal Status</label>
                                <Dropdown id="appealStatus" v-model="appealStatus.name" :options="AppealStatus" optionLabel="name" placeholder="Select AppealStatus"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="reason">reason</label>
                                <InputText required id="reason" type="text" v-model="reason" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="update"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="visibleAdd" header="Create Appraisal Appeal" :style="{ width: '50%' }">
            <CreateAppeal @handleData="handleData" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleAdd = false"></Button>
                <Button v-if="!loading" type="button" label="Submit" @click="submitForm"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>

    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Appraisal Appeal'" @handleAdd="addObjective" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="appraisalAppeals" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['reason']">
            <template #header>
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No appraisal Appeals found. </template>
            <template #loading> Loading appraisal Appeals data. Please wait. </template>
            <Column :sortable="true" field="appealStatus" header="Appeal Status" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.appealStatus }}</template>
            </Column>
            <Column :sortable="true" field="supervisor" header="Supervisor" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.supervisor }}</template>
            </Column>
            <Column :sortable="true" field="employee" header="Employee" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.employee }}</template>
            </Column>
            <Column :sortable="true" field="appraisal" header="Appraisal" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.appraisal }}</template>
            </Column>

            <Column :sortable="false" field="reason" header="reason" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.reason }} </template>
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
