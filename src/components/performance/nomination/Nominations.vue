<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { RecognitionCriteria, RewardType } from '@/components/reuseables/enums.js';
import Create from '@/components/performance/nomination/Create.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getNominations } = usePerformanceUtils();
// const router = useRouter();
const nominations = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const nominationData = ref('');
const name = ref('');
const description = ref('');
const dueDate = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');
const recognitionCriteria = ref('');
const rewardType = ref('');
const nominationDate = ref('');
const reason = ref('');
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

const updateNomination = async () => {
    try {
        loading.value = true;
        const url = `${baseURL}/nomination/update`;
        const formData = {
            id: nominationData?.value?.id,
            nominationDate: changeDateFormat(nominationDate.value) || nominationData.value.nominationDate,
            reason: reason.value || nominationData?.value?.reason,
            recognitionCriteria: recognitionCriteria?.value?.name || nominationData?.value?.recognitionCriteria,
            rewardType: rewardType?.value?.name || nominationData?.value?.rewardType
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            await getNominations(nominations);
        } else {
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (objective) => {
    nominationData.value = objective;

    description.value = objective.description;
    dueDate.value = objective.dueDate;

    name.value = objective.name;
    visible.value = true;
};


const deleteNomination = async (id) => {
   const url = `${baseURL}/nomination/delete/${id}`;

    await confirmDelete(url, async () => {
        await  getNominations(nominations);
    });
  
};

onMounted(async () => {
    await getNominations(nominations);

    // console.log( getStatusColor('PENDING'))
});
initFilters();
const serverError = ref('');
const AddLoading = ref(false);
const submitForm = async () => {
    serverError.value = '';
    AddLoading.value = true;
    const formData = { ...payload.value };

   const url = `${baseURL}/nomination/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            AddLoading.value = false;
            showSuccess(data?.message);
            await getNominations(nominations);
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
    <div class=" flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Nomination" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                             <div class="field col-12 md:col-12">
                                <label for="reason">reason</label>
                                <InputText required id="reason" type="text" v-model="reason" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="recognitionCriteria">Recognition Criteria</label>
                                <Dropdown id="recognitionCriteria" v-model="recognitionCriteria" :options="RecognitionCriteria" optionLabel="name" placeholder="Select RecognitionCriteria"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="rewardType">Reward Type</label>
                                <Dropdown id="rewardType" v-model="rewardType" :options="RewardType" optionLabel="name" placeholder="Select RewardType"></Dropdown>
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="dueDate">Nomination Date</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="nominationDate" :minDate="minDate"></Calendar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateNomination"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
          <Dialog v-model:visible="visibleAdd" header="Create Nomination" :style="{ width: '50%' }">
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
                        <AddButton :label="'Nomination'" @handleAdd="add" />
                        <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addNomination()" style="float: right; width: 10rem" /> -->
                    </div>
                </div>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="nominations" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
            <template #header>
              
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No nominations found. </template>
            <template #loading> Loading nominations data. Please wait. </template>

            <Column :sortable="true" field="nominee" header="Nominee" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.nominee }}</template>
            </Column>
            <Column :sortable="true" field="nominator" header="Nominator" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.nominator }}</template>
            </Column>
            <Column :sortable="true" field="recognitionCriteria" header="Recognition Criteria" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.recognitionCriteria }}</template>
            </Column>
            <Column :sortable="false" field="rewardType" header="Reward Type" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.rewardType }} </template>
            </Column>
            <Column :sortable="false" field="reason" header="Reason" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.reason }}</template>
            </Column>
             <Column :sortable="false" field="nominationDate" header="Nomination Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.nominationDate }}</template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteNomination(data?.id)" style="width: 5rem">
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
