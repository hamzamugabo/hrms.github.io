<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useEmployee } from '@/components/employeeManagement/employeeUtils';
import { RewardType } from '@/components/reuseables/enums.js';

const { getNominations } = usePerformanceUtils();
const { getEmployees } = useEmployee();

const employeeId = ref('');
// const loading = ref(false);
const success = ref(false);
const autoFilteredEmployees = ref([]);
const autoFilteredNominations = ref([]);
const employees = ref([]);
const rewardType = ref('');
const details = ref('');
// const departments = ref([]);
const nominations = ref([]);
const nominationId = ref('');

const serverError = ref('');
const successMessage = ref('');

onMounted(async () => {
    await getEmployees(employees, false);
    await getNominations(nominations);
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
const searchNomination = (event) => {
    if (!event.query.trim().length) {
        autoFilteredNominations.value = nominations?.value?.length > 0 ? [...nominations.value] : [];
    } else {
        autoFilteredNominations.value = nominations.value.filter((nomination) => {
            const recognitionCriteria = nomination.recognitionCriteria.toLowerCase().startsWith(event.query.toLowerCase());
            const nominee = nomination.nominee.toLowerCase().startsWith(event.query.toLowerCase());

            return recognitionCriteria || nominee;
        });
    }
};


const emit = defineEmits(['handleData']);
const submitPayload = () => {
    const formData = {
        rewardDate: changeDateFormat(new Date()),
        nominationId: nominationId.value.id,
        employeeId: employeeId.value.id,
        details: details.value,
        rewardType: rewardType.value.name
    };
  
    emit('handleData', formData);
};
watch([nominationId, employeeId, details, rewardType], () => {
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
                        <!-- <h5>Reward</h5> -->
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">Nominee</label>
                                <AutoComplete placeholder="Search Nominee" id="objective" :dropdown="true" :multiple="false" optionLabel="firstName" v-model="employeeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee">
                                    <template #option="slotProps">
                                        <div class="flex align-items-center">
                                            <div>{{ slotProps?.option?.firstName }} {{ slotProps?.option?.lastName }}</div>
                                        </div>
                                    </template>
                                </AutoComplete>
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="details">details</label>
                                <InputText required id="details" type="text" v-model="details" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="name">Nomination</label>
                                <AutoComplete placeholder="Search Nomination" id="nomination" :dropdown="true" :multiple="false" optionLabel="nominee" v-model="nominationId" :suggestions="autoFilteredNominations" @complete="searchNomination">
                                    <template #option="slotProps">
                                        <div class="job-info">
                                            <div class="flex align-options-center">
                                                <div class="job-detail">
                                                    <div>Nominee: {{ slotProps?.option?.nominee }}</div>
                                                    <div>Criteria: {{ slotProps?.option?.recognitionCriteria }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </AutoComplete>
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="rewardType">Reward Type</label>
                                <Dropdown id="rewardType" v-model="rewardType" :options="RewardType" optionLabel="name" placeholder="Select RewardType"></Dropdown>
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
