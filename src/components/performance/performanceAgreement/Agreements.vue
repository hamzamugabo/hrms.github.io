<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import Create from '@/components/performance/performanceAgreement/Create.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
import { usePerformanceUtils } from '@/components/performance/performanceUtils';

const { getPerformanceAgreements } = usePerformanceUtils();
// const router = useRouter();
const agreements = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const agreementData = ref('');
// const departmentUpdatedName = ref('');
const name = ref('');
// const maxDurationInDays = ref('');
const kpi = ref('');
const output = ref('');
const target = ref(0);
const meansOfVerification = ref('');
const dueDate = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');
// const minDate = ref(getMinDate());
// function getMinDate() {
//     const today = new Date();
//     today.setDate(today.getDate());
//     return today;
// }

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const updateAgreement = async () => {
    try {
        updateError.value = '';
        loading.value = true;
        const url = `${baseURL}/performance_agreement/update`;
        const formData = {
            dueDate: changeDateFormat(dueDate.value) || `${agreementData?.value?.dueDate[0]}-${agreementData?.value?.dueDate[1]}-${agreementData?.value?.dueDate[2]}`,
            kpi: kpi.value || agreementData?.value?.kpi,
            meansOfVerification: meansOfVerification.value || agreementData?.value?.meansOfVerification,
            output: output.value || agreementData?.value?.output,
            id: agreementData?.value?.id,
            target: target.value || agreementData?.value?.target
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            showSuccess(data?.message);
            await getPerformanceAgreements(agreements);
        } else {
            showError(data?.message ? data?.message : data?.error);
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError();
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (agreement) => {
    agreementData.value = agreement;

    name.value = agreement?.name;
    kpi.value = agreement?.kpi;
    meansOfVerification.value = agreement?.meansOfVerification;
    output.value = agreement?.output;
    target.value = agreement?.target;
    dueDate.value = `${agreement?.dueDate[0]}-${agreement?.dueDate[1]}-${agreement?.dueDate[2]}`;
    visible.value = true;
};

const deleteAgreement = async (id) => {
    // const url = `${baseURL}/appraisal/appeal/delete/${id}`;
    const url = `${baseURL}/performance_agreement/delete/${id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getPerformanceAgreements(agreements);
    });
};
onMounted(async () => {
    await getPerformanceAgreements(agreements);

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
    const url = `${baseURL}/performance_agreement/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            success.value = true;
            AddLoading.value = false;
            showSuccess(data?.message);
            await getPerformanceAgreements(agreements);
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
            <!-- <Message v-if="success" severity="success">{{ successMessage }}</Message> -->
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="kpi">KPI</label>
                                <InputText required id="kpi" type="text" v-model="kpi" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="meansOfVerification">Means Of Verification</label>
                                <InputText required id="meansOfVerification" type="text" v-model="meansOfVerification" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="output">Output</label>
                                <InputText required id="output" type="text" v-model="output" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="target">Target</label>
                                <InputText required id="target" type="text" v-model="target" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="dueDate">Due Date</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="dueDate"></Calendar>
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
        <Dialog v-model:visible="visibleAdd" header="Create Agreement" :style="{ width: '50%' }">
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

        <DataTable v-model:filters="filters" :value="agreements" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
            <template #header>
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No agreements found. </template>
            <template #loading> Loading agreements data. Please wait. </template>

            <Column :sortable="true" field="supervisorName" header="Supervisor" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.supervisorName }}</template>
            </Column>
            <Column :sortable="true" field="employeeName" header="Employee" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.employeeName }}</template>
            </Column>
            <Column :sortable="true" field="kpi" header="KPI" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.kpi }}</template>
            </Column>
            <Column :sortable="false" field="output" header="output" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.output }} </template>
            </Column>
            <Column :sortable="false" field="meansOfVerification" header="meansOfVerification" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.meansOfVerification }} </template>
            </Column>
            <Column :sortable="false" field="dueDate" header="Due Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.dueDate[0] }}-{{ data.dueDate[1] }}-{{ data.dueDate[2] }}</template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteAgreement(data?.id)" style="width: 5rem">
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
