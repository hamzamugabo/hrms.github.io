<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import Create from '@/components/performance/individualObjectives/Create.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getIndividualObjectives } = usePerformanceUtils();
// const router = useRouter();
const objectives = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const objectiveData = ref('');
// const departmentUpdatedName = ref('');
const name = ref('');
const description = ref('');
const dueDate = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');
const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const updateObjective = async () => {
    try {
        updateError.value = '';
        loading.value = true;
        const url = `${baseURL}/objective/individual/update`;
        const formData = {
            description: description.value || objectiveData.value.description,
            dueDate: changeDateFormat(dueDate.value) || objectiveData?.value?.dueDate,
            id: objectiveData?.value?.id,
            name: name.value || objectiveData.value.name
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess();
            loading.value = false;
            await getIndividualObjectives(objectives);
        } else {
            showError(data?.message);

            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError();
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (objective) => {
    objectiveData.value = objective;

    description.value = objective.description;
    dueDate.value = objective.dueDate;

    name.value = objective.name;
    visible.value = true;
};

onMounted(async () => {
    await getIndividualObjectives(objectives);

    // console.log( getStatusColor('PENDING'))
});
initFilters();
const deleteObjective = async (id) => {
    const url = `${baseURL}/objective/individual/update/${id}`;

    await confirmDelete(url, async () => {
        await getIndividualObjectives(objectives);
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getIndividualObjectives(objectives);
};

const serverError = ref('');
const AddLoading = ref(false);
const submitForm = async () => {
    serverError.value = '';
    AddLoading.value = true;
    const formData = { ...payload.value };

    const url = `${baseURL}/objective/individual/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            AddLoading.value = false;
            showSuccess(data?.message);
            await getIndividualObjectives(objectives);
        } else {
            showError();
            serverError.value = data?.error || data?.message;
            AddLoading.value = false;
        }
    } catch (error) {
        showError();

        AddLoading.value = false;
        console.log(error?.error);
    }
};
const visibleAdd = ref(false);
const add = () => {
    visibleAdd.value = true;
};
const payload = ref({});
const handleData = (data) => {
    payload.value = data;
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Objective" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">name</label>
                                <InputText required id="name" type="text" v-model="name" />
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="description">description</label>

                                <Textarea id="description" v-model="description" required="true" rows="3" cols="20" />
                                <!-- <InputText required id="description" type="text" v-model="description" /> -->
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="dueDate">Due Date</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="dueDate" :minDate="minDate"></Calendar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateObjective"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="visibleAdd" header="Create objective" :style="{ width: '50%' }">
            <Create @handleData="handleData" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleAdd = false"></Button>
                <Button v-if="!AddLoading" type="button" label="Submit" @click="submitForm"></Button>

                <SpinnerVue :loading="AddLoading" size="2rem" />
            </div>
        </Dialog>
    </div>

    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Objective'" @handleAdd="add" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="objectives" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
            <template #header>
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No objectives found. </template>
            <template #loading> Loading objectives data. Please wait. </template>
            <Column :sortable="true" field="employee" header="Employee" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.employee }}</template>
            </Column>
            <Column :sortable="true" field="departmentObjective" header="Dept Objective" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.departmentObjective }}</template>
            </Column>

            <Column :sortable="false" field="name" header="Name" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.name }} </template>
            </Column>
             <Column :sortable="false" field="progressUpdate" header="Status" style="min-width: 9rem">
                <template #body="{ data }">
                    <Button
                        :label="data?.progressUpdate?.progressStatus"
                        :class="[
                            'p-button-sm',
                            'small-button',
                            data?.progressUpdate?.progressStatus === 'NOT_STARTED'
                                ? 'not-started-status'
                                : data?.progressUpdate?.progressStatus === 'IN_PROGRESS'
                                ? 'in-progress-status'
                                : data?.progressUpdate?.progressStatus === 'COMPLETED'
                                ? 'completed-status'
                                : data?.progressUpdate?.progressStatus === 'ON_HOLD'
                                ? 'on-hold-status'
                                : data?.progressUpdate?.progressStatus === 'CANCELLED'
                                ? 'cancelled-status'
                                : ''
                        ]"
                    />
                </template>
            </Column>
            <Column :sortable="false" field="dueDate" header="Due Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.dueDate }}</template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteObjective(data?.id)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>
@media (max-width: 768px) {
    .flex-column-sm {
        flex-direction: column;
    }
    .gap-3-sm > * {
        margin-bottom: 1rem;
    }
}
</style>
