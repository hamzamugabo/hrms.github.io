<script setup>
import { ref } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import ScreeningCriteria from './ScreeningCriteria.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const jobName = ref('');
const jobDescription = ref('');
const jobExperience = ref('');

const applicationInstruction = ref('');
const expirationDate = ref('');
const loading = ref(false);
const addJobError = ref('');

const success = ref(false);
const successMessage = ref('');
const screeningCriteria = ref({});
const successMessageAddScreening = ref('');
const addScreeningError = ref('');
const successAddScreening = ref(false);
const platforms = ref('');
const salaryRange = ref('');
const companyInformation = ref('');
// const platformLabel = ref('Platform to post jobs to');
const qualifications = ref('');

const changeCurrentDateFormat = (dateString) => {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const submitForm = async () => {
    addJobError.value = '';
    const currentDate = new Date();
    const formFields = {
        applicationProcess: applicationInstruction.value,
        companyInformation: companyInformation?.value,
        datePosted: changeCurrentDateFormat(currentDate),
        expirationDate: changeDateFormat(expirationDate?.value),
        jobDescription: jobDescription.value,
        jobName: jobName.value,
        jobQualifications: qualifications.value,
        postingPlatform: platforms.value,
        salaryRange: salaryRange?.value
    };

    // Perform form submission logic (e.g., send data to backend)
    console.log('Form submitted:', formFields);
    if (!jobName.value || !expirationDate.value) {
        showError('Job Name or Expiration date cant be empty');
        addJobError.value = 'Job Name or Expiration date cant be empty';
        return;
    }

    loading.value = true;

    try {
        const url = `${baseURL}/job-posting/create`;

        // loading.value = false;

        const data = await postData(url, formFields, loading);
         
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            // success.value = true;
            showSuccess();
            await createScreeningCriteria(data?.data?.id);
            loading.value = false;
            applicationInstruction.value = '';
            companyInformation.value = '';
            expirationDate.value = '';
            jobDescription.value = '';
            jobName.value = '';
            qualifications.value = '';
            platforms.value = '';
            salaryRange.value = '';
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
const handleScreeningCriteria = (data) => {
    screeningCriteria.value = data;
};
const createScreeningCriteria = async (jobPostId) => {
    addScreeningError.value = '';
    loading.value = true;
    try {
        const url = `${baseURL}/application/screening-criteria/create/${jobPostId}`;

        if (!screeningCriteria?.value) {
            successAddScreening.value = true;
            addScreeningError.value = 'Screening Criteria not added, you can add it through job details';
            return;
        }

        const formData = {
            communication: screeningCriteria?.value?.communication,
            culturalFit: screeningCriteria?.value?.culturalFit,
            experience: screeningCriteria?.value?.experience,
            qualifications: screeningCriteria?.value?.qualifications,
            specificSkills: screeningCriteria?.value?.specificSkills,
            technicalSkills: screeningCriteria?.value?.technicalSkills
        };

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddScreening.value = data?.message;
            // applicantStore.setapplicantData(formData);
            loading.value = false;

            // successAddScreening.value = true;
            showSuccess();
            loading.value = false;

            setTimeout(() => {
                successAddScreening.value = false;
                successMessageAddScreening.value = '';
            }, 1000);
        } else {
            successAddScreening.value = false;
            successMessageAddScreening.value = '';
            addScreeningError.value = data?.message ? data?.message : data?.error;
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        loading.value = false;
        showError('Failed');

        console.error('Login error:', error);
    }
};
const expirationDateError = ref('');
const minDate = ref(getMinDate());

function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today;
}
</script>

<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-12 md:col-12">
                <div class="card">
                    <Message v-if="success" severity="success">{{ successMessage }}</Message>

                    <Message v-if="addJobError" severity="error">{{ addJobError }}</Message>
                    <h5>Job details</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="jobName">Job Name</label>
                            <InputText required id="jobName" type="text" v-model="jobName" class="mb-30" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="jobQualifications">Job Qualifications</label>
                            <InputText required id="jobQualification" type="text" v-model="qualifications" class="mb-30" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="jobDescription">Expiration Date</label>

                            <Calendar :showIcon="true" :showButtonBar="true" v-model="expirationDate" :minDate="minDate"></Calendar>
                            <small v-if="expirationDateError" class="p-error">{{ expirationDateError }}</small>
                            <!-- <Textarea id="ecomments" rows="4" v-model="jobDescription" /> -->
                        </div>

                        <div class="field col-12 md:col-4">
                            <label for="experience">Experience</label>
                            <Textarea id="ecomments" rows="4" v-model="jobExperience" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="jobDescription">Job Description</label>
                            <Textarea id="ecomments" rows="4" v-model="jobDescription" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 md:col-6">
                <div class="card p-fluid">
                    <!-- <h5>Salary Range</h5> -->
                    <div class="field">
                        <label for="applicationInstruction"> Instructions on how candidates can apply </label>
                        <Textarea id="applicationInstruction" rows="3" v-model="applicationInstruction" />
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="card p-fluid">
                    <!-- <h5>Company Information</h5> -->
                    <div class="field">
                        <label for="overview">Company Information</label>
                        <Textarea id="overview" rows="3" v-model="companyInformation" />
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <!-- <h5>Application process details</h5> -->
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="overview">Salary Range</label>
                            <!-- <InputText required id="salaryRange" type="text" v-model="salaryRange" class="mb-30" /> -->
                            <InputNumber required v-model="salaryRange" inputId="integeronly" class="mb-30" />

                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="platform"> Posting Platform </label>

                            <InputText required id="platform" type="text" v-model="platforms" class="mb-30" />
                            <!-- <MultipleFormsGeneratorWithSingleInputs :qualifications="platforms" @remove="removePlatforms" @add="addPlatforms" :label="platformLabel" /> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card">
                    <Message v-if="successAddScreening" severity="success">{{ successMessageAddScreening }}</Message>

                    <Message v-if="addScreeningError" severity="error">{{ addScreeningError }}</Message>
                    <h5>Screening Criteria</h5>
                    <ScreeningCriteria @handleScreeningCriteria="handleScreeningCriteria" />
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
