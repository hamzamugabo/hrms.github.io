<script setup>
import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { ref } from 'vue';
import { baseURL } from '@/components/reuseables/FetchPostData';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const emit = defineEmits(['refresh']);
const name = ref('');
const loading = ref(false);
const success = ref(false);

const serverError = ref('');
const successMessage = ref('');

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    const formData = { name: name.value };

    const url = `${baseURL}/region/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            success.value = true;
            loading.value = false;
            showSuccess('Success');
            emit('refresh');
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            showError( data?.error || data?.message);
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
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
                <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>

                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Region</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">Name</label>
                                <InputText required id="name" type="text" v-model="name" />
                            </div>
                        </div>
                         <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 20px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
                    </div>
                </div>
            </div>

           
        </form>
    </div>
</template>

<style></style>
