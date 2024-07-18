<script setup>
import { baseAUTHURL, fetchData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
import { baseURL } from '@/components/reuseables/FetchPostData';
// import { useToastPopup } from '@/components/reuseables/useToast.js';

// const { showError } = useToastPopup();

const emit = defineEmits(['handleData']);

const name = ref('');
const gpsCoordinates = ref('');
const loading = ref(false);
const success = ref(false);

const serverError = ref('');
const successMessage = ref('');
const autoFilteredContact = ref([]);
const allContacts = ref([]);
const contactId = ref('');

const autoFilteredRegion = ref([]);
const allRegions = ref([]);
const regionId = ref('');

const autoFilteredCategory = ref([]);
const allCategories = ref([]);
const categoryId = ref('');

const submitFormPayload = async () => {
    serverError.value = '';
    loading.value = true;
    // if (!categoryId.value.id) {
    //     serverError.value = 'Select Category';
    //     showError('Select Category');
    //     return;
    // }
    // if (!contactId.value.id) {
    //     serverError.value = 'Select Contact Person';
    //     showError('Select Contact Person');
    //     return;
    // }

    // if (!regionId.value.id) {
    //     serverError.value = 'Selec Region';
    //     showError('Selec Region');
    //     return;
    // }

    const formData = {
        categoryId: categoryId.value.id,
        contactDetailsId: contactId?.value?.id,
        gpsCoordinates: gpsCoordinates.value,
        name: name.value,
        regionId: regionId?.value?.id
    };
    emit('handleData', formData);
};
watch([gpsCoordinates, name, categoryId, contactId, regionId], () => {
    submitFormPayload();
});
const getContacts = async () => {
    // console.log('designation');
    const url = `${baseURL}/contact-details`;

    try {
        const { data } = await fetchData(url);
        allContacts.value = data || [];
        console.log('contacts', allContacts.value);
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};
const getRegions = async () => {
    // console.log('designation');
    const url = `${baseURL}/region`;

    try {
        const { data } = await fetchData(url);
        allRegions.value = data || [];
        console.log('Regions', allRegions.value);

        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};
const getCategory = async () => {
    // console.log('designation');
    const url = `${baseAUTHURL}/category`;

    try {
        const { data } = await fetchData(url);
        allCategories.value = data || [];
        console.log('Categories', allCategories.value);

        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};

const searchContact = (event) => {
    if (!event.query.trim().length) {
        autoFilteredContact.value = allContacts?.value?.length > 0 ? [...allContacts.value] : [];
    } else {
        // Check if allDepartments.value is iterable and not null/undefined
        if (Array.isArray(allContacts.value)) {
            autoFilteredContact.value = allContacts.value.filter((contact) => {
                return contact.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        } else {
            autoFilteredContact.value = [];
        }
    }
};
const searchRegions = (event) => {
    if (!event.query.trim().length) {
        autoFilteredRegion.value = allRegions?.value?.length > 0 ? [...allRegions.value] : [];
    } else {
        // Check if allDepartments.value is iterable and not null/undefined
        if (Array.isArray(allRegions.value)) {
            autoFilteredRegion.value = allRegions.value.filter((region) => {
                return region.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        } else {
            autoFilteredRegion.value = [];
        }
    }
};
const searchCategories = (event) => {
    if (!event.query.trim().length) {
        autoFilteredCategory.value = allCategories?.value?.length > 0 ? [...allCategories.value] : [];
    } else {
        // Check if allDepartments.value is iterable and not null/undefined
        if (Array.isArray(allCategories.value)) {
            autoFilteredCategory.value = allCategories.value.filter((category) => {
                return category.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        } else {
            autoFilteredCategory.value = [];
        }
    }
};
onMounted(async () => {
    await getContacts();
    await getCategory();
    await getRegions();
});
</script>
<template>
    <!-- <div class="form-container"> -->
    <Toast />
    <!-- <form @submit.prevent="submitForm" class="form-content"> -->
    <div class="grid">
        <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

        <div class="col-12">
            <div class="card">
                <Message v-if="success" severity="success">{{ successMessage }}</Message>

                <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                <!-- <h5>Create Station</h5> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="firstName">contact details</label>
                        <AutoComplete placeholder="Search" id="contact" :dropdown="true" :multiple="false" v-model="contactId" :suggestions="autoFilteredContact" @complete="searchContact($event)" field="name" />
                        <p v-if="allContacts?.length === 0" class="text-red-500">No contacts found.</p>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="firstName">Category</label>
                        <AutoComplete placeholder="Search" id="category" :dropdown="true" :multiple="false" v-model="categoryId" :suggestions="autoFilteredCategory" @complete="searchCategories($event)" field="name" />
                        <p v-if="allCategories?.length === 0" class="text-red-500">No categories found.</p>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="firstName">Region</label>
                        <AutoComplete placeholder="Search" id="region" :dropdown="true" :multiple="false" v-model="regionId" :suggestions="autoFilteredRegion" @complete="searchRegions($event)" field="name" />
                        <p v-if="allRegions?.length === 0" class="text-red-500">No Regions found.</p>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="gpsCoordinates">GPS Coordinates</label>
                        <InputText required id="gpsCoordinates" type="text" v-model="gpsCoordinates" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="name">Name</label>
                        <InputText required id="name" type="text" v-model="name" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
.text-red-500 {
    color: #e53e3e; /* Red color */
    font-size: 0.875rem; /* Adjust font size as needed */
    margin-top: 0.5rem; /* Add spacing between input and message */
}
</style>
