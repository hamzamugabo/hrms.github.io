<script setup>
import { onMounted, ref } from 'vue';
import { useJobStore } from '@/piniaStore/jobData';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useRouter } from 'vue-router';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const router = useRouter();
const jobName = ref('');
const jobDescription = ref('');
const salaryRange = ref('');
const applicationInstruction = ref('');
const companyInformation = ref('');
const expirationDate = ref('');
const loading = ref(false);
const addJobError = ref('');

const success = ref(false);
const successMessage = ref('');

const platforms = ref('');
const qualifications = ref('');

const jobStore = useJobStore();

const job = ref(jobStore?.getJobData());

const getJob = async () => {
    if (!jobStore?.getJobData()) {
        console.log('no job');
        return;
    }
    try {
        const url = `${baseURL}/job-posting/show/${jobStore?.getJobData()?.id}`;

        const { data } = await fetchData(url, loading);
        // console.log('job', data)
        applicationInstruction.value = data?.applicationProcess;
        companyInformation.value = data?.companyInformation;
        expirationDate.value = data?.expirationDate;
        jobDescription.value = data?.jobDescription;
        jobName.value = data?.jobName;
        qualifications.value = data?.jobQualifications;
        platforms.value = data?.postingPlatform;
        salaryRange.value = data?.salaryRange;
        job.value = data;
    } catch (err) {
        console.log(err);
    }
};
onMounted(async () => {
    if (!jobStore?.getJobData()) {
        router('/job-posting');
    }
    await getJob();
});

const changeDateFormat = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const submitForm = async () => {
    addJobError.value = '';
    loading.value = true;

    try {
        const url = `${baseURL}/job-posting/update`;
        // const currentDate = new Date();

        const formFields = {
            applicationProcess: applicationInstruction.value || job?.value?.applicationInstruction,
            companyInformation: companyInformation.value || job?.value?.companyInformation,
            datePosted: job?.value?.datePosted,
            expirationDate: changeDateFormat(expirationDate?.value) || job?.value?.expirationDate,
            jobDescription: jobDescription.value || job?.value?.jobDescription,
            jobName: jobName.value || job?.value?.jobName,
            jobQualifications: qualifications.value || job?.value?.jobQualifications,
            postingPlatform: platforms.value || job?.value?.postingPlatform,
            salaryRange: salaryRange.value || job?.value?.salaryRange,
            id: job?.value?.id
        };

        const data = await postData(url, formFields, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            showSuccess();
            loading.value = false;
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            showError();
            success.value = false;
            successMessage.value = '';
            loading.value = false;
            addJobError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
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
                            <label for="jobnamae">Job Name</label>
                            <InputText required id="jobnamae" type="text" v-model="jobName" class="mb-30" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="jobQualifications">Job Qualifications</label>
                            <InputText required id="jobQualification" type="text" v-model="qualifications" class="mb-30" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="jobDescription">Expiration Date</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="expirationDate"></Calendar>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="jobDescription">Job Description</label>
                            <Textarea id="ecomments" rows="4" v-model="jobDescription" />
                        </div>

                        <!-- <div class="field col-12 md:col-4">
                            <label for="experience">Experience</label>
                            <Textarea id="ecomments" rows="4" v-model="jobExperience" />
                        </div> -->
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
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="overview">Salary Range</label>
                            <!-- <InputText required id="salaryRange" type="text" v-model="salaryRange" class="mb-30" /> -->
                            <InputNumber required v-model="salaryRange" inputId="integeronly" class="mb-30" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="platform"> Posting Platform </label>
                            <InputText required id="platform" type="text" v-model="platforms" class="mb-30" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Update Job</button>
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
