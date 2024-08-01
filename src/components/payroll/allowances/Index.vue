<script setup>
import { ref } from 'vue';
import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import AddAllowance from './CreateComponent.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const baseURL = import.meta.env.VITE_APP_API_URL;
const emit = defineEmits(['refresh'])
const description = ref('');
const durationInDays = ref(0);
const name = ref('');
const loading = ref(false);
const allowanceData = ref({});

const serverError = ref('');
const success = ref(false);
const successMessage = ref('');

const submitForm = async () => {
     serverError.value = '';
    loading.value = true;
    let url = `${baseURL}/allowance/create`;

    if (allowanceData?.value?.allowanceType === 'OVERTIME') {
        url = `${baseURL}/allowance/create/Overtime`;
    } else if (allowanceData?.value?.allowanceType === 'TRANSFER') {
        url = `${baseURL}/allowance/create/Transfer`;
    } else if (allowanceData?.value?.allowanceType === 'TRAVEL_OUTSIDE') {
        url = `${baseURL}/allowance/create/TravelOutside`;
    } else {
        url = `${baseURL}/allowance/create`;
    }

    try {
        const payload = {
            ...allowanceData.value
        };

        const data = await postData(url, payload);
        if (data?.status === 200 || data?.status === 201) {
            // success.value = true;
            showSuccess();
            successMessage.value = data?.message;

            loading.value = false;
            name.value = '';
            description.value = '';
            durationInDays.value = '';
            emit('refresh')
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
            showError();

        serverError.value = error?.message || error?.message;

        loading.value = false;
        console.log(error?.error);
    }
};
const handleAddAllowance = (data) => {
    allowanceData.value = data;
};
</script>
<template>
    <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>
                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Allowance</h5>
                        <AddAllowance @handleAddAllowance="handleAddAllowance" />
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; cursor: pointer; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style></style>
