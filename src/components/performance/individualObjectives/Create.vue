<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
// import { useEmployee } from '@/components/employeeManagement/employeeUtils';
// import { useToastPopup } from '@/components/reuseables/useToast.js';

// const { showError, showSuccess } = useToastPopup();
const { getDepartmentObjectives, getPerformanceAgreements } = usePerformanceUtils();
// const { getEmployees } = useEmployee();

const name = ref('');
const description = ref('');
const dueDate = ref('');
const employeeId = ref('');
const departmentObjectiveId = ref('');
const performanceAgreementId = ref('');
// const loading = ref(false);
const success = ref(false);
// const autoFilteredEmployees = ref([]);
const autoFilteredDepartments = ref([]);
const autoFilteredAgreements = ref([]);
const objectives = ref([]);
// const employees = ref([]);
// const departments = ref([]);
const agreements = ref([]);

const serverError = ref('');
const successMessage = ref('');
const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}

onMounted(async () => {
    // await getEmployees(employees, false);
    await getPerformanceAgreements(agreements);

    await getDepartmentObjectives(objectives, false);
});

// const searchEmployee = (event) => {
//     if (!event.query.trim().length) {
//         autoFilteredEmployees.value = employees?.value?.length > 0 ? [...employees.value] : [];
//     } else {
//         autoFilteredEmployees.value = employees.value.filter((employee) => {
//             const firstName = employee.firstName.toLowerCase().startsWith(event.query.toLowerCase());
//             const lastName = employee.lastName.toLowerCase().startsWith(event.query.toLowerCase());

//             return firstName || lastName;
//         });
//     }
// };

const searchDepartmentObjective = (event) => {
    if (!event.query.trim().length) {
        autoFilteredDepartments.value = objectives?.value?.length > 0 ? [...objectives.value] : [];
    } else {
        autoFilteredDepartments.value = objectives.value.filter((department) => {
            const name = department.name.toLowerCase().startsWith(event.query.toLowerCase());

            return name;
        });
    }
};
const searchPerformanceAgreement = (event) => {
    if (!event.query.trim().length) {
        autoFilteredAgreements.value = agreements?.value?.length > 0 ? [...agreements.value] : [];
    } else {
        autoFilteredAgreements.value = agreements.value.filter((department) => {
            const name = department.output.toLowerCase().startsWith(event.query.toLowerCase());

            return name;
        });
    }
};
watch(performanceAgreementId, () => {
    employeeId.value = performanceAgreementId.value?.employeeId;
    const dateArray = performanceAgreementId.value?.dueDate;
    dueDate.value = `${dateArray[0]}-${dateArray[1]}-${dateArray[1]}`;
    console.log('dueDate', dueDate.value);
});

const emit = defineEmits(['handleData']);
const submitPayload = () => {
    const formData = {
        dueDate: changeDateFormat(dueDate.value),
        employeeId: employeeId.value,
        name: name.value,
        description: description.value,
        departmentObjectiveId: departmentObjectiveId.value.id,
        performanceAgreementId: performanceAgreementId.value.id
    };
    emit('handleData', formData);
};
watch([name, description, dueDate, departmentObjectiveId, performanceAgreementId], () => {
    submitPayload();
});
</script>

<template>
    <!-- <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content"> -->
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Message v-if="success" severity="success">{{ successMessage }}</Message>
                <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                <!-- <h5>Create Individual Objective</h5> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="name">Department Objective</label>
                        <AutoComplete placeholder="Search Objective" id="objective" :dropdown="true" :multiple="false" optionLabel="name" v-model="departmentObjectiveId" :suggestions="autoFilteredDepartments" @complete="searchDepartmentObjective">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps?.option?.name }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="agreement">Performance Agreement</label>
                        <AutoComplete placeholder="Search Agreement" id="agreement" :dropdown="true" :multiple="false" optionLabel="output" v-model="performanceAgreementId" :suggestions="autoFilteredAgreements" @complete="searchPerformanceAgreement">
                            <template #option="slotProps">
                                <div class="job-info" style="max-width:50rem">
                                    <div class="flex align-options-center">
                                        <div class="job-detail"  style="max-width:50rem">
                                            <div><strong>output:</strong> {{ slotProps?.option?.output }}</div>
                                            <div><strong>Employee:</strong>  {{ slotProps?.option?.employeeName }}</div>
                                            <div><strong>Supervisor:</strong> {{ slotProps?.option?.supervisorName }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <!-- <div class="field col-12 md:col-12">
                                <label for="name">Employee</label>
                                <AutoComplete placeholder="Search Employee" id="objective" :dropdown="true" :multiple="false" optionLabel="firstName" v-model="employeeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee">
                                    <template #option="slotProps">
                                        <div class="flex align-items-center">
                                            <div>{{ slotProps?.option?.firstName }} {{ slotProps?.option?.lastName }}</div>
                                        </div>
                                    </template>
                                </AutoComplete>
                            </div> -->
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

    <!-- <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
.job-info {
    margin-bottom: 10px; /* Space below each job info block */
    border-bottom: 1px solid #ccc;
}

.job-detail > div {
    margin-bottom: 5px; /* Space below each pair */

    padding-bottom: 5px;
}
</style>
