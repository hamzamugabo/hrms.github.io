<script setup>
import { onMounted, ref, watch } from 'vue';
// import axios from 'axios';
// import { ProductService } from '@/service/ProductService';
// import { useLayout } from '@/layout/composables/layout';
// import LeaveRequestVue from './LeaveRequest.vue';
import { baseURL } from '@/components/reuseables/FetchPostData';
import EmployeesPerDepartment from './charts/EmployeesPerDepartmentBar.vue';
import AttendenceTimeFramesLineGraph from './charts/AttendenceTimeFramesLineGraph.vue';
import AttendenceTimeFramesBarLIne from './charts/AttendenceTimeFramesBarLIne.vue';
import WeeklyAttendance from './charts/WeeklyAttendance.vue';
import EmployeePayrollComponent from '@/components/payroll/payroll/AddEmployeePayroll.vue';

import { useRouter } from 'vue-router';
import { useDashboardUtils } from '@/views/useDashboardUtils';
import loadFromLocalStorage from '@/components/reuseables/getUser';
import { baseAUTHURL, fetchAUTHData } from '@/components/reuseables/FetchPostData';

// import { utils } from '@/components/payroll/payroll/payrollUtils.js';

// import loadFromLocalStorage from '@/components/reuseables/getUser';

// const { getPayrollSummary } = utils();
const { getEmployees, getEmployeesPerDepartment, getJobs, fetchDataTimeFrameAttendance, getRequests, getAttenceMonthlyFrames, getAttendanceSummary, tokenAuthValidation } = useDashboardUtils();

const router = useRouter();
const tokenAuth = async () => {
    const accessToken = loadFromLocalStorage()?.accessToken;
    const url = `${baseAUTHURL}/validate/${accessToken}`;

    try {
        if (accessToken) {
            console.log('checked token exists');
            const data = await fetchAUTHData(url, false, router);
            console.log('==>data', data);
            if (data?.status !== 200 && !data?.ok) {
                console.log('Token not validated');
                router.push('/auth/login');
            } else {
                console.log('no data');
            }
        } else {
            console.log('No access token');
            router.push('/auth/login');
        }
    } catch (error) {
        console.log('Error validating token', error);
        router.push('/auth/login');
    }
};
onMounted(async () => {
    await tokenAuth();
});
const employees = ref([]);
const jobPosts = ref(0);
const leaveRequets = ref(0);
const attendanceTimeFrames = ref([]);
const timeFrame = ref({ name: 'month', code: 'month' });
const timeFrameUrlState = ref(`${baseURL}/attendance/trends/${timeFrame?.value.name}`);
const barLabels = ref([]);
const barData = ref([]);
const chartData = ref({});
const chartType = ref('bar');
const employeeSearch = ref('');
const originalEmployees = ref([]);
const dailyAttendance = ref(null);
const dailyAttendanceValues = ref({});
const weeklyAttendance = ref({});
// const tokenValidation = ref('');
// const payrollSummary = ref({});

const getMonday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
};

// const fetchEmployees = async () => {
//     try {
//         const response = await axios.get('https://b2b5-41-210-143-82.ngrok-free.app/v1/employees', {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log('response', response)
//         if (response.status === 200) {
//             employees.value = response.data;
//         } else {
//             console.error('Unexpected status code:', response.status);
//         }
//     } catch (error) {
//         if (error.response) {
//             // Server responded with a status other than 200 range
//             console.error('Server error:', error.response.status, error.response.data);
//         } else if (error.request) {
//             // No response received from server
//             console.error('No response received:', error.request);
//         } else {
//             // Other errors
//             console.error('Error:', error.message);
//         }
//     }
// };
onMounted(async () => {
    // await fetchEmployees();
    // const isTokenValid = await tokenAuthValidation(router);
    // tokenValidation.value = isTokenValid;
    // if (isTokenValid === 'Token is valid') {
    await tokenAuthValidation(router);
    await getAttenceMonthlyFrames(timeFrame, attendanceTimeFrames);
    await getEmployees(employees, originalEmployees);
    await getJobs(jobPosts);
    await getRequests(leaveRequets);
    await getEmployeesPerDepartment(barData, barLabels, router);
    await getAttendanceSummary(new Date(), new Date(), dailyAttendance);
    await getAttendanceSummary(getMonday(new Date()), new Date(), weeklyAttendance);
    // } else {
    //     router.push('/auth/login');
    // }

    // await getPayrollSummary(payrollSummary, false);
    // console.log('getMonday', getMonday(getNthDay(new Date())));
    // console.log('getNthDay', getNthDay(new Date()))
});
watch(
    () => dailyAttendance.value,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            // Get the first key (assuming there is only one date key in the object)
            const dateKey = Object.keys(dailyAttendance.value)[0];
            console.log('dailyAttendance.value[dateKey]', dailyAttendance.value[dateKey]);
            // Access the counts
            dailyAttendanceValues.value = dailyAttendance.value[dateKey];
        }
    }
);
watch(
    () => timeFrame.value,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            const timeFrameUrl = `${baseURL}/attendance/trends/${timeFrame?.value.name}`;
            timeFrameUrlState.value = timeFrameUrl;
            fetchDataTimeFrameAttendance(timeFrameUrlState, chartData);
        }
    }
);
watch(employeeSearch, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        if (newValue.trim() !== '') {
            // Filter employees if there's input in the search
            employees.value = originalEmployees.value.filter((employee) => employee.name.toLowerCase().includes(newValue.toLowerCase()));
        } else {
            // Reset to the original list if search input is empty
            employees.value = originalEmployees.value;
        }
    }
});
// const lineOptions = ref(null);

const navigateTo = (subLink) => {
    console.log('==>linkto,', subLink);
    if (subLink === 'employee') {
        router.push('/employees');
    }
    if (subLink === 'leaveRequets') {
        router.push('/leave/request');
    }
    if (subLink === 'jobPosts') {
        router.push('/Jobs');
    }
    if (subLink === 'attendance') {
        router.push('/attendance');
    }
};
const attendanceFilters = [
    { name: 'month', code: 'month' },
    { name: 'year', code: 'year' }
];
onMounted(() => {
    timeFrame.value = attendanceFilters[0];
});
</script>

<template>
    <div class="grid">
        <div @click="navigateTo('employee')" class="col-12 lg:col-6 xl:col-3" style="cursor: pointer">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Employees</span>
                        <div class="text-900 font-medium text-xl">{{ employees?.length }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span>
  <span class="text-500">since last visit</span> -->
            </div>
        </div>
        <div @click="navigateTo('leaveRequets')" class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Leave Requests</span>
                        <div class="text-900 font-medium text-xl">{{ leaveRequets }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-bell text-orange-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-500">since last week</span> -->
            </div>
        </div>
        <div @click="navigateTo('jobPosts')" class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Job Posts</span>
                        <div class="text-900 font-medium text-xl">{{ jobPosts }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-briefcase text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span v-if="jobPosts && jobPosts.length > 0" class="text-green-500 font-medium">
                    {{ jobPosts.applicationList && jobPosts.applicationList.length > 0 ? jobPosts.applicationList.length : 0 }}
                </span>
                <span v-if="jobPosts && jobPosts.length > 0" class="text-500">Applications</span>
            </div>
        </div>
        <div @click="navigateTo('attendance')" class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Attendance</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-briefcase text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <div class="flex justify-around">
                    <div class="flex justify-center items-center mr-1">
                        <span class="text-xs font-bold mr-1 text-red-500">{{ dailyAttendanceValues?.onTimeCount }}</span>
                        <span class="text-xs text-red-500">On Time</span>
                    </div>

                    <div class="flex justify-center items-center mr-1">
                        <span class="text-xs font-bold mr-1 text-green-500">{{ dailyAttendanceValues?.lateCount }}</span>
                        <span class="text-xs text-green-500">Late</span>
                    </div>
                    <div class="flex justify-center items-center">
                        <span class="text-xs font-bold mr-1 text-blue-500">{{ dailyAttendanceValues?.absentCount }}</span>
                        <span class="text-xs text-blue-500">Absent</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Employees per department Bar</h5>
                <EmployeesPerDepartment :label="'Employees per Department'" :lables="barLabels" :data="barData" />
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <!-- <h5>Recent Leaves</h5> -->
                <div class="flex">
                    <h5>Employees attendance</h5>

                    <Dropdown v-model="timeFrame" :options="attendanceFilters" optionLabel="name" placeholder="search employee..." class="mr-2 ml-auto" style="width: 8rem" />
                </div>

                <div class="flex mb-5">
                    <div>
                        <input type="radio" id="bar" value="bar" v-model="chartType" :class="{ 'selected-radio': chartType === 'bar' }" />
                        <label for="bar">Bar</label>
                    </div>
                    <div class="ml-2">
                        <input type="radio" id="line" value="line" v-model="chartType" :class="{ 'selected-radio': chartType === 'line' }" />
                        <label for="line">Line</label>
                    </div>
                </div>

                <AttendenceTimeFramesBarLIne v-if="chartType === 'bar'" :chartDataObject="chartData" :attendanceFrame="timeFrame.name" :url="timeFrameUrlState" />
                <AttendenceTimeFramesLineGraph v-if="chartType === 'line'" :chartDataObject="chartData" :attendanceFrame="timeFrame.name" :url="timeFrameUrlState" />
            </div>
        </div>

        <EmployeePayrollComponent :employees="employees" v-model:employeeSearch="employeeSearch" />
        <WeeklyAttendance :attendanceData="weeklyAttendance" />
    </div>
</template>
<style scoped>
.selected-radio:checked + label {
    color: red;
}

input[type='radio'] {
    accent-color: red;
}
</style>
