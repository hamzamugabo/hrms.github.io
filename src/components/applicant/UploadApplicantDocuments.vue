<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { useToast } from 'primevue/usetoast';
// import { useApplicantStore } from '@/piniaStore/applicantData.js';
import { baseURL, postDataUpload } from '@/components/reuseables/FetchPostData.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import DocUpload from '@/components/reuseables/DocUpload.vue';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const prop = defineProps(['applicant']);
const router = useRouter();
// const profileImageUrl = ref('https://via.placeholder.com/150');

// const applicantStore = useApplicantStore();
const applicantInfor = ref(prop.applicant);

const loading = ref(false);
const profileUploadloadingCover = ref(false);
const profileUploadloadingResume = ref(false);
const fileData = ref('');

const imageUrl = ref('');
const imageBinaryData = ref('');
// const success = ref(false);
const successMessage = ref('');
const uploadProfileError = ref('');

onMounted(() => {
    if (!prop.applicant) {
        router.push('/applicants');
    }
});

const updateCoverLetter = async (formData) => {
    // Accept FormData directly
    profileUploadloadingCover.value = true;
    try {
        const url = `${baseURL}/applicant/upload-cover-letter`;

         

        const data = await postDataUpload(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            profileUploadloadingCover.value = false;
            // success.value = true;
            showSuccess();
        } else {
            showError()
            profileUploadloadingCover.value = false;
            // uploadProfileError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        profileUploadloadingCover.value = false;
        console.error('Error uploading profile picture:', error);
    }
};
const updateResume = async (formData) => {
    // Accept FormData directly
    profileUploadloadingResume.value = true;
    try {
        const url = `${baseURL}/applicant/upload-resume`;

         

        const data = await postDataUpload(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            profileUploadloadingResume.value = false;
            // success.value = true;
            showSuccess();
        } else {
            profileUploadloadingResume.value = false;
            uploadProfileError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError();
        profileUploadloadingResume.value = false;
        console.error('Error uploading profile picture:', error);
    }
};
const handleFileCoverSelected = async (file) => {
    try {
        const formData = new FormData();
        formData.append('id', applicantInfor?.value?.id);
        formData.append('file', file);

        //  
        fileData.value = file;
        imageUrl.value = URL.createObjectURL(file);
        imageBinaryData.value = formData; // Assign FormData directly

        await updateCoverLetter(formData); // Pass FormData to updateCoverLetter
    } catch (error) {
        console.error('Error handling file selection:', error);
    }
};
const handleFileResumeSelected = async (file) => {
    try {
        const formData = new FormData();
        formData.append('id', applicantInfor?.value?.id);
        formData.append('file', file);

        //  
        fileData.value = file;
        imageUrl.value = URL.createObjectURL(file);
        imageBinaryData.value = formData; // Assign FormData directly

        await updateResume(formData); // Pass FormData to updateCoverLetter
    } catch (error) {
        console.error('Error handling file selection:', error);
    }
};
</script>
<template>
<Toast />
    <!-- <div class="col-12 md:col-4"> -->
    <!-- <Message v-if="success" severity="success">{{ successMessage }}</Message> -->

    <Message v-if="uploadProfileError" severity="error">{{ uploadProfileError }}</Message>
    <div class="" style="display: flex; align-items: center; justify-content: center">
        <div class="profileContainer_">
            <!-- Profile Picture -->

            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="profileUploadloadingCover || profileUploadloadingResume" size="3rem" />
            </div>
            <div v-if="!profileUploadloadingCover">
                <DocUpload @getFileData="handleFileCoverSelected" :label="'Upload cover letter'" />
            </div>
            <div v-if="!profileUploadloadingResume">
                <DocUpload @getFileData="handleFileResumeSelected" :label="'Upload Resume'" />

                <div></div>
            </div>
        </div>
    </div>
    <!-- </div> -->
</template>
<style>
.bioTitle {
    font-size: 12px;
    color: #edc9c9;
    margin-bottom: -1px;
}
.semiBio {
    background: #eee;
    border-radius: 10px;
    padding: 10px 10px;
    margin-bottom: 10px;
}
.updateProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
}
.deleteProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;

    /* width: 200px; */
}
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
