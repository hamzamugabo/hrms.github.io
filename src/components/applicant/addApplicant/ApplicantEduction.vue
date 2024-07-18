<script setup>
import { ref, watch } from 'vue';

import DocUpload from '@/components/reuseables/DocUpload.vue';

const emit = defineEmits(['handleEducationDetails', 'onFileChangeAcademicDocs', 'handleFileCoverSelected', 'handleFileResumeSelected']);
defineProps(['successMessageCover', 'successMessageResume', 'uploadCoverError', 'uploadResumeError']);
const award = ref('');
const endDate = ref('');
const fieldOfStudy = ref('');
const schoolName = ref('');
const startDate = ref('');

const educationDoc = ref([]);
const maxDate = ref(getMaxDate())
function getMaxDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}
const onFileChangeAcademicDocsChild = (e) => {
    const files = e.target.files;

    if (!files.length) return;

    // Convert FileList to Array and assign it to the ref
    educationDoc.value = Array.from(files);
    const fileArray = Array.from(files);
    emit('onFileChangeAcademicDocs', fileArray);
};

const handleFileCoverSelectedChild = async (file) => {
    emit('handleFileCoverSelected', file);
};
const handleFileResumeSelectedChild = async (file) => {
    emit('handleFileResumeSelected', file);
};
const submitForm = () => {
    const formData = {
        schoolName: schoolName.value,
        award: award.value,
        fieldOfStudy: fieldOfStudy.value,
        startDate: startDate.value,
        endDate: endDate.value
    };

    // Emit the form data to the parent component
    emit('handleEducationDetails', formData);
};
watch([schoolName, award, fieldOfStudy, startDate, endDate], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
            <label for="school">School Name</label>
            <InputText required id="school" type="text" v-model="schoolName" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="award">Award</label>
            <InputText required id="award" type="text" v-model="award" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="dob">Start Date</label>
            <Calendar :showIcon="true" :showButtonBar="true" :maxDate="maxDate" v-model="startDate"></Calendar>
        </div>
        <div class="field col-12 md:col-4">
            <label for="dob">End Date</label>
            <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate"  :maxDate="maxDate"></Calendar>
        </div>
        <div class="field col-12 md:col-4">
            <label for="fieldOfStudy">Filed of study</label>
            <InputText id="fieldOfStudy" type="text" v-model="fieldOfStudy" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="fieldOfStudy">Academic Documents</label>
            <div class="mt-1 mb-0">
                <!-- Add 'multiple' attribute to allow multiple file selection -->
                <input type="file" id="fileInputAcedemic" @change="onFileChangeAcademicDocsChild($event)" accept=".pdf,.doc,.docx" multiple style="display: none" />

                <label for="fileInputAcedemic" class="bg-light-grey text-black px-4 py-2 rounded-lg mr-2 hover:bg-grey-700 focus:bg-blue-600 focus:outline-none updateProfileButton">
                    <span class="mr-2">Upload </span>
                    <span>&#8679;</span>
                    <!-- Unicode for the upload icon (upwards arrow) -->
                </label>
            </div>
            <div v-for="file in educationDoc" :key="file.name" style="display: flex">{{ file?.name }}</div>
        </div>
        <div class="field col-12 md:col-4">
            <DocUpload @getFileData="handleFileCoverSelectedChild" :label="'Upload cover letter'" :success="successMessageCover" :error="uploadCoverError" />
        </div>
        <div class="field col-12 md:col-4">
            <DocUpload @getFileData="handleFileResumeSelectedChild" :label="'Upload Resume'" :success="successMessageResume" :error="uploadResumeError" />

            <div></div>
        </div>
    </div>
</template>
<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
