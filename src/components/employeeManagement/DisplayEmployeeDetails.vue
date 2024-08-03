<script setup>
import { ref } from 'vue';
import UploadFiles from '@/components/reuseables/FileUploader.vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import UpdateEmployeeDepartment from './UpdateEmployeeDepartment.vue';

defineProps(['employeeInfor','designation', 'dutyStation', 'nationality', 'department', 'success', 'successMessage', 'uploadProfileError', 'imageUrl', 'profileImageUrl', 'profileUploadloading']);
const emit = defineEmits(['handleFileSelected']);
const handleFileSelectedEmit = (file) => {
    emit('handleFileSelected', file);
};
const updateDepartmentVisible = ref(false);
</script>

<template>
    <Dialog v-model:visible="updateDepartmentVisible" modal header="update Department" :style="{ width: '30rem' }">
        <div class="col-12">
            <UpdateEmployeeDepartment :employeeId="employeeInfor?.id" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="updateDepartmentVisible = false"></Button>
        </div>
    </Dialog>
    <div class="grid p-fluid">
        <div class="col-12 md:col-3 flex-container">
            <div class="card_">
                <div class="profileContainer_">
                    <Message v-if="success" severity="success">{{ successMessage }}</Message>

                    <Message v-if="uploadProfileError" severity="error">{{ uploadProfileError }}</Message>

                    <!-- Profile Picture -->
                    <div v-if="!imageUrl" class="mb-2">
                        <img :src="profileImageUrl" alt="Profile Picture" style="border-radius: 100%" />
                    </div>
                    <div v-if="imageUrl" class="mb-2">
                        <img :src="imageUrl" alt="Profile Picture" style="border-radius: 100%; width: 10rem; height: 10rem; background-color: lightgrey" />
                    </div>

                    <div style="display: flex; justify-content: center; width: 100%">
                        <SpinnerVue :loading="profileUploadloading" size="3rem" />
                    </div>

                    <div v-if="!profileUploadloading">
                        <UploadFiles @getImageData="handleFileSelectedEmit" :label="'Update Profile'" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-9">
            <div class="col-12 md:col-12">
                <div class="grid p-fluid">
                    <!-- <h5>Job related information</h5> -->
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">First Name</p>
                        <p class="bioValue">{{ employeeInfor?.firstName }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Last Name</p>
                        <p class="bioValue">{{ employeeInfor?.lastName }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Other Name</p>
                        <p class="bioValue">{{ employeeInfor?.otherNames }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Phone Number</p>
                        <p class="bioValue">{{ employeeInfor?.phoneNumber }}</p>
                    </div>

                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Email Address</p>
                        <p class="bioValue">{{ employeeInfor?.emailAddress }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Gender</p>
                        <p class="bioValue">{{ employeeInfor?.gender }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Marital Status</p>
                        <p class="bioValue">{{ employeeInfor?.maritalStatus }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Date Of Birth</p>
                        <p class="bioValue">{{ employeeInfor?.dateOfBirth }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Nationality</p>
                        <p class="bioValue">{{ nationality }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">ID Type</p>
                        <p class="bioValue">{{ employeeInfor?.idType }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Physical Address</p>
                        <p class="bioValue">{{ employeeInfor?.physicalAddress }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Position/Title</p>
                        <p class="bioValue">{{designation}}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Level</p>
                        <p class="bioValue">{{employeeInfor?.employeeLevel}}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Department</p>
                        <p class="bioValue" style="display: flex">
                            <span class="mr-3"> {{ department }}</span>
                            <!-- <Button
                                type="button"
                                icon="pi pi-trash"
                                @click="updateDepartmentVisible = true"
                                style="width: 2rem; cursor: pointer; margin-right: 5px; border-radius: 200px; background-color: #0e9d6e"
                                @mouseover="showUpdateIcon = true"
                                @mouseleave="showUpdateIcon = false"
                            >
                                <i class="pi pi-file-edit"></i>
                            </Button> -->
                        </p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Date of Joining</p>
                        <p class="bioValue">{{ employeeInfor?.dateOfJoining }}</p>
                    </div>
                    <div class="col-12 md:col-4">
                        <p class="bioTitle">Duty Station</p>
                        <p class="bioValue">{{ dutyStation?.name }}</p>
                    </div>
                     <div class="col-12 md:col-4">
                        <p class="bioTitle">Tin Number</p>
                        <p class="bioValue">{{ employeeInfor?.tinNumber }}</p>
                    </div>
                     <div class="col-12 md:col-4">
                        <p class="bioTitle">Nssf Number</p>
                        <p class="bioValue">{{ employeeInfor?.nssfNumber }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
