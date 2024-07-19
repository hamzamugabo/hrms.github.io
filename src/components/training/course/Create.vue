<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
// import { useToastPopup } from '@/components/reuseables/useToast.js';
import { DifficultyLevel, TrainingStatus } from '@/components/reuseables/enums.js';

// const { showError, showSuccess } = useToastPopup();
const emit = defineEmits(['handleData']);
const cost = ref(0);
const description = ref('');
const difficultyLevel = ref('');
const durationHours = ref(0);
const tags = ref('');
const title = ref('');
const trainingStatus = ref('');
// const loading = ref(false);
const success = ref(false);
const serverError = ref('');
const successMessage = ref('');

const submitData = () => {
    const formData = {
        cost: cost.value,
        description: description.value,
        difficultyLevel: difficultyLevel.value?.name,
        durationHours: durationHours.value,
        tags: tags.value,
        title: title.value,
        trainingStatus: trainingStatus.value?.name
    };
    emit('handleData', formData);
};

watch([cost, description, difficultyLevel, durationHours, tags, title, trainingStatus], () => {
    submitData();
});
</script>
<template>
    <!-- <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content"> -->
    <div class="grid">
        <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

        <div class="col-12">
            <div class="card">
                <Message v-if="success" severity="success">{{ successMessage }}</Message>

                <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                <!-- <h5>Create Job Course</h5> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="cost">cost</label>
                        <InputNumber v-model="cost" inputId="cost" :useGrouping="false" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="description">Description</label>
                        <InputText required id="description" type="text" v-model="description" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="difficultyLevel">Difficulty Level</label>
                        <Dropdown id="difficultyLevel" v-model="difficultyLevel" :options="DifficultyLevel" optionLabel="name" placeholder="Select difficulty Level"></Dropdown>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="durationHours">Duration Hours</label>
                        <InputNumber v-model="durationHours" inputId="durationHours" :useGrouping="false" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="tags">Tags</label>
                        <InputText id="tags" type="text" v-model="tags" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="title">Title</label>
                        <InputText id="title" type="text" v-model="title" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="trainingStatus">Training Status</label>
                        <Dropdown id="trainingStatus" v-model="trainingStatus" :options="TrainingStatus" optionLabel="name" placeholder="Select Training Status"></Dropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div> -->
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
