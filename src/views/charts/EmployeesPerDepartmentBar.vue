<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps(['label', 'lables', 'data']);

const chartData = ref({});
const chartOptions = ref({});

const setChartData = () => {
    const labels = props?.lables;
    const data = props?.data;

    return {
        labels,
        datasets: [
            {
                label: props?.label,
                data,
                backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgba(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'],
                borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                borderWidth: 1
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary,
                    stepSize: 5,
                    callback: (value) => {
                        return (value % 10 === 0) ? value : '';
                    }
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
};

watch(
    () => props.data,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            chartData.value = setChartData();
            chartOptions.value = setChartOptions();
        }
    }
);

onMounted(async () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="card " style="height:19rem">
        <h6>Employees per department</h6>
        <div class="chart-container_" >
        <Chart type="bar" :data="chartData" :options="chartOptions" />
    </div>
    </div>
</template>
