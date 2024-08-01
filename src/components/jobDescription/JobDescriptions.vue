<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useRouter } from 'vue-router';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useJobDescription } from '@/components/jobDescription/jobDescriptionUtils';
import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const router = useRouter();
const { getJobDescriptions } = useJobDescription();
const jobDescriptions = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const jobDescriptionData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const deliverables = ref('');
const jobGrade = ref('');
const jobTitle = ref('');
const lineOfResponsibility = ref('');
const personSpecifications = ref('');
const purpose = ref('');
const tasks = ref('');

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        department: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const update = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/job-description/update`;

        const formData = {
            deliverables: deliverables.value || jobDescriptionData?.value?.deliverables,
            id: jobDescriptionData?.value?.id,
            jobGrade: jobGrade.value || jobDescriptionData?.value?.jobGrade,
            jobTitle: jobTitle.value || jobDescriptionData?.value?.jobTitle,
            lineOfResponsibility: lineOfResponsibility.value || jobDescriptionData?.value?.lineOfResponsibility,
            personSpecifications: personSpecifications.value || jobDescriptionData?.value?.personSpecifications,
            purpose: purpose.value || jobDescriptionData?.value?.purpose,
            tasks: tasks.value || jobDescriptionData?.value?.tasks
        };
        // Perform form submission logic (e.g., send data to backend)
         
        // loading.value = false;

        const data = await postData(url, formData, loading);
         
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess();
            loading.value = false;
            await getJobDescriptions(jobDescriptions);
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
const openModal = (jobDescription) => {
    jobDescriptionData.value = jobDescription;

    deliverables.value = jobDescription?.deliverables;
    jobGrade.value = jobDescription?.jobGrade;
    jobTitle.value = jobDescription?.jobTitle;
    lineOfResponsibility.value = jobDescription?.lineOfResponsibility;
    personSpecifications.value = jobDescription?.personSpecifications;
    purpose.value = jobDescription?.purpose;
    tasks.value = jobDescription?.tasks;

    visible.value = true;
};


const deleteJobDescription = async (data) => {
    const url = `${baseURL}/job-description/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getJobDescriptions(jobDescriptions);
    });
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
// const refresh = async () => {
//     await getJobDescriptions(jobDescriptions);
// };
onMounted(async () => {
    await getJobDescriptions(jobDescriptions);
});
initFilters();
const add = () => {
    router.push('/job-description/create');
};
</script>

<template>
    <div class=" flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Update Contact" :style="{ width: '50rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ jobDescriptionData?.name }} category</span> -->
            <div class="grid">
                <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="deliverables">deliverables</label>
                                <InputText required id="deliverables" type="text" v-model="deliverables" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="jobGrade">job Grade</label>
                                <InputText required id="jobGrade" type="text" v-model="jobGrade" />
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="jobTitle">job Title</label>
                                <InputText id="jobTitle" type="text" v-model="jobTitle" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="lineOfResponsibility">line Of Responsibility</label>
                                <InputText id="lineOfResponsibility" type="text" v-model="lineOfResponsibility" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="personSpecifications">person Specifications</label>
                                <InputText id="personSpecifications" type="text" v-model="personSpecifications" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="purpose">Purpose</label>
                                <InputText id="purpose" type="text" v-model="purpose" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="tasks">tasks</label>
                                <InputText id="tasks" type="text" v-model="tasks" />
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
    </div>
    <div class="card">
         <div class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-12">
                        <AddButton :label="'Job Description'" @handleAdd="add" />
                        <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
                    </div>
                </div>
        <DataTable v-model:filters="filters" :value="jobDescriptions" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['department']">
            <template #header>
               
                <div class="flex justify-content-between">
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No jobDescriptions found. </template>
            <template #loading> Loading jobDescriptions data. Please wait. </template>
            <Column :sortable="true" field="department" header="Department" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.department }} </template>
            </Column>
            <Column :sortable="true" field="jobGrade" header="Job Grade" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.jobGrade }} </template>
            </Column>
            <Column :sortable="true" field="jobTitle" header="Job Title" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.jobTitle }} </template>
            </Column>
            <Column :sortable="true" field="deliverables" header="Deliverables" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.deliverables }} </template>
            </Column>
            <Column :sortable="true" field="lineOfResponsibility" header="line Of Responsibility" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.lineOfResponsibility }} </template>
            </Column>
            <Column :sortable="true" field="purpose" header="Purpose" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.purpose }} </template>
            </Column>
            <Column :sortable="true" field="tasks" header="Tasks" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.tasks }} </template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteJobDescription(data)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
