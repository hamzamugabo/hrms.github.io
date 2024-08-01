<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';
import Create from '@/components/training/lesson/Create.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import { TrainingStatus } from '@/components/reuseables/enums.js';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getLessons } = useTrainingUtils();
const lessons = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const courseData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const lessonOrder = ref(0);
const description = ref('');
const difficultyLevel = ref('');
const durationHours = ref(0);
const resources = ref('');
const title = ref('');
const trainingStatus = ref({ name: '', code: ' ' });

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const update = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/lessons/update`;

        const formData = {
            id: courseData?.value?.id,
            lessonOrder: lessonOrder.value,
            description: description.value,
            durationHours: durationHours.value,
            resources: resources.value,
            title: title.value,
            trainingStatus: trainingStatus.value.name
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
            await getLessons(lessons);
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
const openModal = (course) => {
    courseData.value = course;

    lessonOrder.value = course?.lessonOrder;
    description.value = course?.description;
    difficultyLevel.value = course?.difficultyLevel;
    durationHours.value = course?.durationHours;
    resources.value = course?.resources;
    title.value = course?.title;
    trainingStatus.value = { name: course?.trainingStatus, code: course?.trainingStatus };

    visible.value = true;
};

const deletecourse = async (data) => {
    const url = `${baseURL}/lessons/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getLessons(lessons);
    });
};

onMounted(async () => {
    await getLessons(lessons);
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

    const url = `${baseURL}/lessons/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            success.value = true;
            showSuccess(data?.message);
            loadingAdd.value = false;
            await getLessons(lessons);
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
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Update Lesson" :style="{ width: '50rem' }">
            <!-- <Message v-if="success" severity="success">{{ successMessage }}</Message> -->

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ courseData?.name }} category</span> -->
            <div class="grid">
                <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-6">
                                <label for="lessonOrder">Lesson Order</label>
                                <InputNumber v-model="lessonOrder" inputId="lessonOrder" :useGrouping="false" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="description">Description</label>
                                <InputText required id="description" type="text" v-model="description" />
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="durationHours">Duration Hours</label>
                                <InputNumber v-model="durationHours" inputId="durationHours" :useGrouping="false" />
                            </div>

                            <div class="field col-12 md:col-6">
                                <label for="resources">resources</label>
                                <InputText id="resources" type="text" v-model="resources" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="title">Title</label>
                                <InputText id="title" type="text" v-model="title" />
                            </div>
                            <div class="field col-12 md:col-6">
                                <label for="trainingStatus">Training Status</label>
                                <Dropdown id="trainingStatus" v-model="trainingStatus" :options="TrainingStatus" optionLabel="name" placeholder="Select Training Status"></Dropdown>
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
        <Dialog v-model:visible="addModalVisibility" header="Create Lesson" :style="{ width: '50rem' }">
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
                <AddButton :label="'Lesson'" @handleAdd="handleAdd" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="lessons" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['title']">
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
            <template #empty> No Lesson found. </template>
            <template #loading> Loading Lesson data. Please wait. </template>
            <Column :sortable="true" field="moduleTitle" header="Module Title" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.moduleTitle }} </template>
            </Column>
             <Column :sortable="true" field="title" header="Title" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.title }} </template>
            </Column>
            <Column :sortable="true" field="lessonOrder" header="Lesson Order" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.lessonOrder }} </template>
            </Column>

            <Column :sortable="true" field="durationHours" header="Hours" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.durationHours }} </template>
            </Column>
            <Column :sortable="true" field="trainingStatus" header="Training Status" style="min-width: 10rem">
              <template #body="{ data }"> {{ data.trainingStatus }} </template>
                <!-- <template #body="{ data }">
                    <span :class="getStatusColor(data.trainingStatus)">{{ data.trainingStatus }}</span>
                </template> -->
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
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deletecourse(data)" style="width: 5rem">
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
