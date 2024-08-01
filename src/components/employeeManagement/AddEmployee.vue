<script setup>
import { onMounted, ref } from 'vue';
import { useEmployeeStore } from '../../../src/piniaStore/employeeData.js';
import QualificationsForm from './QualificationFormTemplate.vue';

import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';

import { fetchData, postData, baseURL, postDataUpload } from '@/components/reuseables/FetchPostData.js';
import { genderOptionsEnum, maritalStatusOptionsEnum, idTypeOptionsEnum, employeeLevelsEnum } from '@/components/reuseables/enums.js';

import SpinnerVue from '@/components/reuseables/Spinner.vue';
import EmployeeExperience from './AddEmployeeExperience.vue';
import NextOfKin from './AddEmployeeNextOfKin.vue';
import Dependant from './AddEmployeeDependant.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
import AddDocuments from './AddEmployeeDocuments.vue';
import { useJobDescription } from '@/components/jobDescription/jobDescriptionUtils';

import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const { getJobDescriptions } = useJobDescription();
const genderOptions = ref(genderOptionsEnum);
const maritalStatusOptions = ref(maritalStatusOptionsEnum);
const idTypeOptions = ref(idTypeOptionsEnum);
const employeeLevels = ref(employeeLevelsEnum);

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
const departmentId = ref('');
const designationId = ref('');
const addEmployeeError = ref('');
const allDesignations = ref([]);
const autoFilteredDesignations = ref([]);
const allNationlalities = ref([]);
const autoFilteredNationlalities = ref([]);
const allDepartments = ref([]);
const autoFilteredDepartments = ref([]);
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
const postalAddress = ref('');
const otherEmail = ref('');
const employeeExperienceDetails = ref({});
const employeeNextOfKinDetails = ref({});
const employeeDependantDetails = ref({});
const successMessageAddExperience = ref(false);
const successAddExperience = ref('');
const addExperienceError = ref('');
const successMessageAddNextOfKin = ref(false);
const successAddNextOfKin = ref('');
const addNextOfKinError = ref('');
const successMessageAddDependant = ref(false);
const successAddDependant = ref('');
const addDependantError = ref('');

const successUploadDocs = ref(false);
const successMessageUploadDocs = ref('');
const serverErrorUploadDocs = ref('');
const employeeLevel = ref();
const autoFilteredJobDescription = ref([]);
const jobDescriptionId = ref('');
const nssfNumber = ref('');
const tinNumber = ref('');
const jobDescriptions = ref([]);
const educationQualificationLabel = ref('Education qualification');
const educationQualification = ref([
    { name: '', yearOfAward: '', qualificationTypeId: '', awardingInstitutionId: '' } // Initial empty qualification
]);
const createdEmployee = ref({});

// const baseURL = import.meta.env.VITE_APP_API_URL;

const handleRemoveQualification = (index) => {
    educationQualification.value.splice(index, 1);
};

const handleAddQualification = () => {
    educationQualification.value.push({ name: '', yearOfAward: '', qualificationTypeId: '', awardingInstitutionId: '' });
    console.log('educationQualification.value', educationQualification.value);
};
const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
const loadFromLocalStorage = () => {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null; // Parse JSON data when retrieving from local storage
};
const employeeStore = useEmployeeStore();

const getDesignations = async () => {
    // console.log('designation');
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
const searchDepartment = (event) => {
    if (!event.query.trim().length) {
        autoFilteredDepartments.value = allDepartments?.value?.length > 0 ? [...allDepartments.value] : [];
    } else {
        // Check if allDepartments.value is iterable and not null/undefined
        if (Array.isArray(allDepartments.value)) {
            autoFilteredDepartments.value = allDepartments.value.filter((department) => {
                return department.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        } else {
            console.error('allDepartments.value is not an array or is null/undefined.');
            // Handle the error or set autoFilteredDepartments.value to a default value
            autoFilteredDepartments.value = [];
        }
    }
};
const searchJobDescription = (event) => {
    if (!event.query.trim().length) {
        autoFilteredJobDescription.value = [...jobDescriptions.value];
    } else {
        autoFilteredJobDescription.value = jobDescriptions.value.filter((jobDescription) => {
            const jobGrade = jobDescription.jobGrade.toLowerCase().startsWith(event.query.toLowerCase());
            const jobTitle = jobDescription.jobTitle.toLowerCase().includes(event.query.toLowerCase());
            return jobGrade || jobTitle;
        });
    }
};
const searchDesignation = (event) => {
    if (!event.query.trim().length) {
        autoFilteredDesignations.value = [...allDesignations.value];
    } else {
        autoFilteredDesignations.value = allDesignations.value.filter((designation) => {
            const gradeMatches = designation.grade.toLowerCase().startsWith(event.query.toLowerCase());
            const jobTitleMatches = designation.jobTitle.toLowerCase().includes(event.query.toLowerCase());
            return gradeMatches || jobTitleMatches;
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
const assignAwardingInstitution = async (id, awardingInstitutionId) => {
    loading.value = true;
    addDependantError.value = '';
    try {
        const url = `${baseURL}/employees/qualifications/assign-institution/${id}/${awardingInstitutionId?.id}`;

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', '');
    }
};
const assignQualificationType = async (id, qualificationTypeId) => {
    loading.value = true;
    addDependantError.value = '';
    try {
        const url = `${baseURL}/employees/qualifications/assign-qualificationType/${id}/${qualificationTypeId?.id}`;

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', '');
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
const addEducationQualificationLoading = ref(false);
const addEmplyeeEducationQualification = async (employeeId) => {
    addEducationQualificationLoading.value = true;
    try {
        if (!employeeId) {
            showError('no employee');
            return;
        }
        const url = `${baseURL}/employees/qualifications/create`;
        educationQualification?.value?.forEach(async (qualificationElement) => {
            // Check if any required properties are missing or empty
            if (!qualificationElement?.awardingInstitutionId?.id || !qualificationElement?.name || !qualificationElement?.qualificationTypeId?.id || !qualificationElement?.yearOfAward) {
                // Skip the element and move to the next iteration
                return;
            }

            const formData = {
                // awardingInstitutionId: qualificationElement?.awardingInstitutionId?.id,
                employeeId: employeeId,
                name: qualificationElement?.name,
                // qualificationTypeId: qualificationElement?.qualificationTypeId?.id,
                yearOfAward: changeDateFormat(qualificationElement?.yearOfAward)
            };
            //  {
            //     awardingInstitutionId: qualificationElement?.awardingInstitutionId?.id,
            //     employeeId: employeeId,
            //     name: qualificationElement?.name,
            //     qualificationTypeId: qualificationElement?.qualificationTypeId?.id,
            //     yearOfAward: changeDateFormat(qualificationElement?.yearOfAward)
            // };

            const data = await postData(url, formData, addEducationQualificationLoading);

            if (data?.status === 200 || data?.status === 201) {
                qualificationError.value = '';
                qualificationSuccessMessage.value = data?.message;
                // employeeStore.departmendepartmentIdtIddepartmentId(formData);
                addEducationQualificationLoading.value = false;

                // resetForm();
                qualificationSuccess.value = true;
                await assignAwardingInstitution(data?.data?.id, qualificationElement?.awardingInstitutionId);
                await assignQualificationType(data?.data?.id, qualificationElement?.qualificationTypeId);

                addEducationQualificationLoading.value = false;
                showSuccess(data?.message);

                setTimeout(() => {
                    qualificationSuccess.value = false;
                    qualificationSuccessMessage.value = '';
                }, 1000);
                // nextCallback();
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
// const achievements = ref('');
// const companyName = ref('');
// const startDate = ref('');
// const endDate = ref('');
// const jobTitle = ref('');
// const responsibilities = ref('');
const exprienceData = ref({});
const handleExperienceDetails = (data) => {
    employeeExperienceDetails.value = data;
    if (data) {
        exprienceData.value = { ...data };
    }
};
const nextOfKinDetail = ref({});
const handleNextOfKinDetails = (data) => {
    employeeNextOfKinDetails.value = data;
    if (data) {
        nextOfKinDetail.value = { ...data };
    }
};
const dependantDetails = ref({});
const handleDependantDetails = (data) => {
    employeeDependantDetails.value = data;
    if (data) {
        dependantDetails.value = { ...data };
    }
};
const addEmployeeExperience = async (employeeId) => {
    addExperienceError.value = '';

    addExperienceLoading.value = true;
    const payloadData = employeeExperienceDetails?.value || exprienceData.value;

    try {
        const url = `${baseURL}/employees/experience/create`;

        if (!payloadData?.companyName?.trim()) {
            alert('Please enter Company name.');
            return;
        }

        const formData = {
            achievements: payloadData?.achievements,
            companyName: payloadData?.companyName,
            endDate: changeDateFormat(payloadData?.endDate),
            jobTitle: payloadData?.jobTitle,
            responsibilities: payloadData?.responsibilities,
            startDate: changeDateFormat(payloadData?.startDate),
            employeeId: employeeId
        };
        console.log('experience', formData);
        const data = await postData(url, formData, addExperienceLoading);

        if (data?.status === 200 || data?.status === 201) {
            addExperienceError.value = '';
            successMessageAddExperience.value = data?.message;
            // applicantStore.setapplicantData(formData);
            addExperienceLoading.value = false;

            employeeExperienceDetails.value = {};
            successAddExperience.value = true;
            addExperienceLoading.value = false;
            showSuccess(data?.message);
            setTimeout(() => {
                successAddExperience.value = false;
                successMessageAddExperience.value = '';
            }, 1000);
            // nextCallback();
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
const addEmployeeNextOfKin = async (employeeId) => {
    addNextOfKinError.value = '';
    loading.value = true;
    try {
        const url = `${baseURL}/employees/next-of-kin/create`;

        if (!employeeNextOfKinDetails?.value?.firstName?.trim()) {
            showError('Please enter First name.');
            return;
        }
        const payloadData = employeeNextOfKinDetails?.value || nextOfKinDetail.value;

        const formData = {
            email: payloadData?.email,
            employeeId: employeeId,
            firstName: payloadData?.firstName,
            lastName: payloadData?.lastName,
            phoneNumber: payloadData?.phoneNumber,
            physicalAddress: payloadData?.physicalAddress,
            relationship: payloadData?.relationship
        };

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddNextOfKin.value = data?.message;
            // applicantStore.setapplicantData(formData);
            loading.value = false;

            employeeNextOfKinDetails.value = {};
            successAddNextOfKin.value = true;
            loading.value = false;
            showSuccess(data?.message);

            setTimeout(() => {
                successAddNextOfKin.value = false;
                successMessageAddNextOfKin.value = '';
            }, 1000);
            // nextCallback();
        } else {
            loading.value = false;
            successAddNextOfKin.value = false;
            successMessageAddNextOfKin.value = '';
            addNextOfKinError.value = data?.message ? data?.message : data?.error;
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        loading.value = false;
        showError('Failed', 'Add Next of kin');

        console.error('Login error:', error);
    }
};
const addEmployeeDependant = async (employeeId) => {
    loading.value = true;
    addDependantError.value = '';
    try {
        const url = `${baseURL}/employees/dependent/create`;
        const payloadData = employeeDependantDetails?.value || dependantDetails.value;
        if (!employeeDependantDetails?.value?.firstName?.trim()) {
            alert('Please enter  name.');
            return;
        }

        const formData = {
            employeeId: employeeId,
            name: `${payloadData?.firstName} ${payloadData?.lastName}`,
            phoneNumber: payloadData?.phoneNumber
        };

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddDependant.value = data?.message;
            // applicantStore.setapplicantData(formData);
            loading.value = false;

            employeeDependantDetails.value = {};
            successAddDependant.value = true;
            loading.value = false;
            showSuccess(data?.message);

            setTimeout(() => {
                successAddDependant.value = false;
                successMessageAddDependant.value = '';
            }, 1000);
            // nextCallback();
        } else {
            loading.value = false;
            successAddDependant.value = false;
            successMessageAddDependant.value = '';
            addDependantError.value = data?.message ? data?.message : data?.error;
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        loading.value = false;
        successAddDependant.value = false;
        successMessageAddDependant.value = '';
        console.error('Login error:', error);
        showError('Failed', 'Add dependant');
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
const uploadedFiles = ref([]);
const concatenatedFileNames = ref('');
const uploadEmployeeDocuments = (documents, fileNames) => {
    uploadedFiles.value = documents;
    concatenatedFileNames.value = fileNames;
};
const uploadDocumentLoading = ref(false);
const handleUploadEmployeeDocuments = async (employeeId) => {
    uploadDocumentLoading.value = true;
    console.log('employeeId==>', employeeId);
    // loading.value = true;
    serverErrorUploadDocs.value = '';
    const formData = new FormData();
    formData.append('employeeId', employeeId);

    uploadedFiles.value.forEach((file) => {
        formData.append('file', file);
    });
    formData.append('labels', concatenatedFileNames.value);

    const url = `${baseURL}/employee-file/upload-files`;
    try {
        const data = await postDataUpload(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successUploadDocs.value = true;
            successMessageUploadDocs.value = data?.message;

            loading.value = false;
            showSuccess(data?.message);
            activeStep.value = 0;
            uploadDocumentLoading.value = false;

            resetForm();

            setTimeout(() => {
                successUploadDocs.value = false;
                successMessageUploadDocs.value = '';
            }, 1000);
        } else {
            uploadDocumentLoading.value = false;

            showError(data?.error || data?.message);
            successUploadDocs.value = false;
            successMessageUploadDocs.value = '';
            serverErrorUploadDocs.value = data?.error || data?.message;
            loading.value = false;
            showError(data?.message ? data?.message : data?.error, 'Documents Upload');
        }
    } catch (error) {
        uploadDocumentLoading.value = false;

        showError();
        loading.value = false;
        console.log(error?.error);
        showError('Failed', 'Documents Upload');
    }
};

// eslint-disable-next-line no-unused-vars
const handleSubmitEducationQualification = async (nextCallback) => {
    await addEmplyeeEducationQualification(createdEmployee?.value?.id, nextCallback);
};

const assignDepartment = async (id, department) => {
    loading.value = true;
    addDependantError.value = '';
    try {
        const url = `${baseURL}/employees/assign-department/${id}/${department?.id}`;

        // if (department) {
        //     showError('No department selected');
        //     // return;
        // }

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddDependant.value = data?.message;
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', 'Add department');
    }
};
const assignDesignation = async (id, designation) => {
    loading.value = true;
    // addDependantError.value = '';
    try {
        // if (designation) {
        //     showError('No designation selected');
        //     return;
        // }
        const url = `${baseURL}/employees/assign-designation/${id}/${designation?.id}`;

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddDependant.value = data?.message;
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', 'Add designation');
    }
};
const assignJobDescription = async (id, jobDescription) => {
    loading.value = true;
    // addDependantError.value = '';
    // if (jobDescription) {
    //     // showError('No job description selected');
    //     return;
    // }
    try {
        const url = `${baseURL}/employees/assign-jobDescription/${id}/${jobDescription.id}`;

        const formData = {};

        const data = await postData(url, formData, loading);
        console.log('job description created', data);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddDependant.value = data?.message;
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', 'Add job description');
    }
};
const assignNationality = async (id, nationality) => {
    loading.value = true;
    // addDependantError.value = '';
    try {
        const url = `${baseURL}/employees/assign-nationality/${id}/${nationality.id}`;

        // if (nationality) {
        //     showError('No nationality selected');
        //     return;
        // }

        const formData = {};

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddDependant.value = data?.message;
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        showError('Failed', 'Add job description');
    }
};
const addPersonalDetailsLoading = ref(false);
const savedPersonalDetails = ref({});
const handlePersonalDetails = async () => {
    addEmployeeError.value = '';
    addPersonalDetailsLoading.value = true;
    try {
        const url = `${baseURL}/employees/create`;
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
        if (!jobDescriptionId.value?.id) {
            showError('Please Add a job description');
            addEmployeeError.value = 'Please Add a job description';
            addPersonalDetailsLoading.value = false;

            return;
        }

        if (!validatePhoneNumber(phoneNumber.value)) {
            showError('Please enter a valid phone number.');
            addEmployeeError.value = 'Please enter a valid phone number.';
            addPersonalDetailsLoading.value = false;

            return;
        }
        if (otherPhoneNumber.value) {
            if (!validatePhoneNumber(otherPhoneNumber.value)) {
                showError('Please enter a valid other Phone Number.');
                addEmployeeError.value = 'Please enter a valid other Phone Number.';
                addPersonalDetailsLoading.value = false;

                return;
            }
        }
        // Prepare data object for submission

        const formData = {
            firstName: firstName.value,
            lastName: lastName.value,
            otherNames: otherName.value,
            phoneNumber: phoneNumber.value,
            gender: gender.value.name,
            emailAddress: email.value,
            physicalAddress: physicalAddress.value,
            dateOfBirth: changeDateFormat(dob.value),
            dateOfJoining: changeDateFormat(dateOfJoining.value),
            maritalStatus: maritalStatus.value.name,
            idType: idType.value.name,
            // jobDescriptionId: jobDescriptionId.value.id,
            employeeLevel: employeeLevel.value.name,
            idNumber: idNumber.value,
            // designationId: designationId?.value?.id,
            // nationalityId: nationalityId.value?.id,
            // departmentId: departmentId.value?.id,
            otherEmailAddress: otherEmail.value,
            otherPhoneNumber: otherPhoneNumber.value,
            postalAddress: postalAddress.value,
            customIdType: others.value,
            tinNumber: tinNumber.value,
            nssfNumber: nssfNumber.value

            // educationQualification: educationQualification.value
        };
        savedPersonalDetails.value = formData;
        showSuccess('information saved successfully');
        // nextCallback();
        addPersonalDetailsLoading.value = false;

        // Perform form submission logic (e.g., send data to backend)
        //
        addPersonalDetailsLoading.value = false;

        const data = await postData(url, formData, addPersonalDetailsLoading);

        if (!data?.data) {
            showError(data?.message || data?.error);
        }
        if (data?.status === 200 || data?.status === 201) {
            createdEmployee.value = data?.data;
            if (data?.data?.id) {
                if (nationalityId?.value) {
                    await assignNationality(data?.data?.id, nationalityId?.value);
                }
                if (departmentId?.value) {
                    await assignDepartment(data?.data?.id, departmentId?.value);
                }
                if (designationId.value) {
                    await assignDesignation(data?.data?.id, designationId?.value);
                }
                if (jobDescriptionId?.value) {
                    await assignJobDescription(data?.data?.id, jobDescriptionId?.value);
                }
                await addEmplyeeEducationQualification(data?.data?.id);
                await addEmployeeExperience(data?.data?.id);
                if (employeeNextOfKinDetails.value || nextOfKinDetail.value) {
                    await addEmployeeNextOfKin(data?.data?.id);
                }

                if (employeeDependantDetails.value || dependantDetails.value) {
                    await addEmployeeDependant(data?.data?.id);
                }
                await handleUploadEmployeeDocuments(data?.data?.id);
            }
            // nextCallback();

            successMessage.value = data?.message;
            employeeStore.setEmployeeData(formData);
            addPersonalDetailsLoading.value = false;

            success.value = true;
            showSuccess(data?.data?.message);

            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);

            addPersonalDetailsLoading.value = false;
        } else {
            success.value = false;
            successMessage.value = '';
            addEmployeeError.value = data?.data?.message ? data?.data?.message : data?.data?.error;
            showError(data?.data?.message ? data?.data?.message : data?.data?.error);
        }
    } catch (error) {
        addPersonalDetailsLoading.value = false;
        console.log(error?.error);
    }
};

// eslint-disable-next-line no-unused-vars
const handleSubmitExperience = async () => {
    // console.log('Form Step 3 Data:');
    // alert('Form Submitted Successfully!');
    // nextCallback();

    if (employeeExperienceDetails.value) {
        await addEmployeeExperience(createdEmployee?.value?.id);
    }
};
const addDependantAndNextOfKinLoading = ref(false);
// eslint-disable-next-line no-unused-vars
const handleSubmitNextOfKinAndDependant = async () => {
    // console.log('Form Step 3 Data:');
    // alert('Form Submitted Successfully!');
    // nextCallback();
    addDependantAndNextOfKinLoading.value = true;
    if (employeeNextOfKinDetails.value) {
        await addEmployeeNextOfKin(createdEmployee?.value?.id);
    }

    if (employeeDependantDetails.value) {
        await addEmployeeDependant(createdEmployee?.value?.id);
    }
    addDependantAndNextOfKinLoading.value = false;

    // nextCallback();
};
const activeStep = ref(0);
// eslint-disable-next-line no-unused-vars
const handleSubmitDocuments = async () => {
    // console.log('Form Step 3 Data:');
    // alert('Form Submitted Successfully!');
    uploadDocumentLoading.value = true;
    if (uploadedFiles?.value?.length > 0 && concatenatedFileNames) {
        await handleUploadEmployeeDocuments(createdEmployee?.value?.id);
    }
};
const goBack = (prevCallback) => {
    uploadDocumentLoading.value = false;
    addDependantAndNextOfKinLoading.value = false;
    addExperienceLoading.value = false;
    addPersonalDetailsLoading.value = false;
    addEducationQualificationLoading.value = false;
    loading.value = false;
    prevCallback();
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
                            <form @submit.prevent="nextCallback">
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
                                        <label for="othername">Other Name(s) (optional)</label>
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
                                        <label for="maritalstatus">Designation</label>
                                        <AutoComplete
                                            placeholder="Search"
                                            id="designation"
                                            optionLabel="grade"
                                            :dropdown="true"
                                            :multiple="false"
                                            v-model="designationId"
                                            :suggestions="autoFilteredDesignations"
                                            @complete="searchDesignation($event)"
                                            field="jobTitle"
                                        >
                                            <template #option="slotProps">
                                                <div class="flex align-options-center">
                                                    <div>{{ slotProps?.option?.jobTitle }}</div>
                                                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                                    <!-- Space character -->
                                                    <div>{{ slotProps?.option?.grade }}</div>
                                                </div>
                                            </template>
                                        </AutoComplete>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="maritalstatus">Department</label>
                                        <AutoComplete placeholder="Search" id="department" :dropdown="true" :multiple="false" v-model="departmentId" :suggestions="autoFilteredDepartments" @complete="searchDepartment($event)" field="name" />
                                    </div>

                                    <div class="field col-12 md:col-4">
                                        <label for="nationality">Nationality</label>
                                        <AutoComplete placeholder="Search" id="nationality" :dropdown="true" :multiple="false" v-model="nationalityId" :suggestions="autoFilteredNationlalities" @complete="searchNationality($event)" field="name" />
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="level">Level</label>
                                        <Dropdown id="level" v-model="employeeLevel" :options="employeeLevels" optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="nationality">Job Description</label>
                                        <AutoComplete
                                            required
                                            placeholder="Search"
                                            id="jobDescription"
                                            :dropdown="true"
                                            :multiple="false"
                                            v-model="jobDescriptionId"
                                            :suggestions="autoFilteredJobDescription"
                                            @complete="searchJobDescription($event)"
                                            field="jobTitle"
                                        >
                                            <template #option="slotProps">
                                                <div class="job-info">
                                                    <div class="flex align-options-center">
                                                        <div class="job-detail">
                                                            <div>jobTitle: {{ slotProps?.option?.jobTitle }}</div>
                                                            <div>jobGrade: {{ slotProps?.option?.jobGrade }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </AutoComplete>
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
                                        <label for="otherPhoneNumber">Other Phone Number (optional)</label>
                                        <InputText id="otherPhoneNumber" type="text" v-model="otherPhoneNumber" />
                                    </div>

                                    <div class="field col-12 md:col-4">
                                        <label for="otherEmail">Other Email Address (optional)</label>
                                        <InputText id="otherEmail" type="text" v-model="otherEmail" />
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="postalAddress">Postal Address</label>
                                        <InputText required id="postalAddress" type="text" v-model="postalAddress" />
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="nssfNumber">NSSF Number</label>
                                        <InputText required id="nssfNumber" type="text" v-model="nssfNumber" />
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="tinNumber">Tin Number</label>
                                        <InputText required id="tinNumber" type="text" v-model="tinNumber" />
                                    </div>
                                </div>
                                <div class="flex pt-4 justify-content-end">
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addPersonalDetailsLoading" size="2rem" />
                                        <Button v-if="!addPersonalDetailsLoading" :disabled="addPersonalDetailsLoading" type="submit" label="Continue" icon="pi pi-arrow-right" iconPos="right" />
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
                            <form @submit.prevent="nextCallback">
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
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="goBack(prevCallback)" />
                                    </div>
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addEducationQualificationLoading" size="2rem" />
                                        <Button v-if="!addEducationQualificationLoading" :disabled="addEducationQualificationLoading" type="submit" label="Continue" icon="pi pi-arrow-right" iconPos="right" />
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
                            <form @submit.prevent="nextCallback">
                                <!-- Experience form fields here -->
                                <EmployeeExperience @handleExperienceDetails="handleExperienceDetails" :maxJoiningDate="maxJoiningDate" :exprienceData="exprienceData" />

                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="goBack(prevCallback)" />
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addExperienceLoading" size="2rem" />
                                        <Button v-if="!addExperienceLoading" :disabled="addExperienceLoading" type="submit" label="Continue" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                    <!-- <Button type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" /> -->
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Next Of Kin/Dependant">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="col-12">
                        <div class="card">
                            <form @submit.prevent="nextCallback">
                                <div class="col-12">
                                    <div class="card">
                                        <!-- <form @submit.prevent="handleSubmitNextOfKinAndDependant(nextCallback)"> -->
                                        <Message v-if="successAddNextOfKin" severity="success">{{ successMessageAddNextOfKin }}</Message>

                                        <Message v-if="addNextOfKinError" severity="error">{{ addNextOfKinError }}</Message>

                                        <h5>Next Of Kin</h5>
                                        <NextOfKin
                                            @handleNextOfKinDetails="handleNextOfKinDetails"
                                            :lName="nextOfKinDetail?.lastName"
                                            :fName="nextOfKinDetail?.firstName"
                                            :phonNo="nextOfKinDetail?.phoneNumber"
                                            :address="nextOfKinDetail?.physicalAddress"
                                            :emailAddress="nextOfKinDetail?.email"
                                            :relation="nextOfKinDetail?.relationship"
                                        />
                                        <!-- </form> -->
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="card">
                                        <Message v-if="successAddDependant" severity="success">{{ successMessageAddDependant }}</Message>

                                        <Message v-if="addDependantError" severity="error">{{ addDependantError }}</Message>

                                        <h5>Dependant</h5>
                                        <Dependant @handleDependantDetails="handleDependantDetails" :lName="dependantDetails?.lastName" :fName="dependantDetails?.firstName" :phonNo="dependantDetails?.phoneNumber" />
                                    </div>
                                </div>
                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="goBack(prevCallback)" />
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addDependantAndNextOfKinLoading" size="2rem" />
                                        <Button v-if="!addDependantAndNextOfKinLoading" :disabled="addDependantAndNextOfKinLoading" type="submit" label="Continue" icon="pi pi-arrow-right" iconPos="right" />
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
                            <form @submit.prevent="handlePersonalDetails(nextCallback)">
                                <!-- Documents form fields here -->
                                <AddDocuments @uploadEmployeeDocuments="uploadEmployeeDocuments" />

                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="goBack(prevCallback)" />
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
