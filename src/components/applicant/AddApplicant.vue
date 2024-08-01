<script setup>
import { onMounted, ref } from 'vue';
import { useApplicantStore } from '@/piniaStore/applicantData.js';
import QualificationsForm from './QualificationFormTemplate.vue';

import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';

// import countryList from 'country-list';
import { fetchData, postData, baseURL } from '@/components/reuseables/FetchPostData.js';
import { genderOptionsEnum, maritalStatusOptionsEnum, idTypeOptionsEnum } from '@/components/reuseables/enums.js';
// import { useRouter } from 'vue-router';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import EmployeeExperience from './AddApplicantExperience.vue';
 
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
// import AddDocuments from './AddEmployeeDocuments.vue';
import ApplicantDocUpload from './ApplicantDocUpload.vue';
import { useJobDescription } from '@/components/jobDescription/jobDescriptionUtils';
import { useApplicant } from './addApplicantUtils.js';
const { addApplicantAcademicDocs, updateCoverLetterImport, updateResumeImport } = useApplicant();

import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const { getJobDescriptions } = useJobDescription();
const genderOptions = ref(genderOptionsEnum);
const maritalStatusOptions = ref(maritalStatusOptionsEnum);
const idTypeOptions = ref(idTypeOptionsEnum);

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
const nationalityId = ref('');

const addEmployeeError = ref('');
const allDesignations = ref([]);

const allNationlalities = ref([]);
const autoFilteredNationlalities = ref([]);
const allDepartments = ref([]);

const allInstitutions = ref([]);
const autoFilteredAwardingInstitutions = ref([]);
const allQualifications = ref([]);
const autoFilteredQualifications = ref([]);
const loading = ref(false);
// const success = ref(false);
// const serverError = ref('');
const success = ref(false);
const qualificationSuccess = ref(false);
const successMessage = ref('');
const qualificationSuccessMessage = ref('');
const qualificationError = ref('');
const others = ref('');

const otherEmail = ref('');
const applicantExperienceDetails = ref({});

const successMessageAddExperience = ref(false);
const successAddExperience = ref('');
const addExperienceError = ref('');

// const successUploadDocs = ref(false);
// const successMessageUploadDocs = ref('');
// const serverErrorUploadDocs = ref('');

const jobDescriptions = ref([]);
const educationQualificationLabel = ref('Education qualification');
const educationQualification = ref([
    {
        award: '',
        endDate: new Date(),
        fieldOfStudy: '',
        schoolName: '',
        startDate: new Date()
    }
]);
const createdApplicant = ref({});

// const baseURL = import.meta.env.VITE_APP_API_URL;

const handleRemoveQualification = (index) => {
    educationQualification.value.splice(index, 1);
};

const handleAddQualification = () => {
    educationQualification.value.push({
        award: '',
        endDate: new Date(),
        fieldOfStudy: '',
        schoolName: '',
        startDate: new Date()
    });
};
const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
const loadFromLocalStorage = () => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null; // Parse JSON data when retrieving from local storage
};
const applicantStore = useApplicantStore();

const getDesignations = async () => {
  
    const url = `${baseURL}/designation`;

    try {
        const { data } = await fetchData(url);
        allDesignations.value = data?.designations;
        // Handle the fetched data here
    } catch (error) {
        allDesignations.value = [];

        // Handle errors here
    }
};

const getNationalities = async () => {
  
    const url = `${baseURL}/nationality`;

    try {
        const { data } = await fetchData(url);

        allNationlalities.value = data?.nationalities;
        // Handle the fetched data here
    } catch (error) {
        allNationlalities.value = [];

        // Handle errors here
    }
};

const getDepartments = async () => {
    const url = `${baseURL}/department`;

    try {
        const { data } = await fetchData(url, loading);

        allDepartments.value = data?.departments;
        // Handle the fetched data here
    } catch (error) {
        allDepartments.value = [];

        // Handle errors here
    }
};
const getAwardingInstitutions = async () => {
    const url = `${baseURL}/awarding-institution`;

    try {
        const { data } = await fetchData(url, loading);

        allInstitutions.value = data?.awardingInstitutions;
        // Handle the fetched data here
    } catch (error) {
        allInstitutions.value = [];

        // Handle errors here
    }
};
const getQualifications = async () => {
    const url = `${baseURL}/qualification-type`;

    try {
        const { data } = await fetchData(url, loading);

        allQualifications.value = data?.qualificationTypes;
        // Handle the fetched data here
    } catch (error) {
        allQualifications.value = [];

        // Handle errors here
    }
};
const searchNationality = (event) => {
    if (!event.query.trim().length) {
        autoFilteredNationlalities.value = allNationlalities?.value?.length > 0 ? [...allNationlalities.value] : [];
    } else {
        autoFilteredNationlalities.value = allNationlalities.value.filter((country) => {
            return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
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
onMounted(async () => {
    await getDesignations();
    await getNationalities();
    await getDepartments();
    await getAwardingInstitutions();
    await getQualifications();
    await getJobDescriptions(jobDescriptions);
});

const addEducationQualificationLoading = ref(false);
const createdEducationDetails = ref({});
const addApplicantEducationQualification = async (applicantId, nextCallback) => {
    addEducationQualificationLoading.value = true;
    try {
        if (!applicantId) {
            showError('no Applicant');
            return;
        }
        const url = `${baseURL}/applicant/education/create/${applicantId}`;
        educationQualification?.value?.forEach(async (qualificationElement) => {
            const formData = {
                award: qualificationElement?.award,
                schoolName: qualificationElement?.schoolName,
                endDate: changeDateFormat(qualificationElement?.endDate),
                fieldOfStudy: qualificationElement?.fieldOfStudy,
                startDate: changeDateFormat(qualificationElement?.startDate)
            };

            const data = await postData(url, formData, addEducationQualificationLoading);
        
            createdEducationDetails.value = data?.data;
            if (data?.status === 200 || data?.status === 201) {
                qualificationError.value = '';
                qualificationSuccessMessage.value = data?.message;
                // applicantStore.departmendepartmentIdtIddepartmentId(formData);
                addEducationQualificationLoading.value = false;

                // resetForm();
                qualificationSuccess.value = true;

                addEducationQualificationLoading.value = false;
                showSuccess(data?.message);

                setTimeout(() => {
                    qualificationSuccess.value = false;
                    qualificationSuccessMessage.value = '';
                }, 1000);
                nextCallback();
            } else {
                addEducationQualificationLoading.value = false;

                qualificationSuccessMessage.value = '';
                qualificationSuccess.value = false;

                qualificationError.value = data?.message ? data?.message : data?.error;
                showError(data?.message ? data?.message : data?.error);
                setTimeout(() => {
                    qualificationError.value = '';
                }, 1000);
            }
        });
    } catch (error) {
        addEducationQualificationLoading.value = false;
        console.log(error?.error);
        qualificationSuccessMessage.value = '';
        qualificationSuccess.value = false;
    }
};
const validatePhoneNumber = (number) => {
    const phonePattern = /^\d{10,12}$/; // Adjust the pattern to match 10 to 15 digits
    return phonePattern.test(number);
};
const addExperienceLoading = ref(false);

// eslint-disable-next-line no-unused-vars
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
// const navigateToAddQualification = () => {
//     history.push('/employees/qualification/create');
// };
const handleExperienceDetails = (data) => {
    applicantExperienceDetails.value = data;
};

const addApplicantExperience = async (applicantId, nextCallback) => {
    addExperienceError.value = '';

    addExperienceLoading.value = true;
    try {
        const url = `${baseURL}/applicant/experience/create/${applicantId}`;

        if (!applicantExperienceDetails?.value?.companyName?.trim()) {
            alert('Please enter Company name.');
            return;
        }

        const formData = {
            achievements: applicantExperienceDetails?.value?.achievements,
            companyName: applicantExperienceDetails?.value?.companyName,
            endDate: changeDateFormat(applicantExperienceDetails?.value?.endDate),
            jobTitle: applicantExperienceDetails?.value?.jobTitle,
            responsibilities: applicantExperienceDetails?.value?.responsibilities,
            startDate: changeDateFormat(applicantExperienceDetails?.value?.startDate)
        };
   
        const data = await postData(url, formData, addExperienceLoading);

        if (data?.status === 200 || data?.status === 201) {
            addExperienceError.value = '';
            successMessageAddExperience.value = data?.message;
            // applicantStore.setapplicantData(formData);
            addExperienceLoading.value = false;

            applicantExperienceDetails.value = {};
            successAddExperience.value = true;
            addExperienceLoading.value = false;
            showSuccess(data?.message);
            setTimeout(() => {
                successAddExperience.value = false;
                successMessageAddExperience.value = '';
            }, 1000);
            nextCallback();
        } else {
            addExperienceLoading.value = false;
            successAddExperience.value = false;
            successMessageAddExperience.value = '';
            addExperienceError.value = data?.message ? data?.message : data?.error;
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        addExperienceLoading.value = false;

        console.error('Login error:', error);
        showError('failed', 'Employee Experience');
    }
};

const dobError = ref('');
const maxDate = ref(get18YearsAgoDate());

function get18YearsAgoDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today;
}
const maxJoiningDate = ref(getMaxJoiningDate());

function getMaxJoiningDate() {
    const today = new Date();
    today.setDate(today.getDate());
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

const uploadDocumentLoading = ref(false);

const handleSubmitEducationQualification = async (nextCallback) => {
    await addApplicantEducationQualification(createdApplicant?.value?.id, nextCallback);
};

const addPersonalDetailsLoading = ref(false);
const handlePersonalDetails = async (nextCallback) => {
    addEmployeeError.value = '';
    addPersonalDetailsLoading.value = true;
    try {
        const url = `${baseURL}/applicant/create`;
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }

        if (!firstName.value.trim()) {
            showError('Please enter your first name.');
            addEmployeeError.value = 'Please enter your first name.';
            addPersonalDetailsLoading.value = false;
            return;
        }

        if (!lastName.value.trim()) {
            showError('Please enter your last name.');
            addEmployeeError.value = 'Please enter your last name.';
            addPersonalDetailsLoading.value = false;

            return;
        }

        if (!email.value.trim() || !validateEmail(email.value.trim())) {
            showError('Please enter a valid email address.');
            addEmployeeError.value = 'Please enter a valid email address.';
            addPersonalDetailsLoading.value = false;

            return;
        }

        if (!validatePhoneNumber(phoneNumber.value)) {
            showError('Please enter a valid phone number.');
            addEmployeeError.value = 'Please enter a valid phone number.';
            addPersonalDetailsLoading.value = false;

            return;
        }

        // Prepare data object for submission
        const formData = {
            firstName: firstName.value,
            lastName: lastName.value,
            otherName: otherName.value, // Update if required
            phoneNumber: phoneNumber.value,
            gender: gender.value.name,
            email: email.value, // Update to email if required
            physicalAddress: physicalAddress.value,
            dateOfBirth: changeDateFormat(dob.value),
            maritalStatus: maritalStatus.value.name,
            idType: idType.value.name,
            nationalityId: nationalityId?.value?.id
        };

    
        const data = await postData(url, formData, addPersonalDetailsLoading);
   
        if (!data?.data) {
            showError(data?.message || data?.error);
        }
        if (data?.status === 200 || data?.status === 201) {
            createdApplicant.value = data?.data;

            nextCallback();

            successMessage.value = data?.message;
            applicantStore.setApplicantData(formData);
            addPersonalDetailsLoading.value = false;

            success.value = true;
            showSuccess(data?.data?.message);

            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            // resetForm();

            addPersonalDetailsLoading.value = false;
        } else {
            success.value = false;
            successMessage.value = '';
            addEmployeeError.value = data?.data?.message ? data?.data?.message : data?.data?.error;
            showError(data?.data?.message ? data?.data?.message : data?.data?.error);
        }
    } catch (error) {
        // showError('error adding employee');
        addPersonalDetailsLoading.value = false;
        console.log(error?.error);
    }
};

const handleSubmitExperience = async (nextCallback) => {


    if (applicantExperienceDetails.value) {
        await addApplicantExperience(createdApplicant?.value?.id, nextCallback);
    }
};

const educationDoc = ref([]);
const resumeFileData = ref('');
const coverFileData = ref('');
// const successMessageAddEducation = ref('');
// const successUpload = ref(false);
// const addEducationError = ref('');
// const successMessageUpload = ref('');

const onFileChangeAcademicDocs = (e) => {
    // if (!e.length) return;

    educationDoc.value = e;
};
const handleFileCoverSelected = (file) => {
    coverFileData.value = file;
};
const handleFileResumeSelected = async (file) => {
    resumeFileData.value = file;
};
const activeStep = ref(0);
const handleSubmitDocuments = async () => {
    uploadDocumentLoading.value = true;

    try {
        const responseMessage = await addApplicantAcademicDocs(createdEducationDetails.value?.id, educationDoc, loading);

        if (resumeFileData.value && createdApplicant?.value?.id) {
            const fileFormData = new FormData();
            fileFormData.append('id', createdApplicant?.value?.id);
            fileFormData.append('file', resumeFileData.value);
            const resumeResponse = await updateResumeImport(fileFormData, loading);

            if (resumeResponse?.successMessage) {
                showSuccess(resumeResponse.successMessage);
            } else if (resumeResponse?.errorMessage) {
                showError(resumeResponse.errorMessage);
            }
        }

        if (coverFileData.value && createdApplicant?.value?.id) {
            const fileFormData = new FormData();
            fileFormData.append('id', createdApplicant?.value?.id);
            fileFormData.append('file', coverFileData.value);
            const coverResponse = await updateCoverLetterImport(fileFormData, loading);

            if (coverResponse?.successMessage) {
                showSuccess(coverResponse.successMessage);
            } else if (coverResponse?.errorMessage) {
                showError(coverResponse.errorMessage);
            }
        }

        if (responseMessage?.successMessage) {
            showSuccess(responseMessage.successMessage);
        }

        if (responseMessage?.errorMessage) {
            showError(responseMessage.errorMessage);
        }
        uploadDocumentLoading.value = false;
        activeStep.value = 0;
    } catch (error) {
        uploadDocumentLoading.value = false;

        showError('An unexpected error occurred while submitting the documents.');
        console.error('Error in handleSubmitDocuments:', error);
    } finally {
        uploadDocumentLoading.value = false;
    }
};

// const active = ref(0);
</script>
<template>
    <div class="grid">
        <Stepper v-model:activeStep="activeStep">
            <StepperPanel header="Personal details">
                <template #content="{ nextCallback }">
                    <div class="col-12">
                        <div class="card">
                            <form @submit.prevent="handlePersonalDetails(nextCallback)">
                                <Message v-if="success" severity="success">{{ successMessage }}</Message>
                                <Message v-if="addEmployeeError" severity="error">{{ addEmployeeError }}</Message>

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
                                        <small v-if="dobError" class="p-error">{{ dobError }}</small>
                                    </div>

                                    <div class="field col-12 md:col-4">
                                        <label for="maritalstatus">Marital Status</label>
                                        <Dropdown id="state" v-model="maritalStatus" :options="maritalStatusOptions" optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>

                                    <div class="field col-12 md:col-4">
                                        <label for="nationality">Nationality</label>
                                        <AutoComplete placeholder="Search" id="nationality" :dropdown="true" :multiple="false" v-model="nationalityId" :suggestions="autoFilteredNationlalities" @complete="searchNationality($event)" field="name" />
                                    </div>

                                    <!-- <h5>Identification details</h5> -->
                                    <div class="field col-12 md:col-4">
                                        <label for="idtype">ID Type</label>
                                        <Dropdown id="idtype" v-model="idType" :options="idTypeOptions" optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="idnumber">ID Number</label>
                                        <InputText required id="idnumber" type="text" v-model="idNumber" />
                                    </div>
                                    <div v-if="idType && idType.name === 'OTHERS'" class="field col-12 md:col-4">
                                        <label for="others">Enter ID Type</label>
                                        <InputText required id="others" type="text" v-model="others" />
                                    </div>

                                    <!-- <h5>Contact Information</h5> -->
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

                                    <div class="field col-12 md:col-4">
                                        <label for="otherEmail">Other Email Address</label>
                                        <InputText id="otherEmail" type="text" v-model="otherEmail" />
                                    </div>
                                </div>
                                <div class="flex pt-4 justify-content-end">
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addPersonalDetailsLoading" size="2rem" />
                                        <!-- <Button v-if="!addPersonalDetailsLoading" :disabled="addPersonalDetailsLoading" type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" /> -->
                                        <Button v-if="!addPersonalDetailsLoading" :disabled="addPersonalDetailsLoading" type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Education qualification">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="col-12">
                        <div class="card p-fluid">
                            <form @submit.prevent="handleSubmitEducationQualification(nextCallback)">
                                <div class="field">
                                    <div class="flex items-center">
                                        <QualificationsForm
                                            :qualifications="educationQualification"
                                            :autoFilteredAwardingInstitutions="autoFilteredAwardingInstitutions"
                                            :autoFilteredQualifications="autoFilteredQualifications"
                                            @remove="handleRemoveQualification"
                                            @add="handleAddQualification"
                                            :label="educationQualificationLabel"
                                            @searchAwardingInstitution="searchAwardingInstitution"
                                            @searchQualification="searchQualification"
                                            :maxJoiningDate="maxJoiningDate"
                                        />
                                    </div>
                                </div>

                                <div class="flex pt-4 justify-content-between">
                                    <div class="flex justify-content-end gap-2">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                    </div>
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addEducationQualificationLoading" size="2rem" />
                                        <Button v-if="!addEducationQualificationLoading" :disabled="addEducationQualificationLoading" type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                    <!-- <Button type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" /> -->
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Experience">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="col-12">
                        <div class="card">
                            <form @submit.prevent="handleSubmitExperience(nextCallback)">
                                <!-- Experience form fields here -->
                                <EmployeeExperience @handleExperienceDetails="handleExperienceDetails" :maxJoiningDate="maxJoiningDate" />

                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addExperienceLoading" size="2rem" />
                                        <Button v-if="!addExperienceLoading" :disabled="addExperienceLoading" type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                    <!-- <Button type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" /> -->
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Documents">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="col-12">
                        <div class="card">
                            <form @submit.prevent="handleSubmitDocuments(nextCallback)">
                                <!-- Documents form fields here -->
                                <ApplicantDocUpload @onFileChangeAcademicDocs="onFileChangeAcademicDocs" @handleFileCoverSelected="handleFileCoverSelected" @handleFileResumeSelected="handleFileResumeSelected" />

                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="uploadDocumentLoading" size="2rem" />
                                        <Button v-if="!uploadDocumentLoading" :disabled="uploadDocumentLoading" type="submit" label="submit" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>
        </Stepper>
    </div>
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
.job-info {
    margin-bottom: 10px; /* Space below each job info block */
    border-bottom: 1px solid #ccc;
}

.job-detail > div {
    margin-bottom: 5px; /* Space below each pair */

    padding-bottom: 5px;
}
input.valid {
    border: 2px solid green;
}

input.invalid {
    border: 2px solid red;
}
</style>
