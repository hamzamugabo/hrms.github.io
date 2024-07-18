<script setup>
import { ref, onMounted } from 'vue';
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
const successMessageAddEducation = ref('');
const successAddEducation = ref(false);
const addEducationError = ref('');
const award = ref('');
const endDate = ref('');
const fieldOfStudy = ref('');
const schoolName = ref('');
const startDate = ref('');
const educationQualifications = ref([]);
const educationQualificationsToUpdate = ref('');
const buttonOptions = ref('save');

onMounted(() => {
    if (!prop.applicant) {
        router.push('/applicants');
    } else {
        getEducation();
    }
});
const getEducation = async () => {
    try {
        if (!prop.applicant) {
            console.log('education not selected');
            return;
        }
        const url = `${baseURL}/applicant/education/${prop.applicant?.id}`;
        const { data } = await fetchData(url, loading, router);
        console.log('eucation', data);
        if (data) {
            educationQualifications.value = data;
        }
    } catch (error) {
         educationQualifications.value = [];
        console.log(error);
    }
};

const updateEducation = (educationQualifications) => {
    console.log('==>', educationQualifications);
    educationQualificationsToUpdate.value = educationQualifications;
    award.value = educationQualifications.award;
    endDate.value = educationQualifications.endDate;
    fieldOfStudy.value = educationQualifications.fieldOfStudy;
    schoolName.value = educationQualifications.schoolName;
    startDate.value = educationQualifications.startDate;
    buttonOptions.value = 'Update';
    visible.value = true;
};


const handleEducationUpdate = async () => {
    addEducationError.value = ''
    loading.value = true;
    try {
        const url = `${baseURL}/applicant/education/update`;
        const formData = {
            award: award.value || educationQualificationsToUpdate?.value?.award,
            endDate: changeDateFormat(endDate.value) || educationQualificationsToUpdate?.value?.endDate,
            fieldOfStudy: fieldOfStudy.value || educationQualificationsToUpdate?.value?.fieldOfStudy,
            schoolName: schoolName.value || educationQualificationsToUpdate?.value?.schoolName,
            startDate: changeDateFormat(startDate.value) || educationQualificationsToUpdate?.value?.endDate,
            id: educationQualificationsToUpdate?.value?.id
        };
        console.log('education update formdata==>', formData);

        const data = await postData(url, formData, loading);
        console.log('education update data==>', data);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddEducation.value = data?.message;
            loading.value = false;
            successAddEducation.value = true;
             setTimeout(() => {
                successAddEducation.value = false;
                successMessageAddEducation.value = '';
            }, 1000);
            showSuccess( data?.message);
            loading.value = false;
            await getEducation();
            // visible.value = false;
        } else {
              successAddEducation.value = false;
                successMessageAddEducation.value = '';
            addEducationError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed')
        loading.value = false;

        console.error('Login error:', error);
    }
};

const addApplicantEducation = async () => {
    loading.value = true;
    try {
        const url = `${baseURL}/applicant/education/create/${prop.applicant?.id}`;

        if (!schoolName.value.trim()) {
            alert('Please enter School name.');
            return;
        }

        const formData = {
            award: award.value,
            endDate: changeDateFormat(endDate.value),
            fieldOfStudy: fieldOfStudy.value,
            schoolName: schoolName.value,
            startDate: changeDateFormat(startDate.value)
        };

        const data = await postData(url, formData, loading);
        console.log('education data==>', data);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddEducation.value = data?.message;
            loading.value = false;
            successAddEducation.value = true;
            loading.value = false;
            await getEducation();
            visible.value = false;
        } else {
            addEducationError.value = data?.message ? data?.message : data?.error;
            loading.value = false;

        }
    } catch (error) {
        loading.value = false;

        console.error('Login error:', error);
    }
};
const handleAdd_ = () => {
    buttonOptions.value = 'save';
    educationQualificationsToUpdate.value = '';
    award.value = '';
    endDate.value = '';
    fieldOfStudy.value = '';
    schoolName.value = '';
    startDate.value = '';
    visible.value = true;
};

const hitOptionsButton = async () => {
    if (educationQualificationsToUpdate?.value?.id) {
        console.log('update called');
        await handleEducationUpdate();
    } else {
        await addApplicantEducation();
    }
};


const deleteEducation = async (data) => {
    const url = `${baseURL}/applicant/education/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getEducation();
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };

const refresh = async () => {
    await getEducation();
};

</script>
<template>
 <Toast />
     
    <div class="col-12 md:col-4">
        <div v-if="loading">
            <SpinnerVue />
        </div>
        <Dialog v-model:visible="visible" modal header="Eduction Qualification details" :style="{ width: '25rem' }">
            <div class="col-12">
                <Message v-if="successAddEducation" severity="success">{{ successMessageAddEducation }}</Message>

                <Message v-if="addEducationError" severity="error">{{ addEducationError }}</Message>

                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="school">School Name</label>
                        <InputText required id="school" type="text" v-model="schoolName" />
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="award">Award</label>
                        <InputText required id="award" type="text" v-model="award" />
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="dob">Start Date</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate"></Calendar>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="dob">End Date</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate"></Calendar>
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="fieldOfStudy">Filed of study</label>
                        <InputText id="fieldOfStudy" type="text" v-model="fieldOfStudy" />
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button :disabled="loading" type="button" :label="buttonOptions" @click="hitOptionsButton"></Button>
            </div>
        </Dialog>
        <div style="display: flex; justify-content: space-between">
            <h5>Education qualification</h5>
            <Button
                type="button"
                icon="pi pi-trash"
              
                @click="handleAdd_"
                style="width: 100; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000"
                @mouseover="showUpdateIcon = true"
                @mouseleave="showUpdateIcon = false"
            >
                <i class="pi pi-plus-circle"></i>
            </Button>
        </div>

        <div v-for="educationQualification in educationQualifications" :key="educationQualification?.id" class="card">
            <div v-if="educationQualifications?.length > 0" class="flex justify-center space-x-2" style="margin-bottom: 10px">
                <Button
                    type="button"
                    icon="pi pi-trash"
               
                    @click="updateEducation(educationQualification)"
                    style="width: 50%; cursor: pointer; margin-right: 5px; border-radius: 10px; background-color: #0e9d6e"
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
                    @click="deleteEducation(educationQualification)"
                    style="width: 50%; cursor: pointer; border-radius: 10px"
                    @mouseover="showText = true"
                    @mouseleave="showText = false"
                >
                    Delete
                    <span class="text-sm"><i class="pi pi-trash"></i></span>
                </Button>
                <!-- <span v-if="showText">Disable</span> -->
            </div>
            <div class="semiBio">
                <p class="bioTitle">Award</p>
                <p class="bioValue">{{ educationQualification?.award }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">School</p>
                <p class="bioValue">{{ educationQualification?.schoolName }}</p>
                <!-- Assuming qualification type is available -->
            </div>
            <div class="semiBio">
                <p class="bioTitle">Field of Study</p>
                <p class="bioValue">{{ educationQualification?.fieldOfStudy }}</p>
                <!-- Assuming institution/school is available -->
            </div>
            <div class="semiBio">
                <p class="bioTitle">Start Date</p>
                <p class="bioValue">{{ educationQualification?.startDate }}</p>
            </div>
            <div class="semiBio">
                <p class="bioTitle">End Date</p>
                <p class="bioValue">{{ educationQualification?.endDate }}</p>
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
