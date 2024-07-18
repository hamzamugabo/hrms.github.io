<script setup>
import { ref, watch, onMounted } from 'vue';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { PaymentFrequencyType as Frequency } from '@/components/reuseables/enums';

const emit = defineEmits(['handleAddSalary']);
// const props = defineProps(['employeeId']);

const paymentFrequency = ref('');
const basicSalary = ref(0);
const loading = ref(false);

const employeeId = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);

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
onMounted(async () => {
    await getEmployees();
    // console.log( getStatusColor('PENDING'))
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
const submitForm = () => {
    const formData = {
        basicSalary: basicSalary?.value,
        employeeId: employeeId?.value?.id,
        paymentFrequencyType: paymentFrequency?.value?.name
    };

    emit('handleAddSalary', formData);
};
watch([basicSalary, paymentFrequency, employeeId], () => {
    submitForm();
});
</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-12">
            <label for="paymentFrequency">Select Employee </label>
            <AutoComplete placeholder="Search employee" id="employee" optionLabel="lastName" :dropdown="true" :multiple="false" v-model="employeeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee($event)" field="firstName">
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
        <div class="field col-12 md:col-12">
            <label for="paymentFrequency">Payment Frequency</label>
            <Dropdown id="paymentFrequency" v-model="paymentFrequency" :options="Frequency" optionLabel="name" placeholder="Select paymentFrequency"></Dropdown>

            <!-- <InputText id="paymentFrequency" type="text" v-model="paymentFrequency" /> -->
        </div>
        <!-- <div class="field col-12 md:col-12">
            <label for="basicSalary">Basic Salary</label>
            <InputNumber v-model="basicSalary" inputId="integeronly" />
        </div> -->
    </div>
</template>
