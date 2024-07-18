<script setup>
import { ref, watch, onMounted } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { DeductionType } from '@/components/reuseables/enums';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { utils } from '@/components/payroll/allowances/allowanceUtils.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError } = useToastPopup();
const emit = defineEmits(['handleDeduction', 'handleUpdate']);
const props = defineProps(['employee', 'salary', 'start', 'end', 'fee', 'type', 'deduction', 'nssf', 'tin']);

const startDate = ref('');
const endDate = ref('');
const amount = ref(0);
const tinNumber = ref('');
const nssfNumber = ref('');
const employeeId = ref('');
const salaryId = ref('');
const salaryAmount = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);
const deductionType = ref({ name: '', code: '' });

onMounted(async () => {
    startDate.value = props.start || '';
    endDate.value = props.end || '';
    amount.value = parseInt(props.fee) || 0;
    deductionType.value = { name: props.type || '', code: props.type || '' };

    if (deductionType.value.name === 'PAYE') {
        tinNumber.value = props.tin || '';
    } else if (deductionType.value.name === 'NSSF') {
        nssfNumber.value = props.nssf || '';
    }

    if (props.employee) {
        employeeId.value = props.employee;
    }
    if (props.salary) {
        salaryId.value = props.salary;
    }

    await getEmployees(employees, false);
});

const { getEmployees } = utils();
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
    const commonValues = {
        deductionType: deductionType?.value?.name,
        amount: parseInt(amount?.value),
        endDate: changeDateFormat(endDate?.value),
        startDate: changeDateFormat(startDate?.value),
        employeeId: employeeId?.value?.id,
        salaryId: salaryId?.value
    };

    let payload = { ...commonValues };

    if (deductionType?.value?.name === 'PAYE') {
        payload.tinNumber = tinNumber?.value;
    } else if (deductionType?.value?.name === 'NSSF') {
        payload.nssfNumber = nssfNumber?.value;
    }

    emit('handleDeduction', payload);
};

// const updateDeduction = () => {
//     const commonValues = {
//         deductionType: deductionType?.value?.name,
//         amount: parseInt(amount?.value),
//         endDate: changeDateFormat(endDate?.value),
//         startDate: changeDateFormat(startDate?.value),
//         id: props?.id,
//         salaryId: salaryId?.value
//     };

//     let payload = { ...commonValues };

//     if (deductionType?.value?.name === 'PAYE') {
//         payload.tinNumber = tinNumber?.value;
//     } else if (deductionType?.value?.name === 'NSSF') {
//         payload.nssfNumber = nssfNumber?.value;
//     }

//     emit('handleDeduction', payload);
// };
watch(deductionType, (newType) => {
    if (newType.name === 'PAYE') {
        nssfNumber.value = '';  // Clear NSSF number if PAYE is selected
    } else if (newType.name === 'NSSF') {
        tinNumber.value = '';   // Clear TIN number if NSSF is selected
    }
});

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
        <div v-if="deductionType?.name === 'PAYE' || type === 'PAYE'" class="field col-12 md:col-12">
            <label for="tin">TIN Number</label>
            <InputText required id="tin" type="text" v-model="tinNumber" />
        </div>
        <div v-if="deductionType?.name === 'NSSF' || type === 'NSSF'" class="field col-12 md:col-12">
            <label for="nssf">NSSF Number</label>
            <InputText required id="nssf" type="text" v-model="nssfNumber" />
        </div>
        <div class="field col-12 md:col-12">
            <label for="amount">Amount</label>
            <InputNumber v-model="amount" inputId="integeronly" />
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
