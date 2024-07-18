<script setup>
import { ref, onMounted } from 'vue';
// import { userservice } from './userservice.js';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import userData from './userData';
import { useRouter } from 'vue-router';
import UserDataTable from './UserDataTable.vue';

const router = useRouter();

const users = ref(userData);
const filters = ref();
// console.log('userData',userData)
const loading = ref(false);
const allRolesConst = userData.flatMap((user) => user.roleRequests.map((role) => role.name));

// Use Set to get unique roles and convert back to an array
const uniqueRoles = Array.from(new Set(allRolesConst));
const allRoles = ref(uniqueRoles);
// console.log('uniqueRoles',uniqueRoles)
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        allRoles: { value: null, matchMode: FilterMatchMode.IN }
        // date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

const viewUser = (user) => {
    router.push('/user');
    // router.push({
    //     path: '/user',
    //     query: user
    // });
};

const deleteUser = async (employee) => {
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
    <UserDataTable :allRoles="allRoles" :users="users" @clearFilter="clearFilter" @deleteUser="deleteUser" @viewUser="viewUser" :loading="loading" :filters="filters" />
</template>
