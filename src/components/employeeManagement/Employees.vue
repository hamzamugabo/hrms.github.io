<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useRouter } from 'vue-router';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { useEmployeeStore } from '@/piniaStore/employeeData.js';
import AddButton from '@/components/reuseables/AddButton.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';

const { confirmDelete } = useConfirmDialog();

const router = useRouter();
const employeeStore = useEmployeeStore();
const employees = ref([]);
const disableMessage = ref('');
const loadingDisable = ref(false);
const showText = ref(false);
const filters = ref(null);
const searchTerm = ref('');
const showViewIcon = ref(false);
const showUpdateIcon = ref(false);
const loading = ref(true);

const getEmployees = async () => {
    const url = `${baseURL}/employees`;

    try {
        const { data } = await fetchData(url, loading);
        console.log('employess',data);
        disableMessage.value = '';
        loadingDisable.value = false;
        employees.value = data;
    } catch (error) {
        employees.value = [];

        console.log('employees error', error);
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
};

// eslint-disable-next-line no-unused-vars
const clearFilter = () => {
    initFilters();
};

const viewEmployee = (employee) => {
    employeeStore.setEmployeeData(employee);

    const employeeId = { id: employee?.id };
    router.push({
        path: '/employee',
        query: employeeId
    });
};

const updateEmployee = (employee) => {
    employeeStore.setEmployeeData(employee);
    router.push('/update-employee');
};

const searchEmployees = async () => {
    try {
        const url = `${baseURL}/employees/search`;
        const queryParams = new URLSearchParams();
        queryParams.append('searchTerm', searchTerm.value);
        const queryUrl = `${url}?${queryParams.toString()}`;
        const { data } = await fetchData(queryUrl, loading);
        console.log('data===>', data);
        employees.value = data || [];
    } catch (error) {
        employees.value = [];
        // Handle errors here
    }
};

onMounted(async () => {
    await getEmployees();
});

watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && searchTerm.value.length > 0) {
        await searchEmployees();
    } else {
        await getEmployees();
    }
});
const addEmployee = () => {
    router.push('/add-employee');
};
const deleteEmployee = async (data) => {
    const url = `${baseURL}/employees/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getEmployees();
    });
    refresh();
};

const refresh = async () => {
    await getEmployees();
};
</script>

<template>
    <Toast />

    <div class="card">
        <Message v-if="disableMessage" severity="success">{{ disableMessage }}</Message>
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Employee'" @handleAdd="addEmployee" />
                <!-- <Button type="button" icon="pi pi-user-plus" style="cursor: pointer; background-color: #db0000; color: white" class="mr-2 button-width" label="Add Employee" outlined @click="addEmployee()" /> -->
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <DataTable
            v-model:filters="filters"
            :value="employees"
            paginator
            showGridlines
            :rows="10"
            dataKey="id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['firstName', 'phoneNumber', 'idType', 'idNumber', 'emailAddress', 'maritalStatus', 'gender']"
        >
            <template #header>
                <div class="p-fluid formgrid grid flex-grow">
                    <!-- <div class="field col-12 md:col-12">
                        <AddButton :label="'Employee'" @handleAdd="addEmployee" />
                            </div> -->

                    <div class="field col-12 md:col-12">
                        <div class="custom-flex-container">
                            <IconField iconPosition="left">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="searchTerm" placeholder="Keyword Search" />
                            </IconField>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty> No Employees found. </template>
            <template #loading> Loading Employees data. Please wait. </template>
            <Column :sortable="true" field="firstName" header="Name" style="min-width: 14rem">
                <template #body="{ data }"> {{ data.firstName }} {{ data.lastName }} </template>
            </Column>
            <Column :sortable="true" field="phoneNumber" header="Phone Number" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.phoneNumber }}
                </template>
            </Column>
            <!-- <Column :sortable="true" field="gender" header="Gender" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.gender }}
                </template>
            </Column> -->
            <Column :sortable="true" field="emailAddress" header="Email Address" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.emailAddress }}
                </template>
            </Column>
            <Column :sortable="true" field="idType" header="ID Type" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.idType }}
                </template>
            </Column>
            <!-- <Column :sortable="true" field="idNumber" header="ID Number" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.idNumber }}
                </template>
            </Column> -->
            <!-- <Column :sortable="true" field="maritalStatus" header="Marital Status" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.maritalStatus }}
                </template>
            </Column> -->
            <Column style="min-width: 12rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <!-- <span v-if="showText">Disable</span>
                     <span  v-if="showViewIcon">View</span>
                     <span  v-if="showUpdateIcon">View</span> -->
                    <div class="flex justify-center space-x-2">
                        <!-- <span  v-if="showViewIcon">View</span> -->
                        <Button
                            type="button"
                            icon="pi pi-eye"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            @click="viewEmployee(data)"
                            style="width: 2rem; cursor: pointer; margin-right: 5px; border-radius: 200px"
                            @mouseover="showViewIcon = true"
                            @mouseleave="showViewIcon = false"
                        >
                            <i class="pi pi-eye"></i>
                        </Button>

                        <Button
                            type="button"
                            icon="pi pi-trash"
                            @click="updateEmployee(data)"
                            style="width: 2rem; cursor: pointer; margin-right: 5px; border-radius: 200px; background-color: #0e9d6e"
                            @mouseover="showUpdateIcon = true"
                            @mouseleave="showUpdateIcon = false"
                        >
                            <!-- <span class="text-sm">Update</span> -->
                            <i class="pi pi-file-edit"></i>
                        </Button>
                        <Button
                            type="button"
                            icon="pi pi-trash"
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            @click="deleteEmployee(data)"
                            style="width: 2rem; cursor: pointer; border-radius: 200px"
                            @mouseover="showText = true"
                            @mouseleave="showText = false"
                        >
                            <span class="text-sm"><i class="pi pi-trash"></i></span>
                        </Button>
                        <!-- <span v-if="showText">Disable</span> -->
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<style>
.custom-flex-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 230px;
    float: right;
}

.custom-flex-item {
    flex: 1 1 auto;
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .custom-flex-container {
        flex-direction: column;
        align-items: stretch;
    }

    .custom-flex-item {
        width: 100%;
        margin-bottom: 1rem;
    }
    .button-width {
        width: 230px;
        margin-bottom: 10px;
    }
}
</style>
