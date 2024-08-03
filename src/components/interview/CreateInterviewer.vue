<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleInterviewer']);
const props = defineProps(['interviewer']);

const expertiseArea = ref(props?.interviewer?.expertiseArea);
const name = ref(props?.interviewer?.name);

const submitForm = () => {
    const formData = {
        expertiseArea: expertiseArea.value,
        name: name.value
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
