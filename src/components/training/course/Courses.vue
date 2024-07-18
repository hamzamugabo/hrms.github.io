<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';
import CreateCourse from '@/components/training/course/Create.vue';
import AddButton from '@/components/reuseables/AddButton.vue';
import { DifficultyLevel, TrainingStatus } from '@/components/reuseables/enums.js';

import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';
import { fetchData } from '@/components/reuseables/FetchPostData';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const { getCourses } = useTrainingUtils();
const courses = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const courseData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const cost = ref(0);
const description = ref('');
const difficultyLevel = ref('');
const durationHours = ref(0);
const tags = ref('');
const title = ref('');
const trainingStatus = ref('');
const searchTerm = ref('');

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
        const url = `${baseURL}/course/update`;

        const formData = {
            id: courseData?.value?.id,
            cost: cost.value,
            description: description.value,
            difficultyLevel: difficultyLevel.value,
            durationHours: durationHours.value,
            tags: tags.value,
            title: title.value,
            trainingStatus: trainingStatus.value
        };
        // Perform form submission logic (e.g., send data to backend)
        console.log('Form submitted:', formData);
        // loading.value = false;

        const data = await postData(url, formData, loading);
        console.log('response', data);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            showSuccess();
            loading.value = false;
            await getCourses(courses);
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

    cost.value = course?.cost;
    description.value = course?.description;
    difficultyLevel.value = course?.difficultyLevel;
    durationHours.value = course?.durationHours;
    tags.value = course?.tags;
    title.value = course?.title;
    trainingStatus.value = course?.trainingStatus;

    visible.value = true;
};

const deletecourse = async (data) => {
    const url = `${baseURL}/course/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getCourses(courses);
    });
};

onMounted(async () => {
    await getCourses(courses);
});
initFilters();
const addModalVisibility = ref(false);
const handleAdd = () => {
    addModalVisibility.value = true;
};
const searchByStatus = async () => {
    try {
        const url = `${baseURL}/course/by-status/${searchTerm.value?.name}`;

        const { data } = await fetchData(url, loading);

        if (Array.isArray(data) && data.length > 0) {
            courses.value = data;
        } else {
            courses.value = []; // Handle case where data is not an array or is empty
        }
        // employees.value = data || [];
    } catch (error) {
        courses.value = [];
        // Handle errors here
    }
};
watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
        await searchByStatus();
    } else {
        await getCourses(courses);
    }
});
const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'pending-color';
        case 'APPROVED':
            return 'approved-color';
        case 'ON_GOING':
            return 'on_going-color';
        case 'REJECTED':
            return 'rejected-color';
        default:
            return 'default-color';
    }
};
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Update Course" :style="{ width: '50rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ courseData?.name }} category</span> -->
            <div class="grid">
                <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

                <div class="col-12">
                    <div class="card">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="cost">cost</label>
                                <InputNumber v-model="cost" inputId="cost" :useGrouping="false" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="description">Description</label>
                                <InputText required id="description" type="text" v-model="description" />
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="difficultyLevel">Difficulty Level</label>
                                <Dropdown id="difficultyLevel" v-model="difficultyLevel" :options="DifficultyLevel" optionLabel="name" placeholder="Select difficulty Level"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="durationHours">Duration Hours</label>
                                <InputNumber v-model="durationHours" inputId="durationHours" :useGrouping="false" />
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="tags">Tags</label>
                                <InputText id="tags" type="text" v-model="tags" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="title">Title</label>
                                <InputText id="title" type="text" v-model="title" />
                            </div>
                            <div class="field col-12 md:col-12">
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
        <Dialog v-model:visible="addModalVisibility" header="Course">
            <CreateCourse @refresh="refresh" />
        </Dialog>
    </div>
    <div class="card">
        <div class="p-fluid formgrid grid flex-grow">
            <div class="field col-12 md:col-12">
                <AddButton :label="'Course'" @handleAdd="handleAdd" />
                <!-- <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" label="Add objective" outlined @click="addObjective()" style="float: right; width: 10rem" /> -->
            </div>
        </div>
        <DataTable v-model:filters="filters" :value="courses" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['department']">
            <template #header>
                <div class="flex justify-content-between">
                    <div v-if="filterBy === 'Status' || filterBy === 'All'" class="field col-12 md:col-3">
                        <label for="endDate" class="font-semibold mr-2">Status:</label>

                        <Dropdown style="min-width: 200px" v-model="searchTerm" :options="TrainingStatus" optionLabel="name" placeholder="Search by status" required />
                    </div>
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No courses found. </template>
            <template #loading> Loading courses data. Please wait. </template>
            <Column :sortable="true" field="title" header="Title" style="min-width: 10rem">
                <template #body="{ data }"> {{ data.title }} </template>
            </Column>
            <Column :sortable="true" field="cost" header="cost" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.cost }} </template>
            </Column>
            <Column :sortable="true" field="difficultyLevel" header="Level" style="min-width: 9rem">
                <template #body="{ data }"> {{ data.difficultyLevel }} </template>
            </Column>
            <Column :sortable="true" field="durationHours" header="Hours" style="min-width: 7rem">
                <template #body="{ data }"> {{ data.durationHours }} </template>
            </Column>
            <Column :sortable="true" field="trainingStatus" header="Status" style="min-width: 10rem">
                <template #body="{ data }">
                    <span :class="getStatusColor(data.trainingStatus)">{{ data.trainingStatus }}</span>
                </template>
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