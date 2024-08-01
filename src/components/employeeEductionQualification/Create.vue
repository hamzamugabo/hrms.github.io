<script setup>
import { onMounted, ref } from 'vue';
import QualificationsForm from './AddQualificationComponent.vue';

// import countryList from 'country-list';
import { fetchData, postData, baseURL } from '@/components/reuseables/FetchPostData.js';

import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';

const allInstitutions = ref([]);
const autoFilteredAwardingInstitutions = ref([]);
const allQualifications = ref([]);
const autoFilteredQualifications = ref([]);
const allEmployees = ref([]);
const autoFilteredEmployees = ref([]);
const loading = ref(false);

const qualificationSuccess = ref(false);

const qualificationSuccessMessage = ref('');
const qualificationError = ref('');
// const uploadedFiles = ref([]);

const educationQualificationLabel = ref('Education qualification');
const educationQualification = ref([
    { name: '', yearOfAward: '', qualificationTypeId: '', awardingInstitutionId: '', employeeId: '' } // Initial empty qualification
]);


const getAwardingInstitutions = async () => {
    const url = `${baseURL}/awarding-institution`;

    try {
        const { data } = await fetchData(url, loading);

        allInstitutions.value = data;
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};
const getQualifications = async () => {
    const url = `${baseURL}/qualification-type`;

    try {
        const { data } = await fetchData(url, loading);

        allQualifications.value = data;
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};
const getEmployees = async () => {
    const url = `${baseURL}/employees`;

    try {
        const { data } = await fetchData(url, loading);
        // console.log('empployees', data)

        allEmployees.value = data;
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};
const searchAwardingInstitution = (event) => {
    if (!event.query.trim().length) {
        autoFilteredAwardingInstitutions.value = [...allInstitutions.value];
    } else {
        autoFilteredAwardingInstitutions.value = allInstitutions.value.filter((institution) => {
            const locationMatches = institution.location.toLowerCase().startsWith(event.query.toLowerCase());
            const nameMatches = institution.name.toLowerCase().includes(event.query.toLowerCase());
            return locationMatches || nameMatches;
        });
    }
};
const searchQualification = (event) => {
    if (!event.query.trim().length) {
        autoFilteredQualifications.value = [...allQualifications.value];
    } else {
        autoFilteredQualifications.value = allQualifications.value.filter((qualification) => {
            return qualification.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
};
const searchEmployee = (event) => {
    if (!event.query.trim().length) {
        autoFilteredEmployees.value = [...allEmployees.value];
    } else {
        autoFilteredEmployees.value = allEmployees.value.filter((employee) => {
            const firstNameMatches = employee.firstName.toLowerCase().startsWith(event.query.toLowerCase());
            const lastNameMatches = employee.lastName.toLowerCase().includes(event.query.toLowerCase());
            return firstNameMatches || lastNameMatches;
        });
    }
};
onMounted(async () => {
    await getAwardingInstitutions();
    await getQualifications();
    await getEmployees();
});
const submitForm = async () => {
    try {
        loading.value = true;
        const url = `${baseURL}/employees/qualifications/create`;
        console.log(' educationQualification?.value', educationQualification?.value);
        educationQualification?.value?.forEach(async (qualificationElement) => {
            // Check if any required properties are missing or empty
            if (!qualificationElement?.awardingInstitutionId?.id || !qualificationElement?.name || !qualificationElement?.qualificationTypeId?.id || !qualificationElement?.yearOfAward || !qualificationElement?.employeeId) {
                // Skip the element and move to the next iteration
                return;
            }

            const formData = {
                awardingInstitutionId: qualificationElement?.awardingInstitutionId?.id,
                employeeId: qualificationElement?.employeeId?.id,
                name: qualificationElement?.name,
                qualificationTypeId: qualificationElement?.qualificationTypeId?.id,
                yearOfAward: changeDateFormat(qualificationElement?.yearOfAward)
            };
             

            const data = await postData(url, formData, loading);
             
            if (data?.status === 200 || data?.status === 201) {
                qualificationSuccessMessage.value = data?.message;
                // employeeStore.setEmployeeData(formData);
                loading.value = false;

                // resetForm();
                qualificationSuccess.value = true;
                loading.value = false;
            } else {
                qualificationError.value = data?.message ? data?.message : data?.error;
            }
        });
    } catch (error) {
        loading.value = false;
        console.log(error?.error);
    }
};
</script>

<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-12 md:col-12">
                <div class="card p-fluid">
                    <Message v-if="qualificationSuccess" severity="success">{{ qualificationSuccessMessage }} </Message>

                    <Message v-if="qualificationError" severity="error">{{ qualificationError }} </Message>
                    <h5>Education qualification</h5>

                    <div class="field">
                        <div class="flex items-center">
                            <QualificationsForm
                                :qualifications="educationQualification"
                                :autoFilteredAwardingInstitutions="autoFilteredAwardingInstitutions"
                                :autoFilteredQualifications="autoFilteredQualifications"
                                :autoFilteredEmployees="autoFilteredEmployees"
                                :label="educationQualificationLabel"
                                @searchAwardingInstitution="searchAwardingInstitution"
                                @searchQualification="searchQualification"
                                @searchEmployee="searchEmployee"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Add Employee Qualification</button>
        </div>
    </form>
</template>
<style scoped>
.addEmployeeButtons {
    background-color: #db0000;
    color: #ffffff;
    padding: 10px;
    border-radius: 0.5rem;
    padding-bottom: 10px;
    display: flex;
    cursor: pointer;
}
</style>
