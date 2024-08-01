<script setup>
import { ref, watch } from 'vue';

const initialFileNames = ['Application letter', 'Curriculum vitae', 'Academic Documents', 'Reference letters', 'Appointment letter', 'Medical examination report', 'Confirmation letter'];
const availableFileNames = ref([...initialFileNames]);
const selectedFileName = ref('');
const emit = defineEmits(['uploadEmployeeDocuments']);
const uploadedFiles = ref([]);
const concatenatedFileNames = ref('');
// const successMessage = ref('');
// const uploadError = ref('');

// Watch for changes in selectedFileName to automatically trigger file selection
watch(selectedFileName, (newFileName) => {
    if (newFileName) {
        // Programmatically click the hidden file input
        const input = document.getElementById(`file-input-${newFileName}`);
        if (input) {
            input.click();
        }
    }
});

const handleFileSelected = (file, fileName) => {
    uploadedFiles.value.push({ file, fileName });

    // Update the concatenated file names string
    if (concatenatedFileNames.value) {
        concatenatedFileNames.value += `,${fileName}`;
    } else {
        concatenatedFileNames.value = fileName;
    }

    // Remove the selected file name from the available file names list
    availableFileNames.value = availableFileNames.value.filter((name) => name !== fileName);
    selectedFileName.value = ''; // Reset the selected file name

    emit('uploadEmployeeDocuments', uploadedFiles.value, concatenatedFileNames.value);
};

const handleFileChange = (event, fileName) => {
    const file = event.target.files[0];
    if (file) {
        handleFileSelected(file, fileName);
    }
};

const handleCancelUpload = (index, fileName) => {
    uploadedFiles.value.splice(index, 1);

    // Update concatenated file names
    concatenatedFileNames.value = uploadedFiles.value.map((file) => file.fileName).join(',');

    // Add the file name back to the available list
    availableFileNames.value.push(fileName);
};
</script>

<template>
    <div class="container">
        <div class="upload-section">
            <div class="field">
                <label for="file-selection">Select a file to upload:</label>
                <select id="file-selection" v-model="selectedFileName" class="file-select">
                    <option value="" disabled>Select a file</option>
                    <option v-for="(fileName, index) in availableFileNames" :key="index" :value="fileName">{{ fileName }}</option>
                </select>
            </div>
            <input v-for="(fileName, index) in initialFileNames" :key="index" :id="`file-input-${fileName}`" type="file" class="hidden-file-input" @change="(event) => handleFileChange(event, fileName)" />
        </div>
        <div v-if="uploadedFiles?.length > 0" class="uploaded-files">
            <h3>Uploaded Files:</h3>
            <ul>
                <li v-for="(item, index) in uploadedFiles" :key="index" class="uploaded-file-item">
                    <span>{{ item.fileName }}: {{ item.file.name }}</span>
                    <button @click="handleCancelUpload(index, item.fileName)" class="cancel-button">Cancel</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 2rem;
}

.upload-section {
    flex: 1;
    text-align: center;
}

.field {
    margin-bottom: 1rem;
}

.file-select {
    width: 15rem;
    padding: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    height: 40px;
}

.file-select:focus {
    outline: none;
    border: 1px solid #ccc; /* Maintain the same border color as the non-focused state */
}

.uploaded-files {
    flex: 1;
    text-align: center;
    margin-left: 2rem;
}

.uploaded-file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.cancel-button {
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
}

.cancel-button:hover {
    background-color: #ff7875;
}

.hidden-file-input {
    display: none;
}
</style>
