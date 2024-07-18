<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { AppealStatus } from '@/components/reuseables/enums';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useEmployee } from '@/components/employeeManagement/employeeUtils';
// import { baseURL } from '../../reuseables/FetchPostData';
// import { useToastPopup } from '@/components/reuseables/useToast.js';

// const { showError, showSuccess } = useToastPopup();
const { getAppraisals } = usePerformanceUtils();
const { getEmployees } = useEmployee();

// const loading = ref(false);
const success = ref(false);
const autoFilteredAppraisals = ref([]);
const autoFilteredEmployees = ref([]);
const autoFilteredSupervisors = ref([]);
const employees = ref([]);
const appraisals = ref([]);
const supervisors = ref([]);
const appraisalId = ref('');
const appealStatus = ref({ name: '', code: '' });
const reason = ref('');
const supervisorId = ref('');
const employeeId = ref('');

const serverError = ref('');
const successMessage = ref('');

onMounted(async () => {
    await getEmployees(employees, false);
    await getEmployees(supervisors, false);
    await getAppraisals(appraisals);
});

const searchAppraisal = (event) => {
    if (!event.query.trim().length) {
        autoFilteredAppraisals.value = appraisals?.value?.length > 0 ? [...appraisals.value] : [];
    } else {
        autoFilteredAppraisals.value = appraisals.value.filter((appraisal) => {
            const appraisalPhase = appraisal.appraisalPhase.toLowerCase().startsWith(event.query.toLowerCase());
            const comments = appraisal.comments.toLowerCase().startsWith(event.query.toLowerCase());

            return appraisalPhase || comments;
        });
    }
};

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
const searchSupervisors = (event) => {
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
const emit = defineEmits(['handleData']);
const submitPayload = () => {
    const formData = {
        appealStatus: appealStatus.value.name,
        appraisalId: appraisalId.value.id,
        date: changeDateFormat(new Date()),
        employeeId: employeeId.value.id,
        reason: reason.value,
        supervisorId: supervisorId.value.id
    };
    emit('handleData', formData);
};
watch([appealStatus, appraisalId, employeeId, reason, supervisorId], () => {
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
                        <!-- <h5>Create Appraisal Appeal</h5> -->
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="appealStatus">Appeal Status</label>
                                <Dropdown id="appealStatus" v-model="appealStatus.name" :options="AppealStatus" optionLabel="name" placeholder="Select AppealStatus"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="name">Appraisal</label>
                                <AutoComplete placeholder="Search appraisal" id="appraisal" :dropdown="true" :multiple="false" optionLabel="appraisalPhase" v-model="appraisalId" :suggestions="autoFilteredAppraisals" @complete="searchAppraisal">
                                    <template #option="slotProps">
                                        <div class="flex align-items-center">
                                            <div>{{ slotProps?.option?.appraisalPhase }}</div>
                                        </div>
                                    </template>
                                </AutoComplete>
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
                                <label for="name">Supervisor</label>
                                <AutoComplete placeholder="Search supervisor" id="objective" :dropdown="true" :multiple="false" optionLabel="firstName" v-model="supervisorId" :suggestions="autoFilteredSupervisors" @complete="searchSupervisors">
                                    <template #option="slotProps">
                                        <div class="flex align-items-center">
                                            <div>{{ slotProps?.option?.firstName }} {{ slotProps?.option?.lastName }}</div>
                                        </div>
                                    </template>
                                </AutoComplete>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="reason">reason</label>
                                <InputText required id="reason" type="text" v-model="reason" />
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
            </div> -->
        <!-- </form>
    </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
