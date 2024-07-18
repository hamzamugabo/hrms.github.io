<script setup>
import { ref } from 'vue';
import { postData, baseURL } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { employeeLevelsEnum } from '@/components/reuseables/enums.js';

import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const addLoading = ref(false);
const basicSalary = ref(0);
const employeeLevel = ref({ name: '', code: '' });
const addServerError = ref('');
const addSuccess = ref(false);
const addSuccessMessage = ref('');
const emit = defineEmits(['refresh']);
const submitForm = async () => {
    addServerError.value = '';
    addLoading.value = true;

    const url = `${baseURL}/salary/config/create`;

    try {
        const configData = [
            {
                basicSalary: basicSalary.value,
                employeeLevel: employeeLevel.value.name
            }
        ];
        console.log('submit', configData);
        const data = await postData(url, configData);
        if (data?.status === 200 || data?.status === 201) {
            // addSuccess.value = true;
            showSuccess();
            addSuccessMessage.value = data?.message;
            addLoading.value = false;
            basicSalary.value = '';
            employeeLevel.value = '';
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
                        <h5>Create Salary config</h5>
                        <div class="p-fluid formgrid grid">
                              <div class="field col-12 md:col-12">
                                <label for="employeeLevel">Employee Level</label>
                                <Dropdown id="level" v-model="employeeLevel" :options="employeeLevelsEnum" optionLabel="name" placeholder="Select One"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="basicSalary">Basic Salary</label>
                                <InputNumber v-model="basicSalary" inputId="integeronly" />
                                <!-- <InputText required id="basicSalary" type="text" v-model="basicSalary" /> -->
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
