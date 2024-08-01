<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleAttendance']);
defineProps(['isTimeIn', 'isTimeOut']);

const notes = ref('');

const submitForm = () => {
    const formData = {
        notes: notes.value
    };

    emit('handleAttendance', formData);
};
watch([notes], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-12">
            <label for="notes">Notes (Optional)</label>
            <InputText id="notes" type="text" v-model="notes" />
        </div>
    </div>
</template>
