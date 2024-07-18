<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { useToast } from 'primevue/usetoast';
import { useAttendanceStore } from '@/piniaStore/attendanceData.js';
import { baseURL, fetchDataWithPayload } from '@/components/reuseables/FetchPostData.js';
import MonthlyAttendance from './MonthlyAttendance.vue';
import YearlyAttendance from './YearlyAttendance.vue';

const router = useRouter();
const profileImageUrl = ref('https://via.placeholder.com/150');

const attendanceStore = useAttendanceStore();
const attendanceData = ref(attendanceStore?.getAttendanceData());
const timeWorked = ref('');
const monthlyVisible = ref(false);
const yearlyVisible = ref(false);
const fieldVisible = ref(false);
const yearFieldVisible = ref(false);
const showMonthly = ref(false);
const showYearly = ref(false);
const date = ref('');
const selectedMonth = ref(0);
const selectedYear = ref(0);

// const changeDateFormat = (dateString) => {
//     const dateObject = new Date(dateString);

//     const year = dateObject.getFullYear();
//     const month = String(dateObject.getMonth() + 1).padStart(2, '0');
//     const day = String(dateObject.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
// };

const getMonthYear = (dateString) => {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    // const day = String(dateObject.getDate()).padStart(2, '0');

    // return `${year}-${month}-${day}`;
    console.log('year', year, 'month', month);
    selectedMonth.value = month;
    selectedYear.value = year;
};

const getYear = (dateString) => {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    // const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    // const day = String(dateObject.getDate()).padStart(2, '0');

    // return `${year}-${month}-${day}`;
    console.log('year', year);
    // selectedMonth.value = month;
    selectedYear.value = year;
};

const getTimeWorked = async () => {
    // const now = new Date();
    try {
        if (!attendanceData?.value?.employee?.id) {
            console.log('Employee not selected');
            return;
        }
        const formData = {
            date: attendanceData?.value?.date
            // changeDateFormat(now)
        };
        let url = `${baseURL}/attendance/time-worked/${attendanceData?.value?.employee?.id}`;

        const urlParams = new URLSearchParams(formData).toString();
        url += `?${urlParams}`;

        const { data } = await fetchDataWithPayload(url, false);
        // console.log('Attendance', data);
        timeWorked.value = data;
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    if (!attendanceStore?.getAttendanceData()) {
        router.push('/attendance');
    } else {
        getTimeWorked();
        // console.log('attendance exists', getTimeWorked());
    }
});
const handleMonth = () => {
    // month.value=changeDateFormat(date.value)
    getMonthYear(date.value);
    fieldVisible.value = false;
    monthlyVisible.value = true;
    showMonthly.value = true;
    showYearly.value = false;
};
const handleYear = () => {
    // month.value=changeDateFormat(date.value)
    getYear(date.value);
    yearFieldVisible.value = false;
    monthlyVisible.value = true;
    showYearly.value = true;
    showMonthly.value = false;
};
const closeReportModals = () => {
    monthlyVisible.value = false;
    yearlyVisible.value = false;
    showYearly.value = false;
    showMonthly.value = false;

};
</script>
<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="monthlyVisible = true" /> -->
        <Dialog
            v-model:visible="monthlyVisible"
            maximizable
            modal
            :header="attendanceData?.employee?.firstName + ' ' + attendanceData?.employee?.lastName + ' monthly attendance'"
            :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <MonthlyAttendance v-if="showMonthly" :attendanceData="attendanceData" :month="selectedMonth" :year="selectedYear" />
            <YearlyAttendance v-if="showYearly" :attendanceData="attendanceData" :year="selectedYear" />

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="closeReportModals"></Button>
                <!-- <Button type="button" label="Save" @click="closeReportModals"></Button> -->
            </div>
        </Dialog>
    </div>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="fieldVisible = true" /> -->
        <Dialog v-model:visible="fieldVisible" modal header="Get Monthly Attendance" :style="{ width: '25rem' }">
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Month</label>
                <Calendar v-model="date" view="month" dateFormat="mm/yy" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="fieldVisible = false"></Button>
                <Button type="button" label="submit" @click="handleMonth"></Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="yearFieldVisible" modal header="Get Yearly Attendance" :style="{ width: '25rem' }">
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Year</label>
               <Calendar v-model="date" view="year" dateFormat="yy" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="yearFieldVisible = false"></Button>
                <Button type="button" label="submit" @click="handleYear"></Button>
            </div>
        </Dialog>
    </div>
    <div class="grid p-fluid">
        <div class="col-12 md:col-4">
            <div class="card" style="display: flex; align-items: center; justify-content: center">
                <div class="profileContainer_">
                    <div class="mb-4">
                        <img :src="profileImageUrl" alt="Profile Picture" style="border-radius: 100%; width: 100px; height: 100px; margin-left: 20px" />
                    </div>

                    <p class="text-lg font-semibold mb-4">{{ attendanceData?.employee?.firstName }} {{ attendanceData?.employee?.lastName }}</p>
                    <p class="text-lg font-semibold mb-4">{{ attendanceData?.employee?.email }}</p>
                    <div>
                        <Button @click="fieldVisible = true" type="button" class="text-white font-bold py-1 px-2 rounded" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                            <span class="text-sm">Monthly</span>
                        </Button>
                        <Button @click="yearFieldVisible = true" type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" style="width: 5rem">
                            <span class="text-sm">Yearly</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div class="card">
                <h5>Attendance</h5>
                <div class="semiBio">
                    <p class="bioTitle">Time worked</p>
                    <p class="bioValue">{{ timeWorked }}</p>
                </div>

                <div class="semiBio">
                    <p class="bioTitle">Clocked In</p>
                    <p class="bioValue">{{ attendanceData?.timeIn }}</p>
                </div>

                <div class="semiBio">
                    <p class="bioTitle">Clocked Out</p>
                    <p class="bioValue">{{ attendanceData?.timeOut }}</p>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-8">
            <div class="card">
                <h5>Breaks</h5>
                <DataTable :value="attendanceData?.attendanceBreakList" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column :sortable="true" field="date" header="Date" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.date[0] }}-{{ data.date[1] }}-{{ data.date[2] }} </template>
                    </Column>
                    <Column :sortable="true" field="startTime" header="Start" style="min-width: 12rem">
                        <template #body="{ data }"> {{ data?.endTime }}</template>
                    </Column>
                    <Column :sortable="false" field="endTime" header="End" style="min-width: 9rem">
                        <template #body="{ data }"> {{ data.endTime }} </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <h5>Overtime Requests</h5>
                <DataTable :value="attendanceData?.attendanceOvertimeList" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column :sortable="true" field="date" header="Date" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.date[0] }}-{{ data.date[1] }}-{{ data.date[2] }} </template>
                    </Column>
                    <Column :sortable="true" field="startTime" header="Start" style="min-width: 12rem">
                        <template #body="{ data }"> {{ data?.endTime }}</template>
                    </Column>
                    <Column :sortable="false" field="endTime" header="End" style="min-width: 9rem">
                        <template #body="{ data }"> {{ data.endTime }} </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<style>
.bioTitle {
    font-size: 12px;
    color: #523c3c;
    margin-bottom: -1px;
    font-size: 12px;
}
.bioValue {
    font-weight: 500;
}
.semiBio {
    background: #eee;
    border-radius: 10px;
    padding: 10px 10px;
    margin-bottom: 10px;
}
.updateProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
}
.deleteProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;

    /* width: 200px; */
}
.profileContainer {
    /* margin-left:15% */
}
</style>
