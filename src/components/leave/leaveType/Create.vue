<script setup>
import { ref } from 'vue';
import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { leaveTypes } from '@/components/reuseables/enums';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const baseURL = import.meta.env.VITE_APP_API_URL;

const description = ref('');
const durationInDays = ref(0);
const name = ref({name:"",code:""});
const loading = ref(false);

const serverError = ref('');
const success = ref(false);
const successMessage = ref('');

const validateInput = () => {
    // Remove non-numeric characters from the input
    durationInDays.value = durationInDays.value.replace(/\D/g, '');
};

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    const url = `${baseURL}/leave/type/create`;

    try {
        const leveTypeData = {
            description: description.value,
            maxDurationInDays: parseInt(durationInDays.value),
            leaveTypeEnum: name.value?.name
        };
        console.log('submit', leveTypeData);
        const data = await postData(url, leveTypeData);
        if (data?.status === 200 || data?.status === 201) {
            // success.value = true;
            successMessage.value = data?.message;

            loading.value = false;
            name.value = '';
            description.value = '';
            durationInDays.value = '';
            showSuccess(data?.message);
        } else {
            showError('Failed');
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        serverError.value = error?.message || error?.message;
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
</script>
<template>
    <div class="form-container">
        <Toast />
         
        <form @submit.prevent="submitForm" class="form-content">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>
                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Leave Type</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="jobTitle">Name</label>
                                <Dropdown v-model="name" :options="leaveTypes" optionLabel="name" placeholder="Select a Leave Type" required />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="jobTitle">Duration in days</label>
                                <InputText required id="duration" type="text" v-model="durationInDays" @input="validateInput" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="jobTitle">Description</label>
                                <Textarea rows="3" cols="30" v-model="description" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
            <div v-if="!loading" class="mb-5" style="margin: 20px 0px">
                <button style="background-color: #db0000; cursor: pointer; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 2px" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style></style>
