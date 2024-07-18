<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleExperienceDetails']);
defineProps(['maxJoiningDate'])

const achievements = ref('');
const companyName = ref('');
const startDate = ref('');
const endDate = ref('');
const jobTitle = ref('');
const responsibilities = ref('');

const submitForm = () => {
    const formData = {
        achievements: achievements.value,
        companyName: companyName.value,
        endDate: endDate.value,
        jobTitle: jobTitle.value,
        responsibilities: responsibilities.value,
        startDate: startDate.value
    };

    // Emit the form data to the parent component
    emit('handleExperienceDetails', formData);
};
watch([achievements, companyName, startDate, endDate, jobTitle, responsibilities], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
            <label for="company">company Name</label>
            <InputText required id="company" type="text" v-model="companyName" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="achievements">achievements</label>
            <InputText required id="achievements" type="text" v-model="achievements" />
        </div>

        <div class="field col-12 md:col-4">
            <label for="jobTitle">Job Title</label>
            <InputText id="jobTitle" type="text" v-model="jobTitle" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="responsibilities">Responsibilities</label>
            <InputText id="responsibilities" type="text" v-model="responsibilities" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="startDate">Start Date</label>
            <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate" :maxDate="maxJoiningDate"></Calendar>
        </div>
        <div class="field col-12 md:col-4">
            <label for="endDate">End Date</label>
            <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate" :maxDate="maxJoiningDate"></Calendar>
        </div>
    </div>
</template>
<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
