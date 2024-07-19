<script setup>
import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref } from 'vue';
import { baseURL } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { ProgressStatus } from '@/components/reuseables/enums';

import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { getIndividualObjectives } = usePerformanceUtils();

// const name = ref('');
const progressStatus = ref({ name: '', code: '' });
// const dueDate = ref('');
const individualObjectiveId = ref('');
const loading = ref(false);
const success = ref(false);
const autoFilteredObjectives = ref([]);
const objectives = ref([]);

const serverError = ref('');
const successMessage = ref('');
// const minDate = ref(getMinDate());
// function getMinDate() {
//     const today = new Date();
//     today.setDate(today.getDate());
//     return today;
// }

onMounted(async () => {
    await getIndividualObjectives(objectives);

    // console.log( getStatusColor('PENDING'))
});
const searchObjective = (event) => {
    if (!event.query.trim().length) {
        autoFilteredObjectives.value = objectives?.value?.length > 0 ? [...objectives.value] : [];
    } else {
        autoFilteredObjectives.value = objectives.value.filter((objective) => {
            const name = objective.name.toLowerCase().startsWith(event.query.toLowerCase());

            return name;
        });
    }
};

const emit = defineEmits(['refresh']);
// const submitPayload = () => {
//     const formData = {
//         individualObjectiveId: individualObjectiveId.value.id,
//         progressStatus: progressStatus?.value?.name,
//         updateDate: changeDateFormat(new Date())
//     };

//     emit('handleData', formData);
// };
const addServerError = ref('');
const submitForm = async () => {
    addServerError.value = '';
    loading.value = true;

    const url = `${baseURL}/progress_update/create/individual-objective`;

    try {
        const formData = {
            individualObjectiveId: individualObjectiveId.value.id,
            progressStatus: progressStatus?.value?.name,
            updateDate: changeDateFormat(new Date())
        };
        console.log('submit', formData);
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            // addSuccess.value = true;
            // addSuccessMessage.value = data?.message;

            loading.value = false;

            showSuccess(data?.message);
            emit('refresh');
        } else {
            showError(data?.error || data?.message);
            addServerError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
// watch([progressStatus, individualObjectiveId], () => {
//     submitPayload();
// });
</script>
<template>
    <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content">
            <div class="grid">
                <!-- <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i> -->

                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>

                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create status update</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">Individual objective</label>
                                <AutoComplete
                                    placeholder="Search Individual objective"
                                    id="objective"
                                    :dropdown="true"
                                    :multiple="false"
                                    v-model="individualObjectiveId"
                                    :suggestions="autoFilteredObjectives"
                                    @complete="searchObjective"
                                    field="name"
                                >
                                    <template #option="slotProps">
                                        <div class="flex align-items-center">
                                            <div>{{ slotProps?.option?.name }}</div>
                                        </div>
                                    </template>
                                </AutoComplete>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="progressStatus">Progress Status</label>
                                <Dropdown id="progressStatus" v-model="progressStatus" :options="ProgressStatus" optionLabel="name" placeholder="Select Status"></Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 20px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.bg-light-grey {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>
