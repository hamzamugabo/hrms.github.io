<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useEmployee } from '@/components/employeeManagement/employeeUtils';
import { RecognitionCriteria, RewardType } from '@/components/reuseables/enums.js';

const { getDepartmentObjectives, getPerformanceAgreements } = usePerformanceUtils();
const { getEmployees } = useEmployee();

const nomineeId = ref('');
const nominatorId = ref('');
// const loading = ref(false);
const success = ref(false);
const autoFilteredEmployees = ref([]);
const objectives = ref([]);
const employees = ref([]);
const recognitionCriteria = ref('');
const rewardType = ref('');
const reason = ref('');
// const departments = ref([]);
const agreements = ref([]);

const serverError = ref('');
const successMessage = ref('');

onMounted(async () => {
    await getEmployees(employees, false);
    await getDepartmentObjectives(objectives, false);
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

const emit = defineEmits(['handleData']);
const submitPayload = () => {
    const formData = {
        nominationDate: changeDateFormat(new Date()),
        nominatorId: nominatorId.value.id,
        nomineeId: nomineeId.value.id,
        reason: reason.value,
        recognitionCriteria: recognitionCriteria.value.name,
        rewardType: rewardType.value.name
    };
    emit('handleData', formData);
};
watch([nomineeId, reason, nominatorId, recognitionCriteria, rewardType], () => {
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
                <!-- <h5>Nominate</h5> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="name">Nominee</label>
                        <AutoComplete placeholder="Search Nominee" id="objective" :dropdown="true" :multiple="false" optionLabel="firstName" v-model="nomineeId" :suggestions="autoFilteredEmployees" @complete="searchEmployee">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps?.option?.firstName }} {{ slotProps?.option?.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="name">Nominator</label>
                        <AutoComplete placeholder="Search Nominator" id="nominator" :dropdown="true" :multiple="false" optionLabel="firstName" v-model="nominatorId" :suggestions="autoFilteredEmployees" @complete="searchEmployee">
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
                    <div class="field col-12 md:col-12">
                        <label for="recognitionCriteria">Recognition Criteria</label>
                        <Dropdown id="recognitionCriteria" v-model="recognitionCriteria" :options="RecognitionCriteria" optionLabel="name" placeholder="Select RecognitionCriteria"></Dropdown>
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
</style>
