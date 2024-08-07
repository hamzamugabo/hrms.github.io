<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useDutyStationUtils } from '../dutyStationUtils';
import validatePhoneNumber from '@/components/reuseables/phoneNumeberValidation';
import CreateContact from '@/components/dutyStation/contact/Create.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getStationById, getRegionById } = useDutyStationUtils();
const contacts = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const contactData = ref('');
const contactUpdatedName = ref('');
const phoneNumberUpdated = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const getcontacts = async () => {
    const url = `${baseURL}/contact-details`;

    try {
        const { data } = await fetchData(url, loading);
        console.log('contacts', data);
        let allContacts = await Promise.all(
            data.map(async (element) => {
                const station = await getStationById(element?.dutyStation?.id);
                const region = await getRegionById(element?.dutyStation?.regionId);

                // console.log('element', element)
                return {
                    ...element,
                    station: station?.name,
                    region: region?.name
                };
            })
        );
        contacts.value = allContacts;
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

        if (!validatePhoneNumber(phoneNumberUpdated.value)) {
            updateError.value = 'Enter a valid Phone Number';
            loading.value = false;
            return;
        }
        const url = `${baseURL}/contact-details/update`;
        const formData = {
            id: contactData.value?.id,
            name: contactUpdatedName?.value,
            phoneNumber: phoneNumberUpdated?.value
        };
        // Perform form submission logic (e.g., send data to backend)
         
        // loading.value = false;

        const data = await postData(url, formData, loading);
         
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            showSuccess();
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            await getcontacts();
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
const openModal = (category) => {
    contactData.value = category;
    contactUpdatedName.value = category?.name;
    phoneNumberUpdated.value = category?.phoneNumber;
    visible.value = true;
};

onMounted(async () => {
    await getcontacts();
});
initFilters();
const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/contact-details/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getcontacts();
    });
};
const addModalVisibility = ref(false);
const handleAdd = () => {
    addModalVisibility.value = true;
};

const contactDetails = ref({});
const serverError = ref('');

const submitForm = async () => {

    serverError.value = '';
    loading.value = true;
    const formData = { ...contactDetails.value};

    if (!validatePhoneNumber(formData?.phoneNumber)) {
        serverError.value = 'Enter a valid Phone Number';
            showError('Enter a valid Phone Number');

        console.log('Enter a valid Phone Number');
        loading.value = false;
        return;
    }

    const url = `${baseURL}/contact-details/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            console.log('data', data);
            successMessage.value = data?.message;
            success.value = true;
            loading.value = false;
            showSuccess();
            await getcontacts();
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        showError();

        loading.value = false;
        console.log(error?.error);
    }
};
const handleDataEmitted = (data) => {
    contactDetails.value = data;
};
</script>

<template>
    <Toast />

    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Update Contact" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ contactData?.name }} category</span> -->
            <div class="flex align-items-center gap-3 mb-3">
                <label for="name" class="font-semibold w-6rem">Name</label>
                <InputText id="name" v-model="contactUpdatedName" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="phoneNumber" class="font-semibold w-6rem">phoneNumber</label>
                <InputText id="phoneNumber" v-model="phoneNumberUpdated" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="update"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="addModalVisibility" header="Create Contact Details" :style="{ width: '50rem' }">
            <CreateContact @handleDataEmitted="handleDataEmitted" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="addModalVisibility = false"></Button>
                <Button v-if="!loading" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Contact'" @handleAdd="handleAdd" />
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="contacts" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
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
            <template #empty> No contacts found. </template>
            <template #loading> Loading contacts data. Please wait. </template>
            <Column :sortable="true" field="name" header="Name" style="min-width: 15rem">
                <template #body="{ data }"> {{ data.name }} </template>
            </Column>
            <Column :sortable="true" field="phoneNumber" header="Phone Number" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.phoneNumber }} </template>
            </Column>
            <Column :sortable="true" field="station" header="Station" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.station }} </template>
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
