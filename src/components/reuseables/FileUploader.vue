<script setup>
import { ref } from 'vue';


const emit = defineEmits(['getImageData']);
defineProps(['label']);
const imageUrl = ref('');

const onFileChange = (e) => {
    const files = e.target.files;

    if (!files.length) return;

    const file = files[0];

    imageUrl.value = URL.createObjectURL(file);
    emit('getImageData', file);
};
</script>
<template>
    <div>
        <div class="mt-5 mb-5">
            <!-- Hidden file input -->
            <input type="file" id="fileInput" @change="onFileChange($event)" style="display: none" />
            <!-- Button styled as file input -->
            <label for="fileInput" style="background-color: #db0000" class="text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none updateProfileButton">{{ label || 'upload' }}</label>
        </div>
    </div>
</template>

<style>
.updateProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
    max-width: 200px; /* Limit the maximum width of the button */
    display: inline-block; /* Ensure inline display to prevent breaking */
    text-align: center; /* Center text inside the button */
    white-space: nowrap; /* Prevent text wrapping */
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Show ellipsis for overflow text */
}

/* Add hover style for better user interaction */
.updateProfileButton:hover {
    background-color: #45a049;
}
</style>
