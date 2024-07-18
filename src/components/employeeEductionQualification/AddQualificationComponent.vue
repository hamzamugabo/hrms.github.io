<script setup>

// eslint-disable-next-line no-unused-vars
const props = defineProps(['qualifications', 'label', 'autoFilteredAwardingInstitutions', 'autoFilteredQualifications', 'institutionId', 'qualificationId', 'autoFilteredEmployees']);
const emit = defineEmits(['searchAwardingInstitution', 'searchQualification', 'searchEmployee']);

const handleSearchAwardingInstitution = (event) => {
    emit('searchAwardingInstitution', event);
};

const handleSearchQualification = (event) => {
    emit('searchQualification', event);
};
const handleSearchEmployee = (event) => {
    emit('searchEmployee', event);
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex items-center">
                    <label for="" class="mr-4 ml-2" style="color: transparent">{{ label }}</label>
                    <!-- <button @click.prevent="addQualification" class="addFieldButton">
                        <i class="pi pi-plus cursor-pointer mr-1"></i>
                        <label for="" class="mr-4">New Field</label>
                    </button> -->
                </div>
                <!-- <div class="p-fluid formgrid grid"> -->

                <div class="p-fluid formgrid grid" v-for="(qualification, index) in qualifications" :key="index" style="margin-bottom: 10px">
                    <div class="field col-12 md:col-4">
                        <label :for="'qualificationName' + index">Qualification Name</label>
                        <InputText :id="'qualificationName' + index" type="text" v-model="qualification.name" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label :for="'qualificationType' + index">Year of award</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="qualification.yearOfAward"></Calendar>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="employee">Employee</label>
                        <AutoComplete
                            placeholder="Search"
                            optionLabel="firstName"
                            id="employee"
                            :dropdown="true"
                            :multiple="false"
                            v-model="qualification.employeeId"
                            :suggestions="autoFilteredEmployees"
                            @complete="handleSearchEmployee($event)"
                            field="lastName"
                        >
                            <template #option="slotProps">
                                <div class="flex align-options-center">
                                    <div>{{ slotProps.option.firstName }}</div>
                                    <div>&nbsp;</div>
                                    <div>{{ slotProps.option.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>
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
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>
