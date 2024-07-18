<script setup>
import { ref, onMounted } from 'vue';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import { useJobStore } from '@/piniaStore/jobData.js';
import { useRouter } from 'vue-router';
import Interview from '../interview/index.vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup()
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
        // console.log('job==', data)
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
    console.log('update job', jobStore?.getJobData());
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
    // const user = loadFromLocalStorage();
    // if (!user?.id && user?.role !== 'Applicant') {
    //     console.log('user not an applicant');
    //     router.push('/applicant/create');
    //     return;
    // }
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

            // success.value = true;
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
    <div class="container">
        <div v-if="visible === true" class="flex justify-content-center">
            <!-- <Button label="Show" @click="visible = true" /> -->
            <Dialog v-model:visible="visible" header="Create interview" :style="{ width: '70%' }">
                <Interview :jobPostingId="job.id" />
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <!-- <Button v-if="!loading" type="button" label="Update" @click="updateNationality"></Button> -->

                    <SpinnerVue :loading="loading" size="3rem" />
                </div>
            </Dialog>
        </div>
        <div class="card">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="applyError" severity="error">{{ applyError }}</Message>
            <!-- <button @click="updateJob(job)" class="btn btn-primary">Update</button> -->
            <div style="display: flex">
                <Button
                    type="button"
                    icon="pi pi-trash"
                    class="text-white font-bold py-1 px-2 rounded"
                    @click="updateJob"
                    style="width: 12rem; cursor: pointer; margin-right: 5px; border-radius: 200px; background-color: #0e9d6e"
                    @mouseover="showUpdateIcon = true"
                    @mouseleave="showUpdateIcon = false"
                >
                    <!-- <span class="text-sm">Update</span> -->
                    <i class="pi pi-file-edit"></i>Update
                </Button>
                <Button
                    type="button"
                    icon="pi pi-trash"
                    class="font-bold py-1 px-2 rounded"
                    @click="createInterview"
                    style="width: 12rem; cursor: pointer; margin-right: 5px; border-radius: 200px; background-color: #f0f0f0; border-radius: 8px; padding: 10px 20px; display: inline-block; text-align: center; user-select: none; color: black"
                    @mouseover="showUpdateIcon = true"
                    @mouseleave="showUpdateIcon = false"
                >
                    <!-- <span class="text-sm">Update</span> -->
                    Create Interview
                </Button>
            </div>
            <div class="card-header mt-10" style="margin-top: 10px">
                <h3>{{ job?.jobName }}</h3>
            </div>
            <div class="card-body">
                <p><strong>Description:</strong> {{ job?.jobDescription }}</p>
                <p><strong>Qualifications:</strong> {{ job?.jobQualifications }}</p>
                <p><strong>Salary Range:</strong> {{ job?.salaryRange }}</p>
                <p><strong>Company Information:</strong> {{ job?.companyInformation }}</p>
                <p><strong>Application Process:</strong> {{ job?.applicationProcess }}</p>
                <p><strong>Posting Platform:</strong> {{ job?.postingPlatform }}</p>
                <p><strong>Date Posted:</strong> {{ job?.datePosted }}</p>
                <p><strong>Expiration Date:</strong> {{ job?.expirationDate }}</p>
            </div>
            <div class="card-">
                <div class="btn-group" role="group" aria-label="Job Actions">
                    <!-- <span class="text-sm"><i class="pi pi-trash"></i></span> -->

                    <Button
                        type="button"
                        icon="pi pi-trash"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        @click="applyJob(job)"
                        style="width: 100px; cursor: pointer; border-radius: 10px"
                        @mouseover="showText = true"
                        @mouseleave="showText = false"
                    >
                        Apply
                    </Button>
                    <!-- <button type="button" class="btn btn-primary" @click="viewJob(job.id)"><i class="bi bi-eye-fill"></i> View More</button>
                        <button type="button" class="btn btn-success" @click="updateJob(job.id)"><i class="bi bi-pencil-fill"></i> Update</button>
                        <button type="button" class="btn btn-danger" @click="deleteJob(job.id)"><i class="bi bi-trash-fill"></i> Delete</button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
