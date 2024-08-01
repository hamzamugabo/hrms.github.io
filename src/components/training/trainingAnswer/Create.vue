<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';

// const { showError, showSuccess } = useToastPopup();
const { getTrainingQuestions } = useTrainingUtils();

const emit = defineEmits(['handleData']);

// const trainingStatus = ref('');
// const loading = ref(false);
const success = ref(false);
const serverError = ref('');
const successMessage = ref('');
const autoFilteredAssessment = ref([]);
const assessments = ref([]);
const answerText = ref('');
const trainingQuestionId = ref('');
const explanation = ref('');
const feedback = ref('');
const answerOrder = ref(0);
const scoreWeight = ref(0);
const correct = ref(false);

const submitForm = async () => {
    const formData = {
        trainingQuestionId: trainingQuestionId?.value?.id,
        answerText: answerText.value,
        explanation: explanation.value,
        feedback: feedback.value,
        scoreWeight: scoreWeight.value,
        answerOrder: answerOrder.value,
        correct: correct?.value
    };

    emit('handleData', formData);
};

watch([trainingQuestionId, scoreWeight, answerOrder, answerText, explanation, feedback, correct], () => {
    submitForm();
});
onMounted(async () => {
    await getTrainingQuestions(assessments);
});

const searchAssessment = (event) => {
    if (!event.query.trim().length) {
        autoFilteredAssessment.value = [...assessments.value];
    } else {
        autoFilteredAssessment.value = assessments.value.filter((quiz) => {
            const questionType = quiz.questionType.toLowerCase().startsWith(event.query.toLowerCase());
            const questionText = quiz.questionText.toLowerCase().includes(event.query.toLowerCase());
            return questionType || questionText;
        });
    }
};
</script>

<template>
    <!-- <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content"> -->
    <div class="grid">
        <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

        <div class="col-12">
            <div class="card">
                <Message v-if="success" severity="success">{{ successMessage }}</Message>
                <Message v-if="serverError" severity="error">{{ serverError }}</Message>

                <!-- <h5>Create Job Training</h5> -->

                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="assessment">Question</label>
                        <AutoComplete required placeholder="Search" id="assessment" :dropdown="true" :multiple="false" v-model="trainingQuestionId" :suggestions="autoFilteredAssessment" @complete="searchAssessment($event)" field="questionText">
                            <template #option="slotProps">
                                <div class="job-info">
                                    <div class="flex align-items-center">
                                        <div class="job-detail">
                                            <div>Question: {{ slotProps?.option?.questionText }}</div>
                                            <div>questionType: {{ slotProps?.option?.questionType }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="answerText">Answer Text</label>
                        <InputText required id="answerText" type="text" v-model="answerText" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="explanation">Explanation</label>
                        <InputText id="explanation" type="text" v-model="explanation" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="feedback">Feedback</label>
                        <InputText id="feedback" type="text" v-model="feedback" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="answerOrder">Answer Order</label>
                        <InputNumber v-model="answerOrder" inputId="answerOrder" :useGrouping="false" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="scoreWeight">Score Weight</label>
                        <InputNumber v-model="scoreWeight" inputId="scoreWeight" :useGrouping="false" />
                    </div>
                    <div class="field col-12 md:col-6 flex items-center">
                        <label for="scoreWeight" class="mr-3">Correct</label>
                        <InputSwitch v-model="correct" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer" class="block mx-auto border-none">Submit</button>
            </div>
        </form>
    </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
