<script setup>
import { ref } from 'vue';
import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import Deduction from './CreateComponent.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const baseURL = import.meta.env.VITE_APP_API_URL;
const emit = defineEmits(['refresh']);
const loading = ref(false);
const deductionData = ref({});

const serverError = ref('');
const success = ref(false);
const successMessage = ref('');

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    let url = `${baseURL}/deduction/create`;

    try {
        const payload = { ...deductionData.value };

        if (payload?.tinNumber) {
            url = `${baseURL}/deduction/create-paye`;
        } else if (payload?.nssfNumber) {
            url = `${baseURL}/deduction/create-nssf`;
        }

        const data = await postData(url, payload);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            emit('refresh');
            showSuccess();
        } else {
            serverError.value = data?.error || data?.message;
            showError();
        }
    } catch (error) {
        serverError.value = error?.message || 'An error occurred';
        showError();
        console.log(error);
    } finally {
        loading.value = false;
    }
};

const handleDeduction = (data) => {
    deductionData.value = data;
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
                        <h5>Create Deduction</h5>
                        <Deduction @handleDeduction="handleDeduction" />
                    </div>
                </div>
            </div>
            <!-- <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; cursor: pointer; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Submit</button>
            </div> -->
        </form>
    </div>
</template>

<style></style>
