<script setup>
import { ref, onMounted, watch } from 'vue';
// import Chart from 'primevue/chart';
import { fetchData } from '@/components/reuseables/FetchPostData';

const props = defineProps(['attendanceFrame', 'url', 'chartDataObject']);
console.log('url', props?.url);

const chartData = ref(null);
const chartOptions = ref({
    scales: {
        y: {
            beginAtZero: true
        }
    },
    elements: {
        bar: {
            barPercentage: 0.1,  // Adjust this value to control the bar width
            categoryPercentage: 0.1  // Adjust this value to control the space between categories
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
                    backgroundColor: '#4CAF50',
                    borderColor: '#4CAF50',
                    data: data?.map((entry) => entry.averageBreakDuration),
                    fill: false
                },
                {
                    label: 'Total Attendance',
                    backgroundColor: '#db0000',
                    borderColor: '#db0000',
                    data: data?.map((entry) => entry.totalAttendance),
                    fill: false
                },
                {
                    label: 'Average Overtime Duration',
                    backgroundColor: '#cbd5e1',
                    borderColor: '#cbd5e1',
                    data: data?.map((entry) => entry.averageOvertimeDuration),
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
    <div style="height:18rem">
        <div class="chart-container_">
        <Chart type="bar" :data="chartData" :options="chartOptions" />
    </div>
    </div>
</template>
