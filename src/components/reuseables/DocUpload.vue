<script setup>
import { ref } from 'vue';

const emit = defineEmits(['getFileData']);
const prop = defineProps(['label', 'success', 'error']);
// console.log('success', prop?.success)
// console.log('error', prop?.error)
const imageUrl = ref('');
const fileName = ref('');
const newId = prop.label.replace(/\s/g, '');

const onFileChange = (e) => {
    const files = e.target.files;

    if (!files.length) return;

    const file = files[0];
    fileName.value = file.name;
    imageUrl.value = URL.createObjectURL(file);
    emit('getFileData', file, prop?.label);
};
</script>

<template>
    <div>
        <div class="mt-1 mb-0">
            <input type="file" :id="newId" @change="onFileChange($event)" accept=".pdf,.doc,.docx" style="display: none" />

            <label :for="newId" class="bg-light-grey text-black px-4 py-2 rounded-lg mr-2 hover:bg-grey-700 focus:bg-blue-600 focus:outline-none updateProfileButton">
                <span class="mr-2">{{ label || 'Upload file' }}</span>
                <span>&#8679;</span>
                <!-- Unicode for the upload icon (upwards arrow) -->
            </label>
            <div style="display: flex">
                <p style="margin-right: 5px">{{ fileName }}</p>
                <p v-if="success " style="color: green; font-weight: bold">Uploaded sucessfully</p>
                <p v-if="error " style="color: red; font-weight: bold">Upload Failed</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.updateProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
    max-width: 200px;
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: #f0f0f0; /* Set background color here */
    cursor: pointer; /* Add cursor pointer for better interaction */
}

/* Add hover style for better user interaction */
.updateProfileButton:hover {
    background-color: #db0000;
    color: #fff;
}

.bg-light-grey {
    cursor: pointer;
}
</style>
