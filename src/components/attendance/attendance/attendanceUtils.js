import { baseURL, fetchData, fetchDataWithPayload } from '@/components/reuseables/FetchPostData';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
export const useAttendanceUtils = () => {
    const getMonthlyAttendances = async (monthYearSearchDate, attendances, loading) => {
        // loading.value = true;
        // const now = new Date();
        try {
            const dateObject = new Date(monthYearSearchDate.value);

            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0');

            const formData = {
                year,
                month
            };
            let url = `${baseURL}/attendance/monthly-report`;

            const urlParams = new URLSearchParams(formData).toString();
            url += `?${urlParams}`;

            const { data } = await fetchDataWithPayload(url, false);
            if (Array.isArray(data) && data.length > 0) {
                let allAttendances = await Promise.all(
                    data.map(async (element) => {
                        const employee = await getEmployeeById(element?.employeeId);

                        return {
                            ...element,
                            employee: employee,
                            hoursWorked: await getTimeWorked(employee?.id, element?.date)
                        };
                    })
                );

                attendances.value = allAttendances;
                loading.value = false;
            } else {
                attendances.value = [];
                loading.value = false;
            }
        } catch (error) {
            loading.value = false;

            console.log(error);
        }
    };
    const getTimeWorked = async (employeeId, date) => {
        // const now = new Date();
        try {
            if (!employeeId) {
                console.log('Employee not selected');
                return;
            }
            const formData = {
                date: date
                // changeDateFormat(now)
            };
            let url = `${baseURL}/attendance/time-worked/${employeeId}`;

            const urlParams = new URLSearchParams(formData).toString();
            url += `?${urlParams}`;

            const { data } = await fetchDataWithPayload(url, false);
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const getEmployeeById = async (id, loading) => {
        const url = `${baseURL}/employees/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);
            // console.log('employee', data);

            const employee = {
                id: data?.id,
                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.emailAddress,
                phoneNumber: data?.phoneNumber
            };

            return employee;
        } catch (error) {
            console.error('Error fetching employee:', error);
            // Handle errors here
        }
    };
    const searchByDateRange = async (attendances, startDateSearch, endDateSearch, loading) => {
        try {
            const url = `${baseURL}/attendance/date-range`;
            const queryParams = new URLSearchParams();
            queryParams.append('startDate', changeDateFormat(startDateSearch.value));
            queryParams.append('endDate', changeDateFormat(endDateSearch.value));
            const queryUrl = `${url}?${queryParams.toString()}`;
            const { data } = await fetchData(queryUrl, loading);

            console.log('search by range', data);

            let allAttendances = await Promise.all(
                data.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId);

                    return {
                        ...element,
                        employee: employee,
                        hoursWorked: await getTimeWorked(employee?.id, element?.date)
                    };
                })
            );

            attendances.value = allAttendances;
        } catch (error) {
            attendances.value = [];
            // Handle errors here
        }
    };
    const searchByEmployeeId = async (attendances, employeeId, loading) => {
        try {
            const url = `${baseURL}/attendance/by-employeeId/${employeeId.value?.id}`;

            const { data } = await fetchData(url, loading);
            console.log('Atendance by employee data===>', data);
            if (Array.isArray(data) && data.length > 0) {
                let allAttendances = await Promise.all(
                    data.map(async (element) => {
                        const employee = await getEmployeeById(element?.employeeId);

                        return {
                            ...element,
                            employee: employee,
                            hoursWorked: await getTimeWorked(employee?.id, element?.date)
                        };
                    })
                );

                attendances.value = allAttendances;
                loading.value = false;
            } else {
                attendances.value = [];
                loading.value = false;
            }
            // employees.value = data || [];
        } catch (error) {
            attendances.value = [];
            // Handle errors here
        }
    };
    return {
        getMonthlyAttendances,
        searchByDateRange,
        searchByEmployeeId
    };
};


