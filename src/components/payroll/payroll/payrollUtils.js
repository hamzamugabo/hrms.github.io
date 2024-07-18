// import loadFromLocalStorage from '@/components/reuseables/getUser.js';
import { fetchData, baseURL, fetchDataWithPayload } from '@/components/reuseables/FetchPostData.js';
import changeDateFormat from '@/components/reuseables/changeDateFormat.js';

export const utils = () => {
    const getAllPayrolls = async (payrolls, loading) => {
        loading.value = true;
        const url = `${baseURL}/payrolls`;

        try {
            const { data } = await fetchData(url, loading);
            // console.log('allownaces', data);

            let allPayrolls = await Promise.all(
                data?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId);

                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            payrolls.value = allPayrolls || [];
            loading.value = false;

            // Assign allAllowances to your reactive variable if needed
        } catch (error) {
            payrolls.value = [];

            loading.value = false;

            console.error('Error fetching requests:', error);
            // Handle errors here
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
                lastName: data?.lastName
            };

            return employee;
        } catch (error) {
            console.error('Error fetching employee:', error);
            // Handle errors here
        }
    };
    const getEmployees = async (employees, loading) => {
        const url = `${baseURL}/employees`;
        try {
            const { data } = await fetchData(url, loading);
            // console.log(data)
            employees.value = data;
        } catch (error) {
            console.log('employees error', error);
            // Handle errors here
        }
    };
    const searchByEmployeeId = async (payrolls, employeeId, loading, employeePayroll) => {
        try {
            const url = `${baseURL}/payrolls/by-employeeId/${employeeId}`;

            const { data } = await fetchData(url, loading);
            employeePayroll.value = data;
            // console.log('data===>', data);
            let allPayrolls = await Promise.all(
                data?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId, false);
                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            payrolls.value = allPayrolls || [];
            // employees.value = data || [];
        } catch (error) {
            payrolls.value = [];
            // Handle errors here
        }
    };
    const deletePayroll = async (payroll, allowances, generalError) => {
        if (!payroll) {
            generalError.value = 'No Leave payroll selected';
            return;
        }
        // console.log('designation');
        const url = `${baseURL}/payrolls/delete/${payroll?.id}`;

        try {
            const data = await fetchData(url);
            if (!data?.data) {
                getAllPayrolls(allowances, false);
            }
            getAllPayrolls(allowances, false);
            // console.log(data);
        } catch (error) {
            // Handle errors here
        }
    };
    const searchEmployee = (event, autoFilteredEmployees, employees) => {
        if (!event.query.trim().length) {
            autoFilteredEmployees.value = employees?.value?.length > 0 ? [...employees.value] : [];
        } else {
            autoFilteredEmployees.value = employees.value.filter((employee) => {
                const firstNameMatches = employee.firstName.toLowerCase().startsWith(event.query.toLowerCase());
                const lastNameMatches = employee.lastName.toLowerCase().includes(event.query.toLowerCase());
                return firstNameMatches || lastNameMatches;
            });
        }
    };
    const searchByDateRange = async (payrolls, startDateSearch, endDateSearch, loading) => {
        try {
            const formData = {
                startDate: changeDateFormat(startDateSearch.value),
                endDate: changeDateFormat(endDateSearch.value)
            };
            let url = `${baseURL}/payrolls/generate-payroll`;

            const urlParams = new URLSearchParams(formData).toString();
            url += `?${urlParams}`;

            const { data } = await fetchDataWithPayload(url, loading);
            console.log('range search', data);
            let allPayrolls = await Promise.all(
                data?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId, false);
                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            payrolls.value = allPayrolls || [];
            // payrolls.value = data;
        } catch (error) {
            console.log(error);
        }
    };
    const getPayrollSummary = async (summary, loading) => {
        try {
            let url = `${baseURL}/payrolls/summary`;

            const { data } = await fetchData(url, loading);

            summary.value = data;
            // payrolls.value = data;
        } catch (error) {
            console.log(error);
        }
    };
    return { getAllPayrolls, getEmployeeById, getEmployees, searchByEmployeeId, deletePayroll, searchEmployee, searchByDateRange, getPayrollSummary };
};
