<script setup>

 defineProps(['qualifications', 'label']);
const emit = defineEmits(['remove', 'add']);

const removeQualification = (index) => {
    emit('remove', index);
};

const addQualification = () => {
    emit('add');
};
</script>

<template>
    <div>
        <div class="flex items-center">
            <label for="" class="mr-4 ml-2">{{ label }}</label>
            <button @click.prevent="addQualification" class="addFieldButton">
                <i class="pi pi-plus cursor-pointer mr-1"></i>
                <label for="" class="mr-4">New Field</label>
            </button>
        </div>

        <div v-for="(qualification, index) in qualifications" :key="index" style="margin-bottom: 10px">
            <div class="flex items-center mt-2">
                <div class="field mr-2">
                    <label :for="'qualificationName' + index">Qualification Name</label>
                    <InputText :id="'qualificationName' + index" type="text" v-model="qualification.name" />
                </div>
                <div class="field mr-2">
                    <label :for="'qualificationType' + index">Qualification Type</label>
                    <InputText :id="'qualificationType' + index" type="text" v-model="qualification.type" />
                </div>
                <i @click="removeQualification(index)" v-if="qualifications.length > 1" class="pi pi-times cursor-pointer" style="margin-top: 10px"></i>
            </div>
        </div>
    </div>
</template>
