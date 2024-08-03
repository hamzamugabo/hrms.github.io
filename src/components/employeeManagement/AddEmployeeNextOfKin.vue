<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['handleNextOfKinDetails']);
const props = defineProps(['lName', 'fName', 'phonNo', 'address', 'emailAddress', 'relation']);

const firstName = ref(props?.fName);
const lastName = ref(props?.lName);
const email = ref(props?.emailAddress);
const phoneNumber = ref(props?.phonNo || null);
const physicalAddress = ref(props?.address);
const relationship = ref(props?.relation);

const submitForm = () => {
    const formData = {
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        physicalAddress: physicalAddress.value,
        relationship: relationship.value
    };

    // Emit the form data to the parent component
    emit('handleNextOfKinDetails', formData);
};
watch([firstName, lastName, email, relationship, phoneNumber, physicalAddress], () => {
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
        <div class="field col-12 md:col-4">
            <label for="email">Email</label>
            <InputText id="email" type="text" v-model="email" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="physicalAddress">Physical Address</label>
            <InputText id="physicalAddress" type="text" v-model="physicalAddress" />
        </div>
        <div class="field col-12 md:col-4">
            <label for="relationship">Relationship</label>
            <InputText id="relationship" type="text" v-model="relationship" />
        </div>
    </div>
</template>
<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
