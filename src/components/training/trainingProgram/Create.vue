<script setup>
import { ref } from 'vue';

const submitForm = () => {
    const data = {
        programName: programName.value,
        programDescription: programDescription.value,
        durationInHours: durationInHours.value,
        instructor: instructor.value,
        startDate: startDate.value,
        endDate: endDate.value,
        catalogRequests: catalogRequests.value.map((request) => ({
            category: request.category,
            description: request.description,
            provider: request.provider
        }))
    };
    console.log('submit', data);
};

const programName = ref('');
const programDescription = ref('');
const durationInHours = ref(1);
const instructor = ref('');
const catolog = ref([]);
const startDate = ref('2024-04-26');
const endDate = ref('2024-04-26');
const catalogRequests = ref([{ category: 'string', description: 'string', provider: 'string' }]);
</script>

<template>
  <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content">
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Program Details</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12">
                            <label for="programName">Program Name</label>
                            <InputText required id="programName" type="text" v-model="programName" />
                        </div>
                        <div class="field col-12">
                            <label for="programDescription">Program Description</label>
                            <!-- <InputText required id="programDescription" type="text" v-model="programDescription" /> -->
                            <Textarea id="programDescription" rows="3" v-model="programDescription" />
                        </div>
                        <div class="field col-12">
                            <label for="durationInHours">Duration (Hours)</label>
                            <InputNumber id="durationInHours" v-model="durationInHours" />
                        </div>
                        <div class="field col-12">
                            <label for="instructor">Instructor</label>
                            <InputText required id="instructor" type="text" v-model="instructor" />
                        </div>
                        <div class="field col-12">
                            <label for="startDate">Start Date</label>
                            <!-- <InputDate id="startDate" v-model="startDate" /> -->
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate"></Calendar>
                        </div>
                        <div class="field col-12">
                            <label for="endDate">End Date</label>
                            <!-- <InputDate id="endDate" v-model="endDate" /> -->
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate"></Calendar>
                        </div>
                        <div class="field col-12">
                            <label for="catalogRequests">Catalog Requests</label>
                            <MultiSelect v-model="catolog" :options="catalogRequests" optionLabel="name" placeholder="Select Catalog Requests" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Submit</button>
        </div>
    </form>
  </div>
</template>
