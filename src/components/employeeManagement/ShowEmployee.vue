<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { useToast } from 'primevue/usetoast';
import { useEmployeeStore } from '@/piniaStore/employeeData.js';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData.js';
// import UploadFiles from '@/components/reuseables/FileUploader.vue';
// import loadFromLocalStorage from '@/components/reuseables/getUser.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import AddNextOfKin from './AddEmployeeNextOfKin.vue';
import AddDependant from './AddEmployeeDependant.vue';
import { useEmployee } from './employeeUtils.js';
import DisplayEducation from './DisplayEmployeeQualifications.vue';
import DisplayExperience from './DisplayEmployeeExperience.vue';
import DisplayDetails from './DisplayEmployeeDetails.vue';
import DisplayNextOfKins from './DisplayEmployeeNextOfKin.vue';
import DisplayDependants from './DisplayEmployeeDependants.vue';
import AddDocuments from './AddEmployeeDocuments.vue';
import AttendenceTimeFramesLineGraph from '../../views/charts/AttendenceTimeFramesLineGraphEmployee.vue';
import Summaries from './DisplayEmployeeSummaries.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();


const {
    getNationality,
    getProfilePicture,
    postDataUpload,
    getDepartment,
    getEmployeeDependants,
    getEmployeeNextOfKins,
    getEmployeeExperience,
    getEductionQualifications,
    addEmployeeNextOfKin,
    updateEmployeeNextOfKin,
    addEmployeeDependant,
    updateEmployeeDependant,
    getEmployeeDutyStation,
    getEmployeeById,
    getDesignationById
} = useEmployee();
const router = useRouter();
const route = useRoute();
const profileImageUrl = ref('https://via.placeholder.com/150');

const employeeStore = useEmployeeStore();
const employeeInfor = ref(employeeStore?.getEmployeeData());
const loading = ref(false);
const profileUploadloading = ref(false);
const nationality = ref('');
const department = ref('');
const profilePhoto = ref('');
const nationalityError = ref('');
const departmentError = ref('');
const fileData = ref('');

const imageUrl = ref('');
const imageBinaryData = ref('');
const success = ref(false);
const successMessage = ref('');
const whatToAdd = ref('');
const uploadProfileError = ref('');
const educationQualifications = ref([]);

const successMessageAddNextOfKin = ref(false);
const successAddNextOfKin = ref('');
const addNextOfKinError = ref('');
const successMessageAddDependant = ref(false);
const successAddDependant = ref('');
const addDependantError = ref('');
const showHide = ref('education');
const routeId = ref(route?.query?.id);
const setNextOfKIn = ref({});
const employeeDependants = ref([]);
const employeeNextOfKins = ref([]);

const employeeExperience = ref([]);
const employeeNextOfKinDetails = ref({});
const employeeDependantDetails = ref({});
const loadingAddDependant = ref(false);
const loadingAddNextOfKin = ref(false);
const visibleAddDoc = ref(false);
const successUploadDocs = ref(false);
const successMessageUploadDocs = ref('');
const serverErrorUploadDocs = ref('');
const loadingEmployeeDocs = ref(false);
const timeFrame = ref('month');
const dutyStation = ref({});
const designation = ref('');
const timeFrameUrlState = ref(`${baseURL}/attendance/by-employee/${routeId.value}/timeSeries`);


const hitOptionsButton = () => {
    if (whatToAdd.value === 'next Of Kin' && !setNextOfKIn?.value?.id) {
        addEmployeeNextOfKin(employeeNextOfKinDetails, employeeInfor?.value?.id, employeeNextOfKins, loadingAddNextOfKin, successMessageAddNextOfKin, addNextOfKinError, successAddNextOfKin);
    }
    if (whatToAdd.value === 'next Of Kin' && setNextOfKIn?.value?.id) {
        updateEmployeeNextOfKin(setNextOfKIn?.value?.id, employeeNextOfKinDetails, loadingAddNextOfKin, successMessageAddNextOfKin, addNextOfKinError, successAddNextOfKin, employeeInfor?.value?.id, employeeNextOfKins);
        // (setNextOfKIn?.value?.id);
    }
    if (whatToAdd.value === 'dependant' && !setNextOfKIn?.value?.id) {
      

        addEmployeeDependant(employeeDependantDetails, employeeInfor?.value?.id, employeeDependants, loadingAddDependant, successMessageAddDependant, addDependantError, successAddDependant);
        // (employeeInfor?.value?.id);
    }
    if (whatToAdd.value === 'dependant' && setNextOfKIn?.value?.id) {
      
        updateEmployeeDependant(setNextOfKIn?.value?.id, employeeDependantDetails, loadingAddDependant, successAddDependant, successMessageAddDependant, addDependantError, employeeInfor?.value?.id, employeeDependants);
        // (setNextOfKIn?.value?.id);
    }
};
const handleEditNextOfKin = (editData) => {
    handleAdd('next Of Kin', editData);
};
const handleEditDependant = (editData) => {
    const [firstName, lastName] = editData.name.split(' ');

    const updatedObject = {
        ...editData,
        firstName,
        lastName
    };

    handleAdd('dependant', updatedObject);
};

const deleteData = async (url) => {
    try {
        await fetchData(url, loading);
        getEmployeeDependants(employeeInfor?.value?.id, employeeDependants, false);
        getEmployeeNextOfKins(employeeInfor?.value?.id, employeeNextOfKins, false);
    } catch (error) {
        console.error('Error deleting employee:', error.message);
        alert('Failed to delete employee. Please try again.');
    }
};
watch(employeeInfor, () => {
    getEmployeeDependants(employeeInfor?.value?.id, employeeDependants, loading);
    getEmployeeNextOfKins(employeeInfor?.value?.id, employeeNextOfKins, false);

    getEmployeeExperience(employeeInfor?.value?.id, employeeExperience, false);
    getEductionQualifications(employeeInfor?.value?.id, educationQualifications, departmentError, loading);
});

const update = () => {
    employeeStore.setEmployeeData(employeeInfor);
    router.push('/update-employee');
};
onMounted(() => {
   getDesignationById(employeeInfor?.value?.designationId,designation, false)
    if (!employeeStore?.getEmployeeData()) {
        getEmployeeById(routeId.value, employeeInfor, loading);
        // router.push('/employees');
    }
});
watch(
    () => timeFrame.value,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            const timeFrameUrl = `${baseURL}/attendance/by-employee/${employeeInfor?.value?.id}/timeSeries`;
          
            timeFrameUrlState.value = timeFrameUrl;
        }
    }
);
const handleToggleEducationExperience = (whatToShow) => {
    showHide.value = whatToShow;
};

const updateProfilePicture = async (formData) => {
    // Accept FormData directly
    profileUploadloading.value = true;
    try {
        const url = `${baseURL}/employees/upload-profile-picture`;

         

        const data = await postDataUpload(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            profileUploadloading.value = false;
            success.value = true;
        } else {
            profileUploadloading.value = false;
            uploadProfileError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        profileUploadloading.value = false;
        console.error('Error uploading profile picture:', error);
    }
};

const handleFileSelected = async (file) => {
    try {
        const formData = new FormData();
        formData.append('employeeId', employeeInfor?.value?.id);
        formData.append('file', file);

        //  
        fileData.value = file;
        imageUrl.value = URL.createObjectURL(file);
        imageBinaryData.value = formData; // Assign FormData directly

        await updateProfilePicture(formData); // Pass FormData to updateProfilePicture
    } catch (error) {
        console.error('Error handling file selection:', error);
    }
};
watch(nationality, () => {
    getNationality(employeeInfor?.value?.nationalityId, nationality, nationalityError, false);
    getDepartment(employeeInfor?.value?.departmentId, department, departmentError, loading);
    // getEductionQualifications(employeeInfor?.value?.id, educationQualifications, departmentError, loading);
    getProfilePicture(employeeInfor?.value?.id, profilePhoto, false);
    getEmployeeDutyStation(dutyStation, routeId.value);
});
getEmployeeDependants(employeeInfor?.value?.id, employeeDependants, loading);
getEmployeeNextOfKins(employeeInfor?.value?.id, employeeNextOfKins, false);
getNationality(employeeInfor?.value?.nationalityId, nationality, nationalityError, false);
getDepartment(employeeInfor?.value?.departmentId, department, departmentError, loading);
getEductionQualifications(employeeInfor?.value?.id, educationQualifications, departmentError, loading);
getProfilePicture(employeeInfor?.value?.id, profilePhoto, false);
getEmployeeDutyStation(dutyStation, routeId.value);
   getDesignationById(employeeInfor?.value?.designationId,designation, false)


const visible = ref(false);
const handleAdd = (add, editData) => {
    setNextOfKIn.value = editData ? editData : {};

    whatToAdd.value = add;
    visible.value = true;
    addDependantError.value = '';
    addNextOfKinError.value = '';
    successAddDependant.value = false;
    successAddNextOfKin.value = false;
};

const handleNextOfKinDetails = (data) => {
    employeeNextOfKinDetails.value = data;
};
const handleDependantDetails = (data) => {
    employeeDependantDetails.value = data;
};

const handleDeleteNextOfKin = (data) => {
    const url = `${baseURL}/employees/next-of-kin/delete/${data?.id}`;
    deleteData(url);
};
const handleDeleteDependant = (data) => {
    const url = `${baseURL}/employees/dependent/delete/${data?.id}`;
    deleteData(url);
};
const addDocs = () => {
    visibleAddDoc.value = true;
  
};

const uploadedFiles = ref([]);
const concatenatedFileNames = ref('');
const uploadEmployeeDocuments = (documents, fileNames) => {
    uploadedFiles.value = documents;
    concatenatedFileNames.value = fileNames;
};
const handleUploadEmployeeDocuments = async () => {
    serverErrorUploadDocs.value = '';

    loadingEmployeeDocs.value = true;
    const formData = new FormData();
    formData.append('employeeId', employeeInfor?.value?.id);

    uploadedFiles.value.forEach((file) => {
        formData.append('file', file);
    });
    formData.append('labels', concatenatedFileNames.value);

     
    const url = `${baseURL}/employee-file/upload-files`;
    try {
        const data = await postDataUpload(url, formData, loadingEmployeeDocs);
    
        if (data?.status === 200 || data?.status === 201) {
            successUploadDocs.value = true;
            successMessageUploadDocs.value = data?.message;

            loadingEmployeeDocs.value = false;
            showSuccess(data?.message);
            setTimeout(() => {
                successUploadDocs.value = false;
                successMessageUploadDocs.value = '';
            }, 1000);
        } else {
            showError( data?.error || data?.message);
            successUploadDocs.value = false;
            successMessageUploadDocs.value = '';
            serverErrorUploadDocs.value = data?.error || data?.message;
            loadingEmployeeDocs.value = false;
        }
    } catch (error) {
        showError()
        successUploadDocs.value = false;
        successMessageUploadDocs.value = '';
        serverErrorUploadDocs.value = error?.error || error?.message;

        loadingEmployeeDocs.value = false;
        console.log(error?.error);
    }
};
</script>
<template>
    <div class="button-container">
        <button @click="update" class="custom-button">Update</button>
        <button @click="addDocs" class="custom-button ml-2">addDocs</button>
    </div>
    <Dialog v-model:visible="visibleAddDoc" modal :header="whatToAdd" :style="{ width: '50rem' }">
        <div class="col-12">
            <h5>Add Documents</h5>
            <Message v-if="success" severity="success">{{ successMessageUploadDocs }}</Message>

            <Message v-if="serverErrorUploadDocs" severity="error">{{ serverErrorUploadDocs }}</Message>
            <AddDocuments @uploadEmployeeDocuments="uploadEmployeeDocuments" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visibleAddDoc = false"></Button>
            <SpinnerVue :loading="loadingEmployeeDocs" size="2rem" />

            <Button v-if="!loadingEmployeeDocs" type="button" @click="handleUploadEmployeeDocuments">Submit</Button>
        </div>
    </Dialog>
    <Dialog v-model:visible="visible" modal :header="whatToAdd" :style="{ width: '50rem' }">
        <div class="col-12">
            <Message v-if="successUploadDocs" severity="success">{{ successMessageAddNextOfKin || successMessageAddDependant }}</Message>

            <Message v-if="addDependantError || addNextOfKinError" severity="error">{{ addDependantError || addNextOfKinError }}</Message>

            <div class="p-fluid formgrid grid">
                <AddNextOfKin
                    v-if="whatToAdd === 'next Of Kin'"
                    @handleNextOfKinDetails="handleNextOfKinDetails"
                    :lName="setNextOfKIn?.lastName"
                    :fName="setNextOfKIn?.firstName"
                    :phonNo="setNextOfKIn?.phoneNumber"
                    :address="setNextOfKIn?.physicalAddress"
                    :emailAddress="setNextOfKIn?.email"
                    :relation="setNextOfKIn?.relationship"
                />
                <AddDependant v-if="whatToAdd === 'dependant'" @handleDependantDetails="handleDependantDetails" :lName="setNextOfKIn?.lastName" :fName="setNextOfKIn?.firstName" :phonNo="setNextOfKIn?.phoneNumber" />
            </div>
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <SpinnerVue :loading="loadingAddNextOfKin || loadingAddDependant" size="2rem" />
            <Button v-if="!loadingAddNextOfKin && !loadingAddDependant" type="button" @click="hitOptionsButton">Submit</Button>
        </div>
    </Dialog>
    <Summaries :employeeId="routeId?.value || employeeInfor?.id" />
    <div class="card">
        <h5>Personal Details</h5>

        <DisplayDetails
            :employeeInfor="employeeInfor"
            :department="department"
            :nationality="nationality"
            :success="success"
            :successMessage="successMessage"
            :uploadProfileError="uploadProfileError"
            :imageUrl="imageUrl"
            :profileImageUrl="profileImageUrl"
            :profileUploadloading="profileUploadloading"
            @handleFileSelected="handleFileSelected"
            :dutyStation="dutyStation"
            :designation="designation"
        />
    </div>

    <div class="grid p-fluid">
        <div @click="handleToggleEducationExperience('education')" class="col-12 md:col-6"><h5 :class="{ clickable: true, active: showHide === 'education' }">Education qualification</h5></div>
        <div @click="handleToggleEducationExperience('experience')" class="col-12 md:col-6"><h5 :class="{ clickable: true, active: showHide === 'experience' }">Experience</h5></div>
        <div v-if="showHide === 'education'" class="col-12 md:col-12">
            <DisplayEducation :educationQualifications="educationQualifications" />
        </div>
        <div v-if="showHide === 'experience'" class="col-12 md:col-12">
            <DisplayExperience :employeeExperience="employeeExperience" />
        </div>
    </div>

    <div class="grid p-fluid">
        <DisplayNextOfKins :employeeNextOfKins="employeeNextOfKins" @handleAdd="handleAdd" @handleEditNextOfKin="handleEditNextOfKin" @handleDeleteNextOfKin="handleDeleteNextOfKin" />
        <DisplayDependants :employeeDependants="employeeDependants" @handleAdd="handleAdd" @handleEditDependant="handleEditDependant" @handleDeleteDependant="handleDeleteDependant" />
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>attendance per {{ timeFrame }}</h5>

            <AttendenceTimeFramesLineGraph :attendanceFrame="timeFrame" :url="timeFrameUrlState" />
            <!-- <LeaveRequestVue /> -->
        </div>
    </div>
</template>
<style lang="scss" scoped>
.bioTitle {
    font-size: 12px;
    color: #7b6969;
    margin-bottom: -1px;
}
.semiBio_ {
    /* background: #eee; */
    border-radius: 10px;
    padding: 10px 10px;
    margin-bottom: 10px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}
.card_ {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.custom-button {
    background-color: #db0000;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 10px; /* Add border radius */
    margin-bottom: 20px; /* Add bottom margin */
    cursor: pointer;
    outline: none;
}

.custom-button:hover {
    background-color: #c40000; /* Optional: Change color on hover for better UX */
}
.clickable {
    cursor: pointer;
    border: none;
    // background-color:  #a39f9f;
    padding: 0;
    transition: background-color 0.3s, color 0.3s;
    height: 30px;
    width: 50%;
    padding: 4px;
    border-radius: 5px;
}

.clickable.active {
    border-bottom: 2px solid #db0000;
    transition: border-color 0.3s;
    // background-color: #db0000; /* Active button color */
    // color: #fff; /* Text color on active button */
    border-radius: 5px;
    height: 30px;
    width: 50%;
    padding: 4px;
}
.card-container {
    height: 300px; /* Adjust this height as needed */
    overflow: hidden;
}

.scrollable-content {
    height: 100%;
    overflow-y: auto;
}

.scrollable-content::-webkit-scrollbar {
    width: 8px; /* Width of the scrollbar */
}

.scrollable-content::-webkit-scrollbar-track {
    background: #f1f1f1; /* Background of the scrollbar track */
}

.scrollable-content::-webkit-scrollbar-thumb {
    background: #888; /* Color of the scrollbar thumb */
    border-radius: 4px; /* Rounded corners for the scrollbar thumb */
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
    background: #555; /* Color of the scrollbar thumb when hovered */
}

.scrollable-content {
    scrollbar-width: thin; /* Firefox property to make the scrollbar thin */
    scrollbar-color: #888 #f1f1f1; /* Firefox property to set thumb and track colors */
}
</style>
