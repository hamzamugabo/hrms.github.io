<script setup>
import { onMounted, ref } from 'vue';
import { useEmployeeStore } from '@/piniaStore/employeeData.js';

import QualificationsForm from './QualificationFormTemplate.vue';

import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';

// import countryList from 'country-list';
import { fetchData, postData, baseURL, postDataUpload } from '@/components/reuseables/FetchPostData.js';
import { genderOptionsEnum, maritalStatusOptionsEnum, idTypeOptionsEnum, employeeLevelsEnum } from '@/components/reuseables/enums.js';
// import { useRouter } from 'vue-router';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import EmployeeExperience from './AddEmployeeExperience.vue';
import NextOfKin from './AddEmployeeNextOfKin.vue';
import Dependant from './AddEmployeeDependant.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
// eslint-disable-next-line no-unused-vars
import AddDocuments from './AddEmployeeDocuments.vue';
import { useJobDescription } from '@/components/jobDescription/jobDescriptionUtils';

import { useToastPopup } from '@/components/reuseables/useToast.js';
import { useRouter } from 'vue-router';

const { showError, showSuccess } = useToastPopup();

const { getJobDescriptions } = useJobDescription();
const employeeStore = useEmployeeStore();
const storedEmployeeData = employeeStore.getEmployeeData();
const genderOptions = ref(genderOptionsEnum);
const maritalStatusOptions = ref(maritalStatusOptionsEnum);
const idTypeOptions = ref(idTypeOptionsEnum);
const employeeLevels = ref(employeeLevelsEnum);
const employeeData = ref({});

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
// const nationalityId = ref('');
// const departmentId = ref('');
// const designationId = ref('');
const addEmployeeError = ref('');
const allDesignations = ref([]);
// const autoFilteredDesignations = ref([]);
const allNationlalities = ref([]);
// const autoFilteredNationlalities = ref([]);
const allDepartments = ref([]);
// const autoFilteredDepartments = ref([]);
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
const nssfNumber = ref('');
const tinNumber = ref('');
// const autoFilteredJobDescription = ref([]);
// const jobDescriptionId = ref('');
const jobDescriptions = ref([]);
const educationQualificationLabel = ref('Education qualification');
const educationQualification = ref([
    { id: '', name: '', yearOfAward: '', qualificationTypeId: '', awardingInstitutionId: '' } // Initial empty qualification
]);
const createdEmployee = ref({});

// const baseURL = import.meta.env.VITE_APP_API_URL;

const handleRemoveQualification = (index) => {
    educationQualification.value.splice(index, 1);
};

const handleAddQualification = () => {
    educationQualification.value.push({ id: '', name: '', yearOfAward: '', qualificationTypeId: '', awardingInstitutionId: '' });
    // console.log('educationQualification.value', educationQualification.value);
};
const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
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
const getEmployee = async (employee) => {
    const employeeId = storedEmployeeData?.id || employee?.id;
    const url = `${baseURL}/employees/by-id/${employeeId}`;
    if (!employeeId) {
        useRouter().back();
        return;
    }
    try {
        if (url && employeeId) {
            const { data } = await fetchData(url, loading);
            console.log('employee to edit data', data);
            firstName.value = data?.firstName;
            lastName.value = data?.lastName;
            otherName.value = data?.otherNames;
            gender.value = { name: data?.gender, code: data?.gender };
            dob.value = data?.dob;
            maritalStatus.value = { name: data?.maritalStatus, code: data?.maritalStatus };
            nationality.value = [];
            idType.value = { name: data?.idType, code: data?.idType };
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
            nssfNumber.value = data?.nssfNumber;
            tinNumber.value = data?.tinNumber;

            // console.log('employee===>', data);
            // employees.value = data;
            employeeData.value = data;
            educationQualification.value =
                data?.educationQualification?.length > 0
                    ? data?.educationQualification
                    : [
                          { id: '', name: '', yearOfAward: '', qualificationTypeId: '', awardingInstitutionId: '' } // Initial empty qualification
                      ];
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
const addEducationQualificationLoading = ref(false);
const addEmplyeeEducationQualification = async (nextCallback) => {
    addEducationQualificationLoading.value = true;
    try {
        if (!educationQualification?.value) {
            showError('no qualification selected');
            return;
        }
        let url = `${baseURL}/employees/qualifications/update`;
        if (storedEmployeeData?.educationQualification?.length === 0) {
            url = `${baseURL}/employees/qualifications/create`;
        }

        educationQualification?.value?.forEach(async (qualificationElement) => {
            // Check if any required properties are missing or empty
            // if (!qualificationElement?.awardingInstitutionId?.id || !qualificationElement?.name || !qualificationElement?.qualificationTypeId?.id || !qualificationElement?.yearOfAward) {
            //     // Skip the element and move to the next iteration
            //     return;
            // }

            let formData = {
                // awardingInstitutionId: qualificationElement?.awardingInstitutionId?.id,
                id: qualificationElement?.id,
                name: qualificationElement?.name,
                // qualificationTypeId: qualificationElement?.qualificationTypeId?.id,
                yearOfAward: changeDateFormat(qualificationElement?.yearOfAward)
            };
            if (storedEmployeeData?.educationQualification?.length === 0) {
                formData = {
                    // awardingInstitutionId: qualificationElement?.awardingInstitutionId?.id,
                    employeeId: storedEmployeeData?.id,
                    name: qualificationElement?.name,
                    // qualificationTypeId: qualificationElement?.qualificationTypeId?.id,
                    yearOfAward: changeDateFormat(qualificationElement?.yearOfAward)
                };
            }

            const data = await postData(url, formData, addEducationQualificationLoading);

            if (data?.status === 200 || data?.status === 201) {
                qualificationError.value = '';
                qualificationSuccessMessage.value = data?.message;
                // employeeStore.departmendepartmentIdtIddepartmentId(formData);
                addEducationQualificationLoading.value = false;

                // resetForm();
                qualificationSuccess.value = true;
                if (storedEmployeeData?.educationQualification === 0) {
                    await assignAwardingInstitution(data?.data?.id, qualificationElement?.awardingInstitutionId);
                    await assignQualificationType(data?.data?.id, qualificationElement?.qualificationTypeId);
                }
                addEducationQualificationLoading.value = false;
                showSuccess(data?.message);
                const employeeId = storedEmployeeData?.id;
                await getEmployee(employeeId);

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
    employeeExperienceDetails.value = data;
};

const handleNextOfKinDetails = (data) => {
    employeeNextOfKinDetails.value = data;
};

const handleDependantDetails = (data) => {
    employeeDependantDetails.value = data;
};

const addEmployeeExperience = async (nextCallback) => {
    addExperienceError.value = '';

    addExperienceLoading.value = true;
    try {
        let url = `${baseURL}/employees/experience/update`;

        if (!employeeExperienceDetails?.value?.companyName?.trim()) {
            alert('Please enter Company name.');
            return;
        }

        let formData = {
            achievements: employeeExperienceDetails?.value?.achievements,
            companyName: employeeExperienceDetails?.value?.companyName,
            endDate: changeDateFormat(employeeExperienceDetails?.value?.endDate),
            jobTitle: employeeExperienceDetails?.value?.jobTitle,
            responsibilities: employeeExperienceDetails?.value?.responsibilities,
            startDate: changeDateFormat(employeeExperienceDetails?.value?.startDate),
            id: exprienceData?.value?.id
        };
        if (!updateExprienceState.value && storedEmployeeData?.employeeExperiences?.length === 0) {
            url = `${baseURL}/employees/experience/create`;
            formData = {
                achievements: employeeExperienceDetails?.value?.achievements,
                companyName: employeeExperienceDetails?.value?.companyName,
                endDate: changeDateFormat(employeeExperienceDetails?.value?.endDate),
                jobTitle: employeeExperienceDetails?.value?.jobTitle,
                responsibilities: employeeExperienceDetails?.value?.responsibilities,
                startDate: changeDateFormat(employeeExperienceDetails?.value?.startDate),
                employeeId: storedEmployeeData?.id
            };
        }

        // console.log('experience', formData);
        const data = await postData(url, formData, addExperienceLoading);

        if (data?.status === 200 || data?.status === 201) {
            addExperienceError.value = '';
            successMessageAddExperience.value = data?.message;
            // applicantStore.setapplicantData(formData);
            addExperienceLoading.value = false;

            employeeExperienceDetails.value = {};
            successAddExperience.value = true;
            addExperienceLoading.value = false;
            const employeeId = storedEmployeeData?.id;
            await getEmployee(employeeId);
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

const addEmployeeNextOfKin = async (nextCallback) => {
    addNextOfKinError.value = '';
    addNextOfKinLoading.value = true;
    try {
        let url = `${baseURL}/employees/next-of-kin/update`;

        if (!employeeNextOfKinDetails?.value?.firstName?.trim()) {
            showError('Please enter First name.');
            return;
        }
        let formData = {
            email: employeeNextOfKinDetails?.value?.email,
            id: nextOfKinData?.value?.id,
            firstName: employeeNextOfKinDetails?.value?.firstName,
            lastName: employeeNextOfKinDetails?.value?.lastName,
            phoneNumber: employeeNextOfKinDetails?.value?.phoneNumber,
            physicalAddress: employeeNextOfKinDetails?.value?.physicalAddress,
            relationship: employeeNextOfKinDetails?.value?.relationship
        };

        if (!updateNextOfKinState.value && storedEmployeeData?.nextOfKins?.length === 0) {
            url = `${baseURL}/employees/next-of-kin/create`;
            formData = {
                email: employeeNextOfKinDetails?.value?.email,
                employeeId: storedEmployeeData?.id,
                firstName: employeeNextOfKinDetails?.value?.firstName,
                lastName: employeeNextOfKinDetails?.value?.lastName,
                phoneNumber: employeeNextOfKinDetails?.value?.phoneNumber,
                physicalAddress: employeeNextOfKinDetails?.value?.physicalAddress,
                relationship: employeeNextOfKinDetails?.value?.relationship
            };
        }

        const data = await postData(url, formData, addNextOfKinLoading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddNextOfKin.value = data?.message;
            // applicantStore.setapplicantData(formData);
            addNextOfKinLoading.value = false;

            employeeNextOfKinDetails.value = {};
            successAddNextOfKin.value = true;
            addNextOfKinLoading.value = false;
            showSuccess(data?.message);
            const employeeId = storedEmployeeData?.id;
            await getEmployee(employeeId);
            setTimeout(() => {
                successAddNextOfKin.value = false;
                successMessageAddNextOfKin.value = '';
            }, 1000);
            nextCallback();
        } else {
            addNextOfKinLoading.value = false;
            successAddNextOfKin.value = false;
            successMessageAddNextOfKin.value = '';
            addNextOfKinError.value = data?.message ? data?.message : data?.error;
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        addNextOfKinLoading.value = false;
        showError('Failed', 'Add Next of kin');

        console.error('Login error:', error);
    }
};

const addDependantLoading = ref(false);
const addEmployeeDependant = async (nextCallback) => {
    addDependantLoading.value = true;
    addDependantError.value = '';
    try {
        let url = `${baseURL}/employees/dependent/update`;

        if (!employeeDependantDetails?.value?.firstName?.trim()) {
            alert('Please enter  name.');
            return;
        }

        let formData = {
            id: dependantData?.value?.id,
            name: `${employeeDependantDetails?.value?.firstName} ${employeeDependantDetails?.value?.lastName}`,
            phoneNumber: employeeDependantDetails?.value?.phoneNumber
        };
        if (!updateDependantState.value && storedEmployeeData?.dependents?.length === 0) {
            url = `${baseURL}/employees/dependent/create`;
            formData = {
                employeeId: storedEmployeeData?.id,
                name: `${employeeDependantDetails?.value?.firstName} ${employeeDependantDetails?.value?.lastName}`,
                phoneNumber: employeeDependantDetails?.value?.phoneNumber
            };
        }
        const data = await postData(url, formData, addDependantLoading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddDependant.value = data?.message;
            // applicantStore.setapplicantData(formData);
            addDependantLoading.value = false;

            employeeDependantDetails.value = {};
            successAddDependant.value = true;
            addDependantLoading.value = false;
            showSuccess(data?.message);
            const employeeId = storedEmployeeData?.id;
            await getEmployee(employeeId);
            setTimeout(() => {
                successAddDependant.value = false;
                successMessageAddDependant.value = '';
            }, 1000);
            nextCallback();
        } else {
            addDependantLoading.value = false;
            successAddDependant.value = false;
            successMessageAddDependant.value = '';
            addDependantError.value = data?.message ? data?.message : data?.error;
            showError(data?.message ? data?.message : data?.error);
        }
    } catch (error) {
        addDependantLoading.value = false;
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
// eslint-disable-next-line no-unused-vars
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

const handleSubmitEducationQualification = async (nextCallback) => {
    await addEmplyeeEducationQualification(nextCallback);
};

const addPersonalDetailsLoading = ref(false);
const handlePersonalDetails = async (nextCallback) => {
    const employeeId = storedEmployeeData?.id;
    if (!employeeId) {
        console.log('employee id missing');
        showError('employee id missing');
        return;
    }
    addEmployeeError.value = '';
    addPersonalDetailsLoading.value = true;
    try {
        const url = `${baseURL}/employees/update`;
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
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
        if (!email.value.trim() || !validateEmail(email.value.trim())) {
            showError('Please enter a valid email address.');
            addEmployeeError.value = 'Please enter a valid email address.';

            return;
        }
        if (otherEmail.value.trim()) {
            if (!validateEmail(otherEmail.value.trim())) {
                showError('Please enter a valid otherEmail address.');
                addEmployeeError.value = 'Please enter a valid otherEmail address.';

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

            employeeLevel: employeeLevel.value.name,
            idNumber: idNumber.value,

            id: employeeId,
            otherEmailAddress: otherEmail.value,
            otherPhoneNumber: otherPhoneNumber.value,
            postalAddress: postalAddress.value,
            customIdType: others.value,
            tinNumber: tinNumber.value,
            nssfNumber: nssfNumber.value

            // educationQualification: educationQualification.value
        };

        // Perform form submission logic (e.g., send data to backend)
        //
        // addPersonalDetailsLoading.value = false;

        const data = await postData(url, formData, addPersonalDetailsLoading);

        if (!data?.data) {
            showError(data?.message || data?.error);
        }
        if (data?.status === 200 || data?.status === 201) {
            createdEmployee.value = data?.data;
            // if (data?.data?.id) {
            //     if (nationalityId?.value) {
            //         await assignNationality(data?.data?.id, nationalityId?.value);
            //     }
            //     if (departmentId?.value) {
            //         await assignDepartment(data?.data?.id, departmentId?.value);
            //     }
            //     if (designationId.value) {
            //         await assignDesignation(data?.data?.id, designationId?.value);
            //     }
            //     if (jobDescriptionId?.value) {
            //         await assignJobDescription(data?.data?.id, jobDescriptionId?.value);
            //     }
            // }

            await getEmployee(data?.data?.id);

            nextCallback();

            successMessage.value = data?.message;
            employeeStore.setEmployeeData(data?.data);
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
    if (employeeExperienceDetails.value) {
        await addEmployeeExperience(nextCallback);
    }
};
const updateExprienceState = ref(false);
const exprienceId = ref('');
const achievements = ref('');
const companyName = ref('');
const endDate = ref('');
const jobTitle = ref('');
const responsibilities = ref('');
const startDate = ref('');

const exprienceData = ref({});
const updateExperience = (experience) => {
    achievements.value = experience?.achievements;
    companyName.value = experience?.companyName;
    endDate.value = experience?.endDate;
    jobTitle.value = experience?.jobTitle;
    responsibilities.value = experience?.responsibilities;
    startDate.value = experience?.startDate;
    exprienceId.value = experience?.id;
    exprienceData.value = experience;
    updateExprienceState.value = true;
};
const educationData = ref({});
const updateEducationState = ref(false);
const educationId = ref('');

const updateEducation = (education) => {
    educationQualification.value = [{ id: education?.id, name: education?.name, yearOfAward: education?.yearOfAward }];
    educationId.value = education?.id;
    educationData.value = education;
    updateEducationState.value = true;
};

const updateDependantState = ref(false);

const dependantData = ref({});
const dependantFirstName = ref('');
const dependantLastName = ref('');
const dependantPhoneNumber = ref('');
const dependantId = ref('');
const updateDependantData = (dependent) => {
    const [firstName, lastName] = dependent.name.split(' ');
    dependantFirstName.value = firstName;
    dependantLastName.value = lastName;
    dependantPhoneNumber.value = dependent.phoneNumber;

    dependantId.value = dependent?.id;
    dependantData.value = dependent;
    updateDependantState.value = true;
};

const addNextOfKinLoading = ref(false);
const handleSubmitNextOfKin = async (nextCallback) => {
    if (employeeNextOfKinDetails.value) {
        await addEmployeeNextOfKin(nextCallback);
    }
};

const updateNextOfKinState = ref(false);

const nextOfKinData = ref({});
const nextOfKinFirstName = ref('');
const nextOfKinLastName = ref('');
const nextOfKinPhoneNumber = ref('');
const nextOfKinEmail = ref('');
const nextOfKinPhysicalAddress = ref('');
const nextOfKinRelationship = ref('');
const nextOfKinId = ref('');
const updateNextOfKinData = (nextOfKin) => {
    nextOfKinFirstName.value = nextOfKin?.firstName;
    nextOfKinLastName.value = nextOfKin?.lastName;
    nextOfKinPhoneNumber.value = nextOfKin.phoneNumber;
    nextOfKinEmail.value = nextOfKin.email;
    nextOfKinPhysicalAddress.value = nextOfKin.physicalAddress;
    nextOfKinRelationship.value = nextOfKin.relationship;

    nextOfKinId.value = nextOfKin?.id;
    nextOfKinData.value = nextOfKin;
    updateNextOfKinState.value = true;
};
const handleSubmitDependant = async (nextCallback) => {
    if (employeeDependantDetails.value) {
        await addEmployeeDependant(nextCallback);
    }
    // addNextOfKinLoading.value = false;

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

// const active = ref(0);
</script>
<template>
    <div class="grid">
        <Stepper v-model:activeStep="activeStep">
            <StepperPanel header="Update Personal details">
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
                                        <label for="dob">Date of Joining</label>
                                        <Calendar :showIcon="true" :showButtonBar="true" v-model="dateOfJoining" :maxDate="maxJoiningDate"></Calendar>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="maritalstatus">Marital Status</label>
                                        <Dropdown id="state" v-model="maritalStatus" :options="maritalStatusOptions" optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>
                                    <!-- <div class="field col-12 md:col-4">
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
                                    </div> -->
                                    <div class="field col-12 md:col-4">
                                        <label for="level">Level</label>
                                        <Dropdown id="level" v-model="employeeLevel" :options="employeeLevels" optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>
                                    <!-- <div class="field col-12 md:col-4">
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
                                    </div> -->
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
                                        <label for="otherPhoneNumber">Other Phone Number</label>
                                        <InputText id="otherPhoneNumber" type="text" v-model="otherPhoneNumber" />
                                    </div>

                                    <div class="field col-12 md:col-4">
                                        <label for="otherEmail">Other Email Address</label>
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
                    <div class="grid" v-for="education in storedEmployeeData?.educationQualification" :key="education?.id">
                        <div class="col-12 lg:col-6 xl:col-4 mt-3 mr-2" style="cursor: pointer">
                            <div class="card" style="min-width: 300px">
                                <div class="mb-3">
                                    <div class="flex justify-content-between mb-3">
                                        <span class="block text-500 font-medium mb-1"><strong>Award: </strong> {{ education?.name }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-500 font-medium mb-1"><strong>Year of award: </strong> {{ education?.yearOfAward }}</span>
                                    </div>

                                    <Button @click="updateEducation(education)" class="mb-2" style="float: right; margin-bottom: 3px" label="Update" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="updateEducationState || storedEmployeeData?.educationQualification?.length === 0" class="col-12">
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
                                            :update="storedEmployeeData?.educationQualification?.length === 0 ? '' : 'update'"
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
                    <!-- storedEmployeeData -->
                    <div class="grid" v-for="exprience in storedEmployeeData?.employeeExperiences" :key="exprience?.id">
                        <div class="col-12 lg:col-6 xl:col-4 mt-3 mr-2" style="cursor: pointer">
                            <div class="card" style="min-width: 300px">
                                <div class="mb-3">
                                    <div class="flex justify-content-between mb-3">
                                        <span class="block text-500 font-medium mb-1"><strong>companyName: </strong> {{ exprience?.companyName }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-500 font-medium mb-1"><strong>jobTitle: </strong> {{ exprience?.jobTitle }}</span>
                                    </div>

                                    <Button @click="updateExperience(exprience)" class="mb-2" style="float: right; margin-bottom: 3px" label="Update" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="updateExprienceState || storedEmployeeData?.employeeExperiences?.length === 0" class="col-12">
                        <div class="card">
                            <form @submit.prevent="handleSubmitExperience(nextCallback)">
                                <!-- Experience form fields here -->
                                <EmployeeExperience @handleExperienceDetails="handleExperienceDetails" :maxJoiningDate="maxJoiningDate" :exprienceData="exprienceData" />

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

            <StepperPanel header="Next Of Kin">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="grid" v-for="nextOfKin in storedEmployeeData?.nextOfKins" :key="nextOfKin?.id">
                        <div class="col-12 lg:col-6 xl:col-4 mt-3 mr-2" style="cursor: pointer">
                            <div class="card" style="min-width: 300px">
                                <div class="mb-3">
                                    <div class="flex justify-content-between mb-2">
                                        <span class="block text-500 font-medium"><strong>Name: </strong> {{ nextOfKin?.firstName }} {{ nextOfKin?.lastName }}</span>
                                    </div>
                                    <div class="flex justify-content-between mb-2">
                                        <span class="block text-500 font-medium"><strong>phoneNumber: </strong> {{ nextOfKin?.phoneNumber }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-500 font-medium"><strong>relationship: </strong> {{ nextOfKin?.relationship }}</span>
                                    </div>

                                    <Button @click="updateNextOfKinData(nextOfKin)" class="mb-2" style="float: right; margin-bottom: 3px" label="Update" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="updateNextOfKinState || storedEmployeeData?.nextOfKins?.length === 0" class="col-12">
                        <div class="card">
                            <form @submit.prevent="handleSubmitNextOfKin(nextCallback)">
                                <div class="col-12">
                                    <div class="card">
                                        <Message v-if="successAddNextOfKin" severity="success">{{ successMessageAddNextOfKin }}</Message>

                                        <Message v-if="addNextOfKinError" severity="error">{{ addNextOfKinError }}</Message>

                                        <h5>Next Of Kin</h5>
                                        <NextOfKin
                                            @handleNextOfKinDetails="handleNextOfKinDetails"
                                            :lName="nextOfKinLastName"
                                            :fName="nextOfKinFirstName"
                                            :phonNo="nextOfKinPhoneNumber"
                                            :address="nextOfKinPhysicalAddress"
                                            :emailAddress="nextOfKinEmail"
                                            :relation="nextOfKinRelationship"
                                        />
                                    </div>
                                </div>

                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addNextOfKinLoading" size="2rem" />
                                        <Button v-if="!addNextOfKinLoading" :disabled="addNextOfKinLoading" type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Dependant">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="grid" v-for="dependant in storedEmployeeData?.dependents" :key="dependant?.id">
                        <div class="col-12 lg:col-6 xl:col-4 mt-3 mr-2" style="cursor: pointer">
                            <div class="card" style="min-width: 300px">
                                <div class="mb-3">
                                    <div class="flex justify-content-between mb-3">
                                        <span class="block text-500 font-medium mb-1"><strong>Name: </strong> {{ dependant?.name }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-500 font-medium mb-1"><strong>phoneNumber: </strong> {{ dependant?.phoneNumber }}</span>
                                    </div>

                                    <Button @click="updateDependantData(dependant)" class="mb-2" style="float: right; margin-bottom: 3px" label="Update" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="updateDependantState || storedEmployeeData?.dependents?.length === 0" class="col-12">
                        <div class="card">
                            <form @submit.prevent="handleSubmitDependant(nextCallback)">
                                <div class="col-12">
                                    <div class="card">
                                        <Message v-if="successAddDependant" severity="success">{{ successMessageAddDependant }}</Message>

                                        <Message v-if="addDependantError" severity="error">{{ addDependantError }}</Message>

                                        <h5>Dependant</h5>
                                        <Dependant @handleDependantDetails="handleDependantDetails" :fName="dependantFirstName" :lName="dependantLastName" :phonNo="dependantPhoneNumber" />
                                    </div>
                                </div>
                                <div class="flex pt-4 justify-content-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                    <div class="flex justify-content-end gap-2">
                                        <SpinnerVue :loading="addDependantLoading" size="2rem" />
                                        <Button v-if="!addDependantLoading" :disabled="addDependantLoading" type="submit" label="Update" icon="pi pi-arrow-right" iconPos="right" />
                                    </div>
                                    <!-- <Button type="submit" label="Next" icon="pi pi-arrow-right" iconPos="right" /> -->
                                </div>
                            </form>
                        </div>
                    </div>
                </template>
            </StepperPanel>

            <!-- <StepperPanel header="Documents">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="col-12">
                        <div class="card">
                            <form @submit.prevent="handleSubmitDocuments(nextCallback)">
                              
                                <AddDocuments @uploadEmployeeDocuments="uploadEmployeeDocuments" />

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
            </StepperPanel> -->
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
