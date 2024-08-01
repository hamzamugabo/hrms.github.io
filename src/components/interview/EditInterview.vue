<script setup>
import { ref } from 'vue';
import { postData, baseURL } from '@/components/reuseables/FetchPostData.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import Interview from './CreateInterview.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
// import Interviewer from './CreateInterviewer.vue';
import InterviewQuestions from './InterViewQuestions.vue';

const props = defineProps(['jobPostingId', 'interviewDataToUpdate']);
// console.log('interviewDataToUpdate', props?.interviewDataToUpdate);
const interviewData = ref({});
const interviewQuizData = ref({});
// const interviewerData = ref({});
const successAddInterview = ref(false);
// const successAddInterviewer = ref(false);
const successAddInterviewQuiz = ref(false);
const successMessageAddInterview = ref('');
// const successMessageAddInterviewer = ref('');
const successMessageAddInterviewQuiz = ref('');

const addInterviewError = ref('');
// const addInterviewerError = ref('');
const addInterviewQuizError = ref('');
const loading = ref(false);

const submitForm = async () => {
    const interview = interviewData.value;
    const interviewQuiz = interviewQuizData.value;
    console.log('interviewQuiz', interviewQuiz);
    console.log('interview', interview);
    if (interview?.feedBack && interview?.location && interview?.dateTime) {
        await handleUpdateInterview();
    }
    if (interviewQuiz?.assessmentTools && interviewQuiz?.questions) {
        await handleUpdateInterviewQuestions();
    }
};

const handleUpdateInterview = async () => {
    addInterviewError.value = '';
    loading.value = true;

    const formData = { ...interviewData?.value, id: props?.interviewDataToUpdate?.id };
    try {
        const url = `${baseURL}/interviews/update`;

         
        // loading.value = false;

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddInterview.value = data?.message;
            // successAddInterview.value = true;
            showSuccess()
            loading.value = false;
            interviewData.value = {};
            setTimeout(() => {
                successAddInterview.value = false;
                successMessageAddInterview.value = '';
            }, 1000);
        } else {
        showError();

            successAddInterview.value = false;
            successMessageAddInterview.value = '';
            loading.value = false;
            addInterviewError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
         
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};

const handleUpdateInterviewQuestions = async () => {
    addInterviewQuizError.value = '';
    loading.value = true;
    const formData = { ...interviewQuizData?.value, id: props?.interviewDataToUpdate?.interviewQuestionsAndTools?.id };
    try {
        const url = `${baseURL}/interviews/questions/update`;

         
        // loading.value = false;

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddInterviewQuiz.value = data?.message;
            successAddInterviewQuiz.value = true;
            loading.value = false;
            interviewQuizData.value = {};
            showSuccess();
            setTimeout(() => {
                successMessageAddInterviewQuiz.value = false;
                successAddInterviewQuiz.value = '';
            }, 1000);
        } else {
        showError();

            successMessageAddInterviewQuiz.value = false;
            successAddInterviewQuiz.value = '';
            loading.value = false;
            addInterviewQuizError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
         
        showError('Failed');
        successMessageAddInterviewQuiz.value = false;
        successAddInterviewQuiz.value = '';
        loading.value = false;
        console.log(error?.error);
    }
};

const handleInterview = (data) => {

    interviewData.value = data;
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
                    <Interview @handleInterview="handleInterview" :interview="interviewDataToUpdate" />
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <Message v-if="successAddInterviewQuiz" severity="success">{{ successMessageAddInterviewQuiz }}</Message>

                    <Message v-if="addInterviewQuizError" severity="error">{{ addInterviewQuizError }}</Message>

                    <h5>Interview Questions</h5>
                    <InterviewQuestions @handleInterviewQuestions="handleInterviewQuestions" :interview="interviewDataToUpdate" />
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Update</button>
        </div>
    </form>
</template>
