<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import UpdateAllowance from './CreateComponent.vue';
import { utils } from './allowanceUtils.js';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { baseURL, postData } from '../../reuseables/FetchPostData';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const { confirmDelete } = useConfirmDialog();
// const router = useRouter();
const { getAllowances, getEmployees, searchByEmployeeId, updateAllowance, searchByDateRange } = utils();
const allowances = ref([]);
const filters = ref(null);
const loading = ref(false);
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

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        leaveStatus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
    getAllowances(allowances, loading);
};
const handleUpdateAllowance = async () => {
    await updateAllowance(allowanceDataToUpdate, allowanceData, allowances, successMessage, updateError, success, loading);
    if (successMessage?.value) {
        showSuccess(successMessage?.value);
    }
    if (updateError?.value) {
        showError(updateError?.value);
    }
};
const openModal = (allowance) => {
 
    allowanceData.value = allowance;
    paymentFrequency.value = allowance?.paymentFrequency;
    basicSalary.value = allowance?.basicSalary;

    visible.value = true;
};

onMounted(async () => {
    await getAllowances(allowances, loading);

    await getEmployees(employees, false);
});
initFilters();

watch(searchTerm, async (newVal, oldVal) => {
    // eslint-disable-next-line no-empty
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
    } else {
        await getAllowances(allowances, loading);
    }
});
watch(employeeId, async (newVal, oldVal) => {
    if (newVal !== oldVal && employeeId.value?.id?.length > 0) {
        await searchByEmployeeId(allowances, employeeId?.value?.id, false);
    } else {
        await getAllowances(allowances, loading);
    }
});
watch([startDateSearch, endDateSearch], async () => {
    await searchByDateRange(startDateSearch, endDateSearch, allowances, loading);
});

const handleAddAllowance = (data) => {
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
// const add = () => {
//     router.push('/allowance/create');
// };
const handleDeleteAllowance = async (data) => {
    const url = `${baseURL}/allowance/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getAllowances(allowances, loading);
    });
};
const addModalVisibility = ref(false);
const add = () => {
    addModalVisibility.value = true;
};

// const refresh = async () => {
//     await getAllowances(allowances, loading);
// };
const serverError = ref('');
const loadingAdd = ref(false);
const submitForm = async () => {
    serverError.value = '';
    loadingAdd.value = true;
    let url = `${baseURL}/allowance/create`;
    const emitedAllowance = { ...allowanceDataToUpdate.value };
    if (emitedAllowance?.allowanceType === 'OVERTIME') {
        url = `${baseURL}/allowance/create/Overtime`;
    } else if (emitedAllowance?.allowanceType === 'TRANSFER') {
        url = `${baseURL}/allowance/create/Transfer`;
    } else if (emitedAllowance?.allowanceType === 'TRAVEL_OUTSIDE') {
        url = `${baseURL}/allowance/create/TravelOutside`;
    } else {
        url = `${baseURL}/allowance/create`;
    }

    try {
       
        const data = await postData(url, emitedAllowance);
        if (data?.status === 200 || data?.status === 201) {
            // success.value = true;
            showSuccess();
            successMessage.value = data?.message;

            loadingAdd.value = false;

            await getAllowances(allowances, loadingAdd);
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            loadingAdd.value = false;
        }
    } catch (error) {
        showError();

        serverError.value = error?.message || error?.message;

        loadingAdd.value = false;
        console.log(error?.error);
    }
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Allowance" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <UpdateAllowance
                @handleAddAllowance="handleAddAllowance"
                :employee="allowanceData?.employeeId"
                :salary="allowanceData?.salaryId"
                :start="allowanceData?.startDate"
                :end="allowanceData?.endDate"
                :fee="allowanceData?.amount"
                :type="allowanceData?.allowanceType"
                :allowance="allowanceData"
                :days="allowanceData?.workingDays"
                :transport="allowanceData?.transportAllowance"
            />

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="handleUpdateAllowance"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="addModalVisibility" header="Create Allowance" :style="{ width: '50%' }">
            <!-- <CreateAllowance @refresh="refresh" /> -->
            <UpdateAllowance @handleAddAllowance="handleAddAllowance" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="addModalVisibility = false"></Button>
                <Button v-if="!loadingAdd" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="loadingAdd" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Allowance'" @handleAdd="add" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="allowances" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
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
            <template #empty> No allowances found. </template>
            <template #loading> Loading allowances data. Please wait. </template>

            <Column :sortable="true" field="employee" header="Employee" style="min-width: 18rem">
                <template #body="{ data }"> {{ data.employee?.firstName }} {{ data.employee?.lastName }} </template>
            </Column>

            <Column :sortable="false" field="allowanceType" header="Type" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.allowanceType }} </template>
            </Column>
            <Column :sortable="true" field="amount" header="Amount" style="min-width: 12rem">
                <template #body="{ data }"> {{ data?.amount }}</template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleDeleteAllowance(data)" style="width: 5rem">
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
