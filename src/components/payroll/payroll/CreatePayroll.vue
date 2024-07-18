<script setup>
import { ref, watch, onMounted } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { PaymentMethod as method } from '@/components/reuseables/enums';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';

const emit = defineEmits(['handleCreateEmployeePayroll']);
const props = defineProps(['employee', 'salary', 'start', 'end', 'fee', 'type', 'allowance', 'update', 'payDate']);

const startDate = ref(props?.start || '');
const paymentDate = ref(props?.payDate || '');
const endDate = ref(props?.end || '');
const paymentMethod = ref(props?.type || '');
const amount = ref(parseInt(props?.fee) || 0);
const employeeId = ref('');
const salaryId = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);


const getEmployees = async () => {
    const url = `${baseURL}/employees`;
    try {
        const { data } = await fetchData(url, false);
        employees.value = data;
    } catch (error) {
        console.log('employees error', error);
    }
};

onMounted(async () => {
    await getEmployees();
    if (props?.employee?.id) {
        getEmployeeSalary(props.employee.id);
    }
});

const getEmployeeSalary = async (id) => {
    const url = `${baseURL}/salary/by-employee/${id}`;
    try {
        const { data } = await fetchData(url, false);
        salaryId.value = data?.id;
        amount.value = data?.basicSalary;
    } catch (error) {
        console.log('employees error', error);
    }
};

const minEndDate = ref(getEndMinDate(startDate.value));
const maxEndDate = ref(getMaxEndDate(startDate.value));
const startMaxDate = ref(new Date());

function getEndMinDate(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Ensure end date is at least one day after start date
    return newDate;
}

function getMaxEndDate(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 30); // Set the max end date to 30 days after the start date
    return newDate;
}

const updateEndDateConstraints = () => {
    minEndDate.value = getEndMinDate(startDate.value);
    maxEndDate.value = getMaxEndDate(startDate.value);
};

const submitForm = () => {
    // const payDate = new Date();
    const formData = {
        employeeId: props?.employee?.id || employeeId?.value?.id,
        payPeriodEndDate: changeDateFormat(endDate.value),
        payPeriodStartDate: changeDateFormat(startDate.value),
        paymentDate: changeDateFormat(paymentDate.value),
        paymentMethod: paymentMethod.value?.name,
        salaryId: salaryId.value,
        // totalAmountPaid: parseInt(amount.value)
    };
    // console.log('formdata', formData)
    emit('handleCreateEmployeePayroll', formData);
};

watch([amount, endDate, startDate, employeeId, paymentMethod, paymentDate, () => props?.employee], () => {
    submitForm();
    updateEndDateConstraints();
    if (props?.employee?.id || employeeId.value) {
        getEmployeeSalary(props?.employee?.id || employeeId?.value?.id);
    }
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
</script>

<template>
    <div class="p-fluid formgrid grid">
         <div v-if="update !== 'update'" class="field col-12 md:col-12">
            <label for="employee">Select Employee </label>
            <AutoComplete placeholder="Search employee" id="employee" optionLabel="lastName" :dropdown="true" :multiple="false" v-model="employeeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee($event)" field="firstName">
                <template #option="slotProps">
                    <div class="flex align-options-center">
                        <div>{{ slotProps?.option?.firstName }}</div>
                        <div>&nbsp;</div>

                        <div>{{ slotProps?.option?.lastName }}</div>
                    </div>
                </template>
            </AutoComplete>
        </div>
        <div class="field col-12 md:col-12">
            <label for="paymentMethod">Payment method</label>
            <Dropdown id="paymentMethod" v-model="paymentMethod" :options="method" optionLabel="name" placeholder="Select paymentMethod"></Dropdown>
        </div>

        <!-- <div class="field col-12 md:col-12">
            <label for="salary">Amount </label>
            <InputNumber disabled v-model="amount" inputId="integeronly" />
        </div> -->
<div class="field col-12 md:col-12">
            <label for="startDate">Payment Date</label>
            <Calendar :maxDate="startMaxDate" id="calendar-12h" v-model="paymentDate"  />
        </div>

        <div class="field col-12 md:col-12">
            <label for="startDate">Start Date</label>
            <Calendar :maxDate="startMaxDate" id="calendar-12h" v-model="startDate" @change="updateEndDateConstraints" />
        </div>

        <div class="field col-12 md:col-12">
            <label for="endDate">End Date</label>
            <Calendar :minDate="minEndDate"  id="calendar-12h" v-model="endDate" />
        </div>
    </div>
</template>
