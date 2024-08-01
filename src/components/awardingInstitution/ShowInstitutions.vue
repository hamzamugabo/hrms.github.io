<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import CreateInstitution from '@/components/awardingInstitution/Create.vue';
// import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const institutions = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const institutionData = ref('');
// const departmentUpdatedName = ref('');
const location = ref('');
const name = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const getInstitutions = async () => {
    const url = `${baseURL}/awarding-institution`;

    try {
        const { data } = await fetchData(url, loading);
console.log('institutions', data)
        institutions.value = data?.awardingInstitutions;
    } catch (error) {
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        location: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};
const updateInstitution = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/awarding-institution/update`;
        const formData = {
            id: institutionData.value?.id,
            name: name?.value,
            location: location?.value
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
            showSuccess(data?.message);
            loading.value = false;
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            await getInstitutions();
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
const openModal = (institution) => {
    institutionData.value = institution;
    name.value = institution?.name;
    location.value = institution?.location;
    visible.value = true;
};

onMounted(async () => {
    await getInstitutions();
});
initFilters();
const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/awarding-institution/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getInstitutions();
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getInstitutions();
};
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Institution" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="flex align-items-center gap-3 mb-3">
                <label for="name">Institution Name</label>
                <InputText required id="name" type="text" v-model="name" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="location">Location</label>
                <InputText required id="location" type="text" v-model="location" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateInstitution"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <!-- <Dialog v-model:visible="addModalVisibility" header="Nationality">
            <CreateNationality @refresh="refresh" />
        </Dialog> -->
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-7">
                <DataTable v-model:filters="filters" :value="institutions" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name', 'location']">
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
                    <template #empty> No data found. </template>
                    <template #loading> Loading  data. Please wait. </template>
                    <Column :sortable="true" field="name" header="Name" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.name }} </template>
                    </Column>
                    <Column :sortable="true" field="location" header="location" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.location }} </template>
                       
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
                <CreateInstitution @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
