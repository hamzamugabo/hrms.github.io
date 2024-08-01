<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const prop = defineProps(['applicant']);
const router = useRouter();
const visible = ref(false);

const loading = ref(false);
const successMessageAddExperience = ref('');
const successAddExperience = ref(false);
const addEducationError = ref('');

const experienceToUpdate = ref('');
const buttonOptions = ref('save');

const achievements = ref('');
const companyName = ref('');
const experienceStartDate = ref('');
const experienceEndDate = ref('');
const jobTitle = ref('');
const responsibilities = ref('');
const addExperienceError = ref('');

const experiences = ref([]);

onMounted(() => {
    if (!prop.applicant) {
        router.push('/applicants');
    } else {
        getExperience(); // Call getExperience function if applicant prop is available
    }
});

const getExperience = async () => {
    try {
        if (!prop.applicant) {
            console.log('Applicant not selected');
            return;
        }
        const url = `${baseURL}/applicant/experience/${prop.applicant.id}`;
        const { data } = await fetchData(url, loading, router);
        if (data) {
            experiences.value = data;
        }
    } catch (error) {
        experiences.value = [];

        console.log(error);
    }
};

const updateExperience = (experience) => {
    achievements.value = experience?.achievements;
    companyName.value = experience?.companyName;
    experienceEndDate.value = experience?.endDate;
    jobTitle.value = experience?.jobTitle;
    responsibilities.value = experience?.responsibilities;
    experienceStartDate.value = experience?.startDate;
    experienceToUpdate.value = experience;

    buttonOptions.value = 'Update';
    visible.value = true;
};

const handleExperienceUpdate = async () => {
    addEducationError.value = '';
    loading.value = true;
    try {
        const url = `${baseURL}/applicant/experience/update`;
        const formData = {
            achievements: achievements.value || experienceToUpdate?.value?.achievements,
            companyName: companyName.value || experienceToUpdate?.value?.companyName,
            endDate: changeDateFormat(experienceEndDate.value) || experienceToUpdate?.value?.endDate,
            jobTitle: jobTitle.value || experienceToUpdate?.value?.jobTitle,
            responsibilities: responsibilities.value || experienceToUpdate?.value?.responsibilities,
            startDate: changeDateFormat(experienceStartDate.value) || experienceToUpdate?.value?.startDate,
            id: experienceToUpdate?.value?.id
        };

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddExperience.value = data?.message;
            loading.value = false;
            successAddExperience.value = true;
            loading.value = false;
            setTimeout(() => {
                successMessageAddExperience.value = false;
                successAddExperience.value = '';
            }, 1000);
            showSuccess();
            await getExperience();
            // visible.value = false;
        } else {
            loading.value = false;
            showError(data?.message ? data?.message : data?.error);
            addEducationError.value = data?.message ? data?.message : data?.error;
            successMessageAddExperience.value = false;
            successAddExperience.value = '';
        }
    } catch (error) {
        loading.value = false;

        console.error('Login error:', error);
    }
};

const addApplicantExperience = async () => {
    loading.value = true;
    try {
        const url = `${baseURL}/applicant/experience/create/${prop.applicant?.id}`;

        if (!companyName.value.trim()) {
            alert('Please enter Company name.');
            return;
        }

        const formData = {
            achievements: achievements.value,
            companyName: companyName.value,
            endDate: changeDateFormat(experienceEndDate.value),
            jobTitle: jobTitle.value,
            responsibilities: responsibilities.value,
            startDate: changeDateFormat(experienceStartDate.value)
        };

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            // successMessageAddExperience.value = data?.message;
            // applicantStore.setapplicantData(formData);
            loading.value = false;

            // successAddExperience.value = true;
            showSuccess();

            getExperience();
            loading.value = false;
        } else {
            showError(data?.message ? data?.message : data?.error);
            // addExperienceError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        loading.value = false;

        console.error('Login error:', error);
    }
};
// eslint-disable-next-line no-unused-vars
const handleAdd = () => {
    buttonOptions.value = 'save';
    experienceToUpdate.value = '';
    achievements.value = '';
    companyName.value = '';
    experienceStartDate.value = '';
    experienceEndDate.value = '';
    jobTitle.value = '';
    responsibilities.value = '';
    visible.value = true;
};

const hitOptionsButton = async () => {
    if (experienceToUpdate?.value?.id) {
     
        await handleExperienceUpdate();
    } else {
        await addApplicantExperience();
    }
};

const deleteExperience = async (data) => {
    const url = `${baseURL}/applicant/experience/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getExperience();
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };

const refresh = async () => {
    await getExperience();
};
watch(
    () => prop.applicant,
    () => {
        getExperience();
    }
);
</script>
<template>
    <Toast />

    <div class="col-12">
        <div class="card">
            <div v-if="loading">
                <SpinnerVue />
            </div>
            <Dialog v-model:visible="visible" modal header="Experience details" :style="{ width: '25rem' }">
                <div class="col-12">
                    <Message v-if="successAddExperience" severity="success">{{ successMessageAddExperience }}</Message>

                    <Message v-if="addExperienceError" severity="error">{{ addExperienceError }}</Message>

                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="company">company Name</label>
                            <InputText required id="company" type="text" v-model="companyName" />
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="achievements">achievements</label>
                            <InputText required id="achievements" type="text" v-model="achievements" />
                        </div>

                        <div class="field col-12 md:col-12">
                            <label for="jobTitle">Job Title</label>
                            <InputText id="jobTitle" type="text" v-model="jobTitle" />
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="responsibilities">Responsibilities</label>
                            <InputText id="responsibilities" type="text" v-model="responsibilities" />
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="startDate">Start Date</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="experienceStartDate"></Calendar>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="endDate">End Date</label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="experienceEndDate"></Calendar>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button :disabled="loading" type="button" :label="buttonOptions" @click="hitOptionsButton"></Button>
                </div>
            </Dialog>
            <div style="display: flex; justify-content: space-between">
                <h5>Experience</h5>
                <!-- <Button
                type="button"
                icon="pi pi-trash"
                @click="handleAdd"
                style="width: 100; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000"
                @mouseover="showUpdateIcon = true"
                @mouseleave="showUpdateIcon = false"
            >
                <i class="pi pi-plus-circle"></i>
            </Button> -->
            </div>
            <div v-for="experience in experiences" :key="experience?.id" class="card">
                <div v-if="experiences?.length > 0" class="flex justify-center space-x-2" style="margin-bottom: 10px">
                    <Button
                        type="button"
                        icon="pi pi-trash"
                        @click="updateExperience(experience)"
                        style="width: auto; cursor: pointer; margin-right: 5px; border-radius: 10px; background-color: #0e9d6e"
                        @mouseover="showUpdateIcon = true"
                        @mouseleave="showUpdateIcon = false"
                    >
                        Update
                        <i class="pi pi-file-edit"></i>
                    </Button>
                    <Button
                        type="button"
                        icon="pi pi-trash"
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        @click="deleteExperience(experience)"
                        style="width: auto; cursor: pointer; border-radius: 10px"
                        @mouseover="showText = true"
                        @mouseleave="showText = false"
                    >
                        Delete
                        <span class="text-sm"><i class="pi pi-trash"></i></span>
                    </Button>
                    <!-- <span v-if="showText">Disable</span> -->
                </div>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-4">
                        <p class="bioTitle">Company Name</p>
                        <p class="bioValue">{{ experience?.companyName }}</p>
                    </div>
                    <div class="field col-12 md:col-4">
                        <p class="bioTitle">Achievements</p>
                        <p class="bioValue">{{ experience?.achievements }}</p>
                        <!-- Assuming qualification type is available -->
                    </div>
                    <div class="field col-12 md:col-4">
                        <p class="bioTitle">Job Title</p>
                        <p class="bioValue">{{ experience?.jobTitle }}</p>
                        <!-- Assuming institution/school is available -->
                    </div>
                    <div class="field col-12 md:col-4">
                        <p class="bioTitle">Responsibilities</p>
                        <p class="bioValue">{{ experience?.responsibilities }}</p>
                        <!-- Assuming institution/school is available -->
                    </div>
                    <div class="field col-12 md:col-4">
                        <p class="bioTitle">Start Date</p>
                        <p class="bioValue">{{ experience?.startDate }}</p>
                    </div>
                    <div class="field col-12 md:col-4">
                        <p class="bioTitle">End Date</p>
                        <p class="bioValue">{{ experience?.endDate }}</p>
                    </div>
                </div>
            </div>
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
