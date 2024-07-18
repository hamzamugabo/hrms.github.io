<script setup>
import { ref } from 'vue';
import { postData, baseURL } from '@/components/reuseables/FetchPostData.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import Interview from './CreateInterview.vue';
import Interviewer from './CreateInterviewer.vue';
import InterviewQuestions from './InterViewQuestions.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const props = defineProps(['jobPostingId']);

const interviewData = ref({});
const interviewQuizData = ref({});
const interviewerData = ref({});
const successAddInterview = ref(false);
const successAddInterviewer = ref(false);
const successAddInterviewQuiz = ref(false);
const successMessageAddInterview = ref('');
const successMessageAddInterviewer = ref('');
const successMessageAddInterviewQuiz = ref('');

const addInterviewError = ref('');
const addInterviewerError = ref('');
const addInterviewQuizError = ref('');
const loading = ref(false);

const submitForm = async () => {
    addInterviewError.value = '';
    loading.value = true;
    const formData = { ...interviewData?.value, jobPostingId: props?.jobPostingId };
    try {
        const url = `${baseURL}/interviews/create`;

        console.log('Form submitted:', formData);
        // loading.value = false;

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddInterview.value = data?.message;
            successAddInterview.value = true;
            setTimeout(() => {
                successAddInterview.value = false;
                successMessageAddInterview.value = '';
            }, 1000);
            await handleCreateInterviewer(data?.data?.id, interviewData?.value?.dateTime);
            await handleCreateInterviewQuestions(data?.data?.id);
            interviewData.value = {};
        } else {
            successAddInterview.value = false;
            successMessageAddInterview.value = '';
            addInterviewError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        successAddInterview.value = false;
        successMessageAddInterview.value = '';
        console.log('Form submitted:', formData);
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
const handleCreateInterviewer = async (interviewId, availability) => {
    addInterviewerError.value = '';
    loading.value = true;
    const formData = { ...interviewerData?.value, availability };
    try {
        const url = `${baseURL}/interviewers/create/${interviewId}`;

        console.log('Form submitted:', formData);
        // loading.value = false;

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddInterviewer.value = data?.message;
            // successAddInterviewer.value = true;
            showSuccess();
            interviewerData.value = {};
            setTimeout(() => {
                successAddInterviewer.value = false;
                successMessageAddInterviewer.value = '';
            }, 1000);
        } else {
            showError();

            addInterviewerError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        console.log('Form submitted:', formData);
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};

const handleCreateInterviewQuestions = async (interviewId) => {
    addInterviewQuizError.value = '';
    loading.value = true;
    const formData = interviewQuizData?.value;
    try {
        const url = `${baseURL}/interviews/questions/create/${interviewId}`;

        console.log('Form submitted:', formData);
        // loading.value = false;

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddInterviewQuiz.value = data?.message;
            // successAddInterviewQuiz.value = true;
            showSuccess();
            interviewQuizData.value = {};
            setTimeout(() => {
                successAddInterviewQuiz.value = false;
                successMessageAddInterviewQuiz.value = '';
            }, 1000);
        } else {
            showError();

            successAddInterviewQuiz.value = false;
            successMessageAddInterviewQuiz.value = '';
            addInterviewQuizError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        console.log('Form submitted:', formData);
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};

const handleInterview = (data) => {
    interviewData.value = data;
};
const handleInterviewer = (data) => {
    interviewerData.value = data;
};
const handleInterviewQuestions = (data) => {
    interviewQuizData.value = data;
};
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

            <div class="col-12">
                <div class="card">
                    <Message v-if="successAddInterviewer" severity="success">{{ successMessageAddInterviewer }}</Message>

                    <Message v-if="addInterviewerError" severity="error">{{ addInterviewerError }}</Message>

                    <h5>Interviewer</h5>
                    <Interviewer @handleInterviewer="handleInterviewer" />
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <Message v-if="successAddInterviewQuiz" severity="success">{{ successMessageAddInterviewQuiz }}</Message>

                    <Message v-if="addInterviewQuizError" severity="error">{{ addInterviewQuizError }}</Message>

                    <h5>Interview Questions</h5>
                    <InterviewQuestions @handleInterviewQuestions="handleInterviewQuestions" />
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Add Interview</button>
        </div>
    </form>
</template>
