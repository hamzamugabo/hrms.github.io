<script setup>
import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { onMounted, ref } from 'vue';
import { baseURL } from '@/components/reuseables/FetchPostData';
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { getPerformanceMetric } = usePerformanceUtils();

const performanceAgreementId = ref('');
const loading = ref(false);
const success = ref(false);
const performanceMetricId = ref('');
const metrics = ref([]);
const autoFilteredMetrics = ref([]);
const serverError = ref('');
const successMessage = ref('');

const satisfiedCustomers = ref(0);
const totalCustomers = ref(0);

onMounted(async () => {
    await getPerformanceMetric(metrics);
});

const searchPerformanceMetrics = (event) => {
    if (!event.query.trim().length) {
        autoFilteredMetrics.value = metrics?.value?.length > 0 ? [...metrics.value] : [];
    } else {
        autoFilteredMetrics.value = metrics.value.filter((metric) => {
            const metricCategory = metric.metricCategory.toLowerCase().startsWith(event.query.toLowerCase());
            const metricDescription = metric.metricDescription.toLowerCase().startsWith(event.query.toLowerCase());

            return metricCategory || metricDescription;
        });
    }
};

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    const formData = {
        satisfiedCustomers: satisfiedCustomers.value,
        totalCustomers: totalCustomers.value,

        performanceAgreementId: performanceAgreementId.value
    };

    const url = `${baseURL}/performance_metric/customer/create`;

    try {
        const data = await postData(url, formData);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            showSuccess(data?.message);
            // success.value = true;
        } else {
            showError(data?.error || data?.message);
            serverError.value = data?.error || data?.message;
        }
        console.log('created response', data);
    } catch (error) {
        showError(error.message);
        serverError.value = error.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="form-container">
        <form @submit.prevent="submitForm" class="form-content">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>
                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Employee Customer Metric</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">Performance Metric</label>
                                <AutoComplete
                                    placeholder="Search performance metric"
                                    id="performanceMetric"
                                    :dropdown="true"
                                    :multiple="false"
                                    optionLabel="appraisalPhase"
                                    v-model="performanceMetricId"
                                    :suggestions="autoFilteredMetrics"
                                    @complete="searchPerformanceMetrics"
                                >
                                    <template #option="slotProps">
                                        <div class="job-info">
                                            <div class="flex align-options-center">
                                                <div class="job-detail">
                                                    <div>metricCategory: {{ slotProps?.option?.metricCategory }}</div>
                                                    <div>metricDescription: {{ slotProps?.option?.metricDescription }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </AutoComplete>
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="satisfiedCustomers">Satisfied Customers</label>
                                <InputNumber v-model="satisfiedCustomers" inputId="integeronly" />
                                <!-- <InputText required id="satisfiedCustomers" type="text" v-model="satisfiedCustomers" /> -->
                            </div>

                            <div class="field col-12 md:col-12">
                                <label for="totalCustomers">Total Customers</label>
                                <InputNumber v-model="totalCustomers" inputId="integeronly" />

                                <!-- <InputText required id="totalCustomers" type="text" v-model="totalCustomers" /> -->
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: center">
                <SpinnerVue :loading="loading" size="3rem" />
            </div>

            <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
                <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer" class="block mx-auto border-none pb-3">Submit</button>
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
