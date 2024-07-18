<script setup>
import { ref, watch, onMounted } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { AllowanceType, TransferType, TravelOutsideAllowanceSubType } from '@/components/reuseables/enums';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { utils } from './allowanceUtils.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError } = useToastPopup();
const emit = defineEmits(['handleAddAllowance']);
const props = defineProps(['employee', 'salary', 'start', 'end', 'fee', 'type', 'allowance', 'days']);
console.log('allowance data', props?.allowance);
const startDate = ref(props?.start || '');
const endDate = ref(props?.end || '');
const allowanceType = ref({ name: props?.type || '', code: props?.type || '' });
const amount = ref(parseInt(props?.fee) || 0);
const employeeId = ref('');
const salaryId = ref('');
const salaryAmount = ref('');
const employees = ref([]);
const transferType = ref({ name: props.allowance?.transferType || '', code: props.allowance?.transferType || '' });
const allowanceSubType = ref({ name: props.allowance?.allowanceSubType || '', code: props.allowance?.allowanceSubType || '' });
const showAmountInputField = ref(false);
const autoFilteredEmployees = ref([]);
const workingDays = ref(props?.days || 0);
const gazettedDays = ref([]);
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
        console.log('employee salary', data);
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
const minGazettedDates = ref(getEndMinDate(startDate.value));
const maxGazettedDates = ref(getEndMinDate(endDate.value));

function getEndMinDate(date) {
    const today = new Date(date);
    return today;
}

const allowancesWhichAcceptAmountInput = [
    { name: 'HARDSHIP', code: 'HARDSHIP' },
    { name: 'VEHICLE_FUEL', code: 'VEHICLE_FUEL' },
    { name: 'MILEAGE', code: 'MILEAGE' },
    { name: 'SPECIAL_DUTY', code: 'SPECIAL_DUTY' }
];

const submitForm = () => {
    let commonData = {};
    if (props?.allowance?.employee) {
        commonData = {
            allowanceType: allowanceType?.value?.name,
            amount: parseInt(amount?.value),
            endDate: changeDateFormat(endDate?.value),
            startDate: changeDateFormat(startDate?.value),
            employeeId: props?.employee
            // salaryId: salaryId?.value
        };
    } else {
        commonData = {
            allowanceType: allowanceType?.value?.name,
            amount: parseInt(amount?.value),
            endDate: changeDateFormat(endDate?.value),
            startDate: changeDateFormat(startDate?.value),
            employeeId: employeeId?.value?.id,
            salaryId: salaryId?.value
        };
    }

    let formData = {};

    if (allowanceType?.value?.name === 'OVERTIME') {
        const changeGazettedDaysFormat = gazettedDays?.value?.map((date) => {
            return changeDateFormat(date);
        });

        formData = {
            ...commonData,
            gazettedDays: changeGazettedDaysFormat,
            workingDays: workingDays?.value
        };
        delete formData.amount;
    } else if (allowanceType?.value?.name === 'TRANSFER') {
        formData = {
            ...commonData,
            transferType: transferType?.value?.name
        };
    } else if (allowanceType?.value?.name === 'TRAVEL_OUTSIDE') {
        formData = {
            ...commonData,
            allowanceSubType: allowanceSubType?.value?.name
        };
    } else {
        formData = {
            ...commonData
        };
    }

    if (props?.allowance) {
        formData = { ...formData, id: props.allowance.id };
    }
    // console.log('formData',formData)
    emit('handleAddAllowance', formData);
};

watch([amount, endDate, startDate, employeeId, allowanceType, workingDays, gazettedDays, allowanceType, allowanceSubType], () => {
    if (allowancesWhichAcceptAmountInput.some((a) => a.name === allowanceType.value.name)) {
        showAmountInputField.value = true;
    } else {
        showAmountInputField.value = false;
    }
    submitForm();
    minEndDate.value = getEndMinDate(startDate.value);
    minGazettedDates.value = new Date(startDate.value);
    maxGazettedDates.value = new Date(endDate.value);

    if (employeeId?.value?.id) {
        console.log('employee id', employeeId?.value?.id);
        getEmployeeSalary(employeeId.value.id);
    }
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div v-if="!allowance" class="field col-12 md:col-12">
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
            <label for="allowanceType">Allowance Type</label>
            <Dropdown id="allowanceType" v-model="allowanceType" :options="AllowanceType" optionLabel="name" placeholder="Select allowance type"></Dropdown>
        </div>
        <div class="field col-12 md:col-12" v-if="allowanceType.name === 'TRANSFER'">
            <label for="transferType">Transfer Type</label>
            <Dropdown id="transferType" v-model="transferType" :options="TransferType" optionLabel="name" placeholder="Select transfer type"></Dropdown>
        </div>
        <div class="field col-12 md:col-12" v-if="allowanceType.name === 'TRAVEL_OUTSIDE'">
            <label for="allowanceSubType">Allowance Subtype</label>
            <Dropdown id="allowanceSubType" v-model="allowanceSubType" :options="TravelOutsideAllowanceSubType" optionLabel="name" placeholder="Select allowance subtype"></Dropdown>
        </div>
        <div class="field col-12 md:col-12" v-if="showAmountInputField">
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
        <div class="field col-12 md:col-12" v-if="allowanceType.name === 'OVERTIME'">
            <label for="gazettedDays">Gazetted Days</label>
            <Calendar v-model="gazettedDays" :minDate="minGazettedDates" :maxDate="maxGazettedDates" selectionMode="multiple" :manualInput="false" />
        </div>
        <div class="field col-12 md:col-12" v-if="allowanceType.name === 'OVERTIME'">
            <label for="workingDays">Working Days</label>
            <InputNumber v-model="workingDays" inputId="integeronly" />
        </div>
    </div>
</template>
