<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
// import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useEmployee } from '@/components/employeeManagement/employeeUtils';
import { MetricCategory } from '@/components/reuseables/enums';
const { getPerformanceAgreements, getAppraisals } = usePerformanceUtils();
const { getEmployees } = useEmployee();

const performanceAgreementId = ref('');
// const loading = ref(false);
const success = ref(false);
const autoFilteredAppraisals = ref([]);
const autoFilteredAgreements = ref([]);

const employees = ref([]);
const appraisals = ref([]);
const supervisors = ref([]);
const appraisalId = ref('');
const metricCategory = ref({});
const metricDescription = ref('');
// const departments = ref([]);
const agreements = ref([]);

const serverError = ref('');
const successMessage = ref('');

onMounted(async () => {
    await getEmployees(employees, false);
    await getEmployees(supervisors, false);
    await getPerformanceAgreements(agreements);
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
const submitPayload = () => {
    const formData = {
        appraisalId: appraisalId.value.id,
        metricCategory: metricCategory.value?.name,
        metricDescription: metricDescription.value,
        performanceAgreementId: performanceAgreementId.value.id
    };
    emit('handleData', formData);
};
watch([appraisalId, metricCategory, metricDescription, performanceAgreementId], () => {
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
                <!-- <h5>Create performance Metric</h5> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="metricCategory">Metric Category</label>
                        <Dropdown id="metricCategory" v-model="metricCategory" :options="MetricCategory" optionLabel="name" placeholder="Select metricCategory"></Dropdown>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">appraisal</label>
                        <AutoComplete placeholder="Search appraisal" id="appraisal" :dropdown="true" :multiple="false" optionLabel="appraisalPhase" v-model="appraisalId" :suggestions="autoFilteredAppraisals" @complete="searchAppraisal">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps?.option?.appraisalPhase }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="metricDescription">Metric Description</label>
                        <InputText required id="metricDescription" type="text" v-model="metricDescription" />
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="agreement">Performance Agreement</label>
                        <AutoComplete placeholder="Search Agreement" id="agreement" :dropdown="true" :multiple="false" optionLabel="output" v-model="performanceAgreementId" :suggestions="autoFilteredAgreements" @complete="searchPerformanceAgreement">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps?.option?.output }}</div>
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
