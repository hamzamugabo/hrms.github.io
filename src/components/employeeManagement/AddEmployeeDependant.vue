<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleDependantDetails']);
const props = defineProps(['lName', 'fName', 'phonNo']);

const firstName = ref(props?.fName);
const lastName = ref(props?.lName);
const phoneNumber = ref(props?.phonNo || null);

const submitForm = () => {
    const formData = {
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value
    };

    // Emit the form data to the parent component
    emit('handleDependantDetails', formData);
};
watch([firstName, lastName, phoneNumber], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-4">
            <label for="firstName">First Name</label>
            <InputText required id="firstName" type="text" v-model="firstName" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="lastName">Last Name</label>
            <InputText required id="lastName" type="text" v-model="lastName" />
        </div>

        <div class="field col-12 md:col-4">
            <label for="phoneNumber">Phone Number</label>
            <InputNumber v-model="phoneNumber" inputId="phoneNumber" :useGrouping="false" />
        </div>
    </div>
</template>
<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
