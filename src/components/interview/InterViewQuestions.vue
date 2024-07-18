<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleInterviewQuestions']);
const props = defineProps(['interview'])
const assessmentTools = ref(props?.interview?.interviewQuestionsAndTools?.assessmentTools);
const questions = ref(props?.interview?.interviewQuestionsAndTools?.questions);

const submitForm = () => {
    const formData = {
        assessmentTools: assessmentTools.value,
        questions: questions.value
    };

    // Emit the form data to the parent component
    emit('handleInterviewQuestions', formData);
};
watch([assessmentTools, questions], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-12">
            <label for="assessmentTools">Assessment Tools</label>
            <InputText required id="assessmentTools" type="text" v-model="assessmentTools" />
        </div>
        <div class="field col-12 md:col-12">
            <label for="questions">Questions</label>
            <Textarea id="questions" rows="4" v-model="questions" />
        </div>
    </div>
</template>
