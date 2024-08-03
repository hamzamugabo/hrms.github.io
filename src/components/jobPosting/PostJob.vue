<script setup>
import { onMounted, ref } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { baseURL, postData, baseAUTHURL, fetchData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';

import { PostingType, employeeLevelsEnum } from '@/components/reuseables/enums.js';

import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const loading = ref(false);
const addJobError = ref('');

const success = ref(false);
const successMessage = ref('');

const changeCurrentDateFormat = (dateString) => {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
const formData = ref({
    additionalRequirements: '',
    applicationMode: '',
    competencies: '',
    datePosted: changeCurrentDateFormat(new Date()),
    dutyStation: '',
    employeeLevel: { name: '', code: '' },
    experience: '',
    expirationDate: new Date(),
    jobName: '',
    jobQualifications: '',
    keyPerformanceIndicators: '',
    postingType: { name: 'INTERNAL', code: 'INTERNAL' },
    purposeOfJob: '',
    reportsTo: '',
    responsibilities: ''
});

const submitForm = async () => {
    addJobError.value = '';
    // const currentDate = new Date();

    loading.value = true;

    try {
        const url = `${baseURL}/job-posting/create`;

        const payload = {
            additionalRequirements: formData?.value?.additionalRequirements,
            applicationMode: formData?.value?.applicationMode,
            competencies: formData?.value?.competencies,
            datePosted: formData?.value?.datePosted,
            dutyStation: formData?.value?.dutyStation?.id,
            employeeLevel: formData?.value?.employeeLevel?.name,
            experience: formData?.value?.experience,
            expirationDate: changeDateFormat(formData?.value?.expirationDate),
            jobName: formData?.value?.jobName,
            jobQualifications: formData?.value?.jobQualifications,
            keyPerformanceIndicators: formData?.value?.keyPerformanceIndicators,
            postingType: formData?.value?.postingType?.name,
            purposeOfJob: formData?.value?.purposeOfJob,
            reportsTo: formData?.value?.reportsTo,
            responsibilities: formData?.value?.responsibilities
        };
        const data = await postData(url, payload, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            // success.value = true;
            showSuccess(data?.message);
            formData.value = {};
            // await createScreeningCriteria(data?.data?.id);
            loading.value = false;

            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            showError();
            loading.value = false;
            success.value = false;
            successMessage.value = '';
            addJobError.value = data?.message ? data?.message : data?.error;
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        loading.value = false;
        console.log(error?.error);
        showError('Failed');
    }
};

const minDate = ref(getMinDate());

function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today;
}
const autoFilteredDutyStation = ref([]);
const allStations = ref([]);
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
onMounted(() => {
    getStations();
});
</script>

<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="card">
                <div class="container">
                    <div class="p-fluid formgrid grid">
                        <!-- Job Name -->
                        <div class="field col-12 md:col-4">
                            <label for="jobName">Job Name</label>
                            <InputText required id="jobName" type="text" v-model="formData.jobName" class="mb-30" />
                        </div>

                        <!-- Purpose Of Job -->
                        <div class="field col-12 md:col-4">
                            <label for="purposeOfJob">Purpose Of Job</label>
                            <InputText required id="purposeOfJob" type="text" v-model="formData.purposeOfJob" class="mb-30" />
                        </div>

                        <!-- Responsibilities -->
                        <div class="field col-12 md:col-4">
                            <label for="responsibilities">Responsibilities</label>
                            <InputText required id="responsibilities" type="text" v-model="formData.responsibilities" class="mb-30" />
                        </div>

                        <!-- Key Performance Indicators -->
                        <div class="field col-12 md:col-4">
                            <label for="keyPerformanceIndicators">Key Performance Indicators</label>
                            <InputText required id="keyPerformanceIndicators" type="text" v-model="formData.keyPerformanceIndicators" class="mb-30" />
                        </div>

                        <!-- Competencies -->
                        <div class="field col-12 md:col-4">
                            <label for="competencies">Competencies</label>
                            <InputText required id="competencies" type="text" v-model="formData.competencies" class="mb-30" />
                        </div>

                        <!-- Job Qualifications -->
                        <div class="field col-12 md:col-4">
                            <label for="jobQualifications">Job Qualifications</label>
                            <InputText required id="jobQualifications" type="text" v-model="formData.jobQualifications" class="mb-30" />
                        </div>

                        <!-- Experience -->
                        <div class="field col-12 md:col-4">
                            <label for="experience">Experience</label>
                            <InputText required id="experience" type="text" v-model="formData.experience" class="mb-30" />
                        </div>

                        <!-- Employee Level -->
                        <div class="field col-12 md:col-4">
                            <label for="employeeLevel">Employee Level</label>
                            <Dropdown id="level" v-model="formData.employeeLevel" :options="employeeLevelsEnum" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <!-- Duty Station -->
                        <div class="field col-12 md:col-4">
                            <label for="dutyStation">Duty Station</label>
                            <AutoComplete placeholder="Search" id="station" :dropdown="true" :multiple="false" v-model="formData.dutyStation" :suggestions="autoFilteredDutyStation" @complete="searchStations($event)" field="name" />
                            <p v-if="allStations?.length === 0" class="text-red-500">No duty station found.</p>
                        </div>

                        <!-- Reports To -->
                        <div class="field col-12 md:col-4">
                            <label for="reportsTo">Reports To</label>
                            <InputText required id="reportsTo" type="text" v-model="formData.reportsTo" class="mb-30" />
                        </div>

                        <!-- Date Posted -->
                        <!-- <div class="field col-12 md:col-4">
                            <label for="datePosted">Date Posted</label>
                            <InputText required id="datePosted" type="text" v-model="formData.datePosted" class="mb-30" />
                        </div> -->

                        <!-- Expiration Date -->
                        <div class="field col-12 md:col-4">
                            <label for="expirationDate">Expiration Date</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="formData.expirationDate" :minDate="minDate"></Calendar>
                        </div>

                        <!-- Application Mode -->
                        <div class="field col-12 md:col-4">
                            <label for="applicationMode">Application Mode</label>
                            <InputText required id="applicationMode" type="text" v-model="formData.applicationMode" class="mb-30" />
                        </div>

                        <!-- Posting Type -->
                        <div class="field col-12 md:col-4">
                            <label for="postingType">Posting Type</label>
                            <Dropdown id="postingType" v-model="formData.postingType" :options="PostingType" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <!-- Additional Requirements -->
                        <div class="field col-12 md:col-4">
                            <label for="additionalRequirements">Additional Requirements</label>
                            <InputText required id="additionalRequirements" type="text" v-model="formData.additionalRequirements" class="mb-30" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; cursor: pointer; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Post Job</button>
        </div>
    </form>
</template>

<style>
.addFieldButton {
    background: #679670;
    color: white;
    border-radius: 10px;
    padding: 5px 10px;
    border: none;
    margin-top: -10px;
    cursor: pointer;
}
</style>
