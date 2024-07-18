<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleInterview']);
const props = defineProps(['interview']);

const feedBack = ref(props?.interview?.feedBack);
const location = ref(props?.interview?.location);
const dateTime = ref(props?.interview?.dateTime);
// const now = new Date();
const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const submitForm = () => {
    // const now = new Date();

    // Convert to ISO 8601 string
    // const isoTimestamp = now.toISOString();
    const formData = {
        feedBack: feedBack.value || props?.interview?.feedBack,
        location: location.value || props?.interview?.location,
        dateTime: formatDate(dateTime.value) || props?.interview?.dateTime
    };

    // Emit the form data to the parent component
    emit('handleInterview', formData);
};
watch([feedBack, location, dateTime], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
            <label for="location">Date Time</label>
            <Calendar id="calendar-12h" :minDate="minDate" v-model="dateTime" showTime hourFormat="12" />
        </div>
        <div class="field col-12 md:col-6">
            <label for="location">Location</label>
            <InputText required id="location" type="text" v-model="location" />
        </div>
        <div class="field col-12 md:col-6">
            <label for="feedBack">feedBack</label>
            <InputText required id="feedBack" type="text" v-model="feedBack" />
        </div>
    </div>
</template>
