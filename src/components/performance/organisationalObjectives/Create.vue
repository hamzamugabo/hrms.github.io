<script setup>
// import { postData } from '@/components/reuseables/FetchPostData';
// import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { ref, watch } from 'vue';
// import { baseURL } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';

const name = ref('');
const description = ref('');
const dueDate = ref('');
// const loading = ref(false);
const success = ref(false);

const serverError = ref('');
const successMessage = ref('');
const minDate = ref(getMinDate());
function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today;
}

const emit = defineEmits(['handleData']);
const submitPayload = () => {
    const formData = { name: name.value, description: description.value, dueDate: changeDateFormat(dueDate.value) };

    emit('handleData', formData);
};
watch([name, description, dueDate], () => {
    submitPayload();
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
                <!-- <h5>Create organisation objective</h5> -->
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="name">Name</label>
                        <InputText required id="name" type="text" v-model="name" />
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="description" required="true" rows="3" cols="20" />
                        <!-- <InputText required id="description" type="text" v-model="description" /> -->
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="dueDate">Due Date</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="dueDate" :minDate="minDate"></Calendar>
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
