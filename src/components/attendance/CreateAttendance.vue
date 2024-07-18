<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleAttendance']);
const props = defineProps(['isTimeIn', 'isTimeOut']);
console.log('isTimeIn', props?.isTimeIn);
console.log('isTimeOut', props?.isTimeOut);

const notes = ref('');
// const timeIn = ref('');
// const timeOut = ref('');



const submitForm = () => {
    // const now = new Date();

    // Convert to ISO 8601 string
    // const isoTimestamp = now.toISOString();
    const formData = {
        // date: changeDateFormat(now),
        // employeeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        notes: notes.value,
        // timeIn: now.toString(),
        // timeOut: now ? now.toString : now.toString()
    };


    // Emit the form data to the parent component
    emit('handleAttendance', formData);
};
watch([notes], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <!-- <div class="field col-12 md:col-6">
            <label for="timeIn">Time In</label>
            <Calendar :disabled="isTimeIn === false" id="calendar-12h" v-model="timeIn" showTime hourFormat="12" />
           
        </div>
        <div class="field col-12 md:col-6">
            <label for="timeout">Time Out</label>
            <Calendar :disabled="isTimeOut === false" id="calendar-12h" v-model="timeOut" showTime hourFormat="12" />

            
        </div> -->
        <div class="field col-12 md:col-6">
            <label for="notes">Notes (Optional)</label>
            <InputText  id="notes" type="text" v-model="notes" />
        </div>
    </div>
</template>
