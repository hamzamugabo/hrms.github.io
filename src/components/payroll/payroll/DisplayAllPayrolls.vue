<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
// import changeDateFormat from '@/components/reuseables/changeDateFormat';
import UpdatePayroll from './CreatePayroll.vue';
import { utils } from './payrollUtils.js';
import CreatePayroll from '@/components/payroll/payroll/CreatePayroll.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

// import loadFromLocalStorage from '@/components/reuseables/getUser';

const { getAllPayrolls, getEmployees, searchByEmployeeId, searchByDateRange } = utils();
const payrolls = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const allowanceData = ref('');
const paymentFrequency = ref('');
const basicSalary = ref(0);
const endDateSearch = ref('');
const startDateSearch = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const searchTerm = ref('');
const employeeId = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);
const allowanceDataToUpdate = ref({});
const employeePayroll = ref([]);

const minEndDate = ref(getEndMinDate(new Date()));
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        leaveStatus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
    getAllPayrolls(payrolls, loading);
};
const updatePayroll = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/payrolls/update`;
        const formData = {
            ...allowanceDataToUpdate.value,
            id: allowanceData?.value?.id
        };
        // console.log('allowance to update', formData)
        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess();
            allowanceDataToUpdate.value = {};
            loading.value = false;
            await getAllPayrolls(payrolls, loading);
        } else {
            showError();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError();

        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (allowance) => {
    // console.log('allowance', allowance);
    allowanceData.value = allowance;
    paymentFrequency.value = allowance?.paymentFrequency;
    basicSalary.value = allowance?.basicSalary;
addModalVisibility.value = false
    visible.value = true;
};

onMounted(async () => {
    await getAllPayrolls(payrolls, loading);

    await getEmployees(employees, false);
    // console.log( getStatusColor('PENDING'))
});
initFilters();

watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    // eslint-disable-next-line no-empty
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
    } else {
        await getAllPayrolls(payrolls, loading);
    }
});
watch(employeeId, async (newVal, oldVal) => {
    // console.log('employeeId', employeeId.value)
    if (newVal !== oldVal && employeeId.value?.id?.length > 0) {
        await searchByEmployeeId(payrolls, employeeId?.value?.id, false, employeePayroll);
    } else {
        await getAllPayrolls(payrolls, loading);
    }
});
watch([startDateSearch, endDateSearch], async () => {
    minEndDate.value = getEndMinDate(startDateSearch.value);
    if (startDateSearch.value && endDateSearch.value) {
        await searchByDateRange(payrolls, startDateSearch, endDateSearch, loading);
    }
});

const handleAddAllowance = (data) => {
    console.log('allowance data', data);
    allowanceDataToUpdate.value = data;
};
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

function getEndMinDate(date) {
    const today = new Date(date);
    return today; // No need to setDate since we're not changing the date
}
const deletePayroll = async (data) => {
    const url = `${baseURL}/payrolls/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getAllPayrolls(payrolls, loading);
    });
};
const addModalVisibility = ref(false);
const add = () => {
    visible.value = false;

    addModalVisibility.value = true;
};
const serverError = ref('');
const loaddingAdd = ref(false);
const submitForm = async () => {
    serverError.value = '';
    loaddingAdd.value = true;
    const url = `${baseURL}/payrolls/create`;

    try {
        const payload = {
            ...payrollData.value
        };
        console.log('submit', payload);
        const data = await postData(url, payload);
        if (data?.status === 200 || data?.status === 201) {
            // success.value = true;
            // showSuccess();
            successMessage.value = data?.message;

            loaddingAdd.value = false;
            showSuccess(data?.message);
            payrollData.value = {};
              await getAllPayrolls(payrolls, loading);
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            loaddingAdd.value = false;
        }
    } catch (error) {
        showError();

        serverError.value = error?.message || error?.message;

        loaddingAdd.value = false;
        console.log(error?.error);
    }
};
const payrollData = ref({});
const handleCreateEmployeePayroll = (data) => {
    payrollData.value = data;
};
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Payroll" :style="{ width: '30rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <UpdatePayroll
                @handleAddAllowance="handleAddAllowance"
                :employee="allowanceData?.employeeId"
                :salary="allowanceData?.salaryId"
                :start="allowanceData?.startDate"
                :end="allowanceData?.endDate"
                :fee="allowanceData?.amount"
                :type="allowanceData?.allowanceType"
                :allowance="allowanceData"
                :update="'update'"
                :payDate="allowanceData?.paymentDate"
            />

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updatePayroll"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="addModalVisibility" header="Create Payroll" :style="{ width: '30rem' }">
            <CreatePayroll @handleCreateEmployeePayroll="handleCreateEmployeePayroll" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loaddingAdd" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="loaddingAdd" size="3rem" />
            </div>
        </Dialog>
    </div>

    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Payroll'" @handleAdd="add" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="payrolls" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
            <template #header>
                <div class="p-fluid formgrid grid flex-grow">
                    <div class="field col-12 md:col-12">
                        <Button type="button" icon="pi pi-filter-slash" class="ml-4 mb-2" label="Clear" outlined @click="clearFilter()" style="float: right; width: 100px" />
                    </div>
                </div>
                <div class="flex justify-end items-center">
                    <div class="p-fluid formgrid grid flex-grow justify-end">
                        <div class="field col-12 md:col-4 mr-0 max-w-xs" style="min-width: 200px">
                            <label for="startDate" class="font-semibold mr-2">From:</label>
                            <Calendar id="startDate" :showIcon="true" :showButtonBar="true" v-model="startDateSearch" />
                        </div>
                        <div class="field col-12 md:col-4 max-w-xs" style="min-width: 200px">
                            <label for="endDate" class="font-semibold mr-2">To:</label>
                            <Calendar id="endDate" :showIcon="true" :showButtonBar="true" :minDate="minEndDate" v-model="endDateSearch" />
                        </div>
                        <div class="field col-12 md:col-4 max-w-xs">
                            <label for="endDate" class="font-semibold mr-2">Employee:</label>
                            <AutoComplete
                                placeholder="Search employee"
                                id="employee"
                                optionLabel="lastName"
                                :dropdown="true"
                                :multiple="false"
                                v-model="employeeId"
                                :suggestions="autoFilteredEmployees"
                                @complete="searchEmployee($event, autoFilteredEmployees, employees)"
                                field="firstName"
                                style="width: calc(100% - 1rem)"
                            >
                                <template #option="slotProps">
                                    <div class="flex align-options-center">
                                        <div>{{ slotProps?.option?.firstName }}</div>
                                        <div>&nbsp;</div>
                                        <div>{{ slotProps?.option?.lastName }}</div>
                                    </div>
                                </template>
                            </AutoComplete>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty> No payrolls found. </template>
            <template #loading> Loading payrolls data. Please wait. </template>

            <Column :sortable="true" field="employee" header="Employee" style="min-width: 13rem">
                <template #body="{ data }"> {{ data.employee?.firstName }} {{ data.employee?.lastName }} </template>
            </Column>

            <Column :sortable="false" field="paymentMethod" header="Type" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.paymentMethod }} </template>
            </Column>
            <Column :sortable="true" field="totalAmountPaid" header="Amount" style="min-width: 7rem">
                <template #body="{ data }"> {{ data?.totalAmountPaid }}</template>
            </Column>
            <Column :sortable="true" field="payPeriodStartDate" header="Start Date" style="min-width: 10rem">
                <template #body="{ data }"> {{ data?.payPeriodStartDate }}</template>
            </Column>
            <Column :sortable="true" field="payPeriodEndDate" header="End Date" style="min-width: 10rem">
                <template #body="{ data }"> {{ data?.payPeriodEndDate }}</template>
            </Column>
            <Column style="min-width: 15rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                            <span class="text-sm">Update</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deletePayroll(data)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
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
