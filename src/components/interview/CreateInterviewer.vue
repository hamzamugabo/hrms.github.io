<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleInterviewer']);
const props = defineProps(['interviewer']);

const expertiseArea = ref(props?.interviewer?.expertiseArea);
const name = ref(props?.interviewer?.name);
// function formatDate(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');

//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }
const submitForm = () => {
    // const now = new Date();

    // Convert to ISO 8601 string
    // const isoTimestamp = now.toISOString();
    const formData = {

        expertiseArea: expertiseArea.value,
        name: name.value,
        // availability: formatDate(now)
    };

    // Emit the form data to the parent component
    emit('handleInterviewer', formData);
};
watch([expertiseArea, name], () => {
    submitForm();
});

</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
            <label for="name">Name</label>
            <InputText required id="name" type="text" v-model="name" />
        </div>
        <div class="field col-12 md:col-6">
            <label for="expertiseArea">Expertise Area</label>
            <InputText required id="expertiseArea" type="text" v-model="expertiseArea" />
        </div>
    </div>
</template>

