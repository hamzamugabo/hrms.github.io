<script setup>
import { onMounted, ref, watch } from 'vue';
import { useApplicantStore } from '@/piniaStore/applicantData.js';
import QualificationsForm from './QualificationFormTemplate.vue';

import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';

// import countryList from 'country-list';
import { fetchData, postData, baseURL } from '@/components/reuseables/FetchPostData.js';
import { genderOptionsEnum, maritalStatusOptionsEnum, idTypeOptionsEnum } from '@/components/reuseables/enums.js';
import { useRoute } from 'vue-router';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import EmployeeExperience from './AddApplicantExperience.vue';

import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
// import AddDocuments from './AddEmployeeDocuments.vue';
// import ApplicantDocUpload from './ApplicantDocUpload.vue';
import { useApplicant } from './addApplicantUtils.js';
const { getApplicantEductionQualifications, getApplicantExperience } = useApplicant();

import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const genderOptions = ref(genderOptionsEnum);
const maritalStatusOptions = ref(maritalStatusOptionsEnum);
const idTypeOptions = ref(idTypeOptionsEnum);

const firstName = ref('');
const lastName = ref('');
const otherName = ref('');
const gender = ref('');
const dob = ref('');
const maritalStatus = ref({ name: '', code: '' });


const idType = ref({ name: '', code: '' });

const phoneNumber = ref('');
const email = ref('');
const physicalAddress = ref('');

const nationalityId = ref('');

const addEmployeeError = ref('');

const allNationlalities = ref([]);
const autoFilteredNationlalities = ref([]);


// eslint-disable-next-line no-unused-vars
const loading = ref(false);
// const success = ref(false);
// const serverError = ref('');
const success = ref(false);
const qualificationSuccess = ref(false);
const successMessage = ref('');
const qualificationSuccessMessage = ref('');
const qualificationError = ref('');
const others = ref('');

// const otherEmail = ref('');
const applicantExperienceDetails = ref({});

const successMessageAddExperience = ref(false);
const successAddExperience = ref('');
const addExperienceError = ref('');

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
const route = useRoute();
const routeId = ref(route?.query?.id);
const applicantInfor = ref({});
// const baseURL = import.meta.env.VITE_APP_API_URL;
const getApplicantById = async () => {
    if (!routeId.value) {
        console.log('missing applicant id');
        return;
    }
    const url = `${baseURL}/applicant/by-id/${routeId.value}`;
    try {
        const { data } = await fetchData(url, false);
        applicantInfor.value = data;
    } catch (error) {
        console.error('Error fetching applicant:', error);
    }
};
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

const getNationalities = async () => {
    // console.log('nationalities');
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

const searchNationality = (event) => {
    if (!event.query.trim().length) {
        autoFilteredNationlalities.value = allNationlalities?.value?.length > 0 ? [...allNationlalities.value] : [];
    } else {
        autoFilteredNationlalities.value = allNationlalities.value.filter((country) => {
            return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
};


const applicantQualifications = ref(null);
const applicantExperience = ref(null);
onMounted(async () => {
    await getNationalities();

    await getApplicantById();
    await getApplicantEductionQualifications(routeId.value, applicantQualifications, false);
    await getApplicantExperience(routeId.value, applicantExperience, false);
});

const addEducationQualificationLoading = ref(false);
const createdEducationDetails = ref({});
const updateApplicantEducationQualification = async (id, nextCallback) => {
    addEducationQualificationLoading.value = true;
    try {
        if (!id) {
            showError('no Applicant');
            return;
        }
        const url = `${baseURL}/applicant/education/update`;
        educationQualification?.value?.forEach(async (qualificationElement) => {
            const formData = {
                award: qualificationElement?.award,
                schoolName: qualificationElement?.schoolName,
                endDate: changeDateFormat(qualificationElement?.endDate),
                fieldOfStudy: qualificationElement?.fieldOfStudy,
                startDate: changeDateFormat(qualificationElement?.startDate),
                id: id
            };
            

            const data = await postData(url, formData, addEducationQualificationLoading);
             
            createdEducationDetails.value = data?.data;
            if (data?.status === 200 || data?.status === 201) {
                await getApplicantEductionQualifications(routeId.value, applicantQualifications, false);

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

const handleExperienceDetails = (data) => {
    applicantExperienceDetails.value = data;
};

const updateApplicantExperience = async (id, nextCallback) => {
    addExperienceError.value = '';

    addExperienceLoading.value = true;
    try {
        const url = `${baseURL}/applicant/experience/update`;

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
            startDate: changeDateFormat(applicantExperienceDetails?.value?.startDate),
            id:id
        };

        console.log('experience', formData);
        const data = await postData(url, formData, addExperienceLoading);

        if (data?.status === 200 || data?.status === 201) {
    await getApplicantExperience(routeId.value, applicantExperience, false);

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

const handleSubmitEducationQualification = async (nextCallback) => {
    await updateApplicantEducationQualification(QualificationObjectToUpdate?.value?.id, nextCallback);
};

const addPersonalDetailsLoading = ref(false);
const handlePersonalDetails = async (nextCallback) => {
    addEmployeeError.value = '';
    addPersonalDetailsLoading.value = true;
    try {
        const url = `${baseURL}/applicant/update`;
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
            nationalityId: nationalityId?.value?.id || applicantInfor?.value?.nationalityId,
            id: applicantInfor.value.id || routeId?.value
        };

        // Perform form submission logic (e.g., send data to backend)
        //  
        // addPersonalDetailsLoading.value = false;

        const data = await postData(url, formData, addPersonalDetailsLoading);
         
        if (!data?.data) {
            showError(data?.message || data?.error);
        }
        if (data?.status === 200 || data?.status === 201) {
            createdApplicant.value = data?.data;
            applicantInfor.value = data?.data;

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
        await updateApplicantExperience(exprienceObjectToUpdate?.value?.id, nextCallback);
    }
};

watch(applicantInfor, () => {
    dob.value = applicantInfor.value?.dateOfBirth;
    email.value = applicantInfor.value?.email;
    firstName.value = applicantInfor.value?.firstName;
    gender.value = { name: applicantInfor.value?.gender, code: applicantInfor.value?.gender };
    idType.value = { name: applicantInfor.value?.idType, code: applicantInfor.value?.idType };
    lastName.value = applicantInfor.value?.lastName;
    maritalStatus.value = { name: applicantInfor.value?.maritalStatus, code: applicantInfor.value?.maritalStatus };
    nationalityId.value = applicantInfor.value?.nationalityId;
    otherName.value = applicantInfor.value?.otherName;
    phoneNumber.value = applicantInfor.value?.phoneNumber;
    physicalAddress.value = applicantInfor.value?.physicalAddress;
});
const updateExprienceState = ref(false);
const exprienceObjectToUpdate = ref({});
const updateExperience = (experience) => {
    exprienceObjectToUpdate.value = experience;

    updateExprienceState.value = true;
};
const updateQualificationState = ref(false);
const QualificationObjectToUpdate = ref({});
const updateQualification = (qualification) => {
    QualificationObjectToUpdate.value = qualification;
    educationQualification.value.push(qualification);

    updateQualificationState.value = true;
};

const close = () => {
    updateQualificationState.value = false;
    updateExprienceState.value = false;
};
const activeStep = ref(0);

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
                                    <!-- <div class="field col-12 md:col-4">
                                        <label for="idnumber">ID Number</label>
                                        <InputText required id="idnumber" type="text" v-model="idNumber" />
                                    </div> -->
                                    <div v-if="idType && idType.name === 'OTHERS'" class="field col-12 md:col-4">
                                        <label for="others">Enter ID Type</label>
                                        <InputText required id="others" type="text" v-model="others" />
                                    </div>

                                    <!-- <h5>Contact Information</h5> -->
                                    <div class="field col-12 md:col-4">
                                        <label for="phonenumber">Phone Number</label>
                                         <InputText id="phoneNumber" type="text" v-model="phoneNumber" />
                                        <!-- <InputText id="phonenumber" type="text" v-model="phoneNumber" /> -->
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
                                <div class="flex pt-4 justify-content-end">
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addPersonalDetailsLoading" size="2rem" />
                                        <!-- <Button v-if="!addPersonalDetailsLoading" :disabled="addPersonalDetailsLoading" type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" /> -->
                                        <Button v-if="!addPersonalDetailsLoading" :disabled="addPersonalDetailsLoading" type="submit" label="Update" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Education qualification">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="grid" v-for="qualification in applicantQualifications" :key="qualification?.id">
                        <div class="col-12" style="cursor: pointer">
                            <div class="card" style="min-width: 300px">
                                <div class="mb-3">
                                    <div class="flex justify-content-between mb-3">
                                        <span class="block text-500 font-medium mb-1"><strong>Award: </strong> {{ qualification?.award }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-500 font-medium mb-1"><strong>SchoolName: </strong> {{ qualification?.schoolName }}</span>
                                    </div>

                                    <Button @click="updateQualificationState ? close() : updateQualification(qualification)" class="mb-2" style="float: right; margin-bottom: 3px" :label="updateQualificationState ? 'Close' : 'Open'" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="updateQualificationState" class="col-12">
                        <div class="card p-fluid">
                            <form @submit.prevent="handleSubmitEducationQualification(nextCallback)">
                                <div class="field">
                                    <div class="flex items-center">
                                        <QualificationsForm
                                            :qualifications="[QualificationObjectToUpdate]"
                                      
                                            @remove="handleRemoveQualification"
                                            @add="handleAddQualification"
                                            :label="educationQualificationLabel"
                                            @searchAwardingInstitution="searchAwardingInstitution"
                                            @searchQualification="searchQualification"
                                            :maxJoiningDate="maxJoiningDate"
                                            :update="'update'"
                                        />
                                    </div>
                                </div>

                                <div class="flex pt-4 justify-content-between">
                                    <div class="flex justify-content-end gap-2">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                    </div>
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addEducationQualificationLoading" size="2rem" />
                                        <Button v-if="!addEducationQualificationLoading" :disabled="addEducationQualificationLoading" type="submit" label="Update" icon="pi pi-arrow-right" iconPos="right" />
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
                    <div class="grid" v-for="exprience in applicantExperience" :key="exprience?.id">
                        <div class="col-12" style="cursor: pointer">
                            <div class="card" style="min-width: 300px">
                                <div class="mb-3">
                                    <div class="flex justify-content-between mb-3">
                                        <span class="block text-500 font-medium mb-1"><strong>companyName: </strong> {{ exprience?.companyName }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-500 font-medium mb-1"><strong>jobTitle: </strong> {{ exprience?.jobTitle }}</span>
                                    </div>
                                    <Button @click="updateExprienceState ? close() : updateExperience(exprience)" class="mb-2" style="float: right; margin-bottom: 3px" :label="updateExprienceState ? 'Close' : 'Open'" />

                                    <!-- <Button @click="updateExperience(exprience)" class="mb-2" style="float: right; margin-bottom: 3px" label="Update" /> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="applicantExperience?.length < 1 || !applicantExperience" class="card" style="min-width: 300px">
                        <h6>No Experience to update</h6>
                    </div>

                    <div v-if="updateExprienceState" class="col-12">
                        <div class="card">
                            <form @submit.prevent="handleSubmitExperience(nextCallback)">
                                <!-- Experience form fields here -->
                                <EmployeeExperience @handleExperienceDetails="handleExperienceDetails" :maxJoiningDate="maxJoiningDate" :exprienceData="exprienceObjectToUpdate" />

                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addExperienceLoading" size="2rem" />
                                        <Button v-if="!addExperienceLoading" :disabled="addExperienceLoading" type="submit" label="Update" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                    <!-- <Button type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" /> -->
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
