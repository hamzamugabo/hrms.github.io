<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'primevue/chart';
import { fetchData } from '@/components/reuseables/FetchPostData';

const props = defineProps(['attendanceFrame', 'url', 'chartDataObject']);
console.log('url', props?.url);
const chartData = ref(null);
const chartOptions = ref({
    scales: {
        y: {
            beginAtZero: true
        }
    }
});

const fetchDataTimeFrameAttendance = async () => {
    try {
        const { data } = await fetchData(props?.url, false);
      
        console.log('data from att', data);
        chartData.value = {
            labels: data?.map((entry) => entry.date),
            datasets: [
                {
                    label: 'Average Break Duration',
                    borderColor: '#42A5F5',
                    data: data?.map((entry) => entry.breakCount),
                    fill: false
                },
                {
                    label: 'Total Attendance',
                    borderColor: '#66BB6A',
                    data: data?.map((entry) => entry.attendanceCount),
                    fill: false
                },
                {
                    label: 'Average Overtime Duration',
                    borderColor: '#FFA726',
                    data: data?.map((entry) => entry.overtimeCount),
                    fill: false
                }
            ]
        };
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchDataTimeFrameAttendance();
});

watch(
    () => props.attendanceFrame,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            fetchDataTimeFrameAttendance();
        }
    }
);
watch(
    () => props.url,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            fetchDataTimeFrameAttendance();
        }
    }
);
</script>

<template>
    <div>
        <!-- <h3>Attendance Data</h3> -->
         <div class="chart-container_">
        <Chart v-if="chartData" type="line" :data="chartData" :options="chartOptions" />
        <div v-else>Loading...</div>
    </div>
    </div>
</template>
