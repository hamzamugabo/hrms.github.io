<script setup>
import { ref } from 'vue';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const loading = ref(false);
const name = ref('');
const serverError = ref('');
const success = ref(false);
const successMessage = ref('');
const emit = defineEmits(['refresh'])

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;

    const url = `${baseURL}/qualification-type/create`;

    try {
        const qualificationTypeData = {
            name: name.value
        };
        console.log('submit', qualificationTypeData);
        const data = await postData(url, qualificationTypeData);
        if (data?.status === 200 || data?.status === 201) {
            success.value = true;
            successMessage.value = data?.message;
            showSuccess();
            loading.value = false;
            name.value = '';
              success.value = false;
            emit('refresh');
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        loading.value = showError();
        false;
        console.log(error?.error);
    }
};
</script>
<template>
    <div class="form-container_">
        <form @submit.prevent="submitForm" class="form-content_">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>
                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Qualification Type</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">Qualification Type</label>
                                <InputText required id="name" type="text" v-model="name" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
            <div v-if="!loading" class="mb-10" style="margin: 10px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style></style>
