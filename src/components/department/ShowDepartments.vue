<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import CreateDepartment from '@/components/department/Create.vue';
// import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const departments = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const departmentData = ref('');
const departmentUpdatedName = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const getDepartments = async () => {
    const url = `${baseURL}/department`;

    try {
        const { data } = await fetchData(url, loading);
        departments.value = data?.departments;
    } catch (error) {
        departments.value = [];
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};
const updateDepartment = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/department/update`;
        const formData = {
            id: departmentData.value?.id,
            name: departmentUpdatedName?.value
        };
        // Perform form submission logic (e.g., send data to backend)
         
        // loading.value = false;

        const data = await postData(url, formData, loading);
         
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            loading.value = false;
            await getDepartments();
            showSuccess();
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
const openModal = (department) => {
    departmentData.value = department;
    departmentUpdatedName.value = department?.name;
    visible.value = true;
};

onMounted(async () => {
    await getDepartments();
});
initFilters();
const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/department/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getDepartments();
    });
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getDepartments();
};
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Department" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ departmentData?.name }} Department</span> -->
            <div class="flex align-items-center gap-3 mb-3">
                <label for="name" class="font-semibold w-6rem">Name</label>
                <InputText id="name" v-model="departmentUpdatedName" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateDepartment"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <!-- <Dialog v-model:visible="addModalVisibility" header="Department">
            <CreateDepartment @refresh="refresh" />
        </Dialog> -->
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-7">
                <DataTable v-model:filters="filters" :value="departments" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
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
                    <template #empty> No Departments found. </template>
                    <template #loading> Loading Departments data. Please wait. </template>
                    <Column :sortable="true" field="name" header="Name" style="min-width: 18rem">
                        <template #body="{ data }"> {{ data.name }} </template>
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
                                <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleConfirmDelete(data)" style="width: 5rem">
                                    <span class="text-sm">Delete</span>
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="col-12 xl:col-5">
                <CreateDepartment @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
