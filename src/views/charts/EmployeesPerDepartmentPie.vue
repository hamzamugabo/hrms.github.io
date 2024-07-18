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
        // console.log('employees per department', data);
        loading.value = false;

        employees.value = data;
    } catch (error) {
        loading.value = false;

        console.log('employees per department error', error);
        // Handle errors here
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

    return {
        plugins: {
            legend: {
                labels: {
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
    <div class="card">
        <Chart type="pie" :data="chartData" :options="chartOptions" />
    </div>
</template>
