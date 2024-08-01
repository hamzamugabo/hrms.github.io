<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import CreateRequest from '@/components/leave/leaveRequest/Create.vue';
import AddButton from '@/components/reuseables/AddButton.vue';

// import loadFromLocalStorage from '@/components/reuseables/getUser';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const { confirmDelete } = useConfirmDialog();

const leaveRequests = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const leaveRequestsData = ref({});
// const departmentUpdatedName = ref('');
// const name = ref('');
// const maxDurationInDays = ref('');
const endDate = ref('');
const startDate = ref('');
const endDateSearch = ref('');
const startDateSearch = ref('');
const leaveStatus = ref({ name: '', code: '' });
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const leaveTypes = ref([]);
const searchTerm = ref('');
const filterTerm = ref('');
const filterBy = ref('');
const employeeId = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);
const leveRequestData = ref({});

const getRequests = async () => {
    const url = `${baseURL}/leave/request`;

    try {
        const { data } = await fetchData(url, loading);
        

        if (Array.isArray(data) && data.length > 0) {
            let allRequests = await Promise.all(
                data.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId);
                    const leave = await getLeaveType(element?.leaveTypeId);
                    console.log('leave by id', leave);
                    return {
                        ...element,
                        employee: employee,
                        leaveType: leave?.name
                    };
                })
            );

         

            leaveRequests.value = allRequests;
        } else {
            leaveRequests.value = []; // Handle case where data is not an array or is empty
        }

        // Assign allRequests to your reactive variable if needed
    } catch (error) {
        leaveRequests.value = []; // Handle case where data is not an array or is empty

        console.log('Error fetching requests:', error);
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
        employees.value = [];

        console.log('employees error', error);
        // Handle errors here
    }
};

const getLeaveTypes = async () => {
    const url = `${baseURL}/leave/type`;

    try {
        const { data } = await fetchData(url, loading);
        leaveTypes.value = data;
    } catch (error) {
        leaveTypes.value = [];

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

const clearFilter = () => {
    initFilters();
    getRequests();
    filterBy.value = '';
};
const updateLeaveRequest = async () => {
    try {
        loading.value = true;
        const url = `${baseURL}/leave/request/update`;
        const formData = {
            endDate: changeDateFormat(endDate.value) || leaveRequestsData?.value?.endDate,
            id: leaveRequestsData?.value?.id,
            leaveStatus: leaveStatus.value?.name,
            startDate: changeDateFormat(startDate.value) || leaveRequestsData?.value?.startDate
        };
        // console.log('request', formData);

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            loading.value = false;
            showSuccess(data?.message);
            await getRequests();
        } else {
            showError('Failed');
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (leaveRequest) => {
    leaveRequestsData.value = leaveRequest;
    leaveStatus.value = { name: leaveRequest?.leaveStatus, code: leaveRequest?.leaveStatus };
    endDate.value = leaveRequest?.endDate;
    startDate.value = leaveRequest?.startDate;
    visible.value = true;
};

onMounted(async () => {
    await getRequests();
    await getLeaveTypes();
    await getEmployees();
    // console.log( getStatusColor('PENDING'))
});
initFilters();

const LeaveStatus = [
    { name: 'PENDING', code: 'PENDING' },
    { name: 'APPROVED', code: 'APPROVED' },
    { name: 'ON_GOING', code: 'ON_GOING' },
    { name: 'REJECTED', code: 'REJECTED' }
];
// const filterOPtions = [
//     { name: 'Date Range', code: 'Date Range' },
//     { name: 'Employee', code: 'Employee' },
//     { name: 'Status', code: 'Status' },
//     { name: 'All', code: 'All' }
// ];
const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'pending-color';
        case 'APPROVED':
            return 'approved-color';
        case 'ON_GOING':
            return 'on_going-color';
        case 'REJECTED':
            return 'rejected-color';
        default:
            return 'default-color';
    }
};

const searchByStatus = async () => {
    try {
        const url = `${baseURL}/leave/request/by-status/${searchTerm.value?.name}`;

        const { data } = await fetchData(url, loading);

        if (Array.isArray(data) && data.length > 0) {
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
        } else {
            leaveRequests.value = []; // Handle case where data is not an array or is empty
        }
        // employees.value = data || [];
    } catch (error) {
        leaveRequests.value = [];
        // Handle errors here
    }
};
const searchByDateRange = async () => {
    try {
        const url = `${baseURL}/leave/request/date-range`;
        const queryParams = new URLSearchParams();
        queryParams.append('startDate', changeDateFormat(startDateSearch.value));
        queryParams.append('endDate', changeDateFormat(endDateSearch.value));
        const queryUrl = `${url}?${queryParams.toString()}`;
        const { data } = await fetchData(queryUrl, loading);
        console.log('search by range', data);
        if (Array.isArray(data) && data.length > 0) {
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
        } else {
            leaveRequests.value = []; // Handle case where data is not an array or is empty
        }
    } catch (error) {
        leaveRequests.value = [];
        // Handle errors here
    }
};
const searchByEmployeeId = async () => {
    try {
        const url = `${baseURL}/leave/request/by-employeeId/${employeeId.value?.id}`;

        const { data } = await fetchData(url, loading);

        if (Array.isArray(data) && data.length > 0) {
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
        } else {
            leaveRequests.value = []; // Handle case where data is not an array or is empty
        }
        // employees.value = data || [];
    } catch (error) {
        leaveRequests.value = [];
        // Handle errors here
    }
};
const getFilter = (filter) => {
    switch (filter) {
        case 'Date Range':
            return 'Date Range';
        case 'Employee':
            return 'Employee';
        case 'Status':
            return 'Status';
        case 'All':
            return 'All';

        default:
            return '';
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
watch(filterTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && filterTerm?.value?.name?.length > 0) {
        filterBy.value = getFilter(filterTerm.value?.name);
        console.log('filter by', getFilter(filterTerm.value?.name));
        console.log('filter value', filterTerm.value?.name);
    } else {
        clearFilter();
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
watch([startDateSearch, endDateSearch], async () => {
    await searchByDateRange();
});
const searchEmployee = (event) => {
    if (!event.query.trim().length) {
        autoFilteredEmployees.value = employees?.value?.length > 0 ? [...employees.value] : [];
    } else {
        autoFilteredEmployees.value = employees.value.filter((employee) => {
            const firstNameMatches = employee.firstName.toLowerCase().startsWith(event.query.toLowerCase());
            const lastNameMatches = employee.lastName.toLowerCase().includes(event.query.toLowerCase());
            return firstNameMatches || lastNameMatches;
        });
    }
};

const visibleAdd = ref(false);

const deleteLeaveRequest = async (data) => {
    const url = `${baseURL}/leave/request/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getRequests();
    });
};
const addLeaveType = () => {
    visibleAdd.value = true;
};

const approveRequest = async (request) => {
    updateError.value = '';
    try {
        const url = `${baseURL}/leave/request/approve/${request?.id}`;
        const formData = {};
        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            loading.value = false;
            showSuccess(data?.message);
            await getRequests();
        } else {
            showError('Failed');
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (err) {
        console.log(err);
    }
};
const serverError = ref('');

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    console.log('leaveRequestsData?.value', leaveRequestsData?.value);
    // Validate form fields before submission
    if (!leaveRequestsData?.value?.startDate || !leaveRequestsData?.value?.endDate || !leaveRequestsData?.value?.employeeId) {
        console.log('Please fill in all fields.');
        loading.value = false;
        serverError.value = 'Please fill in all fields';
        showError('Please fill in all fields');
        // Show an error message to the user or handle validation in another way
        return;
    }
    if (!leveRequestData.value) {
        showError('Object empty');
        return;
    }
    const url = `${baseURL}/leave/request/create`;
    const payload = { ...leaveRequestsData.value };
    console.log('payload new', payload);

    try {
        // console.log('submit', leveRequestData);
        const data = await postData(url, payload);
        console.log('payload to submit', payload);
        if (data?.status === 200 || data?.status === 201) {
            // success.value = true;
            successMessage.value = data?.message;

            loading.value = false;

            showSuccess(data?.message);
            await getRequests();
        } else {
            console.log('payload to submit else', payload);

            showError('Failed');
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        console.log('payload to submit catch', leaveRequestsData?.value);

        showError('Failed');

        serverError.value = error?.message || error?.message;

        loading.value = false;
        console.log(error?.error);
    }
};
const getSubmitFormData = (data) => {
    leaveRequestsData.value = { ...data };
};
</script>

<template>
    <div class="flex justify-content-center">
        <Toast />

        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Leave Requests" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="flex align-items-center gap-3 mb-3">
                <label for="name" class="font-semibold w-6rem">Leave Status</label>
                <Dropdown v-model="leaveStatus" :options="LeaveStatus" optionLabel="name" placeholder="Select a Leave Status" required />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="jobTitle" class="font-semibold w-6rem">Start Date</label>
                <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate"></Calendar>
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="jobTitle" class="font-semibold w-6rem">End Date</label>
                <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate"></Calendar>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateLeaveRequest"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleAdd" header="Create Leave Request" :style="{ width: '50%' }">
            <CreateRequest @getSubmitFormData="getSubmitFormData" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleAdd = false"></Button>
                <Button v-if="!loading" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Leave Request'" @handleAdd="addLeaveType" />
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="leaveRequests" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
            <template #header>
                <!-- <div class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-7 flex">
                        <label for="filter" class="font-semibold mr-5">Filter By:</label>

                        <Dropdown v-model="filterTerm" :options="filterOPtions" optionLabel="name" placeholder="Filter By" required />
                    </div>
                </div> -->
                <!-- <div v-if="filterBy" class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-12">
                        <Button type="button" icon="pi pi-filter-slash" class="ml-4 mb-2" label="Clear" outlined @click="clearFilter()" style="float: right; width: 100px" />
                    </div>
                </div> -->

                <div class="filter-container">
                    <div class="p-fluid formgrid grid flex-grow">
                        <div class="field col-12 md:col-6 lg:col-3 flex">
                            <label for="employee" class="font-semibold">Employee:</label>
                            <AutoComplete
                                placeholder="Search by employee"
                                id="employee"
                                optionLabel="lastName"
                                :dropdown="true"
                                :multiple="false"
                                v-model="employeeId"
                                :suggestions="autoFilteredEmployees"
                                @complete="searchEmployee($event)"
                                field="firstName"
                                class="filter-input"
                            >
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <div>{{ slotProps?.option?.firstName }}</div>
                                        <div>&nbsp;</div>
                                        <!-- Space character -->
                                        <div>{{ slotProps?.option?.lastName }}</div>
                                    </div>
                                </template>
                            </AutoComplete>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-3 flex">
                            <label for="startDate" class="font-semibold">DateFrom:</label>
                            <Calendar id="startDate" :showIcon="true" :showButtonBar="true" v-model="startDateSearch" class="filter-input" />
                        </div>

                        <div class="field col-12 md:col-6 lg:col-3 flex">
                            <label for="endDate" class="font-semibold mr-2">DateTo:</label>
                            <Calendar id="endDate" :showIcon="true" :showButtonBar="true" v-model="endDateSearch" class="filter-input" />
                        </div>
                        <div class="field col-12 md:col-6 lg:col-3 flex">
                            <label for="status" class="font-semibold">Status:</label>
                            <Dropdown v-model="searchTerm" :options="LeaveStatus" optionLabel="name" placeholder="Search by status" class="filter-input" required />
                        </div>
                    </div>
                </div>
            </template>

            <template #empty> No Leave Requests found. </template>
            <template #loading> Loading Leave Requests data. Please wait. </template>

            <Column :sortable="false" field="employee" header="Employee" style="min-width: 13rem">
                <template #body="{ data }"> {{ data.employee?.firstName }} {{ data.employee?.lastName }} </template>
            </Column>
            <Column :sortable="false" field="leaveTypeId" header="Leave Type" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.leaveType }}</template>
            </Column>
            <Column :sortable="false" field="startDate" header="Start Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.startDate }} </template>
            </Column>
            <Column :sortable="false" field="endDate" header="End Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.endDate }} </template>
            </Column>
            <Column :sortable="false" field="leaveStatus" header="Status" style="min-width: 9rem">
                <template #body="{ data }">
                    <span :class="getStatusColor(data.leaveStatus)">{{ data.leaveStatus }}</span>
                </template>
            </Column>

            <Column style="min-width: 19rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button v-if="data.leaveStatus === 'PENDING'" type="button" icon="pi pi-info-circle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" @click="approveRequest(data)" style="width: 5rem">
                            <span class="text-sm">Approve</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                            <span class="text-sm">Update</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteLeaveRequest(data)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>
.filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem; /* Add space between the filter elements */
}

.filter-input {
    min-width: 100%; /* Ensure inputs take full width on small screens */
    max-width: 100%; /* Prevent overflow */
    height: 35px;
}

.field label {
    line-height: 35px;
}

@media (min-width: 768px) {
    .filter-input {
        min-width: 150px; /* Adjust minimum width for medium screens and up */
    }
}

@media (min-width: 992px) {
    .filter-container {
        flex-wrap: nowrap;
    }
}
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
