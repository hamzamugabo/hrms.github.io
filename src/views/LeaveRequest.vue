<script>
export default {};
</script>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { useRouter } from 'vue-router';

// import loadFromLocalStorage from '@/components/reuseables/getUser';
const router = useRouter();
const leaveRequests = ref([]);
const filters = ref(null);
const loading = ref(true);

const generalError = ref('');
const leaveTypes = ref([]);
const searchTerm = ref('');
const employeeId = ref('');
const employees = ref([]);

const getRequests = async () => {
    const url = `${baseURL}/leave/request`;

    try {
        const { data } = await fetchData(url, loading, router);

        let allRequests = await Promise.all(
            data.map(async (element) => {
                const employee = await getEmployeeById(element?.employeeId);

                return {
                    ...element,
                    employee: employee,
                    leaveType: await getLeaveType(element?.leaveTypeId)
                };
            })
        );

        leaveRequests.value = allRequests;

        // Assign allRequests to your reactive variable if needed
    } catch (error) {
        console.error('Error fetching requests:', error);
        // Handle errors here
    }
};
const getLeaveType = async (id) => {
    const url = `${baseURL}/leave/type/by-id/${id}`;

    try {
        const { data } = await fetchData(url, loading);
        // console.log('employee', data);

        return data;
    } catch (error) {
        console.error('Error fetching employee:', error);
        // Handle errors here
    }
};

const getEmployees = async () => {
    const url = `${baseURL}/employees`;

    try {
        const { data } = await fetchData(url, loading);
        // console.log(data)
        employees.value = data;
    } catch (error) {
        console.log('employees error', error);
        // Handle errors here
    }
};

const getLeaveTypes = async () => {
    const url = `${baseURL}/leave/type`;

    try {
        const { data } = await fetchData(url, loading);
        // console.log('leavetypes', data?.leaveTypes);
        leaveTypes.value = data;
    } catch (error) {
        // Handle errors here
    }
};

const getEmployeeById = async (id) => {
    const url = `${baseURL}/employees/by-id/${id}`;

    try {
        const { data } = await fetchData(url, loading);
        // console.log('employee', data);

        const employee = {
            id: data?.id,
            firstName: data?.firstName,
            lastName: data?.lastName
        };

        return employee;
    } catch (error) {
        console.error('Error fetching employee:', error);
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        leaveStatus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

onMounted(async () => {
    await getRequests();
    await getLeaveTypes();
    await getEmployees();
    // console.log( getStatusColor('PENDING'))
});
initFilters();

const searchByStatus = async () => {
    try {
        const url = `${baseURL}/leave/request/by-status/${searchTerm.value?.name}`;

        const { data } = await fetchData(url, loading);
        console.log('data===>', data);
        let allRequests = await Promise.all(
            data.map(async (element) => {
                const employee = await getEmployeeById(element?.employeeId);
                return {
                    ...element,
                    employee: employee
                };
            })
        );
        leaveRequests.value = allRequests || [];
        // employees.value = data || [];
    } catch (error) {
        leaveRequests.value = [];
        // Handle errors here
    }
};
// const searchByDateRange = async () => {
//     try {
//         const url = `${baseURL}/leave/request/date-range`;
//         const queryParams = new URLSearchParams();
//         queryParams.append('startDate', changeDateFormat(startDateSearch.value));
//         queryParams.append('endDate', changeDateFormat(endDateSearch.value));
//         const queryUrl = `${url}?${queryParams.toString()}`;
//         const { data } = await fetchData(queryUrl, loading);
//         // console.log('search by range', data);
//     } catch (error) {
//         leaveRequests.value = [];
//         // Handle errors here
//     }
// };
const searchByEmployeeId = async () => {
    try {
        const url = `${baseURL}/leave/request/by-employeeId/${employeeId.value?.id}`;

        const { data } = await fetchData(url, loading);
        // console.log('data===>', data);
        let allRequests = await Promise.all(
            data.map(async (element) => {
                const employee = await getEmployeeById(element?.employeeId);
                return {
                    ...element,
                    employee: employee
                };
            })
        );
        leaveRequests.value = allRequests || [];
        // employees.value = data || [];
    } catch (error) {
        leaveRequests.value = [];
        // Handle errors here
    }
};
watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
        await searchByStatus();
    } else {
        await getRequests();
    }
});
watch(employeeId, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && employeeId.value?.id?.length > 0) {
        await searchByEmployeeId();
    } else {
        await getRequests();
    }
});
// watch([startDateSearch, endDateSearch], async () => {
//     await searchByDateRange();
// });
</script>

<template>
    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
        <DataTable :value="leaveRequests" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column :sortable="true" field="employee" header="Employee" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.employee?.firstName }} {{ data.employee?.lastName }} </template>
            </Column>
            <Column :sortable="true" field="leaveTypeId" header="Leave Type" style="min-width: 18rem">
                <template #body="{ data }"> {{ data?.leaveType?.name }}</template>
            </Column>
            <Column :sortable="false" field="startDate" header="Start Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.startDate }} </template>
            </Column>
            <Column :sortable="false" field="endDate" header="End Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.endDate }} </template>
            </Column>
        </DataTable>
    </div>
</template>

<style></style>

<style>
.pending-color {
    color: orange; /* Adjust color as needed */
}

.approved-color {
    color: green; /* Adjust color as needed */
}

.on_going-color {
    color: blue; /* Adjust color as needed */
}

.rejected-color {
    color: red; /* Adjust color as needed */
}
.default-color {
    color: black; /* Adjust color as needed */
}
.autocomplete-custom .p-autocomplete-input {
    width: 150px; /* Adjust the width as needed */
}
@media (max-width: 768px) {
    .flex-column-sm {
        flex-direction: column;
    }
    .gap-3-sm > * {
        margin-bottom: 1rem;
    }
}
</style>
