<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { baseURL, fetchDataWithPayload } from '@/components/reuseables/FetchPostData.js';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

const router = useRouter();
// const profileImageUrl = ref('https://via.placeholder.com/150');
const props = defineProps(['attendanceData', 'month', 'year']);

// const timeWorked = ref('');
const filters = ref(null);
const attendances = ref([]);
const loading = ref(false);

// const changeDateFormat = (dateString) => {
//     const dateObject = new Date(dateString);

//     const year = dateObject.getFullYear();
//     const month = String(dateObject.getMonth() + 1).padStart(2, '0');
//     const day = String(dateObject.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
// };

const getTimeWorked = async (date) => {
    // const now = new Date();
    try {
        if (!props?.attendanceData?.employee?.id) {
            console.log('Employee not selected');
            return;
        }
        const formData = {
            date
        };
        let url = `${baseURL}/attendance/time-worked/${props?.attendanceData?.employee?.id}`;

        const urlParams = new URLSearchParams(formData).toString();
        url += `?${urlParams}`;

        const { data } = await fetchDataWithPayload(url, false);
        console.log('Attendance time worked', data);
        return data;
    } catch (error) {
        console.log(error);
    }
};
const getAttendances = async () => {
    loading.value = true;
    // const now = new Date();
    try {
        if (!props?.attendanceData?.employee?.id) {
            console.log('Employee not selected');
            loading.value = false;

            return;
        }

        const formData = {
            year: parseInt(props?.year),
            // month: parseInt(props?.month)
        };
        let url = `${baseURL}/attendance/${props?.attendanceData?.employee?.id}/yearly`;

        const urlParams = new URLSearchParams(formData).toString();
        url += `?${urlParams}`;

        const { data } = await fetchDataWithPayload(url, false);
        const newAttendance = await Promise.all(
            data.map(async (element) => {
                const timeWorked = await getTimeWorked(element.date);
                return { ...element, timeWorked };
            })
        );

        console.log('Processed attendance data:', newAttendance);

        attendances.value = newAttendance;
        loading.value = false;
    } catch (error) {
        loading.value = false;

        console.log(error);
    }
};

onMounted(() => {
    if (!props?.attendanceData) {
        router.push('/attendance');
    } else {
        getAttendances();
        console.log('attendance exists');
    }
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        timeOut: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

// eslint-disable-next-line no-unused-vars
const clearFilter = () => {
    initFilters();
};
initFilters();
const getDayOfWeek = (selectedDate) => {
    if (!selectedDate) return;

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(selectedDate);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
};
</script>
<template>
    <div class="grid p-fluid">
        <div class="col-12 md:col-12">
            <div class="card">
                <h5>Yearly Attendance</h5>


                <DataTable v-model:filters="filters" :value="attendances" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['timeIn', 'timeOut']">
                    <template #header>
                        <div class="flex justify-content-between" style="width: 20%">
                            <!-- <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" /> -->
                            <IconField iconPosition="left">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No Attendances found. </template>
                    <template #loading> Loading Attendances data. Please wait. </template>

                    <Column :sortable="true" field="date" header="Date" style="min-width: 15rem">
                        <template #body="{ data }">
                            <div class="flex justify-center space-x-2">
                                <Button type="button" icon="pi pi-trash" class="text-black font-bold py-1 px-2 rounded" style="width: 3rem; margin-right: 5px; background-color: lightgrey; color: black; font-size: 12px">
                                    {{ getDayOfWeek(data?.date) }}
                                </Button>
                                <span class="py-1 px-2"> {{ data?.date }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column :sortable="false" field="timeIn" header="Time In" style="min-width: 15rem">
                        <template #body="{ data }"> {{ data.timeIn }} </template>
                    </Column>
                    <Column :sortable="false" field="timeOut" header="Time Out" style="min-width: 15rem">
                        <template #body="{ data }"> {{ data.timeOut }} </template>
                    </Column>
                    <Column :sortable="false" field="timeWorked" header="Hours Worked" style="min-width: 19rem">
                        <template #body="{ data }"> {{ data?.timeWorked }} </template>
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
