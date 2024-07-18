<script setup>
import { ref } from 'vue';

import { postData, baseURL } from '@/components/reuseables/FetchPostData.js';

import SpinnerVue from '@/components/reuseables/Spinner.vue';
import PersonalDetails from './PersonalDetails.vue';
import ApplicantEducation from './ApplicantEduction.vue';
import ApplicantExprience from './ApplicantExperience.vue';
import { useApplicant } from './addAplicantUtils';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const { addApplicantEducationImport, addApplicantExperienceImport, updateCoverLetterImport, updateResumeImport } = useApplicant();

const idTypeOptions = ref([
    { name: 'NATIONAL_ID', code: 'NATIONAL_ID' },
    { name: 'PASSPORT', code: 'PASSPORT' },
    { name: 'DRIVING_PERMIT', code: 'DRIVING_PERMIT' }
]);

const idType = ref('');
const idNumber = ref('');
const phoneNumber = ref('');
const email = ref('');
const physicalAddress = ref('');
const loading = ref(false);
const successAddEducation = ref(false);
const successAddExperience = ref(false);
const success = ref(false);
const successCover = ref(false);
const successResume = ref(false);
const successUpload = ref(false);
const qualificationSuccess = ref(false);
const successMessage = ref('');
const successMessageCover = ref('');
const successMessageResume = ref('');
const successMessageAddEducation = ref('');
const successMessageAddExperience = ref('');
const qualificationSuccessMessage = ref('');
const qualificationError = ref('');
const addEducationError = ref('');
const addExperienceError = ref('');
const uploadCoverError = ref('');
const uploadResumeError = ref('');
const applicant = ref('');
const addEmployeeError = ref('')

const educationDoc = ref([]);
const successMessageUpload = ref('');
const resumeFileData = ref('');
const coverFileData = ref('');
const applicantPersonalDetails = ref({});
const applicantEducationDetails = ref({});
const applicantExperienceDetails = ref({});

const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
const loadFromLocalStorage = () => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null; // Parse JSON data when retrieving from local storage
};

const navigateToAddQualification = () => {
    history.push('/employees/qualification/create');
};

const onFileChangeAcademicDocs = (e) => {
    if (!e.length) return;

    educationDoc.value = e;
};
const addApplicantEducation = async (applicantId) => {
    addApplicantEducationImport(applicantId, applicantEducationDetails, educationDoc, loading, successMessageAddEducation, successMessageUpload, successUpload, addEducationError, successAddEducation);
};

const addApplicantExperience = async (applicantId) => {
    addApplicantExperienceImport(applicantId, applicantExperienceDetails, baseURL, loading, successMessageAddExperience, successAddExperience, addExperienceError);
};
const submitForm = async () => {
     addEmployeeError.value = '';
    loading.value = true;
    const formData = {
        firstName: applicantPersonalDetails?.value?.firstName,
        lastName: applicantPersonalDetails?.value?.lastName,
        otherName: applicantPersonalDetails?.value?.otherName,
        phoneNumber: phoneNumber.value,
        gender: applicantPersonalDetails?.value?.gender?.name,
        email: email.value,
        physicalAddress: physicalAddress.value,
        dateOfBirth: changeDateFormat(applicantPersonalDetails?.value?.dob),
        maritalStatus: applicantPersonalDetails?.value?.maritalStatus?.name,
        idType: idType.value.name,
        nationalityId: applicantPersonalDetails?.value?.nationalityId?.id
    };
    try {
        const url = `${baseURL}/applicant/create`;
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }

        if (!applicantPersonalDetails?.value?.firstName?.trim()) {
            alert('Please enter your first name.');
            return;
        }

        if (!applicantPersonalDetails?.value?.lastName?.trim()) {
            alert('Please enter your last name.');
            return;
        }

        if (!email?.value.trim() || !validateEmail(email?.value?.trim())) {
            alert('Please enter a valid email address.');
            return;
        }

        console.log('Form submitted:', formData);
  

        const data = await postData(url, formData, loading);
        const applicantPostData = data;
        applicant.value = data?.data;
        if (data?.status === 200 || data?.status === 201) {
            // successMessage.value = data?.message;
            // success.value = true;
            showSuccess(data?.message);

            await addApplicantEducation(applicantPostData?.data?.id !== data?.data?.id ? applicantPostData?.data?.id : data?.data?.id);
            await addApplicantExperience(applicantPostData?.data?.id !== data?.data?.id ? applicantPostData?.data?.id : data?.data?.id);
            if (resumeFileData.value) {
                const fileFormData = new FormData();
                fileFormData.append('id', applicantPostData?.data?.id !== data?.data?.id ? applicantPostData?.data?.id : data?.data?.id);
                fileFormData.append('file', resumeFileData.value);
                await updateResume(fileFormData);
            }
            if (coverFileData.value) {
                const fileFormData = new FormData();
                fileFormData.append('id', applicantPostData?.data?.id !== data?.data?.id ? applicantPostData?.data?.id : data?.data?.id);
                fileFormData.append('file', resumeFileData.value);
                await updateCoverLetter(fileFormData);
            }

            applicantPersonalDetails.value = {};
        } else {
            showError(data?.message ? data?.message : data?.error);
            addEmployeeError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        console.log('Form submitted:', formData);

        loading.value = false;
        console.log(error?.error);
    }
};

const updateCoverLetter = async (formData) => {
    updateCoverLetterImport(formData, baseURL, loading, successMessageCover, successCover, uploadCoverError);
};
const updateResume = async (formData) => {
    updateResumeImport(formData, baseURL, loading, successMessageResume, successResume, uploadResumeError);
};
const handleFileCoverSelected = (file) => {
    coverFileData.value = file;
};
const handleFileResumeSelected = async (file) => {
    resumeFileData.value = file;
};
const handlePersonalDetails = (data) => {
    applicantPersonalDetails.value = data;
};
const handleEducationDetails = (data) => {
    applicantEducationDetails.value = data;
};
const handleExperienceDetails = (data) => {
    applicantExperienceDetails.value = data;
};
</script>

<template>
    <form @submit.prevent="submitForm">
        <Toast />
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <Message v-if="success" severity="success">{{ successMessage }}</Message>

                    <Message v-if="addEmployeeError" severity="error">{{ addEmployeeError }}</Message>
                    <Message v-if="qualificationSuccess" severity="success">{{ qualificationSuccessMessage }} </Message>

                    <Message v-if="qualificationError" severity="error"
                        >{{ qualificationError }}
                        <h4 @click="navigateToAddQualification">Click to add Eduction qualificationSuccess</h4></Message
                    >
                    <h5>Personal details</h5>
                    <PersonalDetails @handlePersonalDetails="handlePersonalDetails" />
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
            <div class="col-12">
                <div class="card">
                    <Message v-if="successAddEducation" severity="success">{{ successMessageAddEducation }}</Message>

                    <Message v-if="addEducationError" severity="error">{{ addEducationError }}</Message>

                    <h5>Eduction Qualification details</h5>
                    <ApplicantEducation
                        @handleEducationDetails="handleEducationDetails"
                        @onFileChangeAcademicDocs="onFileChangeAcademicDocs"
                        @handleFileCoverSelected="handleFileCoverSelected"
                        @handleFileResumeSelected="handleFileResumeSelected"
                        :successMessageCover="successMessageCover"
                        :successMessageResume="successMessageResume"
                        :uploadCoverError="uploadCoverError"
                        :uploadResumeError="uploadResumeError"
                    />
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <Message v-if="successAddExperience" severity="success">{{ successMessageAddExperience }}</Message>

                    <Message v-if="addExperienceError" severity="error">{{ addExperienceError }}</Message>

                    <Message v-if="successUpload" severity="success">{{ successMessageUpload }}</Message>

                    <!-- <Message v-if="uploadProfileError" severity="error">{{ uploadProfileError }}</Message> -->

                    <h5>Exprience details</h5>
                    <ApplicantExprience @handleExperienceDetails="handleExperienceDetails" />
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3 my-custom-button">Add Applicant</button>
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
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
