<script setup>
import { ref, watch } from 'vue';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import Interview from './CreateInterview.vue';


const props = defineProps(['jobPostingId']);
const emit = defineEmits(['handleInterviewData'])

const interviewData = ref({});

const successAddInterview = ref(false);
const successMessageAddInterview = ref('');

const addInterviewError = ref('');
// const loading = ref(false);

const submitForm = async () => {
    const formData = { ...interviewData?.value, jobPostingId: props?.jobPostingId };
    emit('handleInterviewData', formData);

};

const handleInterview = (data) => {
    interviewData.value = data;
};

watch(interviewData, () => {
    submitForm();
});
</script>

<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <Message v-if="successAddInterview" severity="success">{{ successMessageAddInterview }}</Message>

                    <Message v-if="addInterviewError" severity="error">{{ addInterviewError }}</Message>

                    <h5>Interview</h5>
                    <Interview @handleInterview="handleInterview" />
                </div>
            </div>
        </div>
        <!-- <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Add Interview</button>
        </div> -->
    </form>
</template>
