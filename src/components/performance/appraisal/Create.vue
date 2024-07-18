<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useEmployee } from '@/components/employeeManagement/employeeUtils';
import { AppraisalPhase } from '@/components/reuseables/enums';
// import { useToastPopup } from '@/components/reuseables/useToast.js';

// const { showError, showSuccess } = useToastPopup();
const { getPerformanceAgreements } = usePerformanceUtils();

const { getEmployees } = useEmployee();

const comments = ref('');
const employeeId = ref('');
const supervisorId = ref('');
const appraisalPhase = ref({});
const performanceAgreementId = ref('');
// const loading = ref(false);
const success = ref(false);
const autoFilteredEmployees = ref([]);
const autoFilteredSupervisors = ref([]);
const autoFilteredAgreements = ref([]);
const employees = ref([]);
const supervisors = ref([]);
// const departments = ref([]);
const agreements = ref([]);

const serverError = ref('');
const successMessage = ref('');

onMounted(async () => {
    await getEmployees(employees, false);
    await getEmployees(supervisors, false);
    await getPerformanceAgreements(agreements);
});

const searchEmployee = (event) => {
    if (!event.query.trim().length) {
        autoFilteredEmployees.value = employees?.value?.length > 0 ? [...employees.value] : [];
    } else {
        autoFilteredEmployees.value = employees.value.filter((employee) => {
            const firstName = employee.firstName.toLowerCase().startsWith(event.query.toLowerCase());
            const lastName = employee.lastName.toLowerCase().startsWith(event.query.toLowerCase());

            return firstName || lastName;
        });
    }
};
const searchSupervisor = (event) => {
    if (!event.query.trim().length) {
        autoFilteredSupervisors.value = supervisors?.value?.length > 0 ? [...supervisors.value] : [];
    } else {
        autoFilteredSupervisors.value = supervisors.value.filter((supervisor) => {
            const firstName = supervisor.firstName.toLowerCase().startsWith(event.query.toLowerCase());
            const lastName = supervisor.lastName.toLowerCase().startsWith(event.query.toLowerCase());

            return firstName || lastName;
        });
    }
};
const searchPerformanceAgreement = (event) => {
    if (!event.query.trim().length) {
        autoFilteredAgreements.value = agreements?.value?.length > 0 ? [...agreements.value] : [];
    } else {
        autoFilteredAgreements.value = agreements.value.filter((department) => {
            const name = department.name.toLowerCase().startsWith(event.query.toLowerCase());

            return name;
        });
    }
};
const emit = defineEmits(['handleData']);
const handleGetData = () => {
    const formData = {
        appraisalPhase: appraisalPhase?.value?.name,
        date: changeDateFormat(new Date()),
        employeeId: employeeId.value.id,
        comments: comments.value,
        supervisorId: supervisorId.value.id,
        performanceAgreementId: performanceAgreementId.value.id
    };

    emit('handleData', formData);
};
watch([appraisalPhase, employeeId, comments, supervisorId, performanceAgreementId], () => {
    handleGetData();
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
                <!-- <h5>Create Appraisal</h5> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="appraisalPhase">Appraisal Phase</label>
                        <Dropdown id="appraisalPhase" v-model="appraisalPhase" :options="AppraisalPhase" optionLabel="name" placeholder="Select AppraisalPhase"></Dropdown>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Employee</label>
                        <AutoComplete placeholder="Search Employee" id="objective" :dropdown="true" :multiple="false" optionLabel="firstName" v-model="employeeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps?.option?.firstName }} {{ slotProps?.option?.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="comments">comments</label>
                        <Textarea id="comments" v-model="comments" required="true" rows="2" cols="20" />

                        <!-- <InputText required id="comments" type="text" v-model="comments" /> -->
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="agreement">Performance Agreement</label>
                        <AutoComplete placeholder="Search Agreement" id="agreement" :dropdown="true" :multiple="false" optionLabel="output" v-model="performanceAgreementId" :suggestions="autoFilteredAgreements" @complete="searchPerformanceAgreement">
                            <template #option="slotProps">
                                <div class="job-info" >
                                    <div class="flex align-options-center">
                                        <div class="job-detail" >
                                            <div>output: {{ slotProps?.option?.output }}</div>
                                            <div>Employee: {{ slotProps?.option?.employeeName }}</div>
                                            <div>Supervisor: {{ slotProps?.option?.supervisorName }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="name">Supervisor</label>
                        <AutoComplete placeholder="Search Supervisor" id="objective" :dropdown="true" :multiple="false" optionLabel="firstName" v-model="supervisorId" :suggestions="autoFilteredSupervisors" @complete="searchSupervisor">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps?.option?.firstName }} {{ slotProps?.option?.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-5" style="margin: 10px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div> -->
    <!-- </form>
    </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
.job-info {
    max-width: 10rem;
    margin-bottom: 10px; /* Space below each job info block */
    border-bottom: 1px solid #ccc;
}

.job-detail > div {
    margin-bottom: 5px; /* Space below each pair */

    padding-bottom: 5px;
}
</style>
