<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import UpdateDeduction from './CreateComponent.vue';
import { utils } from '@/components/payroll/allowances/allowanceUtils.js';
import { baseURL } from '../../reuseables/FetchPostData';
// import { useRouter } from 'vue-router';
import CreateNssfDeduction from '@/components/payroll/deductions/nssf/Create.vue';

import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
// import { useToastPopup } from '@/components/reuseables/useToast.js';

// const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getNssfDeductions, getEmployees, searchDdeuctionByEmployeeId, updateDeduction, searchByDateRange } = utils();
const deductions = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const deductionData = ref('');
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
const deductionDataToUpdate = ref({});
// const router = useRouter();
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        leaveStatus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
    getNssfDeductions(deductions, loading);
};
const handleUpdateDeduction = async () => {
    await updateDeduction(deductionDataToUpdate, deductionData, deductions, successMessage, updateError, success, loading);
};
const openModal = (deduction) => {
    console.log('deduction', deduction);
    deductionData.value = deduction;

    visible.value = true;
};

onMounted(async () => {
    await getNssfDeductions(deductions, loading);

    await getEmployees(employees, false);
});
initFilters();

watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    // eslint-disable-next-line no-empty
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
    } else {
        await getNssfDeductions(deductions, loading);
    }
});
watch(employeeId, async (newVal, oldVal) => {
    if (newVal !== oldVal && employeeId.value?.id?.length > 0) {
        await searchDdeuctionByEmployeeId(deductions, employeeId?.value?.id, false);
    } else {
        await getNssfDeductions(deductions, loading);
    }
});
watch([startDateSearch, endDateSearch], async () => {
    await searchByDateRange(startDateSearch, endDateSearch, deductions, loading);
});

const handleDeduction = (data) => {
    deductionDataToUpdate.value = data;
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
// const deleteDeduction = async (id) => {
//     if (!id) {
//         generalError.value = 'No deduction';
//         return;
//     }
//     const url = `${baseURL}/deduction/delete/${id}`;

//     try {
//         const data = await fetchData(url);
//         if (!data?.data) {
//             await getNssfDeductions(deductions, loading);
//         }
//         await getNssfDeductions(deductions, loading);

//         console.log(data);
//     } catch (error) {
//         // Handle errors here
//     }
// };
// const addDeduction = () => {
//     router.push('/deduction/create');
// };
const deleteDeduction = async (data) => {
    const url = `${baseURL}/deduction/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getNssfDeductions(deductions, loading);
    });
    refresh();
};
const addModalVisibility = ref(false);
const handleAdd = () => {
    addModalVisibility.value = true;
};
const refresh = async () => {
    await getNssfDeductions(deductions, loading);
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Deduction" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <UpdateDeduction
                @handleDeduction="handleDeduction"
                :employee="deductionData?.employeeId"
                :salary="deductionData?.salaryId"
                :start="deductionData?.startDate"
                :end="deductionData?.endDate"
                :fee="deductionData?.amount"
                :type="deductionData?.deductionType"
                :deduction="deductionData"
            />

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="handleUpdateDeduction"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="addModalVisibility" header="Add">
            <CreateNssfDeduction />
        </Dialog>
    </div>
    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Deduction'" @handleAdd="handleAdd" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="deductions" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
            <template #header>
                <div class="flex justify-content-between flex-wrap">
                    <Button type="button" icon="pi pi-filter-slash" class="mr-2 mb-2" label="Clear" outlined @click="clearFilter()" />

                    <div class="flex flex-wrap gap-2">
                        <AutoComplete
                            placeholder="Search by employee"
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
                                    <!-- Space character -->
                                    <div>{{ slotProps?.option?.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                </div>
            </template>
            <template #empty> No deductions found. </template>
            <template #loading> Loading deductions data. Please wait. </template>

            <Column :sortable="true" field="employee" header="Employee" style="min-width: 15rem">
                <template #body="{ data }"> {{ data.employee?.firstName }} {{ data.employee?.lastName }} </template>
            </Column>

            <Column :sortable="false" field="deductionType" header="Type" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.deductionType }} </template>
            </Column>
            <Column :sortable="true" field="amount" header="Amount" style="min-width: 12rem">
                <template #body="{ data }"> {{ data?.amount }}</template>
            </Column>
            <Column :sortable="true" field="startDate" header="start Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.startDate }}</template>
            </Column>
            <Column :sortable="true" field="endDate" header="end Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.endDate }}</template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteDeduction(data?.id)" style="width: 5rem">
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
