<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { useToast } from 'primevue/usetoast';
import { useApplicantStore } from '@/piniaStore/applicantData.js';

import Education from './GetApplicantEducation.vue';
import Details from './GetApplicantDetails.vue';
import Experience from './GetApplicantExperience.vue';

const router = useRouter();

const applicantStore = useApplicantStore();
const applicantInfor = ref(applicantStore?.getApplicantData());

const update = () => {
    applicantStore.setApplicantData(applicantInfor);
    router.push('/update-applicant');
};
onMounted(() => {
    if (!applicantStore?.getApplicantData()) {
        router.push('/applicants');
    }
});
</script>
<template>
    <div class="card">
        <div class="grid p-fluid">
            <div class="col-12 md:col-6 flex items-center">
                <h5 class="mr-auto">{{ applicantInfor?.firstName }} {{ applicantInfor?.lastName }}</h5>
                <!-- mr-auto for margin-right auto -->
            </div>

            <div class="col-12 md:col-6 flex items-center justify-end">
                <!-- flex and justify-end for alignment -->
                <button @click="update" class="bg-green-500 text-white px-4 py-2 rounded-lg border-none focus:outline-none">Update</button>
            </div>
        </div>
    </div>

    <div class="grid p-fluid">
        <Details :applicantInfor="applicantStore?.getApplicantData()" />

        <Education :applicant="applicantStore?.getApplicantData()" />

        <Experience :applicant="applicantStore?.getApplicantData()" />
    </div>
</template>
