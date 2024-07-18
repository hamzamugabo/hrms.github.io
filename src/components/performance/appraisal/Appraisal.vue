<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';
import CreateAppriasal from '@/components/performance/appraisal/Create.vue';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getAppraisals } = usePerformanceUtils();
// const router = useRouter();
const appraisals = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const appraisalData = ref('');
// const departmentUpdatedName = ref('');
const comments = ref('');
const appraisalPhase = ref('');
const date = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');
const visibleAdd = ref(false);

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const addObjective = () => {
   visibleAdd.value = true;
};
const update = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/appraisal/update`;
        const formData = {
            appraisalPhase: appraisalPhase.value || appraisalData.value.appraisalPhase,
            date: changeDateFormat(new Date()) || appraisalData?.value?.date,
            id: appraisalData?.value?.id,
            comments: comments.value || appraisalData.value.comments
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess();
            loading.value = false;
            await getAppraisals(appraisals);
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
    appraisalData.value = appraisal;

    appraisalPhase.value = appraisal.appraisalPhase;
    date.value = appraisal.date;

    comments.value = appraisal.comments;
    visible.value = true;
};



onMounted(async () => {
    await getAppraisals(appraisals);

    // console.log( getStatusColor('PENDING'))
});
initFilters();
const deleteAppraisal = async (id) => {
    const url = `${baseURL}/appraisal/delete/${id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getAppraisals(appraisals);
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getAppraisals(appraisals);
};
const serverError = ref('');
const submitForm = async () => {
    loading.value = true;
    serverError.value = '';
    const formData = { ...appraisalEmittedData?.value };

    console.log('form data', formData);
    const url = `${baseURL}/appraisal/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            showSuccess(data?.message);
            await getAppraisals(appraisals);
        } else {
            showError();
            serverError.value = data?.error || data?.message;
        }
        console.log('created appraisal response', data);
    } catch (error) {
        showError();

        serverError.value = error?.message;
    } finally {
        loading.value = false;
    }
};
const appraisalEmittedData = ref({});
const handleData = (data) => {
    appraisalEmittedData.value = { ...data };
};

</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Appraisal" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="appraisalPhase">Appraisal Phase</label>
                                <Dropdown id="appraisalPhase" v-model="appraisalPhase" :options="AppraisalPhase" optionLabel="name" placeholder="Select AppraisalPhase"></Dropdown>
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="comments">comments</label>
                                <Textarea id="comments" v-model="comments" required="true" rows="3" cols="20" />

                                <!-- <InputText required id="comments" type="text" v-model="comments" /> -->
                            </div>
                            <!-- <div class="field col-12 md:col-12">
                                <label for="date">Due Date</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="date" :minDate="minDate"></Calendar>
                            </div> -->
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
        <Dialog v-model:visible="visibleAdd" header="Create Appraisal" :style="{ width: '50%' }">
            <CreateAppriasal @handleData="handleData" />
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
                <AddButton :label="'Appraisal'" @handleAdd="addObjective" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
       
        <DataTable v-model:filters="filters" :value="appraisals" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
            <template #header>
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No appraisals found. </template>
            <template #loading> Loading appraisals data. Please wait. </template>

            <Column :sortable="true" field="supervisor" header="Supervisor" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.supervisor }}</template>
            </Column>
            <Column :sortable="true" field="employee" header="Employee" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.employee }}</template>
            </Column>
            <Column :sortable="true" field="appraisalPhase" header="Appraisal Phase" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.appraisalPhase }}</template>
            </Column>
            <Column :sortable="false" field="comments" header="Comments" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.comments }} </template>
            </Column>
            <!-- <Column :sortable="true" field="performanceAgreement" header="Performance Agreement" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.performanceAgreement }}</template>
            </Column> -->
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteAppraisal(data?.id)" style="width: 5rem">
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
