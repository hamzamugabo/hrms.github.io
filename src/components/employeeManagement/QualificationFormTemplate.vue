<script setup>

// eslint-disable-next-line no-unused-vars
const props = defineProps(['qualifications', 'label', 'autoFilteredAwardingInstitutions', 'autoFilteredQualifications', 'institutionId', 'qualificationId', 'maxJoiningDate']);
const emit = defineEmits(['remove', 'add', 'searchAwardingInstitution', 'searchQualification']);
// const institutionId = ref(props.institutionId);
// const qualificationId = ref(props.qualificationId);

const removeQualification = (index) => {
    emit('remove', index);
};

const addQualification = () => {
    emit('add');
};

const handleSearchAwardingInstitution = (event) => {
    emit('searchAwardingInstitution', event);
};

const handleSearchQualification = (event) => {
    emit('searchQualification', event);
};

// const updateInstitutionId = (value) => {
//     emit('updateInstitutionId', value);
// };

// const updateQualificationId = (value) => {
//     emit('updateQualificationId', value);
// };
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div>
                <div style="display: flex; justify-content: space-between">
                    <h5 class="mr-4 ml-2">{{ label }}</h5>
                    <Button
                        type="button"
                        icon="pi pi-trash"
                        @click="addQualification"
                        style="width: 100; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000"
                        @mouseover="showUpdateIcon = true"
                        @mouseleave="showUpdateIcon = false"
                    >
                        <i class="pi pi-plus-circle"></i>
                    </Button>
                </div>
                <!-- <div class="flex">
                    <h5 class="mr-4 ml-2" >{{ label }}</h5>
                    <button @click.prevent="addQualification" class="addFieldButton" style="height:30px;cursor:pointer;float:right">
                        <i style="cursor:pointer" class="pi pi-plus cursor-pointer mr-1"></i>
                        <label style="cursor:pointer" for="" class="mr-4">New Field</label>
                    </button>
                </div> -->
                <!-- <div class="p-fluid formgrid grid"> -->

                <div class="p-fluid formgrid grid card" v-for="(qualification, index) in qualifications" :key="index" style="margin-bottom: 10px">
                    <div class="field col-12 md:col-4">
                        <label :for="'qualificationName' + index">Qualification Name</label>
                        <InputText :id="'qualificationName' + index" type="text" v-model="qualification.name" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label :for="'qualificationType' + index">Year of award</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="qualification.yearOfAward" :maxDate="maxJoiningDate"></Calendar>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="institution">Institution</label>
                        <AutoComplete
                            placeholder="Search"
                            optionLabel="location"
                            id="institution"
                            :dropdown="true"
                            :multiple="false"
                            v-model="qualification.awardingInstitutionId"
                            :suggestions="autoFilteredAwardingInstitutions"
                            @complete="handleSearchAwardingInstitution($event)"
                            field="name"
                        />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="qualification">Qualification</label>
                        <AutoComplete
                            placeholder="Search"
                            id="qualification"
                            :dropdown="true"
                            :multiple="false"
                            v-model="qualification.qualificationTypeId"
                            :suggestions="autoFilteredQualifications"
                            @complete="handleSearchQualification($event)"
                            field="name"
                        />
                    </div>
                    <div class="field col-12 md:col-4" v-if="qualifications.length > 1" style="align-self: center; margin-top: 20px">
                        <Button @click="removeQualification(index)" v-if="qualifications.length > 1" icon="pi pi-times" severity="danger" rounded aria-label="Cancel" />
                    </div>
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>
