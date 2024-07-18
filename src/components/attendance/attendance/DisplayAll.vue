<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, fetchDataWithPayload, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useRouter } from 'vue-router';
import { useAttendanceStore } from '@/piniaStore/attendanceData';
import { useAttendanceUtils } from './attendanceUtils';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';


const { confirmDelete } = useConfirmDialog();
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { getMonthlyAttendances, searchByDateRange, searchByEmployeeId } = useAttendanceUtils();
const router = useRouter();
const attendances = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const attandanceData = ref({});

const endDateSearch = ref('');
const startDateSearch = ref('');
const success = ref(false);
const deleting = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const searchTerm = ref('');
const employeeId = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);
const notes = ref('');
const timeIn = ref('');
const timeOut = ref('');
const attendanceToDelete = ref('');

const monthYearSearchDate = ref('');
const filterTerm = ref('');
const filterBy = ref('');

const attendanceStore = useAttendanceStore();
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const getAttendances = async () => {
    const url = `${baseURL}/attendance`;

    try {
        const { data } = await fetchData(url, loading);

        if (Array.isArray(data) && data.length > 0) {
            let allAttendances = await Promise.all(
                data.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId);

                    return {
                        ...element,
                        employee: employee,
                        hoursWorked: await getTimeWorked(employee?.id, element?.date)
                    };
                })
            );

            attendances.value = allAttendances;
            loading.value = false;
        } else {
            attendances.value = [];
            loading.value = false;
        }
    } catch (error) {
            attendances.value = [];

        console.error('Error fetching requests:', error);
        // Handle errors here
    }
};

const getDayOfWeek = (selectedDate) => {
    if (!selectedDate) return;

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(selectedDate);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
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

const getTimeWorked = async (employeeId, date) => {
    // const now = new Date();
    try {
        if (!employeeId) {
            console.log('Employee not selected');
            return;
        }
        const formData = {
            date: date
            // changeDateFormat(now)
        };
        let url = `${baseURL}/attendance/time-worked/${employeeId}`;

        const urlParams = new URLSearchParams(formData).toString();
        url += `?${urlParams}`;

        const { data } = await fetchDataWithPayload(url, false);
        return data;
    } catch (error) {
        console.log(error);
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
            lastName: data?.lastName,
            email: data?.emailAddress,
            phoneNumber: data?.phoneNumber
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
const clearAllFilters = () => {
    monthYearSearchDate.value = '';
    endDateSearch.value = '';
    startDateSearch.value = '';
    employeeId.value = '';
};
const clearFilter = () => {
    initFilters();
    clearAllFilters();
    filterBy.value = '';
    getAttendances();
};
const updateAttendance = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/attendance/update`;
        const formData = {
            date: attandanceData?.value?.date,
            notes: notes?.value?.notes || attandanceData?.value?.notes,
            timeIn: timeIn.value ? formatDate(timeIn.value) : attandanceData?.value?.timeIn,
            timeOut: timeOut.value ? formatDate(timeOut.value) : attandanceData?.value?.timeOut,
            id: attandanceData?.value?.id
        };
        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess();
            loading.value = false;
            await getAttendances();
        } else {
            showError(data?.message ? data?.message : data?.error);
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (attendance) => {
    attandanceData.value = attendance;
    notes.value = attendance?.notes;
    timeIn.value = attendance?.timeIn;
    timeOut.value = attendance?.timeOut;

    visible.value = true;
};


onMounted(async () => {
    await getAttendances();

    await getEmployees();
    // console.log( getStatusColor('PENDING'))
});
initFilters();
const filterOPtions = [
    { name: 'Date Range', code: 'Date Range' },
    { name: 'Employee', code: 'Employee' },
    { name: 'Monthly', code: 'Monthly' },
    { name: 'All', code: 'All' }
];
const getFilter = (filter) => {
    switch (filter) {
        case 'Date Range':
            return 'Date Range';
        case 'Employee':
            return 'Employee';
        case 'Monthly':
            return 'Monthly';
        case 'All':
            return 'All';

        default:
            return '';
    }
};
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

watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    // eslint-disable-next-line no-empty
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
    } else {
        await getAttendances();
    }
});
watch(employeeId, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && employeeId.value?.id?.length > 0) {
        await searchByEmployeeId(attendances, employeeId, loading);
    } else {
        await getAttendances();
    }
});
watch([startDateSearch, endDateSearch], async () => {
    await searchByDateRange(attendances, startDateSearch, endDateSearch, loading);
});

const searchEmployee = (event) => {
    if (!event.query.trim().length) {
        autoFilteredEmployees.value = [...employees.value];
    } else {
        autoFilteredEmployees.value = employees.value.filter((employee) => {
            const firstNameMatches = employee.firstName.toLowerCase().startsWith(event.query.toLowerCase());
            const lastNameMatches = employee.lastName.toLowerCase().includes(event.query.toLowerCase());
            return firstNameMatches || lastNameMatches;
        });
    }
};
const viewMore = (data) => {
    attendanceStore.setAttendanceData(data);
    console.log(data);
    router.push('/attendance/view');
};

watch(monthYearSearchDate, async () => {
    await getMonthlyAttendances(monthYearSearchDate, attendances, loading);
});

const deleteAttendance = async (data) => {
    const url = `${baseURL}/attendance/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getAttendances();
    });
    refresh();
};

const refresh = async () => {
    await getAttendances();
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Attendance" :style="{ width: '50rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="flex align-items-center gap-3 mb-3">
                <label for="timeIn">Time In</label>
                <Calendar id="calendar-12h" v-model="timeIn" showTime hourFormat="12" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="timeout">Time Out</label>
                <Calendar id="calendar-12h" v-model="timeOut" showTime hourFormat="12" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="notes">Notes (Optional)</label>
                <InputText id="notes" type="text" v-model="notes" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateAttendance"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="attendances" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
            <template #header>
                <div class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-7 flex align-center">
                        <label for="filter" class="font-semibold mr-5">Filter By:</label>

                        <Dropdown v-model="filterTerm" :options="filterOPtions" optionLabel="name" placeholder="Filter By" required />
                    </div>
                </div>
                <div v-if="filterBy" class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-12">
                        <Button type="button" icon="pi pi-filter-slash" class="ml-4 mb-2" label="Clear" outlined @click="clearFilter()" style="float: right; width: 100px" />
                    </div>
                </div>
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow">
                        <div v-if="filterBy === 'Date Range' || filterBy === 'All'" class="field col-12 md:col-3 mr-0" style="min-width: 200px">
                            <label for="startDate" class="font-semibold mr-2">From:</label>
                            <Calendar id="startDate" :showIcon="true" :showButtonBar="true" v-model="startDateSearch" />
                        </div>
                        <div v-if="filterBy === 'Date Range' || filterBy === 'All'" class="field col-12 md:col-3" style="min-width: 200px">
                            <label for="endDate" class="font-semibold mr-2">To:</label>
                            <Calendar id="endDate" :showIcon="true" :showButtonBar="true" v-model="endDateSearch" />
                        </div>
                        <div v-if="filterBy === 'Monthly' || filterBy === 'All'" class="field col-12 md:col-3" style="min-width: 200px">
                            <label for="endDate" class="font-semibold mr-2">Monthly:</label>

                            <Calendar id="endDate" :showIcon="true" :showButtonBar="true" v-model="monthYearSearchDate" view="month" dateFormat="mm/yy" />
                        </div>
                        <div v-if="filterBy === 'Employee' || filterBy === 'All'" class="field col-12 md:col-3">
                            <label for="endDate" class="font-semibold mr-2">Employee:</label>
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
                                style="min-width: 200px"
                            >
                                <template #option="slotProps">
                                    <div class="flex align-options-center">
                                        <div>{{ slotProps?.option?.firstName }}</div>
                                        <div>&nbsp;</div>
                                        <!-- Space character -->
                                        <div>{{ slotProps?.option?.lastName }}</div>
                                    </div>
                                </template>
                            </AutoComplete>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty> No Attendances found. </template>
            <template #loading> Loading Attendances data. Please wait. </template>

            <Column :sortable="true" field="employee" header="Employee" style="min-width: 14rem">
                <template #body="{ data }"> {{ data.employee?.firstName }} {{ data.employee?.lastName }} </template>
            </Column>
            <Column :sortable="true" field="date" header="Date" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button type="button" icon="pi pi-trash" class="text-black font-bold py-1 px-2 rounded" style="width: 3rem; margin-right: 5px; background-color: lightgrey; color: black; font-size: 12px">
                            {{ getDayOfWeek(data?.date) }}
                        </Button>
                        <span class="py-1 px-2"> {{ data?.date }}</span>
                    </div>
                </template>
            </Column>
            <Column :sortable="false" field="hoursWorked" header="Hours" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.hoursWorked }} </template>
            </Column>
            <!-- <Column :sortable="false" field="timeIn" header="Time In" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.timeIn }} </template>
            </Column>
            <Column :sortable="false" field="timeOut" header="Time Out" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.timeOut }} </template>
            </Column> -->

            <Column style="min-width: 15rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button type="button" icon="pi pi-trash" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" @click="viewMore(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                            <span class="text-sm">More</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                            <span class="text-sm">Update</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteAttendance(data)" style="width: 5rem">
                            <span v-if="attendanceToDelete?.id !== data?.id && !deleting" class="text-sm">Delete</span><i v-if="attendanceToDelete?.id === data?.id && deleting" class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>
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
