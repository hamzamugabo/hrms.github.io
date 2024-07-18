<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleScreeningCriteria']);


const communication = ref('');
const culturalFit = ref('');
const experience = ref('');
const qualifications = ref('');
const specificSkills = ref('');
const technicalSkills = ref('');

const submitForm = () => {
    const formData = {
        communication: communication.value,
        culturalFit: culturalFit.value,
        experience: experience.value,
        qualifications: qualifications.value,
        specificSkills: specificSkills.value,
        technicalSkills: technicalSkills.value
    };

    // Emit the form data to the parent component
    emit('handleScreeningCriteria', formData);
};
watch([communication, culturalFit, experience, qualifications, specificSkills, technicalSkills], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
            <label for="company">Cultural Oufit</label>
            <InputText id="company" type="text" v-model="culturalFit" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="communication">Communication</label>
            <InputText id="communication" type="text" v-model="communication" />
        </div>

        <div class="field col-12 md:col-4">
            <label for="specificSkills">Specific Skills</label>
            <InputText id="specificSkills" type="text" v-model="specificSkills" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="technicalSkills">Technical Skills</label>
            <InputText id="technicalSkills" type="text" v-model="technicalSkills" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="experience">Experience</label>
            <InputText id="experience" type="text" v-model="experience" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="qualifications">Qualifications</label>
            <InputText id="qualifications" type="text" v-model="qualifications" />
      
        </div>
    </div>
</template>
<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
