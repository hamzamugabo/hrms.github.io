<script setup>
import { ref } from 'vue';
import DocUpload from '@/components/reuseables/DocUpload.vue'; // Adjust the path as needed
// import { baseURL, postDataUpload } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';

// const props = defineProps(['employeeId']);
const fileNames = ['Application letter', 'Curriculum vitae', 'Academic Documents', 'Reference letters', 'Appointment letter', 'Medical examination report', 'Confirmation letter'];
const emit = defineEmits(['uploadEmployeeDocuments']);
const uploadedFiles = ref([]);
const concatenatedFileNames = ref('');
// const loading = ref(false);
const successMessage = ref('');
const uploadError = ref('');

const handleFileSelected = (file, fileName) => {
    uploadedFiles.value.push(file);

    // Update the concatenated file names string
    if (concatenatedFileNames.value) {
        concatenatedFileNames.value += `,${fileName}`;
    } else {
        concatenatedFileNames.value = fileName;
    }

    emit('uploadEmployeeDocuments', uploadedFiles.value, concatenatedFileNames.value);
};
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div v-for="(fileName, index) in fileNames" :key="index" class="field col-12 md:col-4">
            <label :for="`input-${index}`">Upload {{ fileName }}</label>
            <DocUpload :label="`${fileName}`" :fileName="fileName" :success="successMessage" :error="uploadError" @getFileData="handleFileSelected" />
        </div>
        <!-- <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>

        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button @click="uploadDocument" style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Submit</button>
        </div> -->
    </div>
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
