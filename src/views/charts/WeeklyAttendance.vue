<script setup>
import { ref, watch } from 'vue';

// Define props
const props = defineProps(['attendanceData']);

// Initialize chart data
const chartData = ref({
    labels: Object.keys(props?.attendanceData),
    datasets: [
        {
            label: 'On Time',
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            data: Object.values(props?.attendanceData).map((day) => day.onTimeCount)
        },
        {
            label: 'Late',
            backgroundColor: '#FFA726',
            borderColor: '#FFA726',
            data: Object.values(props?.attendanceData).map((day) => day.lateCount)
        },
        {
            label: 'Absent',
            backgroundColor: '#db0000',
            borderColor: '#db0000',
            data: Object.values(props?.attendanceData).map((day) => day.absentCount)
        }
    ]
});

// Define chart options
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            title: {
                display: true,
                text: 'Date'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Count'
            },
            beginAtZero: true,
            ticks: {
                stepSize: 10, // Set the interval between ticks
                callback: function (value) {
                    // Ensure ticks are only displayed for specific values
                    return (value % 10 === 0) ? value : '';
                },
                precision: 0 // Ensure no decimal points are shown
            }
        }
    }
});

// Watch for changes in attendanceData prop
watch(
    () => props.attendanceData,
    (newData) => {
        chartData.value.labels = Object.keys(newData);
        chartData.value.datasets[0].data = Object.values(newData).map((day) => day.onTimeCount);
        chartData.value.datasets[1].data = Object.values(newData).map((day) => day.lateCount);
        chartData.value.datasets[2].data = Object.values(newData).map((day) => day.absentCount);
    },
    { immediate: true }
);
</script>

<template>
    <div class="col-12 xl:col-6">
        <div class="card" style="height: 18rem">
            <h6>Weekly Attendance</h6>
            <div class="chart-container_">
            <Chart type="bar" :data="chartData" :options="chartOptions" />
        </div>
        </div>
    </div>
</template>

<style>
.attendance-value,
.attendance-label {
    flex: 1;
    margin-bottom: 5px;
}
</style>
