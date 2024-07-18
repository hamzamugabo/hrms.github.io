<script setup>
import { onMounted, ref } from 'vue';
import { useApplicantStore } from '@/piniaStore/applicantData.js';
// import QualificationsForm from './QualificationFormTemplate.vue';
// import countryList from 'country-list';
import { fetchData, postData } from '@/components/reuseables/FetchPostData.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { useRouter } from 'vue-router';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const router = useRouter();
const genderOptions = ref([
    { name: 'MALE', code: 'MALE' },
    { name: 'FEMALE', code: 'FEMALE' }
]);
const maritalStatusOptions = ref([
    { name: 'SINGLE', code: 'SINGLE' },
    { name: 'MARRIED', code: 'MARRIED' },
    { name: 'WIDOWED', code: 'WIDOWED' },
    { name: 'DIVORCED', code: 'DIVORCED' }
]);
const idTypeOptions = ref([
    { name: 'NATIONAL_ID', code: 'NATIONAL_ID' },
    { name: 'PASSPORT', code: 'PASSPORT' },
    { name: 'DRIVING_PERMIT', code: 'DRIVING_PERMIT' }
]);

const firstName = ref('');
const lastName = ref('');
const otherName = ref('');
const gender = ref('');
const dob = ref('');
const maritalStatus = ref('');
const nationality = ref([]);
const idType = ref('');
const idNumber = ref('');
const phoneNumber = ref('');
const otherPhoneNumber = ref('');
const email = ref('');
const physicalAddress = ref('');
const position = ref('');
const department = ref('');
const dateOfJoining = ref('');
const dutyStation = ref('');
const qualificationNameEducation = ref('');
const qualificationTypeEducation = ref('');
const institutionAwardEducation = ref('');
const yearOfAwardEducation = ref('');
const commentEducation = ref('');
const qualificationNameProfessional = ref('');
const qualificationTypeProfessional = ref('');
const institutionAwardProfessional = ref('');
const yearOfAwardProfessional = ref('');
const commentProfessional = ref('');
// const allDesignations = ref([]);
// const designation = ref('');
const nationalityId = ref('');
const loading = ref(false);

const autoFilteredNationalities = ref([]);
const allNationlalities = ref([]);

const success = ref(false);
const successMessage = ref('');
const updateApplicantError = ref('');
const applicantData = ref({});

const baseURL = import.meta.env.VITE_APP_API_URL;

const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

const applicantStore = useApplicantStore();
const storedApplicantData = applicantStore.getApplicantData();

const loadFromLocalStorage = () => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null; // Parse JSON data when retrieving from local storage
};

const getNationalities = async () => {
    // console.log('nationalities');
    const url = `${baseURL}/nationality`;

    try {
        const { data } = await fetchData(url, false, router);

        allNationlalities.value = data?.nationalities;
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};

const searchNationality = (event) => {
    if (!event.query.trim().length) {
        autoFilteredNationalities.value = allNationlalities.value?.length > 0 ? [...allNationlalities.value] : [];
    } else {
        autoFilteredNationalities.value = allNationlalities.value.filter((nationality) => {
            const name = nationality.name.toLowerCase().startsWith(event.query.toLowerCase());
            const code = nationality.code.toLowerCase().includes(event.query.toLowerCase());
            return name || code;
        });
    }
};

const getApplicant = async () => {
    const url = `${baseURL}/applicant/by-id/${storedApplicantData?.id}`;

    try {
        if (url && storedApplicantData?.id) {
            const { data } = await fetchData(url, loading, router);
            firstName.value = data?.firstName;
            lastName.value = data?.lastName;
            otherName.value = data?.otherNames;
            gender.value = data?.gender;
            dob.value = data?.dob;
            maritalStatus.value = data?.maritalStatus;
            nationality.value = [];
            idType.value = data?.idType;
            idNumber.value = data?.idNumber;
            phoneNumber.value = data?.phoneNumber;
            otherPhoneNumber.value = data?.otherPhoneNumber;
            email.value = data?.emailAddress;
            physicalAddress.value = data?.physicalAddress;
            position.value = data?.position;
            department.value = data?.department;
            dateOfJoining.value = data?.dateOfJoining;
            dob.value = data?.dateOfBirth;
            dutyStation.value = data?.dutyStation;
            qualificationNameEducation.value = data?.qualificationNameEducation;
            qualificationTypeEducation.value = data?.qualificationTypeEducation;
            institutionAwardEducation.value = data?.institutionAwardEducation;
            yearOfAwardEducation.value = data?.yearOfAwardEducation;
            commentEducation.value = data?.commentEducation;
            qualificationNameProfessional.value = data?.qualificationNameProfessional;
            qualificationTypeProfessional.value = data?.qualificationTypeProfessional;
            institutionAwardProfessional.value = data?.institutionAwardProfessional;
            yearOfAwardProfessional.value = data?.yearOfAwardProfessional;
            commentProfessional.value = data?.commentProfessional;
            // console.log('employee===>', data);
            // employees.value = data;
            applicantData.value = data;
        }
    } catch (error) {
        // nationalityError.value = error;
        // console.error('Error searching employees:', error.message);
    }
};

onMounted(async () => {
    await getApplicant();
    // await getDesignations();
    await getNationalities();
});
const submitForm = async () => {
    updateApplicantError.value = '';
    loading.value = true;
    try {
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }
        const url = `${baseURL}/applicant/update`;

        if (!firstName.value.trim()) {
            showError('Please enter your first name.');
            return;
        }

        if (!lastName.value.trim()) {
            showError('Please enter your last name.');
            return;
        }

        if (!email.value.trim() || !validateEmail(email.value.trim())) {
            showError('Please enter a valid email address.');
            return;
        }
        const formData = {
            firstName: firstName.value,
            lastName: lastName.value,
            otherName: otherName.value,
            phoneNumber: phoneNumber.value,
            gender: gender.value.name,
            email: email.value,
            physicalAddress: physicalAddress.value,
            dateOfBirth: changeDateFormat(dob.value),
            maritalStatus: maritalStatus.value.name,
            idType: idType.value.name,
            nationalityId: nationalityId.value?.id,
            id: applicantData.value?.id
        };

        // console.log('formData', formData)

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            // applicantStore.setapplicantData(formData);
            loading.value = false;

            resetForm();
            success.value = true;
            loading.value = false;
            showSuccess();
             setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
        } else {
            showError(data?.message ? data?.message : data?.error);
            updateApplicantError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;

        // console.error(' error:', error);
    }
};
const resetForm = () => {
    // Reset all form fields to initial state
    firstName.value = '';
    lastName.value = '';
    otherName.value = '';
    gender.value = '';
    dob.value = '';
    maritalStatus.value = '';
    nationality.value = [];
    idType.value = '';
    idNumber.value = '';
    phoneNumber.value = '';
    otherPhoneNumber.value = '';
    email.value = '';
    physicalAddress.value = '';
    position.value = '';
    department.value = '';
    dateOfJoining.value = '';
    dutyStation.value = '';
    qualificationNameEducation.value = '';
    qualificationTypeEducation.value = '';
    institutionAwardEducation.value = '';
    yearOfAwardEducation.value = '';
    commentEducation.value = '';
    qualificationNameProfessional.value = '';
    qualificationTypeProfessional.value = '';
    institutionAwardProfessional.value = '';
    yearOfAwardProfessional.value = '';
    commentProfessional.value = '';
};
onMounted(() => {
    if (applicantData.value) {
        console.log('they should update');
        // updateFields();
    } else {
        console.log('not updated the fields');
    }
});
const dobError = ref('');
const maxDate = ref(get18YearsAgoDate());

function get18YearsAgoDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today;
}

function validateDOB() {
    const selectedDate = new Date(dob.value);
    const today = new Date();
    let ageDiff = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
        ageDiff--;
    }

    if (ageDiff < 18) {
        dobError.value = 'You must be at least 18 years old.';
    } else {
        dobError.value = '';
    }
}
</script>

<template>
    <form @submit.prevent="submitForm">
    <Toast />

        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <Message v-if="success" severity="success">{{ successMessage }}</Message>

                    <Message v-if="updateApplicantError" severity="error">{{ updateApplicantError }}</Message>
                    <h5>Personal details</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="firstname">First Name</label>
                            <InputText required id="firstname" type="text" v-model="firstName" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="lastname">Last Name</label>
                            <InputText required id="lastname" type="text" v-model="lastName" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="othername">Other Name(s)</label>
                            <InputText id="othername" type="text" v-model="otherName" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="gender">Gender</label>
                            <Dropdown id="state" v-model="gender" :options="genderOptions" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="dob">Date of Birth</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="dob" :maxDate="maxDate" @change="validateDOB"></Calendar>
                        </div>

                        <div class="field col-12 md:col-4">
                            <label for="maritalstatus">Marital Status</label>
                            <Dropdown id="state" v-model="maritalStatus" :options="maritalStatusOptions" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="maritalstatus">Nationality</label>
                            <AutoComplete placeholder="Search" id="nationality" optionLabel="code" :dropdown="true" :multiple="false" v-model="nationality" :suggestions="autoFilteredNationalities" @complete="searchNationality($event)" field="name">
                                <template #option="slotProps">
                                    <div class="flex align-options-center">
                                        <div>{{ slotProps?.option?.name }}</div>
                                        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <!-- Space character -->
                                        <div>{{ slotProps?.option?.code }}</div>
                                    </div>
                                </template>
                            </AutoComplete>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <h5>Identification details</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="idtype">ID Type</label>
                            <Dropdown id="state" v-model="idType" :options="idTypeOptions" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="idnumber">ID Number</label>
                            <InputText required id="idnumber" type="text" v-model="idNumber" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <h5>Contact Information</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="phonenumber">Phone Number</label>
                            <InputText id="phonenumber" type="text" v-model="phoneNumber" />
                        </div>
                        <!-- <div class="field col-12 md:col-4">
                            <label for="otherphonennumber">Another Phone Number</label>
                            <InputText id="otherphonennumber" type="text" v-model="otherPhoneNumber" />
                        </div> -->
                        <div class="field col-12 md:col-4">
                            <label for="email">Email Address</label>
                            <InputText id="email" type="text" v-model="email" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="address">Physical Address (Residence)</label>
                            <InputText required id="address" type="text" v-model="physicalAddress" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; cursor: pointer; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Update Applicant</button>
        </div>
    </form>
</template>
