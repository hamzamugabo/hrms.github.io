<script setup>
import { onMounted, ref } from 'vue';
import countryList from 'country-list';
import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const emit = defineEmits(['refresh']);

const addName = ref('');
// eslint-disable-next-line no-unused-vars
const code = ref('');
const loading = ref(false);
const success = ref(false);
const autoFilteredValue = ref([]);
const autoValue = ref(null);
const serverError = ref('');
const successMessage = ref('');

const baseURL = import.meta.env.VITE_APP_API_URL;

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    const countryData = {
        name: addName.value.name,
        code: addName.value.code
    };

    if (!countryData?.name && !countryData?.code) {
        serverError.value = 'Select nationality';
        loading.value = false;
        return;
    }
    console.log('countryData', countryData);
    const url = `${baseURL}/nationality/create`;

    try {
        const data = await postData(url, countryData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            loading.value = false;
            addName.value = '';
            showSuccess(data?.message);
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            emit('refresh');
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};

const countriesArray = countryList.getData();
const countries = countriesArray.map((country) => ({
    name: country.name,
    code: country.code
}));
onMounted(() => {
    autoValue.value = countries;
});
const searchCountry = (event) => {
    // setTimeout(() => {
    if (!event.query.trim().length) {
        autoFilteredValue.value = autoValue?.value?.length > 0 ? [...autoValue.value] : [];
    } else {
        autoFilteredValue.value = autoValue.value.filter((country) => {
            return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
    // }, 250);
};
</script>
<template>
    <div class="form-container_">
        <form @submit.prevent="submitForm" class="form-content_">
            <div class="grid">
                <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>

                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Nationality</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">Nationality Name</label>
                                <AutoComplete placeholder="Search" id="dd" :dropdown="true" :multiple="false" v-model="addName" :suggestions="autoFilteredValue" @complete="searchCountry($event)" field="name" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style></style>
