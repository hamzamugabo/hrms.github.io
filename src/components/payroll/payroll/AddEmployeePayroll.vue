<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import AddPayroll from './CreatePayroll.vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { utils } from './payrollUtils.js';

const props = defineProps({
    employees: {
        type: Array,
        required: true
    },
    employeeSearch: {
        type: String,
        default: ''
    },
 
});
const payrollSummary = ref({});
const { getPayrollSummary } = utils();

onMounted(async () => {
    await getPayrollSummary(payrollSummary, false);
});
const serverError = ref('');
const success = ref(false);
const successMessage = ref('');
const loading = ref(false);
const visible = ref(false);

const payrollData = ref({});
const employeeData = ref({});

const submitForm = async () => {
    loading.value = true;
    const url = `${baseURL}/payrolls/create`;

    if (!payrollData?.value?.salaryId) {
        serverError.value = "Add Employee's salary first";
        loading.value = false;

        return;
    }

    try {
        const payload = {
            ...payrollData.value
        };

        const data = await postData(url, payload);
        if (data?.status === 200 || data?.status === 201) {
            success.value = true;
            successMessage.value = data?.message;

            loading.value = false;
        } else {
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        serverError.value = error?.message || error?.message;

        loading.value = false;
        console.log(error?.error);
    }
};

const emit = defineEmits(['update:employeeSearch']);

const localEmployeeSearch = ref(props?.employeeSearch);

const filteredEmployees = computed(() => {
    return localEmployeeSearch.value.trim() === '' ? props?.employees : props?.employees.filter((employee) => employee.name.toLowerCase().includes(localEmployeeSearch.value.toLowerCase()));
});

const onSearchInput = () => {
    emit('update:employeeSearch', localEmployeeSearch.value);
};

const createPayroll = (employee) => {
    console.log(`Creating payroll for ${employee}`);

    employeeData.value = employee;
    visible.value = true;
};

watch(
    () => props.employeeSearch,
    (newValue) => {
        localEmployeeSearch.value = newValue;
    }
);
const handleCreateEmployeePayroll = (data) => {
    payrollData.value = data;
};
</script>

<template>
    <Dialog v-model:visible="visible" header="Create Payroll" :style="{ width: '50rem' }">
        <Message v-if="success" severity="success">{{ successMessage }}</Message>

        <Message v-if="serverError" severity="error">{{ serverError }}</Message>

        <AddPayroll @handleCreateEmployeePayroll="handleCreateEmployeePayroll" :employee="employeeData" />

        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button v-if="!loading" type="button" label="Submit" @click="submitForm()"></Button>

            <SpinnerVue :loading="loading" size="3rem" />
        </div>
    </Dialog>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h6>Payroll summary</h6>

            <div class="flex justify-around">
                <div class="flex justify-center items-center div-button mr-1">
                    <span class="text-xs font-bold mr-1 text-red-500">{{ payrollSummary?.totalAmountPaid }}</span>
                    <span class="text-xs text-red-500">Total Amount</span>
                </div>

                <div class="flex justify-center items-center div-button mr-1">
                    <span class="text-xs font-bold mr-1 text-green-500">{{ payrollSummary?.numberOfPayrolls }}</span>
                    <span class="text-xs text-green-500">Payrolls</span>
                </div>
                <div class="flex justify-center items-center div-button">
                    <span class="text-xs font-bold mr-1 text-blue-500">{{ payrollSummary?.averagePayrollAmount }}</span>
                    <span class="text-xs text-blue-500">Average Amount</span>
                </div>
            </div>
            <h5>Add Employee Payroll</h5>
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center space-x-2">
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="localEmployeeSearch" placeholder="Keyword Search" @input="onSearchInput" />
                    </IconField>
                </div>
            </div>
            <div class="overflow-y-auto" style="max-height: 200px">
                <ul class="list-none p-0">
                    <li v-for="employee in filteredEmployees" :key="employee.id" class="flex justify-between items-center border-b py-2">
                        <div class="flex-1">
                            <span class="block">{{ employee.name }}</span>
                        </div>
                        <Button :label="employee.payroll.length > 0 ? 'Add Payroll' : 'Create Payroll'" class="p-button-sm p-button-primary ml-2" @click="createPayroll(employee)" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.div-button {
    background-color: #e2e8f0; /* Tailwind gray-200 */
    border-radius: 0.5rem; /* Tailwind rounded-lg */
    padding: 1rem; /* Tailwind p-4 */
    cursor: pointer;
    transition: background-color 0.3s; /* Tailwind transition duration-300 */
}

.div-button:hover {
    background-color: #cbd5e0; /* Tailwind gray-300 */
}
/* Add your styles here */
</style>
