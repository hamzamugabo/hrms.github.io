<script setup>
import { ref } from 'vue';
// import { userservice } from './userservice.js';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import programs from './programData';
import { useRouter } from 'vue-router';
import ProgramDataTable from './ProgramDataTable.vue';

const router = useRouter();

const programList = ref(programs);
const filters = ref();
// console.log('userData',userData)
const loading = ref(false);
const allCategoriesConst = programs.flatMap((user) => user.catalogRequests.map((cat) => cat.category));

// Use Set to get unique roles and convert back to an array
const uniqueCatelogs = Array.from(new Set(allCategoriesConst));
const allCatelogs = ref(uniqueCatelogs);
// console.log('uniqueRoles',uniqueRoles)
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        allCatelogs: { value: null, matchMode: FilterMatchMode.IN }
        // date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

const viewProgram = (user) => {
    router.push('/training-program/show-program');
    // router.push({
    //     path: '/user',
    //     query: user
    // });
};

const deleteProgram = async (employee) => {
    try {
        const apiUrl = process.env.VUE_APP_API_URL;
        const response = await fetch(`${apiUrl}` + employee.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }

        // Assuming successful deletion
        console.log('apiUrl', apiUrl);
        alert(`Deleted Employee: ${employee.firstName} ${employee.lastName}`);
    } catch (error) {
        console.error('Error deleting employee:', error.message);
        alert('Failed to delete employee. Please try again.');
    }
};
</script>
<template>
    <ProgramDataTable :allCatelogs="allCatelogs" :programList="programList" @clearFilter="clearFilter" @deleteProgram="deleteProgram" @viewProgram="viewProgram" :loading="loading" :filters="filters" />
</template>
