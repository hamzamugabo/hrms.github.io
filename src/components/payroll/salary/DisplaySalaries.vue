<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { AllowanceType } from '@/components/reuseables/enums';
import CreateSalary from '@/components/payroll/salary/Index.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
// import loadFromLocalStorage from '@/components/reuseables/getUser';

const salaries = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const salariesData = ref('');
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

const getSalaries = async () => {
    const url = `${baseURL}/salary`;

    try {
        const { data } = await fetchData(url, loading);

        let allSalaries = await Promise.all(
            data.map(async (element) => {
                const employee = await getEmployeeById(element?.employeeId);

                return {
                    ...element,
                    employee: employee
                };
            })
        );

        salaries.value = allSalaries;

        // Assign allSalaries to your reactive variable if needed
    } catch (error) {
        salaries.value = [];

        console.error('Error fetching requests:', error);
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
    getSalaries();
};
const updateSalary = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/salary/update`;
        const formData = {
            basicSalary: basicSalary.value ? basicSalary.value : salariesData?.value?.basicSalary,
            id: salariesData?.value?.id,
            paymentFrequency: paymentFrequency.value ? paymentFrequency.value?.name : salariesData?.value?.paymentFrequency
        };
        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess();
            loading.value = false;
            await getSalaries();
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
const openModal = (salary) => {
    salariesData.value = salary;
    paymentFrequency.value = salary?.paymentFrequency;
    basicSalary.value = salary?.basicSalary;

    visible.value = true;
};

onMounted(async () => {
    await getSalaries();

    await getEmployees();
    // console.log( getStatusColor('PENDING'))
});
initFilters();

const searchByDateRange = async () => {
    try {
        const url = `${baseURL}/leave/request/date-range`;
        const queryParams = new URLSearchParams();
        queryParams.append('startDate', changeDateFormat(startDateSearch.value));
        queryParams.append('endDate', changeDateFormat(endDateSearch.value));
        const queryUrl = `${url}?${queryParams.toString()}`;
        const { data } = await fetchData(queryUrl, loading);
        console.log('search by range', data);
    } catch (error) {
        salaries.value = [];
        // Handle errors here
    }
};
const searchByEmployeeId = async () => {
    try {
        const url = `${baseURL}/leave/request/by-employeeId/${employeeId.value?.id}`;

        const { data } = await fetchData(url, loading);
        console.log('data===>', data);
        let allRequests = await Promise.all(
            data.map(async (element) => {
                const employee = await getEmployeeById(element?.employeeId);
                return {
                    ...element,
                    employee: employee
                };
            })
        );
        salaries.value = allRequests || [];
        // employees.value = data || [];
    } catch (error) {
        salaries.value = [];
        // Handle errors here
    }
};
watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    // eslint-disable-next-line no-empty
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
    } else {
        await getSalaries();
    }
});
watch(employeeId, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && employeeId.value?.id?.length > 0) {
        await searchByEmployeeId();
    } else {
        await getSalaries();
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
const deleteSalary = async (data) => {
    const url = `${baseURL}/salary/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getSalaries();
    });
};
const addModalVisibility = ref(false);
const add = () => {
    addModalVisibility.value = true;
};
const refresh = async() =>{
     await getSalaries();
}
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Salary" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <!-- <span class="p-text-secondary block mb-5">Update {{ salariesData?.name }} Department</span> -->
            <div class="flex align-items-center gap-3 mb-3">
                <label for="paymentFrequency">Payment Frequency</label>
                <Dropdown id="allowanceType" v-model="paymentFrequency" :options="AllowanceType" optionLabel="name" placeholder="Select allowanceType"></Dropdown>

                <!-- <InputText id="paymentFrequency" type="text" v-model="paymentFrequency" /> -->
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="basicSalary">Basic Salary</label>
                <InputNumber v-model="basicSalary" inputId="integeronly" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateSalary"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="addModalVisibility" header="Add">
            <CreateSalary @refresh="refresh" />
        </Dialog>
    </div>
    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Salary'" @handleAdd="add" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="salaries" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
            <template #header>
                <div class="flex justify-content-between flex-wrap">
                    <Button type="button" icon="pi pi-filter-slash" class="mr-2 mb-2" label="Clear" outlined @click="clearFilter()" />

                    <div class="flex flex-wrap gap-2">
                        <AutoComplete
                            placeholder="Search employee"
                            id="employee"
                            optionLabel="lastName"
                            :dropdown="true"
                            :multiple="false"
                            v-model="employeeId"
                            :suggestions="autoFilteredEmployees"
                            @complete="searchEmployee($event)"
                            field="firstName"
                            style="width: calc(100% - 1rem)"
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
            </template>
            <template #empty> No Salaries found. </template>
            <template #loading> Loading Salaries data. Please wait. </template>

            <Column :sortable="true" field="employee" header="Employee" style="min-width: 15rem">
                <template #body="{ data }"> {{ data.employee?.firstName }} {{ data.employee?.lastName }} </template>
            </Column>
            <Column :sortable="true" field="basicSalary" header="Gross" style="min-width: 10rem">
                <template #body="{ data }"> {{ data?.basicSalary }}</template>
            </Column>
            <Column :sortable="false" field="paymentFrequency" header="Frequency" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.paymentFrequencyType }} </template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteSalary(data)" style="width: 5rem">
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
