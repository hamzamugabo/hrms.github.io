<script setup>
import { ref, onMounted } from 'vue';
import { postData, baseURL, fetchDataWithPayload } from '@/components/reuseables/FetchPostData.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import Attendance from './CreateAttendance.vue';
import AttendanceBreakRequest from './CreateBreakRequest.vue';
import { useRouter } from 'vue-router';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

const props = defineProps(['employeeId']);
const router = useRouter();
const attendanceData = ref({});
const attendanceBreakRequestData = ref({});
const successAddAttendance = ref(false);
const successAddAttendanceBreak = ref(false);
const addBreakes = ref(false);
const successMessageAddAttendance = ref('');
const successMessageAddAttendanceBreak = ref('');

const addAttendanceError = ref('');
const addAttendanceBreakError = ref('');
const loading = ref(false);
const loadingBreak = ref(false);
const attandanceData = ref({});

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// eslint-disable-next-line no-unused-vars
function addHoursToTime(dateString, hours) {
    const date = new Date(dateString);
    date.setHours(date.getHours() + hours);
    return date;
}
const getEmployeeAttendance = async () => {
    const now = new Date();

    try {
        if (!props?.employeeId) {
            console.log('Employee not selected');
            return;
        }
        const formData = {
            date: changeDateFormat(now)
        };
        let url = `${baseURL}/attendance/employee/${props?.employeeId}`;

        const urlParams = new URLSearchParams(formData).toString();
        url += `?${urlParams}`;

        const { data } = await fetchDataWithPayload(url, loading);
        // console.log('Attendance', data);
        attandanceData.value = data;
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    if (!props?.employeeId) {
        router.push('/');
    } else {
        getEmployeeAttendance();
    }
});

const submitForm = async () => {
    addAttendanceError.value = '';
    if (!props?.employeeId) {
     
        addAttendanceError.value = 'No Employee information';
        return;
    }
    loading.value = true;
    const formData = {
        notes: attendanceData.value?.notes,
        employeeId: props?.employeeId
    };
    if (!formData) {
        console.log('no formdata', formData);
        return;
    }

    try {
        const url = `${baseURL}/attendance/clock-in`;

        //  
        // loading.value = false;

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            attandanceData.value = data?.data;

            successMessageAddAttendance.value = data?.message;
            // successAddAttendance.value = true;

            loading.value = false;

            attendanceData.value = data?.data;
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
            loading.value = false;
            addAttendanceError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
         

        loading.value = false;
        console.log(error?.error);
    }
};
const handleCreateAttendanceBreak = async () => {
    addAttendanceBreakError.value = '';
    loadingBreak.value = true;
    if (!attandanceData.value?.id) {
        console.log('Attendance id missing');
        loadingBreak.value = false;
        return;
    }
    const attendanceId = attandanceData.value?.id;
    const formData = {
        attendanceId,
        date: attendanceBreakRequestData?.value?.date,
        endTime: formatDate(attendanceBreakRequestData?.value?.endTime),
        startTime: formatDate(attendanceBreakRequestData?.value?.startTime)
    };
    try {
        const url = `${baseURL}/attendance/breaks/create/${attendanceId}`;

         
        // loadingBreak.value = false;

        const data = await postData(url, formData, loadingBreak);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddAttendanceBreak.value = data?.message;
            // successAddAttendanceBreak.value = true;
            loadingBreak.value = false;

            attendanceBreakRequestData.value = {};
            showSuccess(data?.message);
        } else {
            showError(data?.message ? data?.message : data?.error);
            loadingBreak.value = false;

            addAttendanceBreakError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
         

        loadingBreak.value = false;
        console.log(error?.error);
    }
};

const handleAttendance = (data) => {
    attendanceData.value = data;
};

const handleBreakRequest = (data) => {
    attendanceBreakRequestData.value = data;
};
const showHideBreake = () => {
    addBreakes.value = !addBreakes.value;
    // console.log('addBreakes.value:', addBreakes.value);
};
</script>

<template>
    <Dialog v-model:visible="addBreakes" header="Add Break" :style="{ width: '50rem' }">
        <Message v-if="successAddAttendanceBreak" severity="success">{{ successMessageAddAttendanceBreak }}</Message>

        <Message v-if="addAttendanceBreakError" severity="error">{{ addAttendanceBreakError }}</Message>

        <!-- <h5>Interview Break Request</h5> -->
        <AttendanceBreakRequest @handleBreakRequest="handleBreakRequest" />

        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="addBreakes = false"></Button>
            <Button v-if="!loadingBreak" type="button" label="Add Break" @click="handleCreateAttendanceBreak"></Button>

            <SpinnerVue :loading="loadingBreak" size="3rem" />
        </div>
    </Dialog>
    <form @submit.prevent="submitForm" class="form-container">
        <div class="grid">
            <div class="col-12">
                <div class="card" style="min-width: 300px">
                    <Button
                        v-if="attandanceData?.id"
                        type="button"
                        @click="showHideBreake"
                        style="width: auto; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000; float: right"
                        @mouseover="showUpdateIcon = true"
                        @mouseleave="showUpdateIcon = false"
                    >
                        <i class="pi pi-plus-circle"></i> Request Break
                    </Button>
                    <Message v-if="successAddAttendance" severity="success">{{ successMessageAddAttendance }}</Message>

                    <Message v-if="addAttendanceError" severity="error">{{ addAttendanceError }}</Message>

                    <h5>Attendance</h5>
                    <p>Clocked in: {{ attandanceData?.timeIn }}</p>
                    <Attendance @handleAttendance="handleAttendance" :isTimeOut="false" :isTimeIn="true" v-if="!attandanceData?.id" />
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="display: flex; justify-content: center; margin: 0px 0px">
            <button v-if="!attandanceData?.id" style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 10px" class="border-none">Clock In</button>
        </div>
    </form>
</template>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}
</style>
