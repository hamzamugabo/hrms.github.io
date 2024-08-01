<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import CreateDesignation from '@/components/designation/Create.vue';
// import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const designation = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const designationData = ref('');
// const departmentUpdatedName = ref('');
const jobTitle = ref('');
const grade = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const getDesignations = async () => {
    const url = `${baseURL}/designation`;

    try {
        const { data } = await fetchData(url, loading);
        console.log('designation', data?.designations);
        designation.value = data?.designations;
    } catch (error) {
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        jobTitle: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        grade: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};
const updateDesignation = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/designation/update`;
        const formData = {
            id: designationData.value?.id,
            jobTitle: jobTitle?.value,
            grade: grade?.value
        };
        // Perform form submission logic (e.g., send data to backend)
        //  
        // loading.value = false;

        const data = await postData(url, formData, loading);
        //  
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            loading.value = false;
            showSuccess();
            await getDesignations();
        } else {
            showError();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (designation) => {
    designationData.value = designation;
    jobTitle.value = designation?.jobTitle;
    grade.value = designation?.grade;
    visible.value = true;
};

onMounted(async () => {
    await getDesignations();
});
initFilters();

const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/designation/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getDesignations();
    });
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getDesignations();
};
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Designation" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ designationData?.name }} Department</span> -->
            <div class="flex align-items-center gap-3 mb-3">
                <label for="jobTitle" class="font-semibold w-6rem">jobTitle</label>
                <InputText id="jobTitle" v-model="jobTitle" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="grade" class="font-semibold w-6rem">Grade</label>
                <InputText id="grade" v-model="grade" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateDesignation"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <!-- <Dialog v-model:visible="addModalVisibility" header="Add Designation">
            <CreateDesignation @refresh="refresh" />
        </Dialog> -->
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-7">
                <DataTable v-model:filters="filters" :value="designation" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['jobTitle', 'grade']">
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
                    <template #empty> No Designation found. </template>
                    <template #loading> Loading Designation data. Please wait. </template>
                    <Column :sortable="true" field="jobTitle" header="JobTitle" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.jobTitle }} </template>
                    </Column>
                    <Column :sortable="false" field="grade" header="Grade" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.grade }} </template>
                    </Column>

                    <Column style="min-width: 12rem">
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
                <CreateDesignation @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
