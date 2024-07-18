<script setup>
import { ref } from 'vue';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const prop = defineProps(['applicantId']);

const award = ref('');
const endDate = ref('');
const fieldOfStudy = ref('');
const schoolName = ref('');
const startDate = ref('');
const loading = ref('');
const success = ref(false);
const successMessage = ref('');
const updateApplicantError = ref('');
const addEmployeeError = ref('');

const submitForm = async () => {
    updateApplicantError.value = '';
    loading.value = true;
    try {
        const url = `${baseURL}/applicant/education/create/${prop?.applicantId}`;

        if (!schoolName.value.trim()) {
            alert('Please enter School name.');
            return;
        }

        const formData = {
            award: award.value,
            endDate: endDate.value,
            fieldOfStudy: fieldOfStudy.value,
            schoolName: schoolName.value,
            startDate: startDate.value
        };

        // console.log('formData', formData)

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            loading.value = false;
            resetForm();
            success.value = true;
            loading.value = false;
            showSuccess();
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);

        } else {
            showError(data?.message ? data?.message : data?.error);
            updateApplicantError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;

        console.error('Login error:', error);
    }
};
const resetForm = () => {
    award.value = '';
    endDate.value = '';
    fieldOfStudy.value = '';
    schoolName.value = '';
    startDate.value = '';
};
</script>

<template>
    <Toast />
    <form @submit.prevent="submitForm">
        <div class="grid" >
            <div class="col-12">
                <div class="card">
                    <Message v-if="success" severity="success">{{ successMessage }}</Message>

                    <Message v-if="addEmployeeError" severity="error">{{ addEmployeeError }}</Message>

                    <h5>Qualification details</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="school">School Name</label>
                            <InputText required id="school" type="text" v-model="schoolName" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="award">Award</label>
                            <InputText required id="award" type="text" v-model="award" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="dob">Start Date</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate"></Calendar>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="dob">End Date</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate"></Calendar>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="fieldOfStudy">Filed of study</label>
                            <InputText id="fieldOfStudy" type="text" v-model="fieldOfStudy" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; cursor: pointer; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Update Applicant</button>
        </div>
    </form>
</template>
