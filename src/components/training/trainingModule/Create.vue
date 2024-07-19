<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';

// import { useToastPopup } from '@/components/reuseables/useToast.js';
import { TrainingStatus } from '@/components/reuseables/enums.js';

// const { showError, showSuccess } = useToastPopup();
const { getCourses } = useTrainingUtils();
const emit = defineEmits(['handleData']);
const moduleOrder = ref(0);
const description = ref('');
const durationHours = ref(0);
const resources = ref('');
const title = ref('');
const trainingStatus = ref('');
// const loading = ref(false);
const success = ref(false);
const serverError = ref('');
const successMessage = ref('');
const autoFilteredCourse = ref([]);
const courses = ref([]);
const courseId = ref('');

const submitForm = async () => {
    const formData = {
        courseId: courseId?.value?.id,
        moduleOrder: moduleOrder.value,
        description: description.value,
        durationHours: durationHours.value,
        resources: resources.value,
        title: title.value,
        trainingStatus: trainingStatus.value?.name
    };
    emit('handleData', formData);
};
watch([courseId, moduleOrder, description, durationHours, resources, title, trainingStatus], () => {
    submitForm();
});
onMounted(async () => {
    await getCourses(courses);
});
const searchCourse = (event) => {
    if (!event.query.trim().length) {
        autoFilteredCourse.value = [...courses.value];
    } else {
        autoFilteredCourse.value = courses.value.filter((jobDescription) => {
            const durationHours = jobDescription.durationHours.toLowerCase().startsWith(event.query.toLowerCase());
            const title = jobDescription.title.toLowerCase().includes(event.query.toLowerCase());
            return durationHours || title;
        });
    }
};
</script>

<template>
    <!-- <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content"> -->
    <div class="grid">
        <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

        <div class="col-12">
            <div class="card">
                <Message v-if="success" severity="success">{{ successMessage }}</Message>
                <Message v-if="serverError" severity="error">{{ serverError }}</Message>

                <!-- <h5>Create Job Training</h5> -->

                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="course">Course</label>
                        <AutoComplete required placeholder="Search" id="course" :dropdown="true" :multiple="false" v-model="courseId" :suggestions="autoFilteredCourse" @complete="searchCourse($event)" field="title">
                            <template #option="slotProps">
                                <div class="job-info">
                                    <div class="flex align-items-center">
                                        <div class="job-detail">
                                            <div>Title: {{ slotProps?.option?.title }}</div>
                                            <div>Hours: {{ slotProps?.option?.durationHours }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="moduleOrder">Module Order</label>
                        <InputNumber v-model="moduleOrder" inputId="moduleOrder" :useGrouping="false" />
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
                        <label for="resources">Resources</label>
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

    <!-- <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer" class="block mx-auto border-none">Submit</button>
            </div>
        </form>
    </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
