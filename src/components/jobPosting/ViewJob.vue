<script setup>
import { ref, onMounted } from 'vue';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import { useJobStore } from '@/piniaStore/jobData.js';
import { useRouter } from 'vue-router';
import Interview from '../interview/index.vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const jobStore = useJobStore();

const router = useRouter();
const job = ref(jobStore?.getJobData());
const loading = ref(false);
const successMessage = ref('');
const success = ref(false);
const visible = ref(false);
const applyError = ref('');
const getJob = async () => {
    if (!jobStore?.getJobData()) {
        console.log('no job');
        router.push('./Jobs');
        return;
    }
    try {
        const url = `${baseURL}/job-posting/show/${jobStore?.getJobData()?.id}`;
        const { data } = await fetchData(url, loading);
        job.value = data;
    } catch (err) {
        console.log(err);
    }
};
onMounted(async () => {
    if (!jobStore?.getJobData()) {
        console.log('still getting job');
    }
    await getJob();
});
const updateJob = () => {
    jobStore.setJobData(jobStore?.getJobData());
    router.push('/edit-job');
};
const changeCurrentDateFormat = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const applyJob = async () => {
    applyError.value = '';
    if (!job?.value?.id) {
        console.log('no job selected');
        router.push('./Jobs');
        return;
    }
    const currentDate = new Date();
    const formData = {
        applicantId: '9253e407-6fc5-47d1-b16c-7b680d88e061',
        applicationDate: changeCurrentDateFormat(currentDate),
        applicationStatus: 'PENDING',
        jobPostingId: job.value?.id
    };
    const url = `${baseURL}/application/create`;
    try {
        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            loading.value = false;
            showSuccess();
        } else {
            showError();
            loading.value = false;
            applyError.value = data?.message ? data?.message : data?.error;
        }
    } catch (err) {
        showError();
        console.log('error', err);
    }
};
const createInterview = () => {
    visible.value = true;
};
</script>

<template>
    <div class="container mx-auto p-5">
        <div v-if="visible" class="flex justify-center">
            <Dialog v-model:visible="visible" header="Create Interview" :style="{ width: '70%' }">
                <Interview :jobPostingId="job.id" />
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <SpinnerVue :loading="loading" size="3rem" />
                </div>
            </Dialog>
        </div>
        <div class="card p-5 shadow-lg rounded-lg">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="applyError" severity="error">{{ applyError }}</Message>
            <div class="flex justify-end mb-5 space-x-4" style="width: 100%">
                <Button type="button" icon="pi pi-file-edit" class="text-white font-bold py-2 px-6 rounded-full" @click="updateJob" style="background-color: #0e9d6e; cursor: pointer; width: 200px; margin-right: 50px"> Update Job </Button>
                <Button type="button" icon="pi pi-calendar-plus" class="font-bold py-2 px-6 rounded-full" @click="createInterview" style="background-color: #f0f0f0; color: black; cursor: pointer; width: 200px"> Create Interview </Button>
            </div>

            <div class="text-center mb-5">
                <h2 class="text-2xl font-bold">{{ job?.jobName }}</h2>
            </div>
            <div class="grid">
                <div class="p-fluid formgrid grid" style="margin-left:5%">
                    <div class="field col-12 md:col-4">
                        <p><strong>Date Posted:</strong> {{ job?.datePosted }}</p>
                    </div>
                    <div class="field col-12 md:col-4">
                        <p><strong>Expiration Date:</strong> {{ job?.expirationDate }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Purpose Of Job:</strong> {{ job?.purposeOfJob }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Responsibilities:</strong> {{ job?.responsibilities }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Key Performance Indicators:</strong> {{ job?.keyPerformanceIndicators }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Competencies:</strong> {{ job?.competencies }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Job Qualifications:</strong> {{ job?.jobQualifications }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Experience:</strong> {{ job?.experience }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Employee Level:</strong> {{ job?.employeeLevel }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Duty Station:</strong> {{ job?.dutyStation }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Reports To:</strong> {{ job?.reportsTo }}</p>
                    </div>
                    
                    <div class="field col-12 md:col-12">
                        <p><strong>Application Mode:</strong> {{ job?.applicationMode }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Posting Type:</strong> {{ job?.postingType }}</p>
                    </div>
                    <div class="field col-12 md:col-12">
                        <p><strong>Additional Requirements:</strong> {{ job?.additionalRequirements }}</p>
                    </div>
                </div>
            </div>
            <div class="text-center mt-5">
                <Button type="button" icon="pi pi-check" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full" @click="applyJob" style="cursor: pointer; width: 200px"> Apply Now </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
}
.card {
    background: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    
}
.card-header h2 {
    color: #333;
}
.card-body p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 10px 0;
}
.button-group .button {
    margin-right: 10px;
}
</style>
