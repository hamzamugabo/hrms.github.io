<script setup>
import { onMounted, ref } from 'vue';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { useJobStore } from '@/piniaStore/jobData.js';
import { useRouter } from 'vue-router';
// import Interview from '../interview/CreateInterview.vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import ViewInterview from './ViewInterview.vue';
import UpdateInterview from '../interview/EditInterview.vue';
import JobComponent from './JobComponent.vue';
// import loadFromLocalStorage from '@/components/reuseables/getUser';
import EditJob from '@/components/jobPosting/EditJob.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';
import { postData } from '../reuseables/FetchPostData';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const router = useRouter();
const jobs = ref([]);
const loading = ref(false);
const loadingJobs = ref(false);

const visible = ref(false);
const visibleUpdate = ref(false);
const selectedJob = ref({});

const jobDisplayError = ref('');
const interviewDataToUpdate = ref({});
const displayModal = ref(false);
// const loadInterview = ref(false);
const interviewData = ref([]);
const jobIdToView = ref('');
const jobStore = useJobStore();
// const interviewDataToSubmit = ref({});
const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}
const feedBack = ref('');
const location = ref('');
const dateTime = ref('');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const showInterview = async (job) => {
    // console.log('job post', job)
    jobIdToView.value = job?.id;
    // console.log('interview', interview);
    interviewData.value = job;
    // const data = await getInterviewByJobId(job?.id);
    displayModal.value = true;
};

const getJobs = async () => {
    loadingJobs.value = true;

    const url = `${baseURL}/job-posting`;
    try {
        const { data } = await fetchData(url, loadingJobs);

        loadingJobs.value = false;

        jobs.value = data;
    } catch (error) {
        jobs.value = [];
        loadingJobs.value = false;
        console.log('Job posting error', error);
        jobDisplayError.value = error;
        // showError('Failed')

        // Handle errors here
    }
};

const viewJob = (job) => {
    jobStore.setJobData(job);

    const jobId = { id: job?.id };
    router.push({
        path: '/view-job',
        query: jobId
    });
};

onMounted(async () => {
    await getJobs();
});
const startApplication = (job) => {
    router.push({
        path: '/applicant/create',
        query: { jobPostId: job?.id }
    });
};
const createInterview = (job) => {
    selectedJob.value = job;
    visible.value = true;
};

const handleEditInterview = async (interviewToEdit) => {
    interviewDataToUpdate.value = interviewToEdit;
    visibleUpdate.value = true;
};

const handleDeleteInterview = async (data) => {
    const url = `${baseURL}/interviews/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getJobs();
    });
    refresh();
    displayModal.value = false;
};
const deleteJob = async (data) => {
    const url = `${baseURL}/job-posting/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getJobs();
    });
    refresh();
};
const addModalVisibility = ref(false);
const handleEditJob = (job) => {
    jobStore.setJobData(job);
    // addModalVisibility.value = true;
    const jobId = { id: job?.id };
    router.push({
        path: '/edit-job',
        query: jobId
    });
};
const addInterviewError = ref('');
const addInterviewLoading = ref(false);
const submitForm = async () => {
    addInterviewError.value = '';
    addInterviewLoading.value = true;
    const formData = { feedBack: feedBack.value, location: location.value, dateTime: formatDate(dateTime.value), jobPostingId: selectedJob.value.id };
    console.log('formdat', formData);
    if (!formData?.dateTime) {
        console.log('no datime');
        addInterviewLoading.value = false;

        return;
    }
    try {
        const url = `${baseURL}/interviews/create`;

        const data = await postData(url, formData, addInterviewLoading);

        if (data?.status === 200 || data?.status === 201) {
            showSuccess(data?.message);
            addInterviewLoading.value = false;
            await getJobs();
            feedBack.value = '';
            location.value = '';
            dateTime.value = '';
            displayModal.value = false;
            visible.value = false;
        } else {
            addInterviewLoading.value = false;
            addInterviewError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        addInterviewLoading.value = false;
    }
};

// const handleInterviewData = (data) => {
//     console.log('data', data);
//     interviewDataToSubmit.value = data;
// };
const refresh = async () => {
    await getJobs();
};
</script>

<template>
    <Dialog v-model:visible="addModalVisibility" header="Update" :style="{ width: '60rem' }">
        <EditJob @refresh="refresh" />
    </Dialog>
    <div v-if="!loadingJobs && jobs.length < 1" style="height: 50px; display: flex; align-items: center; justify-content: center">
        <h4>{{ jobDisplayError || 'No Job posts Found' }}</h4>
    </div>
    <div v-if="loadingJobs" style="height: 50px; display: flex; align-items: center; justify-content: center">
        <SpinnerVue :loading="loading" size="3rem" />
    </div>
    <div class="grid p-fluid">
        <div v-if="visible === true || displayModal === true" class="flex justify-content-center">
            <!-- <Button label="Show" @click="visible = true" /> -->
            <Dialog v-model:visible="visible" header="Create interview" :style="{ width: '30%' }">
                <!-- <Interview :handleInterview="handleInterviewData" /> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="dateTime">Date Time</label>
                        <Calendar id="calendar-12h" :minDate="minDate" v-model="dateTime" showTime hourFormat="12" />
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="location">Location</label>
                        <InputText required id="location" type="text" v-model="location" />
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="feedBack">Feedback</label>
                        <InputText required id="feedBack" type="text" v-model="feedBack" />
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button v-if="!addInterviewLoading" type="button" label="Submit" @click="submitForm"></Button>

                    <SpinnerVue :loading="addInterviewLoading" size="3rem" />
                </div>
            </Dialog>
            <Dialog v-model:visible="displayModal" header="Interview Details" :style="{ width: '50%' }">
                <ViewInterview :interviewData="interviewData" :jobId="jobIdToView" @handleEditInterview="handleEditInterview" @handleDeleteInterview="handleDeleteInterview" />

                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="displayModal = false"></Button>
                </div>
            </Dialog>
            <Dialog v-model:visible="visibleUpdate" header="Update interview" :style="{ width: '50rem' }">
                <UpdateInterview :jobPostingId="selectedJob.id" :interviewDataToUpdate="interviewDataToUpdate" />
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visibleUpdate = false"></Button>
                </div>
            </Dialog>
        </div>

        <div v-for="job in jobs" :key="job.id" class="col-12 md:col-4">
            <div v-if="job?.id === selectedJob?.id">
                <!-- <Message v-if="success" severity="success">{{ successMessage }}</Message>

                <Message v-if="applyError" severity="error">{{ applyError }}</Message> -->
            </div>

            <JobComponent @showInterview="showInterview" @createInterview="createInterview" @viewJob="viewJob" @updateJob="handleEditJob" @applyJob="startApplication" :job="job" @deleteJob="deleteJob" />
        </div>
    </div>
</template>

<style></style>
