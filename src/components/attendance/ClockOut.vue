<script setup>
import { ref, onMounted } from 'vue';
import { postData, baseURL, fetchDataWithPayload } from '@/components/reuseables/FetchPostData.js';
import loadFromLocalStorage from '@/components/reuseables/getUser.js';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
// import Attendance from './CreateAttendance.vue';
import AttendanceOvertimeRequest from './CreateOvertimeRequests.vue';
import { useRouter } from 'vue-router';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();

// const props = defineProps(['employeeId']);
const user = loadFromLocalStorage();

const employeeId = user?.user?.id;

// eslint-disable-next-line no-unused-vars
const router = useRouter();

// const attendanceData = ref({});
const attendanceOvertimeRequestData = ref({});
const successAddAttendance = ref(false);
const successAddAttendanceOvertime = ref(false);
const successMessageAddAttendance = ref('');
const successMessageAddAttendanceOvertime = ref('');
const addOverTime = ref(false);

const addAttendanceError = ref('');
const addAttendanceOvertimeError = ref('');
const loading = ref(false);
const loadingOverTime = ref(false);
const attendanceData = ref({});
// const attendanceData = ref({});

const getEmployeeAttendance = async () => {
    const now = new Date();

    try {
        if (!employeeId) {
            console.log('Employee not selected');
            return;
        }
        const formData = {
            date: changeDateFormat(now)
        };
        let url = `${baseURL}/attendance/employee/${employeeId}`;

        const urlParams = new URLSearchParams(formData).toString();
        url += `?${urlParams}`;

        const { data } = await fetchDataWithPayload(url, loading);
        // console.log('Attendance', data);
        attendanceData.value = data;
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    getEmployeeAttendance();
});
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

const submitForm = async () => {
     addAttendanceError.value = '';
    if (!attendanceData?.value) {
        addAttendanceError.value = 'No clock in information';
        return;
    }
    const now = new Date();
    // console.log('attendance data', attendanceData.value);
    const formData = {
        date: attendanceData?.value?.date,
        notes: attendanceData?.value?.notes || attendanceData?.value?.notes,
        timeIn: formatDate(attendanceData.value?.timeIn),
        timeOut: formatDate(now.toString()),
        id: attendanceData?.value?.id
    };

    try {
        loading.value = true;

        const url = `${baseURL}/attendance/update`;

        // console.log('Form submitted:', formData);
        // loading.value = false;

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddAttendance.value = data?.message;
            // successAddAttendance.value = true;
        showSuccess(data?.message);

            loading.value = false;
            attendanceData.value = data?.data;

            // attendanceData.value = {};
        } else {
            showError(data?.message ? data?.message : data?.error);
            loading.value = false;
            addAttendanceError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        console.log('Form submitted:', formData);

        loading.value = false;
        console.log(error?.error);
    }
};

const handleCreateAttendanceOvertime = async () => {
     addAttendanceOvertimeError.value = '';
    loadingOverTime.value = true;
    const attendanceId = attendanceData.value?.id;
    // const formData = attendanceBreakRequestData?.value;
    const formData = {
        attendanceId,
        date: attendanceOvertimeRequestData?.value?.date,
        endTime: formatDate(attendanceOvertimeRequestData?.value?.endTime),
        startTime: formatDate(attendanceOvertimeRequestData?.value?.startTime)
    };
    try {
        const url = `${baseURL}/attendance/overtime/create/${attendanceId}`;

        // console.log('Form submitted:', formData);
        // loadingOverTime.value = false;

        const data = await postData(url, formData, loadingOverTime);

        if (data?.status === 200 || data?.status === 201) {
            successMessageAddAttendanceOvertime.value = data?.message;
            // successAddAttendanceOvertime.value = true;
            loadingOverTime.value = false;
            showSuccess(data?.message);

            // attendanceOvertimeRequestData.value = {};
        } else {
            showError(data?.message ? data?.message : data?.error);
            loadingOverTime.value = false;

            addAttendanceOvertimeError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        console.log('Form submitted:', formData);

        loadingOverTime.value = false;
        console.log(error?.error);
    }
};

// const handleAttendance = (data) => {
//     attendanceData.value = data;
// };
const handleOvertimeRequest = (data) => {
    attendanceOvertimeRequestData.value = data;
};
const showHideOvertime = () => {
    addOverTime.value = !addOverTime.value;
    // console.log('addOverTime.value:', addOverTime.value);
};
</script>

<template>
    <Dialog v-model:visible="addOverTime" header="Add Overtime" :style="{ width: '50rem' }">
        <Message v-if="successAddAttendanceOvertime" severity="success">{{ successMessageAddAttendanceOvertime }}</Message>

        <Message v-if="addAttendanceOvertimeError" severity="error">{{ addAttendanceOvertimeError }}</Message>

        <!-- <h5>Interview Break Request</h5> -->
        <AttendanceOvertimeRequest @handleOvertimeRequest="handleOvertimeRequest" />

        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="addOverTime = false"></Button>
            <Button v-if="!loadingOverTime" type="button" label="Add Overtime" @click="handleCreateAttendanceOvertime"></Button>

            <SpinnerVue :loading="loadingOverTime" size="3rem" />
        </div>
    </Dialog>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <Button
                        v-if="attendanceData?.id"
                        type="button"
                        @click="showHideOvertime"
                        style="width: auto; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000; float: right"
                        @mouseover="showUpdateIcon = true"
                        @mouseleave="showUpdateIcon = false"
                    >
                        <i class="pi pi-plus-circle"></i> Overtime
                    </Button>
                    <Message v-if="successAddAttendance" severity="success">{{ successMessageAddAttendance }}</Message>

                    <Message v-if="addAttendanceError" severity="error">{{ addAttendanceError }}</Message>

                    <div style="display: flex; flex-direction: row">
                        <h5>Attendance</h5>
                    </div>
                    <h6>Clocked in : {{ attendanceData?.timeIn }}</h6>
                    <h6>Clocked Out : {{ attendanceData?.timeOut }}</h6>
                    <!-- <Attendance @handleAttendance="handleAttendance" :isTimeOut="true" :isTimeIn="false" /> -->
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: center">
            <SpinnerVue :loading="loading" size="3rem" />
        </div>
        <div v-if="!loading" class="mb-10" style="margin: 50px 0px">
            <button v-if="!attendanceData?.timeOut" style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Clock Out</button>
        </div>
    </form>
</template>
