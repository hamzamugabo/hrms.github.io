<script setup>
import { ref } from 'vue';
import { postData, baseURL } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const addLoading = ref(false);
const addJobTitle = ref('');
const addGrade = ref('');
const addServerError = ref('');
const addSuccess = ref(false);
const addSuccessMessage = ref('');
const emit = defineEmits(['refresh']);
const submitForm = async () => {
    addServerError.value = '';
    addLoading.value = true;

    const url = `${baseURL}/designation/create`;

    try {
        const desigantionData = {
            jobTitle: addJobTitle.value,
            grade: addGrade.value
        };
        console.log('submit', desigantionData);
        const data = await postData(url, desigantionData);
        if (data?.status === 200 || data?.status === 201) {
            // addSuccess.value = true;
            showSuccess();
            addSuccessMessage.value = data?.message;
            addLoading.value = false;
            addJobTitle.value = '';
            addGrade.value = '';
            emit('refresh');
        } else {
            showError();
            addServerError.value = data?.error || data?.message;
            addLoading.value = false;
        }
    } catch (error) {
        showError();

        addLoading.value = false;
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
                        <Message v-if="addSuccess" severity="success">{{ addSuccessMessage }}</Message>
                        <Message v-if="addServerError" severity="error">{{ addServerError }}</Message>
                        <h5>Create Designation</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="addJobTitle">Job Title</label>
                                <InputText required id="addJobTitle" type="text" v-model="addJobTitle" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="addGrade">grade</label>
                                <InputText required id="addGrade" type="text" v-model="addGrade" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="addLoading" size="3rem" />
            </div>

            <div v-if="!addLoading" class="mb-10" style="margin: 10px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style></style>
