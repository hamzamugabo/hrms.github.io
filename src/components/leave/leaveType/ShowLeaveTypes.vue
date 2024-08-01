<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
// import ComfirmDelete from '@/components/reuseables/DeleteAlert.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';
// import { leaveTypes } from '@/components/reuseables/enums';

const { showError, showSuccess } = useToastPopup();

const { confirmDelete } = useConfirmDialog();

const leeveTypes = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const leaveTypesData = ref('');
// const departmentUpdatedName = ref('');
const name = ref('');
const maxDurationInDays = ref(0);
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');

const description = ref('');
const durationInDays = ref(0);

const serverError = ref('');
const visibleAddLeave = ref(false);

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    if (!name.value) {
        serverError.value = 'Enter Leave Name';
        loading.value = false;

        return;
    }
    if (!maxDurationInDays.value) {
        serverError.value = 'Enter maximum days';
        loading.value = false;

        return;
    }

    const url = `${baseURL}/leave/type/create`;

    try {
        const leveTypeData = {
            description: description.value,
            maxDurationInDays: parseInt(maxDurationInDays.value),
            name: name.value
        };
        console.log('submit', leveTypeData);
        const data = await postData(url, leveTypeData);
        if (data?.status === 200 || data?.status === 201) {
            success.value = true;
            successMessage.value = data?.message;

            loading.value = false;
            name.value = '';
            description.value = '';
            durationInDays.value = '';
            showSuccess(data?.message);
            await getLeaveTypes();

            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 2000);
        } else {
            showError('Failed');
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        serverError.value = error?.message || error?.message;
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
const getLeaveTypes = async () => {
    const url = `${baseURL}/leave/type`;

    try {
        const { data } = await fetchData(url, loading);
        leeveTypes.value = data;
    
    } catch (error) {
        leeveTypes.value = [];
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        maxDurationInDays: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};
const updateLeaveType = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/leave/type/update`;
        const formData = {
            id: leaveTypesData.value?.id,
            name: name?.value,
            maxDurationInDays: maxDurationInDays?.value,
            description: description.value
        };

        const data = await postData(url, formData, loading);
        //  
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            showSuccess(data?.message);

            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 2000);
            await getLeaveTypes();
        } else {
            showError('Failed');
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (leaveType) => {
    leaveTypesData.value = leaveType;
    name.value = leaveType?.name;
    maxDurationInDays.value = leaveType?.maxDurationInDays;
    visible.value = true;
};

onMounted(async () => {
    await getLeaveTypes();
});
initFilters();

const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/leave/type/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getLeaveTypes();
    });
};
const addLeaveType = () => {
    visibleAddLeave.value = true;
};
</script>

<template>
    <Toast />

    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Leave Type" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ leaveTypesData?.name }} Department</span> -->
            <div class="flex align-items-center gap-3 mb-3">
                <label for="name" class="font-semibold w-6rem">name</label>
                <InputText required id="name" type="text" v-model="name" />

                <!-- <Dropdown v-model="name" :options="leaveTypes" optionLabel="name" placeholder="Select a Leave Type" required /> -->
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="maxDurationInDays" class="font-semibold w-6rem">maxDurationInDays</label>
                <InputNumber required v-model="maxDurationInDays" inputId="integeronly" />
                <!-- <InputText required id="duration" type="text" v-model="maxDurationInDays" @input="validateInput" /> -->
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="jobTitle">Description</label>
                <Textarea rows="3" cols="30" v-model="description" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateLeaveType"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="visibleAddLeave" header="Add Leave Type" :style="{ width: '30rem' }">
            <!-- <div class="form-container"> -->
            <!-- <form @submit.prevent="submitForm"> -->
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>
                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <!-- <h5>Create Leave Type</h5> -->
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="jobTitle">Name</label>
                                <InputText required id="name" type="text" v-model="name" />

                                <!-- <Dropdown v-model="name" :options="leaveTypes" optionLabel="name" placeholder="Select a Leave Type" required /> -->
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="jobTitle">Duration in days</label>
                                <InputNumber required v-model="maxDurationInDays" inputId="integeronly" />

                                <!-- <InputText required id="duration" type="text" v-model="maxDurationInDays" @input="validateInput" /> -->
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="jobTitle">Description</label>
                                <Textarea rows="3" cols="30" v-model="description" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleAddLeave = false"></Button>
                <Button v-if="!loading" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>

        </Dialog>
    </div>
    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Leave Type'" @handleAdd="addLeaveType" />
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="leeveTypes" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name', 'maxDurationInDays']">
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
            <template #empty> No Leave Types found. </template>
            <template #loading> Loading Leave Types data. Please wait. </template>
            <Column :sortable="true" field="name" header="Type" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.name }} </template>
            </Column>
            <Column :sortable="false" field="maxDurationInDays" header="maxDurationInDays" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.maxDurationInDays }} </template>
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
</template>
