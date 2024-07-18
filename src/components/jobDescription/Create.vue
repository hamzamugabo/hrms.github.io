<script setup>
import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref } from 'vue';
import { baseURL } from '@/components/reuseables/FetchPostData';
import { fetchData } from '../reuseables/FetchPostData';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const deliverables = ref('');
const jobGrade = ref('');
const jobTitle = ref('');
const departmentId = ref('');
const lineOfResponsibility = ref('');
const personSpecifications = ref('');
const purpose = ref('');
const tasks = ref('');
const loading = ref(false);
const success = ref(false);
const autoFilteredDepartments = ref([]);
const allDepartments = ref([]);

const serverError = ref('');
const successMessage = ref('');

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    const formData = {
        deliverables: deliverables.value,
        departmentId: departmentId?.value?.id,
        jobGrade: jobGrade.value,
        jobTitle: jobTitle.value,
        lineOfResponsibility: lineOfResponsibility.value,
        personSpecifications: personSpecifications.value,
        purpose: purpose.value,
        tasks: tasks.value
    };

    const url = `${baseURL}/job-description/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            showSuccess(data?.message);
            loading.value = false;
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
            showError();

        loading.value = false;
        console.log(error?.error);
    }
};
const getDepartments = async () => {
    const url = `${baseURL}/department`;
    try {
        const { data } = await fetchData(url, false);
        allDepartments.value = data?.departments;
    } catch (error) {
        // Handle errors here
    }
};
const searchDepartment = (event) => {
    if (!event.query.trim().length) {
        autoFilteredDepartments.value = allDepartments?.value?.length > 0 ? [...allDepartments.value] : [];
    } else {
        // Check if allDepartments.value is iterable and not null/undefined
        if (Array.isArray(allDepartments.value)) {
            autoFilteredDepartments.value = allDepartments.value.filter((department) => {
                return department.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        } else {
            console.error('allDepartments.value is not an array or is null/undefined.');
            // Handle the error or set autoFilteredDepartments.value to a default value
            autoFilteredDepartments.value = [];
        }
    }
};
onMounted(async () => {
    await getDepartments();
});
</script>
<template>
    <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content">
            <div class="grid">
                <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>

                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Job Description</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-6">
                                <label for="department">Department</label>
                                <AutoComplete placeholder="Search" id="department" :dropdown="true" :multiple="false" v-model="departmentId" :suggestions="autoFilteredDepartments" @complete="searchDepartment($event)" field="name" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="deliverables">deliverables</label>
                                <InputText required id="deliverables" type="text" v-model="deliverables" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="jobGrade">job Grade</label>
                                <InputText required id="jobGrade" type="text" v-model="jobGrade" />
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="jobTitle">job Title</label>
                                <InputText id="jobTitle" type="text" v-model="jobTitle" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="lineOfResponsibility">line Of Responsibility</label>
                                <InputText id="lineOfResponsibility" type="text" v-model="lineOfResponsibility" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="personSpecifications">person Specifications</label>
                                <InputText id="personSpecifications" type="text" v-model="personSpecifications" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="purpose">Purpose</label>
                                <InputText id="purpose" type="text" v-model="purpose" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="tasks">tasks</label>
                                <InputText id="tasks" type="text" v-model="tasks" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
