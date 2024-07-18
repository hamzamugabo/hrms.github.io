<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useEmployee } from '@/components/employeeManagement/employeeUtils';

const { getOrganisationObjectives } = usePerformanceUtils();
const { getEmployees, getSupervisors } = useEmployee();

const kpi = ref('');
const output = ref('');
const target = ref(0);
const meansOfVerification = ref('');
const dueDate = ref('');
const employeeId = ref('');
const supervisorId = ref('');
// const loading = ref(false);
const success = ref(false);
const autoFilteredEmployees = ref([]);
const autoFilteredSupervisors = ref([]);
const objectives = ref([]);
const employees = ref([]);
const supervisors = ref([]);

const serverError = ref('');
const successMessage = ref('');
const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}

onMounted(async () => {
    await getOrganisationObjectives(objectives);
    await getEmployees(employees, false);
    await getSupervisors(supervisors, false);
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
        dueDate: changeDateFormat(dueDate.value),
        employeeId: employeeId.value.id,
        kpi: kpi.value,
        meansOfVerification: meansOfVerification.value,
        output: output.value,
        supervisorId: supervisorId.value.id,
        target: target.value
    };
    emit('handleData', formData);
};
watch([employeeId, kpi, meansOfVerification, output, supervisorId, target], () => {
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
                        <!-- <h5>Create performance agreement</h5> -->
                        <div class="p-fluid formgrid grid">
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
                                <label for="kpi">KPI</label>
                                <InputText required id="kpi" type="text" v-model="kpi" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="meansOfVerification">Means Of Verification</label>
                                <InputText required id="meansOfVerification" type="text" v-model="meansOfVerification" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="output">Output</label>
                                <InputText required id="output" type="text" v-model="output" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="target">Target</label>
                                <InputText required id="target" type="text" v-model="target" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="dueDate">Due Date</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="dueDate" :minDate="minDate"></Calendar>
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
</style>
