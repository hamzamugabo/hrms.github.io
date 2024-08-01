<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';
import { QuestionDifficulty, QuestionType } from '@/components/reuseables/enums.js';

// const { showError, showSuccess } = useToastPopup();
const { getTrainingAssesment } = useTrainingUtils();

const emit = defineEmits(['handleData']);


// const trainingStatus = ref('');
// const loading = ref(false);
const success = ref(false);
const serverError = ref('');
const successMessage = ref('');
const autoFilteredAssessment = ref([]);
const assessments = ref([]);
const questionType = ref({ name: '', code: '' });
const questionDifficulty = ref({ name: '', code: '' });
const questionText = ref('');
const trainingAssessmentId = ref('');const explanation = ref('');
const tags = ref('');

const submitForm = async () => {
    const formData = {
        trainingAssessmentId: trainingAssessmentId?.value?.id,
        questionDifficulty: questionDifficulty?.value?.name,
        questionType: questionType.value?.name,
        questionText: questionText.value,
        explanation: explanation.value,
        tags: tags.value
    };

    emit('handleData', formData);
};

watch([trainingAssessmentId, questionDifficulty, questionType, questionText, explanation, tags], () => {
    submitForm();
});
onMounted(async () => {
    await getTrainingAssesment(assessments);
});

const searchAssessment = (event) => {
    if (!event.query.trim().length) {
        autoFilteredAssessment.value = [...assessments.value];
    } else {
        autoFilteredAssessment.value = assessments.value.filter((jobquestionText) => {
            const durationMinutes = jobquestionText.durationMinutes.toLowerCase().startsWith(event.query.toLowerCase());
            const title = jobquestionText.title.toLowerCase().includes(event.query.toLowerCase());
            return durationMinutes || title;
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
                        <label for="assessment">Assessment</label>
                        <AutoComplete required placeholder="Search" id="assessment" :dropdown="true" :multiple="false" v-model="trainingAssessmentId" :suggestions="autoFilteredAssessment" @complete="searchAssessment($event)" field="title">
                            <template #option="slotProps">
                                <div class="job-info">
                                    <div class="flex align-items-center">
                                        <div class="job-detail">
                                            <div>Title: {{ slotProps?.option?.title }}</div>
                                            <div>Minutes: {{ slotProps?.option?.durationMinutes }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="questionDifficulty">Training Status</label>
                        <Dropdown id="questionDifficulty" v-model="questionDifficulty" :options="QuestionDifficulty" optionLabel="name" placeholder="Select question Difficulty"></Dropdown>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="questionText">questionText</label>
                        <InputText required id="questionText" type="text" v-model="questionText" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="questionType">Question Type</label>
                        <Dropdown id="questionType" v-model="questionType" :options="QuestionType" optionLabel="name" placeholder="Select question Type"></Dropdown>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="explanation">explanation</label>
                        <InputText id="explanation" type="text" v-model="explanation" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="tags">tags</label>
                        <InputText id="tags" type="text" v-model="tags" />
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
