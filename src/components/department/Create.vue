<script setup>
import { onMounted, ref } from 'vue';
import { baseAUTHURL, baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const emit = defineEmits(['refresh']);

const loading = ref(false);
const addName = ref('');
const addServerError = ref('');
const addSuccess = ref(false);
const addSuccessMessage = ref('');
const addDutyStationId = ref('');
const autoFilteredDutyStation = ref([]);
const allStations = ref([]);

const submitForm = async () => {
    addServerError.value = '';
    loading.value = true;

    const url = `${baseURL}/department/create`;

    try {
        const desigantionData = {
            dutyStationId: addDutyStationId.value.id || '1218a93a-b828-46ec-b841-b0b4b2bddf21',
            name: addName.value
        };
        console.log('submit', desigantionData);
        const data = await postData(url, desigantionData);
        if (data?.status === 200 || data?.status === 201) {
            // addSuccess.value = true;
            addSuccessMessage.value = data?.message;

            loading.value = false;
            addName.value = '';
            showSuccess(data?.message);
            emit('refresh');

        } else {
            showError(data?.error || data?.message);
            addServerError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
const getStations = async () => {
    // console.log('designation');
    const url = `${baseAUTHURL}/duty-station`;

    try {
        const { data } = await fetchData(url);
        allStations.value = data || [];

        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};

const searchStations = (event) => {
    if (!event.query.trim().length) {
        autoFilteredDutyStation.value = allStations?.value?.length > 0 ? [...allStations.value] : [];
    } else {
        // Check if allDepartments.value is iterable and not null/undefined
        if (Array.isArray(allStations.value)) {
            autoFilteredDutyStation.value = allStations.value.filter((station) => {
                return station.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        } else {
            autoFilteredDutyStation.value = [];
        }
    }
};
onMounted(async () => {
    await getStations();
});
</script> 
<template>
    <div class="form-container_">
        <form @submit.prevent="submitForm" class="form-content_">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Message v-if="addSuccess" severity="success">{{ addSuccessMessage }}</Message>
                        <Message v-if="addServerError" severity="error">{{ addServerError }}</Message>
                        <h5>Create Department</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="firstName">Duty Station</label>
                                <AutoComplete placeholder="Search" id="station" :dropdown="true" :multiple="false" v-model="addDutyStationId" :suggestions="autoFilteredDutyStation" @complete="searchStations($event)" field="name" />
                                <p v-if="allStations?.length === 0" class="text-red-500">No duty station found.</p>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="name">Department Name</label>
                                <InputText required id="name" type="text" v-model="addName" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
            <div v-if="!loading" class="mb-10" style="margin: 10px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style></style>
