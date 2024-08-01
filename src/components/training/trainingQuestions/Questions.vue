<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';
import Create from '@/components/training/trainingQuestions/Create.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import { QuestionDifficulty, QuestionType } from '@/components/reuseables/enums.js';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getTrainingQuestions } = useTrainingUtils();
const questions = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const questionData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');

const questionType = ref({ name: '', code: '' });
const questionDifficulty = ref({ name: '', code: '' });
const questionText = ref('');

const explanation = ref('');
const tags = ref('');

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        questionText: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const update = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/questions/update`;
        const formData = {
            id: questionData?.value?.id,
            questionDifficulty: questionDifficulty?.value,
            questionType: questionType.value,
            questionText: questionText.value,
            explanation: explanation.value,
            tags: tags.value
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
            await getTrainingQuestions(questions);
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
    questionData.value = question;

    questionDifficulty.value = question?.questionDifficulty;
    questionType.value = question?.questionType;
    questionText.value = question?.questionText;
    explanation.value = question?.explanation;
    tags.value = question?.tags;

    visible.value = true;
};

const deleteQuestion = async (data) => {
    const url = `${baseURL}/questions/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getTrainingQuestions(questions);
    });
};

onMounted(async () => {
    await getTrainingQuestions(questions);
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
    const url = `${baseURL}/questions/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            success.value = true;
            showSuccess(data?.message);
            loadingAdd.value = false;
            await getTrainingQuestions(questions);
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
        <Dialog v-model:visible="visible" header="Update Training Question" :style="{ width: '50rem' }">
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-6">
                                <label for="questionDifficulty">Training Status</label>
                                <Dropdown id="questionDifficulty" v-model="questionDifficulty" :options="QuestionDifficulty" optionLabel="name" placeholder="Select question Difficulty"></Dropdown>
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="questionText">questionText</label>
                                <InputText required id="questionText" type="text" v-model="questionText" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="questionType">Training Status</label>
                                <Dropdown id="questionType" v-model="QuestionType" :options="TrainingStatus" optionLabel="name" placeholder="Select question Type"></Dropdown>
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="explanation">explanation</label>
                                <InputText id="explanation" type="text" v-model="explanation" />
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="tags">tags</label>
                                <InputText id="tags" type="text" v-model="tags" />
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

        <Dialog v-model:visible="addModalVisibility" header="Create Training Question" :style="{ width: '50rem' }">
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
                <AddButton :label="'Training Question'" @handleAdd="handleAdd" />
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="questions" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['questionText']">
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
            <template #empty> No Training Question found. </template>
            <template #loading> Loading Training Question data. Please wait. </template>

            <Column :sortable="true" field="assessment" header="assessment" style="min-width: 17rem">
                <template #body="{ data }"> {{ data.assessment }} </template>
            </Column>
            <Column :sortable="true" field="questionText" header="question" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.questionText }} </template>
            </Column>
            <Column :sortable="true" field="questionDifficulty" header=" Difficulty" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.questionDifficulty }} </template>
            </Column>
            <Column :sortable="true" field="questionType" header=" Type" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.questionType }} </template>
            </Column>

            <Column :sortable="true" field="explanation" header="explanation" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.explanation }} </template>
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteQuestion(data)" style="width: 5rem">
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
