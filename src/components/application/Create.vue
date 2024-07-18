<script setup>
import { onMounted, ref, watch } from 'vue';

import { fetchData, baseURL } from '@/components/reuseables/FetchPostData.js';
import { useRouter } from 'vue-router';

const emit = defineEmits(['handlePersonalDetails']);
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

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const otherName = ref('');
const gender = ref('');
const dob = ref('');
const maritalStatus = ref('');

const nationalityId = ref('');
const allNationlalities = ref([]);
const autoFilteredNationlalities = ref([]);
const getNationalities = async () => {
    // console.log('nationalities');
    const url = `${baseURL}/nationality`;

    try {
        const { data } = await fetchData(url, false, router);

        allNationlalities.value = data?.nationalities;
        // Handle the fetched data here
    } catch (error) {
        allNationlalities.value = [];
        // Handle errors here
    }
};

onMounted(async () => {
    await getNationalities();
});
const searchNationality = (event) => {
    if (!event.query.trim().length) {
        autoFilteredNationlalities.value = allNationlalities?.value?.length > 0 ? [...allNationlalities.value] : [];
    } else {
        autoFilteredNationlalities.value = allNationlalities.value.filter((country) => {
            return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
};

const submitForm = () => {
    const formData = {
        firstName: firstName.value,
        lastName: lastName.value,
        otherName: otherName.value,
        gender: gender.value,
        dob: dob.value,
        maritalStatus: maritalStatus.value,
        nationalityId: nationalityId.value
    };

    // Emit the form data to the parent component
    emit('handlePersonalDetails', formData);
};
watch([firstName, lastName, otherName, gender, dob, maritalStatus, nationalityId], () => {
    submitForm();
});
</script>

<template>
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
            <Calendar :showIcon="true" :showButtonBar="true" v-model="dob"></Calendar>
        </div>
        <!-- <div class="field col-12 md:col-4">
                            <label for="dob">Date of Joining</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="dateOfJoining"></Calendar>
                        </div> -->
        <div class="field col-12 md:col-12">
            <label for="maritalstatus">Marital Status</label>
            <Dropdown id="state" v-model="maritalStatus" :options="maritalStatusOptions" optionLabel="name" placeholder="Select One"></Dropdown>
        </div>

        <div class="field col-12 md:col-4">
            <label for="nationality">Nationality</label>
            <AutoComplete placeholder="Search" id="nationality" :dropdown="true" :multiple="false" v-model="nationalityId" :suggestions="autoFilteredNationlalities" @complete="searchNationality($event)" field="name" />
        </div>

        <div class="field col-12 md:col-4">
            <button @click="router.push('/nationality/add')" class="block mx-auto border-none pb-3 addEmployeeButtons">
                <i class="pi pi-plus-circle" style="color: white"></i>
                Nationality
            </button>
        </div>
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
</style>
