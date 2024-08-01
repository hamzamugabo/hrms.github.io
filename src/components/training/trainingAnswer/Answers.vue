<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';
import Create from '@/components/training/trainingAnswer/Create.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getTrainingAnswers } = useTrainingUtils();
const answers = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const answerData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const answerText = ref('');

const explanation = ref('');
const feedback = ref('');
const answerOrder = ref(0);
const scoreWeight = ref(0);
const correct = ref(false);

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        answerText: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const update = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/training_answer/update`;
        const formData = {
            id: answerData?.value?.id,
            answerText: answerText.value,
            explanation: explanation.value,
            feedback: feedback.value,
            scoreWeight: scoreWeight.value,
            answerOrder: answerOrder.value,
            correct: correct?.value
        };

        // Perform form submission logic (e.g., send data to backend)
         
        // loading.value = false;

        const data = await postData(url, formData, loading);
         
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            showSuccess();
            loading.value = false;
            await getTrainingAnswers(answers);
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
const openModal = (question) => {
    answerData.value = question;

    answerText.value = question?.answerText;
    explanation.value = question?.explanation;
    feedback.value = question?.feedback;
    scoreWeight.value = question?.scoreWeight;
    answerOrder.value = question?.answerOrder;
    correct.value = question?.correct;

    visible.value = true;
};

const deleteAnswers = async (data) => {
    const url = `${baseURL}/training_answer/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getTrainingAnswers(answers);
    });
};

onMounted(async () => {
    await getTrainingAnswers(answers);
});
initFilters();
const addModalVisibility = ref(false);
const handleAdd = () => {
    addModalVisibility.value = true;
};

const serverError = ref('');
const loadingAdd = ref(false);
const submitForm = async () => {
    serverError.value = '';
    loadingAdd.value = true;
    const formData = {
        ...payload.value
    };
  if (Object.keys(formData).length === 0) {
        showError('No data entered');
        loadingAdd.value = false;

        return;
    }
    const url = `${baseURL}/training_answer/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            success.value = true;
            showSuccess(data?.message);
            loadingAdd.value = false;
            await getTrainingAnswers(answers);
        } else {
            showError(data?.error || data?.message);
            serverError.value = data?.error || data?.message;
            loadingAdd.value = false;
        }
    } catch (error) {
        showError();

        loadingAdd.value = false;
        console.log(error?.error);
    }
};
const payload = ref({});
const handleData = (data) => {
    payload.value = data;
};
</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Update Training Answer" :style="{ width: '50rem' }">
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-6">
                                <label for="answerText">AnswerText</label>
                                <InputText required id="answerText" type="text" v-model="answerText" />
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="explanation">Explanation</label>
                                <InputText id="explanation" type="text" v-model="explanation" />
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="feedback">Feedback</label>
                                <InputText id="feedback" type="text" v-model="feedback" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="answerOrder">Answer Order</label>
                                <InputNumber v-model="answerOrder" inputId="answerOrder" :useGrouping="false" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="scoreWeight">Score Weight</label>
                                <InputNumber v-model="scoreWeight" inputId="scoreWeight" :useGrouping="false" />
                            </div>
                             <div class="field col-12 md:col-6 flex items-center">
                        <label for="scoreWeight" class="mr-3">Correct</label>
                        <InputSwitch v-model="correct" />
                    </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="update"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>

        <Dialog v-model:visible="addModalVisibility" header="Create Training Answer" :style="{ width: '50rem' }">
            <Create @handleData="handleData" />
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="addModalVisibility = false"></Button>
                <Button v-if="!loadingAdd" type="button" label="Submit" @click="submitForm"></Button>
                <SpinnerVue :loading="loadingAdd" size="3rem" />
            </div>
        </Dialog>
    </div>

    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Training Answer'" @handleAdd="handleAdd" />
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="answers" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['answerText']">
            <template #header>
                <div class="flex justify-content-between">
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No Training Answer found. </template>
            <template #loading> Loading Training Answer data. Please wait. </template>

            <Column :sortable="true" field="question" header="Question" style="min-width: 17rem">
                <template #body="{ data }"> {{ data.question }} </template>
            </Column>
            <Column :sortable="true" field="answerText" header="Answer" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.answerText }} </template>
            </Column>
            <Column :sortable="true" field="correct" header=" Correct" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.correct }} </template>
            </Column>
          
            <Column :sortable="true" field="scoreWeight" header="score Weight" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.scoreWeight }} </template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteAnswers(data)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>
.pending-color {
    color: orange; /* Adjust color as needed */
}

.approved-color {
    color: green; /* Adjust color as needed */
}

.on_going-color {
    color: blue; /* Adjust color as needed */
}

.rejected-color {
    color: red; /* Adjust color as needed */
}
.default-color {
    color: black; /* Adjust color as needed */
}
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
