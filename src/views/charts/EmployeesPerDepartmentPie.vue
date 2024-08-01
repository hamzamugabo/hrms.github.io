<script setup>
import { ref, onMounted } from 'vue';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import { useRouter } from 'vue-router';
const router = useRouter();
const loading = ref(false);
const employees = ref([]);
const chartData = ref({});
const chartOptions = ref({});

const getEmployeesPerDepartment = async () => {
    loading.value = true;

    const url = `${baseURL}/employees/distribution/department`;

    try {
        const { data } = await fetchData(url, loading, router);
        loading.value = false;
        employees.value = data;
    } catch (error) {
        loading.value = false;
        console.log('employees per department error', error);
    }
};

const setChartData = () => {
    const labels = employees.value.map((department) => department.departmentName);
    const data = employees.value.map((department) => department.employeeCount);

    return {
        labels,
        datasets: [
            {
                label: 'Employees per Department',
                data,
                backgroundColor: [
                    'rgba(249, 115, 22, 0.2)',
                    'rgba(6, 182, 212, 0.2)',
                    'rgba(107, 114, 128, 0.2)',
                    'rgba(139, 92, 246, 0.2)'
                ],
                borderColor: [
                    'rgb(249, 115, 22)',
                    'rgb(6, 182, 212)',
                    'rgb(107, 114, 128)',
                    'rgb(139, 92, 246)'
                ],
                borderWidth: 1
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    return {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Employees',
                    color: textColor
                },
                ticks: {
                    color: textColor,
                    stepSize: 10,
                    callback: (value) => {
                        return (value % 10 === 0) ? value : '';
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Departments',
                    color: textColor
                },
                ticks: {
                    color: textColor
                }
            }
        }
    };
};

onMounted(async () => {
    await getEmployeesPerDepartment();
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="card" style="height: chart-container_">
        <h6>Employees per department</h6>
        <div class="chart-container_">
            <Chart type="bar" :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<style>
.chart-container_ {
    position: relative;
    height: calc(100% - 2rem); /* Adjust based on header height */
    margin-top: 1rem;
}
</style>
