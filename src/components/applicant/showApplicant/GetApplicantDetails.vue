<script setup>
import FileUploads from './UploadApplicantDocuments.vue';

defineProps(['applicantInfor']);
</script>
<template>
    <div class="col-12 md:col-4">
        <div class="card">
            <h5>Personal Details</h5>
            <div class="semiBio">
                <p class="bioTitle">First Name</p>
                <p class="bioValue">{{ applicantInfor?.firstName }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">Last Name</p>
                <p class="bioValue">{{ applicantInfor?.lastName }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">Other Name</p>
                <p class="bioValue">{{ applicantInfor?.otherName }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">Phone Number</p>
                <p class="bioValue">{{ applicantInfor?.phoneNumber }}</p>
            </div>

            <div class="semiBio">
                <p class="bioTitle">Email Address</p>
                <p class="bioValue">{{ applicantInfor?.email }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">Gender</p>
                <p class="bioValue">{{ applicantInfor?.gender }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">Marital Status</p>
                <p class="bioValue">{{ applicantInfor?.maritalStatus }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">Date Of Birth</p>
                <p class="bioValue">{{ applicantInfor?.dateOfBirth }}</p>
            </div>

            <div class="semiBio">
                <p class="bioTitle">ID Type</p>
                <p class="bioValue">{{ applicantInfor?.idType }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">Physical Address</p>
                <p class="bioValue">{{ applicantInfor?.physicalAddress }}</p>
            </div>
            <FileUploads :applicant="applicantInfor" />
        </div>
    </div>
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
</style>
