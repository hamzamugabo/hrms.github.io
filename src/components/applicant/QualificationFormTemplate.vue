<script setup>
// Define component props and emits
defineProps(['qualifications', 'label', 'autoFilteredAwardingInstitutions', 'autoFilteredQualifications', 'institutionId', 'qualificationId', 'maxJoiningDate', 'update']);

const emit = defineEmits(['remove', 'add', 'searchAwardingInstitution', 'searchQualification']);

const removeQualification = (index) => {
    emit('remove', index);
};

const addQualification = () => {
    emit('add');
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div>
                <div v-if="update !== 'update'" style="display: flex; justify-content: space-between">
                    <h5 class="mr-4 ml-2">{{ label }}</h5>
                    <Button
                        type="button"
                        icon="pi pi-trash"
                        @click="addQualification"
                        style="width: auto; padding: 10px; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000"
                        @mouseover="showUpdateIcon = true"
                        @mouseleave="showUpdateIcon = false"
                    >
                        Add New Qualification
                    </Button>
                </div>

                <div class="p-fluid formgrid grid card" v-for="(qualification, index) in qualifications" :key="index" style="margin-bottom: 10px">
                    <div class="field col-12 md:col-4">
                        <label :for="'award' + index">Award</label>
                        <InputText :id="'award' + index" type="text" v-model="qualification.award" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label :for="'schoolName' + index">School Name</label>
                        <InputText :id="'schoolName' + index" type="text" v-model="qualification.schoolName" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label :for="'fieldOfStudy' + index">Field of Study</label>
                        <InputText :id="'fieldOfStudy' + index" type="text" v-model="qualification.fieldOfStudy" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label :for="'startDate' + index">Start Date</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="qualification.startDate" :maxDate="maxJoiningDate" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label :for="'endDate' + index">End Date</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="qualification.endDate" :maxDate="maxJoiningDate" />
                    </div>

                    <div class="field col-12 md:col-4" v-if="qualifications.length > 1" style="align-self: center; margin-top: 20px">
                        <Button @click="removeQualification(index)" v-if="qualifications.length > 1" icon="pi pi-times" severity="danger" rounded aria-label="Cancel" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tab {
    @apply text-sm bg-gray-50 rounded-t cursor-pointer text-gray-800 w-full text-center py-2 px-4 gap-3 border-b-2 border-gray-200;
}

.tab:hover {
    @apply bg-primary-50 text-primary-700 border-b-2 border-primary-400 rounded-t;
}

.tab-active {
    @apply text-sm bg-primary-50 rounded-t cursor-pointer font-bold text-primary-700 text-center w-full py-2 px-4 gap-3 border-b-4 border-primary-700;
}
</style>
