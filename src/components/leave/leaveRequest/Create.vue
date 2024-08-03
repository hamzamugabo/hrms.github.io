<script setup>
import { ref, onMounted, watch } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { fetchData } from '@/components/reuseables/FetchPostData';

const baseURL = import.meta.env.VITE_APP_API_URL;
const emit = defineEmits(['getSubmitFormData']);
const startDate = ref('');
const endDate = ref('');
const description = ref('');
const selectedAutoValue = ref('');
const autoFilteredValue = ref([]);
const autoFilteredValueLeave = ref([]);
const loading = ref(false);
const employees = ref([]);
const leaveTypes = ref([]);
const leaveTypeId = ref({});

const maxDurationInDays = ref(0);
const serverError = ref('');
const success = ref(false);
const dateError = ref('');
const annualLeaveBalanceDays = ref(0);

const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}
const minEndDate = ref(getEndMinDate());
function getEndMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}
const maxDate = ref(new Date());
function getMaxDate(start, days) {
    const today = new Date(start);
    today.setDate(today.getDate() + days);
    return today;
}
watch([startDate], () => {
    minEndDate.value = new Date(startDate.value);
    maxDate.value = getMaxDate(startDate.value, leaveTypeId.value?.maxDurationInDays || 0);
});
watch([leaveTypeId, maxDurationInDays], () => {
    maxDurationInDays.value = leaveTypeId.value?.maxDurationInDays || 0;
});


const changeCurrentDateFormat = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getEmployees = async (genderFilter) => {
    const url = `${baseURL}/employees`;
    try {
        loading.value = true;
        const { data } = await fetchData(url, loading);
        if (genderFilter) {
            // Filter employees based on gender
            employees.value = data.filter((employee) => employee.gender === genderFilter);
        } else {
            // Set all employees
            employees.value = data;
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
    } finally {
        loading.value = false;
    }
};

const getAllLeaveTypes = async () => {
    const url = `${baseURL}/leave/type`;
    try {
        loading.value = true;
        const { data } = await fetchData(url, loading);

        leaveTypes.value = data;
    } catch (error) {
        console.error('Error fetching leave types:', error);
    } finally {
        loading.value = false;
    }
};

const getAnnualLeaveBalance = async (employeeId) => {
    const url = `${baseURL}/leave/request/annualLeaveBalance/${employeeId}`;
    try {
        loading.value = true;
        const { data } = await fetchData(url, loading);
        annualLeaveBalanceDays.value = data;
    } catch (error) {
        console.error('Error fetching annual leave balance:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await getEmployees();
    await getAllLeaveTypes();
});

watch(selectedAutoValue, async () => {
    await getAnnualLeaveBalance(selectedAutoValue.value.id);
});

const searchEmployee = (event) => {
    const query = event.query.toLowerCase().trim();
    autoFilteredValue.value = query ? employees.value.filter((employee) => employee.firstName.toLowerCase().startsWith(query) || employee.lastName.toLowerCase().includes(query)) : [...employees.value];
};

const searchLeaveType = (event) => {
    const query = event.query.toLowerCase().trim();
    autoFilteredValueLeave.value = query ? leaveTypes.value.filter((leaveType) => leaveType.name.toLowerCase().startsWith(query) || leaveType.maxDurationInDays.toString().includes(query)) : [...leaveTypes.value];
};

const handleSubmitForm = async () => {
    const leveRequestData = {
        date: changeCurrentDateFormat(new Date()),
        employeeId: selectedAutoValue.value.id,
        endDate: changeDateFormat(endDate.value),
        leaveStatus: 'PENDING',
        startDate: changeDateFormat(startDate.value),
        description: description.value,
        leaveTypeId: leaveTypeId.value.id
    };
    emit('getSubmitFormData', leveRequestData);
};

watch([selectedAutoValue, startDate, description, leaveTypeId, endDate], () => {
    handleSubmitForm();
});
watch(leaveTypeId, async () => {
    const leaveTypeName = leaveTypeId.value?.name || '';

    // Check if the leave type is "Paternity leave"
    if (leaveTypeName.includes('Paternity')) {
        // Fetch and filter employees
        await getEmployees('MALE');
    } else if (leaveTypeName.includes('Maternity')) {
        await getEmployees('FEMALE');
    } else {
        // Fetch all employees
        await getEmployees();
    }
});
</script>

<template>
    <Toast />

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Message v-if="success" severity="success">Leave Request Created Successfully</Message>
                <Message v-if="serverError" severity="error">{{ serverError }}</Message>

                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="leaveType">Select Leave Type</label>
                        <AutoComplete placeholder="Search" optionLabel="maxDurationInDays" id="leaveType" :dropdown="true" :multiple="false" v-model="leaveTypeId" :suggestions="autoFilteredValueLeave" @complete="searchLeaveType" field="name">
                            <template #option="slotProps">
                                <div class="flex align-options-center">
                                    <div>{{ slotProps.option.name }}</div>
                                    <div>&nbsp;</div>
                                    <div>
                                        <strong> {{ slotProps.option.maxDurationInDays }} days</strong>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="employee">Employee</label>
                        <AutoComplete placeholder="Search" optionLabel="lastName" id="employee" :dropdown="true" :multiple="false" v-model="selectedAutoValue" :suggestions="autoFilteredValue" @complete="searchEmployee" field="firstName">
                            <template #option="slotProps">
                                <div class="flex align-options-center">
                                    <div>{{ slotProps.option.firstName }}</div>
                                    <div>&nbsp;</div>
                                    <div>{{ slotProps.option.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="startDate">Start Date</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate" :minDate="minDate"></Calendar>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="endDate">End Date</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate" :minDate="minEndDate" :maxDate="maxDate"></Calendar>
                        <small v-if="dateError" class="p-error">{{ dateError }}</small>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="description">Description</label>
                        <Textarea v-model="description" rows="3" cols="30" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.form-content {
    width: 100%;
    max-width: 600px;
    padding: 20px;
}
</style>
