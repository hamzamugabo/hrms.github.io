<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEmployeeStore } from '@/piniaStore/employeeData.js';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
// import QualificationsForm from './QualificationFormTemplate.vue';
// import countryList from 'country-list';
import { fetchData, postData } from '@/components/reuseables/FetchPostData.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { employeeLevelsEnum, idTypeOptionsEnum} from '@/components/reuseables/enums.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
// const educationQualificationLabel = ref('Education qualification');
const educationQualification = ref([
    { name: '', yearOfAward: '' } // Initial empty qualification
]);

// const handleRemoveQualification = (index) => {
//     educationQualification.value.splice(index, 1);
// };

// const handleAddQualification = () => {
//     educationQualification.value.push({ name: '', yearOfAward: '' });
// };

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
// const idTypeOptions = ref([
//     { name: 'NATIONAL_ID', code: 'NATIONAL_ID' },
//     { name: 'PASSPORT', code: 'PASSPORT' },
//     { name: 'DRIVING_PERMIT', code: 'DRIVING_PERMIT' }
// ]);
// const countriesArray = countryList.getData();
// const countries = countriesArray.map((country) => ({
//     name: country.name,
//     code: country.code
// }));

const firstName = ref('');
const lastName = ref('');
const otherName = ref('');
const gender = ref({ name: '', code: '' });
const dob = ref('');
const maritalStatus = ref({ name: '', code: '' });
const nationality = ref([]);
const idType = ref({name:"",code:""});
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
const allDesignations = ref([]);
const designation = ref('');
const loading = ref(false);
const employeeLevels = ref(employeeLevelsEnum);
const employeeLevel = ref({ name: '', code: '' });
const otherEmail = ref('');
const postalAddress = ref('');
const others = ref('');


// const autoFilteredDesignations = ref([]);
const allNationlalities = ref([]);
// const autoFilteredNationlalities = ref([]);
const allDepartments = ref([]);
// const autoFilteredDepartments = ref([]);
const allInstitutions = ref([]);
// const autoFilteredAwardingInstitutions = ref([]);
const allQualifications = ref([]);
// const autoFilteredQualifications = ref([]);
// const success = ref(false);
// const serverError = ref('');
const success = ref(false);
const successMessage = ref('');
const updateEmployeeError = ref('');
const employeeData = ref({});

const baseURL = import.meta.env.VITE_APP_API_URL;
const dobError = ref('');
const maxDate = ref(get18YearsAgoDate());

function get18YearsAgoDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today;
}
const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
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
const employeeStore = useEmployeeStore();
const storedEmployeeData = employeeStore.getEmployeeData();

const loadFromLocalStorage = () => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null; // Parse JSON data when retrieving from local storage
};

const getDesignations = async () => {
    // console.log('designation');
    const url = `${baseURL}/designation`;

    try {
        const { data } = await fetchData(url);
        allDesignations.value = data?.designations;
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};

const getNationalities = async () => {
    // console.log('nationalities');
    const url = `${baseURL}/nationality`;

    try {
        const { data } = await fetchData(url);

        allNationlalities.value = data?.nationalities;
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};

const getDepartments = async () => {
    const url = `${baseURL}/department`;

    try {
        const { data } = await fetchData(url, loading);

        allDepartments.value = data;
        // Handle the fetched data here
    } catch (error) {
        // Handle errors here
    }
};
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

// const searchDesignation = (event) => {
//     if (!event.query.trim().length) {
//         autoFilteredDesignations.value = [...allDesignations.value];
//     } else {
//         autoFilteredDesignations.value = allDesignations.value.filter((designation) => {
//             const gradeMatches = designation.grade.toLowerCase().startsWith(event.query.toLowerCase());
//             const jobTitleMatches = designation.jobTitle.toLowerCase().includes(event.query.toLowerCase());
//             return gradeMatches || jobTitleMatches;
//         });
//     }
// };
// const searchAwardingInstitution = (event) => {
//     if (!event.query.trim().length) {
//         autoFilteredAwardingInstitutions.value = [...allInstitutions.value];
//     } else {
//         autoFilteredAwardingInstitutions.value = allInstitutions.value.filter((institution) => {
//             const locationMatches = institution.location.toLowerCase().startsWith(event.query.toLowerCase());
//             const nameMatches = institution.name.toLowerCase().includes(event.query.toLowerCase());
//             return locationMatches || nameMatches;
//         });
//     }
// };
// const searchQualification = (event) => {
//     if (!event.query.trim().length) {
//         autoFilteredQualifications.value = [...allQualifications.value];
//     } else {
//         autoFilteredQualifications.value = allQualifications.value.filter((qualification) => {
//             return qualification.name.toLowerCase().startsWith(event.query.toLowerCase());
//         });
//     }
// };
const getEmployee = async () => {
    const url = `${baseURL}/employees/by-id/${storedEmployeeData?.id}`;

    try {
        if (url && storedEmployeeData?.id) {
            const { data } = await fetchData(url, loading);
            console.log('employee to edit data', data);
            firstName.value = data?.firstName;
            lastName.value = data?.lastName;
            otherName.value = data?.otherNames;
            gender.value = { name: data?.gender, code: data?.gender };
            dob.value = data?.dob;
            maritalStatus.value = { name: data?.maritalStatus, code: data?.maritalStatus };
            nationality.value = [];
            idType.value = {name:data?.idType, code:data?.idType};
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
            postalAddress.value = data?.postalAddress;
            otherEmail.value = data?.otherEmailAddress;
            employeeLevel.value = { name: data?.employeeLevel, code: data?.employeeLevel };
            others.value = data?.customIdType;
          

            // console.log('employee===>', data);
            // employees.value = data;
            employeeData.value = data;
        }
    } catch (error) {
        // nationalityError.value = error;
        // console.error('Error searching employees:', error.message);
    }
};

onMounted(async () => {
    await getEmployee();
    await getDesignations();
    await getNationalities();
    await getDepartments();
    await getAwardingInstitutions();
    await getQualifications();
});
const submitForm = async () => {
    updateEmployeeError.value = '';
    loading.value = true;
    try {
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }
        const url = `${baseURL}/employees/update`;

        if (!firstName.value.trim()) {
            alert('Please enter your first name.');
            return;
        }

        if (!lastName.value.trim()) {
            alert('Please enter your last name.');
            return;
        }

        if (!email.value.trim() || !validateEmail(email.value.trim())) {
            alert('Please enter a valid email address.');
            return;
        }
        const formData = {
            firstName: firstName.value,
            lastName: lastName.value,
            otherNames: otherName.value,
            phoneNumber: phoneNumber.value,
            gender: gender.value.name || employeeData.value?.gender,
            emailAddress: email.value,
            physicalAddress: physicalAddress.value,
            dateOfBirth: changeDateFormat(dob.value),
            dateOfJoining: changeDateFormat(dateOfJoining.value),
            maritalStatus: maritalStatus.value.name || employeeData.value?.maritalStatus,
            idType: idType.value.name || employeeData.value?.idType,
            idNumber: idNumber.value || employeeData.value?.idNumber,
            designationId: designation.value || employeeData.value?.designationId,
            educationQualification: educationQualification.value,
            id: employeeData.value?.id,
            employeeLevel: employeeLevel?.value?.name,
            otherEmailAddress: otherEmail?.value,
            otherPhoneNumber: otherPhoneNumber?.value,
            postalAddress: postalAddress?.value,
            customIdType: others?.value
        };

        // console.log('formData', formData)

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            employeeStore.setEmployeeData(formData);
            loading.value = false;

            resetForm();
            success.value = true;
            loading.value = false;
            showSuccess(data?.message);
            useRouter().back();
        } else {
            showError( data?.message ? data?.message : data?.error);
            updateEmployeeError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError()
        loading.value = false;

        console.error('Login error:', error);
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
    if (employeeData.value) {
        console.log('they should update');
        // updateFields();
    } else {
        console.log('not updated the fields');
    }
});

</script>

<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <Message v-if="success" severity="success">{{ successMessage }}</Message>

                    <Message v-if="updateEmployeeError" severity="error">{{ updateEmployeeError }}</Message>
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
                                        <label for="dob">Date of Joining</label>
                                        <Calendar :showIcon="true" :showButtonBar="true" v-model="dateOfJoining" :maxDate="maxJoiningDate"></Calendar>
                                    </div>
                        <div class="field col-12 md:col-4">
                            <label for="maritalstatus">Marital Status</label>
                            <Dropdown id="state" v-model="maritalStatus" :options="maritalStatusOptions" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div class="field col-12 md:col-4">
                            <label for="email">Email Address</label>
                            <InputText id="email" type="text" v-model="email" />
                        </div>

                       
                        <div class="field col-12 md:col-4">
                            <label for="postalAddress">Postal Address</label>
                            <InputText required id="postalAddress" type="text" v-model="postalAddress" />
                        </div>

                        <div class="field col-12 md:col-4">
                            <label for="level">Level</label>
                            <Dropdown id="level" v-model="employeeLevel" :options="employeeLevels" optionLabel="name" placeholder="Select One"></Dropdown>
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
                            <Dropdown id="state" v-model="idType" :options="idTypeOptionsEnum" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                         <div v-if="idType && idType.name === 'OTHERS'" class="field col-12 md:col-6">
                                        <label for="others">Enter ID Type</label>
                                        <InputText required id="others" type="text" v-model="others" />
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
                            <label for="otherphonennumber">Another Phone Number</label>
                            <InputText id="otherphonennumber" type="text" v-model="otherPhoneNumber" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="otherEmail">Other Email Address</label>
                            <InputText id="otherEmail" type="text" v-model="otherEmail" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="address">Physical Address (Residence)</label>
                            <InputText required id="address" type="text" v-model="physicalAddress" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div class="col-12 md:col-6">
                <div class="card p-fluid">
                    <h5>Job related information</h5>
                    <div class="field">
                        <label for="title">Position/Title</label>
                        <InputText required id="title" type="text" v-model="position" />
                    </div>
                    <div class="field">
                        <label for="department">Department</label>
                        <InputText required id="department" type="text" v-model="department" />
                    </div>
                    <div class="field">
                        <label for="dateofjoining">Date of Joining</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="dateOfJoining"></Calendar>
                    </div>
                    <div class="field">
                        <label for="location">Location/Duty station</label>
                        <InputText required id="location" type="text" v-model="dutyStation" />
                    </div>
                </div>
            </div> -->
            <!-- <div class="col-12 md:col-12">
                <div class="card p-fluid">
                    <h5>Education qualification</h5>

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
                            />
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- <div class="col-12">
                <div class="card">
                    <h5>Professional qualifications</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="pqname">Qualification Name</label>
                            <InputText required id="pqname" type="text" v-model="qualificationNameProfessional" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="pqtype">Qualification Type</label>
                            <InputText required id="pqtype" type="text" v-model="qualificationTypeProfessional" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="pinstitution">Awarding Institution/Organization/Company</label>
                            <InputText required id="pinstitution" type="text" v-model="institutionAwardProfessional" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="pdateofaward">Date/Year of the award</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="yearOfAwardProfessional"></Calendar>
                        </div>

                        <div class="field col-12 md:col-6">
                            <label for="pcomment">Comments/Description</label>
                            <Textarea id="pcomment" rows="4" v-model="commentProfessional" />
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; cursor: pointer; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Update Employee</button>
        </div>
    </form>
</template>
