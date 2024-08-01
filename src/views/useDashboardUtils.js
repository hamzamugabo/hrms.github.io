import { ref } from 'vue';
import { baseURL, baseAUTHURL, fetchAUTHData, fetchData, fetchDataWithPayload } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import loadFromLocalStorage from '@/components/reuseables/getUser';
export const useDashboardUtils = () => {
    const loading = ref(false);
    const tokenAuthValidation = async (router) => {
        const accessToken = loadFromLocalStorage()?.accessToken;

        const url = `${baseAUTHURL}/validate/${accessToken}`;
        // console.log('url',url)

        try {
            if (accessToken) {
                const data = await fetchAUTHData(url, loading, router);
                // console.log('token validation', 'status=>', data?.status, 'okay==>', data?.ok);
                return data;
                // if (data?.ok && data?.status === 200) {
                //     // If the route requires authentication and the user is not authenticated, redirect to login
                //     router.push('/');
                // } else {
                //     // Proceed to the requested route
                //     router.push('/auth/login');
                // }
            } else {
                router.push('/auth/login');
                console.log('no access token');
                return 'Token not available';
            }
        } catch (error) {
            // Handle errors here
        }
    };
    const getEmployeePayroll = async (employeeId) => {
        const url = `${baseURL}/payrolls/by-employeeId/${employeeId}`;
        try {
            const { data } = await fetchData(url, loading);
            return data || [];
        } catch (error) {
            console.log('employee payroll error', error);
            // Handle errors here
        }
    };

    const getEmployees = async (employees, originalEmployees) => {
        const url = `${baseURL}/employees`;
        loading.value = true;
        try {
            const { data } = await fetchData(url, loading);

            const allEmployees = await Promise.all(
                data.map(async (employee) => ({
                    ...employee,
                    name: `${employee.firstName} ${employee.lastName}`,
                    payroll: await getEmployeePayroll(employee?.id)
                }))
            );

            employees.value = allEmployees;
            originalEmployees.value = allEmployees;
        } catch (error) {
            console.log('employees error', error);
        } finally {
            loading.value = false;
        }
    };

    const getEmployeesPerDepartment = async (barData, barLabels, router) => {
        const url = `${baseURL}/employees/distribution/department`;
        loading.value = true;
        try {
            const { data } = await fetchData(url, loading, router);
            console.log('employees per department', data);

            barLabels.value = data?.map((department) => department.departmentName);
            barData.value = data?.map((department) => department.employeeCount);
        } catch (error) {
            console.log('employees per department error', error);
        } finally {
            loading.value = false;
        }
    };

    const getJobs = async (jobPosts) => {
        const url = `${baseURL}/job-posting`;
        loading.value = true;
        try {
            const { data } = await fetchData(url, loading);
            jobPosts.value = data?.length;
        } catch (error) {
            console.log('Job posting error', error);
        } finally {
            loading.value = false;
        }
    };

    const getAttendanceMonthlyFrames = async (attendanceTimeFrames, timeFrame) => {
        const url = `${baseURL}/attendance/trends/${timeFrame?.value?.name}`;
        loading.value = true;
        try {
            const { data } = await fetchData(url, loading);
            attendanceTimeFrames.value = data;
        } catch (error) {
            console.log('Attendance monthly frames error', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchDataTimeFrameAttendance = async (timeFrameUrlState, chartData) => {
        try {
            const { data } = await fetchData(timeFrameUrlState.value, false);
            console.log('data from att', data);
            chartData.value = {
                labels: data?.map((entry) => entry.date),
                datasets: [
                    {
                        label: 'Average Break Duration',
                        borderColor: '#42A5F5',
                        data: data?.map((entry) => entry.averageBreakDuration),
                        fill: false
                    },
                    {
                        label: 'Total Attendance',
                        borderColor: '#66BB6A',
                        data: data?.map((entry) => entry.totalAttendance),
                        fill: false
                    },
                    {
                        label: 'Average Overtime Duration',
                        borderColor: '#FFA726',
                        data: data?.map((entry) => entry.averageOvertimeDuration),
                        fill: false
                    }
                ]
            };
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getRequests = async (leaveRequests) => {
        const url = `${baseURL}/leave/request`;
        loading.value = true;
        try {
            const { data } = await fetchData(url, loading);
            leaveRequests.value = data?.length;
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            loading.value = false;
        }
    };

    const getAttenceMonthlyFrames = async (timeFrame, attendanceTimeFrames) => {
        const url = `${baseURL}/attendance/trends/${timeFrame?.value?.name}`;
        loading.value = true;
        try {
            const { data } = await fetchData(url, loading);
            console.log('===>', data);
            loading.value = false;
            attendanceTimeFrames.value = data;
        } catch (error) {
            loading.value = false;
            console.log('Job posting error', error);
            // Handle errors here
        }
    };

    const applyLightTheme = (lineOptions) => {
        lineOptions.value = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    };

    const applyDarkTheme = (lineOptions) => {
        lineOptions.value = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };
    };

    // watch(
    //     isDarkTheme,
    //     (val) => {
    //         if (val) {
    //             applyDarkTheme();
    //         } else {
    //             applyLightTheme();
    //         }
    //     },
    //     { immediate: true }
    // );
    const getAttendanceSummary = async (startDate, endDate, dataAttendance) => {
        try {
            const formData = {
                startDate: changeDateFormat(startDate),
                endDate: changeDateFormat(endDate)
            };
            let url = `${baseURL}/attendance/summary/daily`;

            const urlParams = new URLSearchParams(formData).toString();
            url += `?${urlParams}`;

            const { data } = await fetchDataWithPayload(url, loading);
            console.log('daily Attendance', data);
            dataAttendance.value = data;
        } catch (error) {
            console.log(error);
        }
    };
    return {
        getEmployeePayroll,
        getEmployees,
        getEmployeesPerDepartment,
        getJobs,
        getAttendanceMonthlyFrames,
        fetchDataTimeFrameAttendance,
        getRequests,
        getAttenceMonthlyFrames,
        applyLightTheme,
        applyDarkTheme,
        getAttendanceSummary,
        tokenAuthValidation
    };
};
