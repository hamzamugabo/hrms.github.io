<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
// import { useRouter } from 'vue-router';
import AddButton from '@/components/reuseables/AddButton.vue';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { RewardType } from '@/components/reuseables/enums.js';
import Create from '@/components/performance/reward/Create.vue';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const { getRewards } = usePerformanceUtils();
// const router = useRouter();
const rewards = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const rewardData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const generalError = ref('');
const filterBy = ref('');
const rewardDate = ref('');
const rewardType = ref('');
const details = ref('');
const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        rewardType: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const updateReward = async () => {
    try {
        loading.value = true;
        const url = `${baseURL}/reward/update`;
        const formData = {
            id: rewardData?.value?.id,
            rewardDate: changeDateFormat(rewardDate.value) || rewardData?.value.rewardDate,
            details: details.value || rewardData?.value?.details,
            rewardType: rewardType?.value?.name || rewardData?.value?.rewardType
        };

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            await getRewards(rewards);
        } else {
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (reward) => {
    rewardData.value = reward;

    rewardDate.value = reward.rewardDate;
    details.value = reward.details;
    rewardType.value = reward?.rewardType;
    visible.value = true;
};

const deleteReward = async (id) => {
    const url = `${baseURL}/reward/delete/${id}`;

    await confirmDelete(url, async () => {
        await getRewards(rewards);
    });
};
onMounted(async () => {
    await getRewards(rewards);

    // console.log( getStatusColor('PENDING'))
});
initFilters();

const serverError = ref('');
const AddLoading = ref(false);
const submitForm = async () => {
    serverError.value = '';
    AddLoading.value = true;
    const formData = { ...payload.value };

    const url = `${baseURL}/reward/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // success.value = true;
            AddLoading.value = false;
            showSuccess(data?.message);
            await getRewards(rewards);
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
        <Dialog v-model:visible="visible" header="Edit Reward" :style="{ width: '50%' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="details">details</label>
                                <InputText required id="details" type="text" v-model="details" />
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="rewardType">Reward Type</label>
                                <Dropdown id="rewardType" v-model="rewardType" :options="RewardType" optionLabel="name" placeholder="Select RewardType"></Dropdown>
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="rewardDate">Reward Date</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="rewardDate" :minDate="minDate"></Calendar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateReward"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
        <Dialog v-model:visible="visibleAdd" header="Create Reward" :style="{ width: '50%' }">
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
                <AddButton :label="'Reward'" @handleAdd="add" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addReward()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="rewards" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['rewardType']">
            <template #header>
                <div v-if="filterBy" class="flex justify-between items-center">
                    <div class="p-fluid formgrid grid flex-grow"></div>
                </div>
            </template>

            <template #empty> No rewards found. </template>
            <template #loading> Loading rewards data. Please wait. </template>

            <Column :sortable="true" field="employee" header="Employee" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.employee }}</template>
            </Column>
            <Column :sortable="false" field="rewardType" header="Reward Type" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.rewardType }} </template>
            </Column>
            <Column :sortable="true" field="criteria " header="Recognition Criteria" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.criteria }}</template>
            </Column>
            <Column :sortable="false" field="details" header="Details" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.details }}</template>
            </Column>
            <Column :sortable="false" field="rewardDate" header="Reward Date" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.rewardDate }}</template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteReward(data?.id)" style="width: 5rem">
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
