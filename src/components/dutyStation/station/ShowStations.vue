<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseAUTHURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useDutyStationUtils } from '../dutyStationUtils';
import CreateStation from '@/components/dutyStation/station/Create.vue';
import AddButton from '@/components/reuseables/AddButton.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getContactById, getRegionById } = useDutyStationUtils();
const stations = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const stationData = ref('');
const stationUpdatedName = ref('');
const coordinatesUpdated = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const getstations = async () => {
    const url = `${baseAUTHURL}/duty-station`;

    try {
        const { data } = await fetchData(url, loading);
        console.log('stations', data);
        let allstations = await Promise.all(
            data.map(async (element) => {
                const contact = await getContactById(element?.contactDetailsId);
                const region = await getRegionById(element?.regionId);

                // console.log('element', element)
                return {
                    ...element,
                    contact: contact?.name,
                    region: region?.name
                };
            })
        );
        console.log('allstations', allstations);
        stations.value = allstations;
    } catch (error) {
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
const update = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseAUTHURL}/duty-station/update`;
        const formData = {
            id: stationData.value?.id,
            name: stationUpdatedName?.value,
            gpsCoordinates: coordinatesUpdated?.value
        };
        // Perform form submission logic (e.g., send data to backend)
         
        // loading.value = false;

        const data = await postData(url, formData, loading);
         
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            showSuccess('Success');
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            await getstations();
        } else {
            showError(data?.message ? data?.message : data?.error);
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (category) => {
    stationData.value = category;
    stationUpdatedName.value = category?.name;
    coordinatesUpdated.value = category?.gpsCoordinates;
    visible.value = true;
};

onMounted(async () => {
    await getstations();
});
initFilters();
const handleConfirmDelete = async (data) => {
    const url = `${baseAUTHURL}/duty-station/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getstations();
    });
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
// const refresh = async () => {
//     await getstations();
// };
const assignCategory = async (id, categoryId) => {
    serverError.value = '';
    try {
        const url = `${baseAUTHURL}/duty-station/assign-category-to-dutyStation/${id}/${categoryId}`;

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', 'Category not assigned');
    }
};
const assignContact = async (id, contactDetailsId) => {
    serverError.value = '';
    try {
        const url = `${baseAUTHURL}/duty-station/assign-contact-to-dutyStation/${id}/${contactDetailsId}`;

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', 'Add contact details not assigned');
    }
};
const serverError = ref('');
const AddLoading = ref(false);
const assignRegion = async (id, regionId) => {
    serverError.value = '';
    try {
        const url = `${baseAUTHURL}/duty-station/assign-region-to-dutyStation/${id}/${regionId}`;

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', 'Add Region not assigned');
    }
};
const submitForm = async () => {
    serverError.value = '';
    AddLoading.value = true;
    const allData = { ...payload.value };
    console.log('all data', allData)
    const formData = {
        // categoryId: categoryId.value.id,
        // contactDetailsId: contactId?.value?.id,
        gpsCoordinates: allData?.gpsCoordinates,
        name: allData?.name
        // regionId: regionId?.value?.id
    };
    if (!allData?.categoryId) {
        serverError.value = 'Select Category';
        showError('Select Category');
            AddLoading.value = false;

        return;
    }
    if (!allData?.contactDetailsId) {
        serverError.value = 'Select Contact Person';
        showError('Select Contact Person');
            AddLoading.value = false;

        return;
    }

    if (!allData?.regionId) {
        serverError.value = 'Selec Region';
        showError('Select Region');
            AddLoading.value = false;

        return;
    }

    const url = `${baseAUTHURL}/duty-station/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            if (data?.data?.id) {
                await assignCategory(data?.data?.id, allData?.categoryId);
                await assignContact(data?.data?.id, allData?.contactDetailsId);
                await assignRegion(data?.data?.id, allData?.regionId);
            }
            successMessage.value = data?.message;
            success.value = true;
            AddLoading.value = false;
            showSuccess('Success');
            await getstations();
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            showError(data?.error || data?.message);
            success.value = false;
            successMessage.value = '';
            serverError.value = data?.error || data?.message;
            AddLoading.value = false;
        }
    } catch (error) {
        showError('Failed');

        success.value = false;
        successMessage.value = '';
        AddLoading.value = false;
        console.log(error?.error);
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
    <Toast />

    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Update Station" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ stationData?.name }} category</span> -->
            <div class="flex align-items-center gap-3 mb-3">
                <label for="name" class="font-semibold w-6rem">Name</label>
                <InputText id="name" v-model="stationUpdatedName" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="gpsCoordinates" class="font-semibold w-6rem">GPS Coordinates</label>
                <InputText id="gpsCoordinates" v-model="coordinatesUpdated" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="update"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
     
         <Dialog v-model:visible="visibleAdd" header="Create Station" :style="{ width: '50%' }">
            <CreateStation @handleData="handleData" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleAdd = false"></Button>
                <Button v-if="!AddLoading" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="AddLoading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Station'" @handleAdd="add" />
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="stations" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
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
            <template #empty> No stations found. </template>
            <template #loading> Loading stations data. Please wait. </template>
            <Column :sortable="true" field="name" header="Name" style="min-width: 15rem">
                <template #body="{ data }"> {{ data.name }} </template>
            </Column>

            <Column :sortable="true" field="contact" header="Contact" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.contact }} </template>
            </Column>
            <Column :sortable="true" field="region" header="Region" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.region }} </template>
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
