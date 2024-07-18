<script setup>
import { ref, onMounted } from 'vue';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';

// const emit = defineEmits(['handleExperienceDetails']);
const props = defineProps(['employeeId']);

const departmentId = ref('');

const autoFilteredDepartments = ref([]);
const allDepartments = ref([]);
const loading = ref(false);
const updateEmployeeError = ref('');
const success = ref(false);
const successMessage = ref('');
const submitForm = async () => {
     updateEmployeeError.value = '';
    loading.value = true;

    try {
        const url = `${baseURL}/employees/${props?.employeeId}/department/${departmentId?.value?.id}`;

        const data = await postData(url, {}, loading);
        console.log('update data', data);
        if (data?.status === 200 || data?.status === 201) {
            success.value = true;
            loading.value = false;
            successMessage.value = data?.message;
            loading.value = false;
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            success.value = false;
            successMessage.value = '';
            updateEmployeeError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        loading.value = false;
        success.value = false;
        successMessage.value = '';
        console.error('Login error:', error);
    }

    // Emit the form data to the parent component
    // emit('handleExperienceDetails', formData);
};

const getDepartments = async () => {
    const url = `${baseURL}/department`;

    try {
        const { data } = await fetchData(url, false);

        allDepartments.value = data?.departments;
        // Handle the fetched data here
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
    <div class="p-fluid formgrid grid">
        <Message v-if="success" severity="success">{{ successMessage }}</Message>

        <Message v-if="updateEmployeeError" severity="error">{{ updateEmployeeError }}</Message>
        <div class="field col-12 md:col-12">
            <div class="field col-12 md:col-12">
                <!-- <label for="maritalstatus">Department</label> -->
                <AutoComplete placeholder="Search" id="department" :dropdown="true" :multiple="false" v-model="departmentId" :suggestions="autoFilteredDepartments" @complete="searchDepartment($event)" field="name" />
            </div>
        </div>
    </div>
    <div style="display: flex; justify-content: center">
        <SpinnerVue :loading="loading" size="3rem" />
    </div>
    <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
        <button @click="submitForm" style="color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3 my-custom-button">Submit</button>
    </div>
</template>
<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
