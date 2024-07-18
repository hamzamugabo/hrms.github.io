<script setup>
import { ref } from 'vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';

defineProps(['job', 'loadInterview', 'jobIdToView']);
const emit = defineEmits(['createInterview', 'showInterview', 'viewJob', 'updateJob', 'applyJob', 'deleteJobEmit']);

const showViewIcon = ref(false);
const showUpdateIcon = ref(false);
const showText = ref(false);
const truncateTitle = (title) => {
    // Truncate long titles
    const maxLength = 20;
    if (title?.length > maxLength) {
        return title.substring(0, maxLength) + '...';
    }
    return title;
};
const showInterviewEmit = (jobId) => {
    emit('showInterview', jobId);
};
const createInterviewEmit = (job) => {
    emit('createInterview', job);
};
const viewJobEmit = (job) => {
    emit('viewJob', job);
};
const updateJobEmit = (job) => {
    emit('updateJob', job);
};
const applyJobEmit = (job) => {
    emit('applyJob', job);
};
const deleteJobEmit = (job)=>{
    emit('deleteJob', job)
}
</script>

<template>
    <div class="card" style="height: 100%">
        <div class="card-body">
            <p v-if="job?.interviews?.length < 1" @click="createInterviewEmit(job)" style="cursor: pointer; background-color: #f0f0f0; border-radius: 8px; padding: 10px 20px; display: inline-block; text-align: center; user-select: none">
                Create interview
            </p>
            <p v-if="job?.interviews?.length > 0" @click="showInterviewEmit(job.id)" style="cursor: pointer; background-color: #0e9d6e; border-radius: 8px; padding: 10px 20px; display: inline-block; text-align: center; user-select: none">
                <span v-if="!loadInterview || !jobIdToView === job?.id" style="color: white"> View Interview</span>
                <span> <SpinnerVue :loading="loadInterview && jobIdToView === job?.id" size="2rem" /></span>
            </p>

            <h5 class="card-title">
                <strong>{{ truncateTitle(job.jobName) }}</strong>
            </h5>
            <p class="card-text">{{ job.jobDescription }}</p>
            <p class="card-text"><strong>Qualifications:</strong> {{ job.jobQualifications }}</p>
            <p class="card-text"><strong> Range:</strong> {{ job.salaryRange }}</p>

            <p class="card-text"><strong> Posted: </strong>{{ job.datePosted }}</p>
            <p class="card-text"><strong>Expiration Date: </strong> {{ job.expirationDate }}</p>
            <p class="card-text"><strong>Applicants: </strong> {{ job?.applicationList?.length }}</p>

            <!-- Buttons for View More, Update, and Delete -->
            <div class="btn-group" role="group" aria-label="Job Actions">
                <Button
                    type="button"
                    icon="pi pi-eye"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    @click="viewJobEmit(job)"
                    style="width: 2rem; cursor: pointer; margin-right: 5px; border-radius: 200px"
                    @mouseover="showViewIcon = true"
                    @mouseleave="showViewIcon = false"
                >
                    <i class="pi pi-eye"></i>
                </Button>

                <Button
                    type="button"
                    icon="pi pi-trash"
                    class="text-white font-bold py-1 px-2 rounded"
                    @click="updateJobEmit(job)"
                    style="width: 2rem; cursor: pointer; margin-right: 5px; border-radius: 200px; background-color: #0e9d6e"
                    @mouseover="showUpdateIcon = true"
                    @mouseleave="showUpdateIcon = false"
                >
                    <!-- <span class="text-sm">Update</span> -->
                    <i class="pi pi-file-edit"></i>
                </Button>
                <Button
                    type="button"
                    icon="pi pi-trash"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    @click="deleteJobEmit(job)"
                    style="width: 2rem; cursor: pointer; border-radius: 200px"
                    @mouseover="showText = true"
                    @mouseleave="showText = false"
                >
                    <span class="text-sm"><i class="pi pi-trash"></i></span>
                </Button>
                <Button
                    type="button"
                    icon="pi pi-trash"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    @click="applyJobEmit(job)"
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
</template>

<style></style>
