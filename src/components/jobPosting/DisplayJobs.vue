<script setup>
import { onMounted, ref } from 'vue';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import { useJobStore } from '@/piniaStore/jobData.js';
import { useRouter } from 'vue-router';
import Interview from '../interview/index.vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import ViewInterview from './ViewInterview.vue';
import UpdateInterview from '../interview/EditInterview.vue';
import JobComponent from './JobComponent.vue';
import loadFromLocalStorage from '@/components/reuseables/getUser';
import EditJob from '@/components/jobPosting/EditJob.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const router = useRouter();
const jobs = ref([]);
const loading = ref(false);
const loadingJobs = ref(false);

const successMessage = ref('');
const success = ref(false);
const visible = ref(false);
const visibleUpdate = ref(false);
const selectedJob = ref({});
const applyError = ref('');
const jobDisplayError = ref('');
const interviewDataToUpdate = ref({});
const displayModal = ref(false);
const loadInterview = ref(false);
const interviewData = ref([]);
const jobIdToView = ref('');
const jobStore = useJobStore();
const changeCurrentDateFormat = (dateString) => {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
const showInterview = async (jobId) => {
    jobIdToView.value = jobId;
    // console.log('interview', interview);
    interviewData.value = await getInterviewByJobId(jobId);
    displayModal.value = true;
};
const getInterviewByJobId = async (jobPostingId) => {
    loadInterview.value = true;
    const url = `${baseURL}/interviews/interview/${jobPostingId}`;
    try {
        const { data } = await fetchData(url, loadingJobs);
      
        loadInterview.value = false;
        return data;
    } catch (error) {
        loadInterview.value = false;

        console.log('Job posting error', error);
        jobDisplayError.value = error;
        // Handle errors here
    }
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

// const updateJob = (job) => {
//     jobStore.setJobData(job);
//     router.push('/edit-job');
// };

onMounted(async () => {
    await getJobs();
});
const applyJob = async (job) => {
    applyError.value = '';
    selectedJob.value = job;
    if (!job?.id) {
        console.log('no job selected');
        return;
    }
    const user = loadFromLocalStorage();
    // console.log('user',user)
    if (!user?.user?.id) {
    
        router.push('/applicant/create');
        return;
    }
    const currentDate = new Date();
    const formData = {
        applicantId: user?.user?.role === 'Applicant' ? user?.user?.id : '6a3fa1cc-f1bd-4b8a-bfdf-3ee92a40b28a',
        applicationDate: changeCurrentDateFormat(currentDate),
        applicationStatus: 'PENDING',
        jobPostingId: job?.id
    };
    const url = `${baseURL}/application/create`;
    try {
        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            // success.value = true;
            showSuccess()
            loading.value = false;
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            success.value = false;
            successMessage.value = '';
            loading.value = false;
            showError(data?.message ? data?.message : data?.error);

            applyError.value = data?.message ? data?.message : data?.error;
        }
    } catch (err) {
        showError('Failed');

        console.log('error', err);
    }
};
const createInterview = (job) => {
    selectedJob.value = job;
    visible.value = true;
};

const handleEditInterview = async (interviewToEdit) => {
    interviewDataToUpdate.value = interviewToEdit;
    visibleUpdate.value = true;
};

// const handleDeleteInterview = async (interviewToDelete) => {
//     console.log('interview data to edit', interviewToDelete);
//     try {
//         const url = `${baseURL}/interviews/delete/${interviewToDelete?.id}`;

//         await fetchData(url, loading);
//         displayModal.value = false;
//         getJobs();
//     } catch (error) {
//         // loadingDisable.value = false;

//         console.error('Error deleting interview:', error.message);
//     }
// };
const handleDeleteInterview = async (data) => {
    const url = `${baseURL}/interviews/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getJobs();
    });
    refresh();
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
const handleAdd = (job) => {
    jobStore.setJobData(job);
    addModalVisibility.value = true;
};

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
            <Dialog v-model:visible="visible" header="Create interview" :style="{ width: '50rem' }">
                <Interview :jobPostingId="selectedJob.id" />
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <!-- <Button v-if="!loading" type="button" label="Update" @click="updateNationality"></Button> -->

                    <SpinnerVue :loading="loading" size="3rem" />
                </div>
            </Dialog>
            <Dialog v-model:visible="displayModal" header="Update" :style="{ width: '50rem' }">
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

            <JobComponent @showInterview="showInterview" @createInterview="createInterview" @viewJob="viewJob" @updateJob="handleAdd" @applyJob="applyJob" :job="job" @deleteJob="deleteJob" />
        </div>
    </div>
</template>

<style></style>
