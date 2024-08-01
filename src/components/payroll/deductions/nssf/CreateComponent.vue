<script setup>
import { ref, watch, onMounted } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { DeductionType } from '@/components/reuseables/enums';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { utils } from '@/components/payroll/allowances/allowanceUtils.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError } = useToastPopup();
const emit = defineEmits(['handleNssf']);
const props = defineProps(['employee', 'salary', 'start', 'end', 'fee', 'type', 'deduction', 'nssf']);


const startDate = ref(props?.start || '');
const endDate = ref(props?.end || '');
const amount = ref(parseInt(props?.fee) || 0);
const employeeId = ref('');
const salaryId = ref('');
const salaryAmount = ref('');
const nssfNumber = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);
const deductionType = ref({ name: props?.type || '', code: '' });
const { getEmployees } = utils();

onMounted(async () => {
    await getEmployees(employees, false);
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

const getEmployeeSalary = async (id) => {
    const url = `${baseURL}/salary/by-employee/${id}`;

    try {
        const { data } = await fetchData(url, false);
     
        if (!data) {
            showError('No salary attached to the Employee');
            return;
        }
        salaryId.value = data?.id;
        salaryAmount.value = data?.basicSalary;
    } catch (error) {
        showError('No salary attached to the Employee');

        console.log('employees error', error);
    }
};

const minEndDate = ref(getEndMinDate(startDate.value));

function getEndMinDate(date) {
    const today = new Date(date);
    today.setDate(today.getDate());
    return today;
}

const submitForm = () => {
    const payload = {
        deductionType: deductionType?.value.name,
        amount: parseInt(amount?.value),
        endDate: changeDateFormat(endDate?.value),
        startDate: changeDateFormat(startDate?.value),
        employeeId: employeeId?.value?.id,
        salaryId: salaryId?.value,
        nssfNumber: nssfNumber?.value
    };

    emit('handleNssf', payload);
};

watch([amount, endDate, startDate, employeeId, deductionType], () => {
    submitForm();
    minEndDate.value = getEndMinDate(startDate.value);
    if (employeeId?.value?.id) {
        getEmployeeSalary(employeeId.value.id);
    }
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div v-if="!deduction" class="field col-12 md:col-12">
            <label for="employee">Select Employee</label>
            <AutoComplete placeholder="Search employee" id="employee" optionLabel="lastName" :dropdown="true" :multiple="false" v-model="employeeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee" field="firstName">
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <div>{{ slotProps?.option?.firstName }}</div>
                        <div>&nbsp;</div>
                        <div>{{ slotProps?.option?.lastName }}</div>
                    </div>
                </template>
            </AutoComplete>
        </div>
        <div class="field col-12 md:col-12">
            <label for="deductionType">Deduction Type</label>
            <Dropdown id="deductionType" v-model="deductionType" :options="DeductionType" optionLabel="name" placeholder="Select deduction type"></Dropdown>
        </div>

        <div class="field col-12 md:col-12">
            <label for="amount">Amount</label>
            <InputNumber v-model="amount" inputId="integeronly" />
        </div>
        <div class="field col-12 md:col-12">
            <label for="nssf">NSSF Number</label>
            <InputText required id="nssf" type="text" v-model="nssfNumber" />
        </div>

        <div class="field col-12 md:col-12">
            <label for="startDate">Start Date</label>
            <Calendar id="startDate" v-model="startDate" />
        </div>
        <div class="field col-12 md:col-12">
            <label for="endDate">End Date</label>
            <Calendar :minDate="minEndDate" id="endDate" v-model="endDate" />
        </div>
    </div>
</template>
