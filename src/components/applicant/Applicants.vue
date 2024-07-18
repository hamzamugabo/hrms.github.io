<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useRouter } from 'vue-router';

import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { useApplicantStore } from '@/piniaStore/applicantData.js';
import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
// import { useToastPopup } from '@/components/reuseables/useToast.js';

// const { showError } = useToastPopup();
const { confirmDelete } = useConfirmDialog();


const router = useRouter();
const applicantStore = useApplicantStore();
const applicants = ref([]);
const disableMessage = ref('');
const loadingDisable = ref(false);
const showText = ref(false);
const filters = ref(null);
const searchTerm = ref('');
const showViewIcon = ref(false);
const showUpdateIcon = ref(false);
const loading = ref(true);

const getApplicants = async () => {
    const url = `${baseURL}/applicant`;

    try {
        const { data } = await fetchData(url, loading, router);
        // console.log(data);
        disableMessage.value = '';
        loadingDisable.value = false;
        applicants.value = data;
        console.log('applicants', data)
        if (!data) {
            applicants.value = [];
            console.log('no applicants available')
        }
    } catch (error) {
        applicants.value = [];
        console.log('applicants error', error);
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

const viewApplicant = (applicant) => {
    applicantStore.setApplicantData(applicant);

    const applicantId = { id: applicant?.id };
    router.push({
        path: '/applicant',
        query: applicantId
    });
};

const updateApplicant = (applicant) => {
    applicantStore.setApplicantData(applicant);
    router.push('/update-applicant');
};

// const deleteApplicant = async (applicant) => {
//     loadingDisable.value = true;
//     if (!applicant) {
//         console.log('applicant not selected');
//         loadingDisable.value = false;
//         await getApplicants();
//         return;
//     }
//     try {
//         const url = `${baseURL}/applicant/delete/${applicant?.id}`;

//         await fetchData(url, loading, router);
//         await getApplicants();
//         // if (!data?.data) {
//         //     disableMessage.value = `${employee?.firstName} ${employee?.lastName} is disabled successfuly`;
//         //     loadingDisable.value = false
//         //     getApplicants();
//         //     loadingDisable.value = false
//         // }
//     } catch (error) {
//         loadingDisable.value = false;

//         console.error('Error deleting employee:', error.message);
//         alert('Failed to delete employee. Please try again.');
//     }
// };

const searchApplicant = async () => {
    try {
        const url = `${baseURL}/applicant/search`;
        const queryParams = new URLSearchParams();
        queryParams.append('searchTerm', searchTerm.value);
        const queryUrl = `${url}?${queryParams.toString()}`;
        const { data } = await fetchData(queryUrl, loading, router);
        console.log('data===>', data);
        applicants.value = data || [];
    } catch (error) {
        applicants.value = [];
        // Handle errors here
    }
};

onMounted(async () => {
    await getApplicants();
});

watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && searchTerm.value.length > 0) {
        await searchApplicant();
    } else {
        await getApplicants();
    }
});
const deleteApplicant = async (data) => {
    const url = `${baseURL}/applicant/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getApplicants();
    });
    refresh();
};
// const addModalVisibility = ref(false);
const handleAdd = () => {
     router.push('/applicant/create');
};

const refresh = async () => {
    await getApplicants();
};
</script>

<template>
 <Toast />
     
    <div class="card">
        <Message v-if="disableMessage" severity="success">{{ disableMessage }}</Message>
         <div class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-12">
                        <AddButton :label="'Applicant'" @handleAdd="handleAdd" />
                    </div>
                </div>
        <DataTable
            v-model:filters="filters"
            :value="applicants"
            paginator
            showGridlines
            :rows="10"
            dataKey="id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['firstName', 'phoneNumber', 'idType', 'idNumber', 'emailAddress', 'maritalStatus', 'gender']"
        >
            <template #header>

                <div class="flex justify-content-between">
                    <!-- <Button type="button" icon="pi pi-filter-slash" class="mr-2" label="Clear" outlined @click="clearFilter()" /> -->
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="searchTerm" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No Applicants found. </template>
            <template #loading> Loading Applicants data. Please wait. </template>
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
            <Column :sortable="true" field="email" header="Email Address" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.email }}
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
                            @click="viewApplicant(data)"
                            style="width: 2rem; cursor: pointer; margin-right: 5px; border-radius: 200px"
                            @mouseover="showViewIcon = true"
                            @mouseleave="showViewIcon = false"
                        >
                            <i class="pi pi-eye"></i>
                        </Button>

                        <Button
                            type="button"
                          
                            class=" text-white font-bold py-1 px-2 rounded"
                            @click="updateApplicant(data)"
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
                            @click="deleteApplicant(data)"
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
