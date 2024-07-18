<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { baseURL, fetchDataWithPayload } from '@/components/reuseables/FetchPostData';
import { utils } from '../payroll/payroll/payrollUtils';

// import loadFromLocalStorage from '@/components/reuseables/getUser';

const { searchByEmployeeId } = utils();

const props = defineProps(['employeeId']);
console.log('employee id', props?.employeeId);
const router = useRouter();
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
};

const loading = ref(false);
const attendanceData = ref([]);
const employeePayroll = ref([]);
const payrolls = ref([]);
const getAttendance = async () => {
    try {
        if (!props?.employeeId) {
            console.log('Employee not selected');
            return;
        }
        const url = `${baseURL}/attendance/breakdown/${props.employeeId}`;
        const { data } = await fetchDataWithPayload(url, loading);
        attendanceData.value = data;
    } catch (error) {
        console.log(error);
    }
};

// Watch for changes in employeeId and call getAttendance
watch(
    () => props.employeeId,
    (newEmployeeId) => {
        if (newEmployeeId) {
            searchByEmployeeId(payrolls, newEmployeeId, false, employeePayroll);
            getAttendance();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid">
        <!-- Payroll Section -->
        <div @click="navigateTo('employee')" class="col-12 lg:col-6 xl:col-4" style="cursor: pointer">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Payroll</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                </div>
                <div v-for="payroll in employeePayroll" :key="payroll?.id" class="justify-around flex-row">
                    <div class="flex-row justify-between">
                        <span class="payroll-label mr-3">duration:</span>
                        <span class="payroll-value" style="font-weight: bold">{{ payroll?.payPeriodStartDate }} <strong>-</strong> {{ payroll?.payPeriodEndDate }}</span>
                    </div>

                    <div class="flex-row mb-3">
                        <span class="payroll-label mr-3">Amount:</span>
                        <span class="payroll-value" style="font-weight: bold">{{ payroll?.totalAmountPaid }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Attendance Section -->
        <div @click="navigateTo('employee')" class="col-12 lg:col-6 xl:col-4" style="cursor: pointer">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Attendance breakdown</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                </div>
                <div v-for="attendance in attendanceData" :key="attendance?.label" class="flex justify-between">
                    <span class="attendance-value">{{ attendance?.value }}</span>
                    <span class="attendance-label">{{ attendance?.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.attendance-value,
.attendance-label {
    flex: 1;
    margin-bottom: 5px;
    /* text-align: center; */
}
</style>
