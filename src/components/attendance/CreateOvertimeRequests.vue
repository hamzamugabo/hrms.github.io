<script setup>
import { ref, watch } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';

const emit = defineEmits(['handleOvertimeRequest']);

const startTime = ref('');
const endTime = ref('');



const submitForm = () => {
    const now = new Date();

    // Convert to ISO 8601 string
    // const isoTimestamp = now.toISOString();
    const formData = {
        date: changeDateFormat(now),
        startTime: startTime.value.toString(),
        endTime: endTime.value.toString()
    };

    // Emit the form data to the parent component
    emit('handleOvertimeRequest', formData);
};
watch([startTime, endTime], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
            <label for="startTime">Start Time</label>
            <!-- <Calendar :showIcon="true" :showButtonBar="true" v-model="startTime"></Calendar> -->
            <Calendar id="calendar-12h" v-model="startTime" showTime hourFormat="12" />

        </div>
        <div class="field col-12 md:col-6">
            <label for="endTime">end Time</label>
            <!-- <Calendar :showIcon="true" :showButtonBar="true" v-model="endTime"></Calendar> -->
            <Calendar id="calendar-12h" v-model="endTime" showTime hourFormat="12" />

        </div>
    </div>
</template>
