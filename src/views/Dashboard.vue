<script setup>
import { onMounted, ref, watch } from 'vue';

import { baseURL } from '@/components/reuseables/FetchPostData';
import EmployeesPerDepartment from './charts/EmployeesPerDepartmentBar.vue';
import AttendenceTimeFramesLineGraph from './charts/AttendenceTimeFramesLineGraph.vue';
import AttendenceTimeFramesBarLIne from './charts/AttendenceTimeFramesBarLIne.vue';
import WeeklyAttendance from './charts/WeeklyAttendance.vue';
// import EmployeePayrollComponent from '@/components/payroll/payroll/AddEmployeePayroll.vue';
import ObjectStatus from '@/views/ObjectStatus.vue';
import defaultProfile from '@/components/reuseables/defaultProfilePic';
import { useRouter } from 'vue-router';
import { useDashboardUtils } from '@/views/useDashboardUtils';
import loadFromLocalStorage from '@/components/reuseables/getUser';
import { baseAUTHURL, fetchAUTHData } from '@/components/reuseables/FetchPostData';

const { getEmployees, getEmployeesPerDepartment, getJobs, fetchDataTimeFrameAttendance, getRequests, getAttenceMonthlyFrames, getAttendanceSummary, tokenAuthValidation } = useDashboardUtils();
import { usePerformanceUtils } from '@/components/performance/performanceUtils';
const { getOrganisationObjectives } = usePerformanceUtils();
const { user } = loadFromLocalStorage();
// console.log('user', user)
const router = useRouter();
const tokenAuth = async () => {
    const accessToken = loadFromLocalStorage()?.accessToken;
    const url = `${baseAUTHURL}/validate/${accessToken}`;

    try {
        if (accessToken) {
            const data = await fetchAUTHData(url, false, router);

            if (data?.status !== 200 && !data?.ok) {
                router.push('/auth/login');
            }
        } else {
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
const objectives = ref([]);
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

onMounted(async () => {
    await tokenAuthValidation(router);
    await getAttenceMonthlyFrames(timeFrame, attendanceTimeFrames);
    await getEmployees(employees, originalEmployees);
    await getJobs(jobPosts);
    await getRequests(leaveRequets);
    await getEmployeesPerDepartment(barData, barLabels, router);
    await getAttendanceSummary(new Date(), new Date(), dailyAttendance);
    await getAttendanceSummary(getMonday(new Date()), new Date(), weeklyAttendance);
    await getOrganisationObjectives(objectives);
});
watch(
    () => dailyAttendance.value,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            // Get the first key (assuming there is only one date key in the object)
            const dateKey = Object.keys(dailyAttendance.value)[0];
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
        <div class="col-12">
            <div class="grid">
                <div class="col-12 lg:col-6 xl:col-9">
                    <div class="user-profile flex items-center border rounded-md shadow-sm">
                        <img :src="defaultProfile" alt="User Picture" class="w-1 h-1 rounded-full mr-4" />
                        <div>
                            <h6 class="text-xl">{{ user?.firstName || user?.username }} {{ user?.lastName }}</h6>
                            <p class="text-gray-600">{{ user?.userRole || user?.accountType }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="notification border rounded-md shadow-sm flex items-center">
                        <!-- <i class="pi pi-bell mr-2 text-xl"></i> -->
                        <!-- <span>New notification</span> -->
                    </div>
                </div>
            </div>
        </div>
        <div @click="navigateTo('employee')" class="col-12 lg:col-6 xl:col-3" style="cursor: pointer">
            <div class="card mb-0" style="height: 100%; background-color: #b0e0e6">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Employees</span>
                        <div class="text-900 font-medium text-xl">{{ employees?.length }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem; background-color: #b0e0e6">
                        <i class="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div @click="navigateTo('leaveRequets')" class="col-12 lg:col-6 xl:col-3" style="height: 150px">
            <div class="card mb-0" style="height: 100%; background-color: #ffb6c1">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Leave Requests</span>
                        <div class="text-900 font-medium text-xl">{{ leaveRequets }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem; background-color: #ffb6c1">
                        <i class="pi pi-bell text-orange-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div @click="navigateTo('jobPosts')" class="col-12 lg:col-6 xl:col-3" style="height: 150px">
            <div class="card mb-0" style="height: 100%; background-color: #e6e6fa">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Job Posts</span>
                        <div class="text-900 font-medium text-xl">{{ jobPosts }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-300 border-round" style="width: 2.5rem; height: 2.5rem; background-color: #e6e6fa">
                        <i class="pi pi-briefcase text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span v-if="jobPosts && jobPosts.length > 0" class="text-green-500 font-medium">
                    {{ jobPosts.applicationList && jobPosts.applicationList.length > 0 ? jobPosts.applicationList.length : 0 }}
                </span>
                <span v-if="jobPosts && jobPosts.length > 0" class="text-500">Applications</span>
            </div>
        </div>
        <div @click="navigateTo('attendance')" class="col-12 lg:col-6 xl:col-3" style="height: 150px">
            <div class="card mb-0" style="height: 100%; background-color: #f5f5dc">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Attendance</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem; background-color: #f0e68c">
                        <i class="pi pi-calendar text-cyan-500 text-xl"></i>
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
            <div style="height: 18rem">
                <EmployeesPerDepartment :label="'Employees per Department'" :lables="barLabels" :data="barData" />
            </div>
        </div>
        <!-- <EmployeesPerDepartment :label="'Employees per Department'" :lables="barLabels" :data="barData" /> -->

        <WeeklyAttendance :attendanceData="weeklyAttendance" />

        <div class="col-12 xl:col-6">
            <div class="card" style="height: 25rem">
                <!-- <h5>Recent Leaves</h5> -->
                <div style="height: 100%">
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
                    <div style="height: 18rem">
                        <AttendenceTimeFramesBarLIne v-if="chartType === 'bar'" :chartDataObject="chartData" :attendanceFrame="timeFrame.name" :url="timeFrameUrlState" />
                        <AttendenceTimeFramesLineGraph v-if="chartType === 'line'" :chartDataObject="chartData" :attendanceFrame="timeFrame.name" :url="timeFrameUrlState" />
                    </div>
                </div>
            </div>
        </div>
        <ObjectStatus :objectives="objectives" />

        <EmployeePayrollComponent :employees="employees" v-model:employeeSearch="employeeSearch" />
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
