<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['handleDataEmitted']);

const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref(null);
const success = ref(false);

const serverError = ref('');
const successMessage = ref('');

const handleData = async () => {
    const formData = { name: `${firstName.value} ${lastName.value}`, phoneNumber: phoneNumber.value };
    emit('handleDataEmitted', formData);
};
watch([firstName, lastName, phoneNumber], () => {
    handleData();
});
</script>
<template>
    <!-- <div class="form-container"> -->
    <Toast />
    <!-- <form @submit.prevent="submitForm" class="form-content"> -->
    <div class="grid">
        <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

        <div class="col-12">
            <div class="card">
                <Message v-if="success" severity="success">{{ successMessage }}</Message>

                <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                <h5>Create Contact</h5>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="firstName">First Name</label>
                        <InputText required id="firstName" type="text" v-model="firstName" />
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="lastName">Last Name</label>
                        <InputText required id="lastName" type="text" v-model="lastName" />
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="phoneNumber">Phone Number</label>
                        <InputNumber v-model="phoneNumber" inputId="withoutgrouping" :useGrouping="false" />
                        <!-- <InputText id="phoneNumber" type="text" v-model="phoneNumber" /> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 
            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div> -->
    <!-- </form> -->
    <!-- </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
