<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useApplicantStore } from '@/piniaStore/applicantData.js';

import Education from './GetApplicantEducation.vue';
import Details from './GetApplicantDetails.vue';
import Experience from './GetApplicantExperience.vue';
import { baseURL, fetchData } from '../reuseables/FetchPostData';

const router = useRouter();
const route = useRoute();
const routeId = ref(route?.query?.id);

const applicantInfor = ref({});
const applicantStore = useApplicantStore();

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

const update = () => {
    applicantStore.setApplicantData(applicantInfor.value);
    router.push('/update-applicant');
};

onMounted(() => {
    getApplicantById();
});
</script>

<template>
    <div class="card relative">
        <div class="grid p-fluid">
            <div class="col-12 flex justify-center items-center">
                <h5 class="text-center">{{ applicantInfor?.firstName }} {{ applicantInfor?.lastName }}</h5>
            </div>
        </div>
        <Button type="button" icon="pi pi-file-edit" @click="update" class="absolute top-4 right-4 bg-green-500 px-4 py-2 rounded-lg border-none focus:outline-none">
            Update
        </Button>
    </div>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Details :applicantInfor="applicantInfor" />
                <Education :applicant="applicantInfor" />
                <Experience :applicant="applicantInfor" />
            </div>
        </div>
    </div>
</template>
