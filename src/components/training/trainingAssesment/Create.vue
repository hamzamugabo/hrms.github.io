<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import { useTrainingUtils } from '@/components/training/useTrainingUtils';
import { utils } from '@/components/payroll/allowances/allowanceUtils.js';

// const { showError, showSuccess } = useToastPopup();
const { getCourses } = useTrainingUtils();
const { getEmployees } = utils();

const emit = defineEmits(['handleData']);
const passingScore = ref(0);
const description = ref('');
const durationMinutes = ref(0);
const instructions = ref('');
const title = ref('');
const attempts = ref(0);
// const trainingStatus = ref('');
// const loading = ref(false);
const success = ref(false);
const serverError = ref('');
const successMessage = ref('');
const autoFilteredCourse = ref([]);
const courses = ref([]);
const courseId = ref('');
const employeeId = ref('');
const employees = ref([]);
const autoFilteredEmployees = ref([]);

const submitForm = async () => {
    const formData = {
        courseId: courseId?.value?.id,
        attempts: attempts?.value,
        passingScore: passingScore.value,
        description: description.value,
        durationMinutes: durationMinutes.value,
        employeeId: employeeId?.value?.id,
        instructions: instructions.value,
        title: title.value
    };
    emit('handleData', formData);
};

watch([courseId, attempts, passingScore, employeeId, description, durationMinutes, instructions, title], () => {
    submitForm();
});
onMounted(async () => {
    await getCourses(courses);
    await getEmployees(employees, false);
});

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
const searchCourse = (event) => {
    if (!event.query.trim().length) {
        autoFilteredCourse.value = [...courses.value];
    } else {
        autoFilteredCourse.value = courses.value.filter((jobDescription) => {
            const durationMinutes = jobDescription.durationMinutes.toLowerCase().startsWith(event.query.toLowerCase());
            const title = jobDescription.title.toLowerCase().includes(event.query.toLowerCase());
            return durationMinutes || title;
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
                                            <div>Hours: {{ slotProps?.option?.durationMinutes }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="employee">Select Employee</label>
                        <AutoComplete placeholder="Search employee" id="employee" optionLabel="lastName" :dropdown="true" :multiple="false" v-model="employeeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee" field="firstName">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps?.option?.firstName }}</div>
                                    <div>&nbsp;</div>
                                    <div>{{ slotProps?.option?.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="passingScore">Module Order</label>
                        <InputNumber v-model="passingScore" inputId="passingScore" :useGrouping="false" />
                    </div>


                    <div class="field col-12 md:col-6">
                        <label for="attempts">Attempts</label>
                        <InputNumber v-model="attempts" inputId="attempts" :useGrouping="false" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="description">Description</label>
                        <InputText required id="description" type="text" v-model="description" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="durationMinutes">Duration Hours</label>
                        <InputNumber v-model="durationMinutes" inputId="durationMinutes" :useGrouping="false" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="instructions">instructions</label>
                        <InputText id="instructions" type="text" v-model="instructions" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="title">Title</label>
                        <InputText id="title" type="text" v-model="title" />
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
