// import loadFromLocalStorage from '@/components/reuseables/getUser.js';
import { fetchData, baseURL, postData } from '@/components/reuseables/FetchPostData.js';
import changeDateFormat from '@/components/reuseables/changeDateFormat';

// import { useToastPopup } from '@/components/reuseables/useToast.js';

// const { showError, showSuccess } = useToastPopup();

export const utils = () => {
    const getAllowances = async (allowances, loading) => {
        loading.value = true;
        const url = `${baseURL}/allowance`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('allownaces b4', data);

            let allAllowances = await Promise.all(
                data?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId);

                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            console.log('allownaces after', data);

            allowances.value = allAllowances || [];
            loading.value = false;

            // Assign allAllowances to your reactive variable if needed
        } catch (error) {
            allowances.value = [];
            loading.value = false;

            // console.log('Error fetching requests:', error);
            // Handle errors here
        }
    };
    const getDeductions = async (deductions, loading) => {
        loading.value = true;
        const url = `${baseURL}/deduction`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('deduction===>', data);

            let allDeductions = await Promise.all(
                data?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId);

                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            deductions.value = allDeductions || [];
            loading.value = false;

            // Assign alldeductions to your reactive variable if needed
        } catch (error) {
            loading.value = false;

            console.error('Error fetching requests:', error);
            // Handle errors here
        }
    };
    const getNssfDeductions = async (deductions, loading) => {
        loading.value = true;
        const url = `${baseURL}/deduction`;

        try {
            const { data } = await fetchData(url, loading);
            // console.log('deduction', data);

            let allDeductions = await Promise.all(
                data?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId);

                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            deductions.value = allDeductions || [];
            loading.value = false;

            // Assign alldeductions to your reactive variable if needed
        } catch (error) {
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
    const searchByEmployeeId = async (allowances, employeeId, loading) => {
        try {
            const url = `${baseURL}/allowance/${employeeId}`;

            const { data } = await fetchData(url, loading);
            // console.log('data===>', data);
            let allRequests = await Promise.all(
                data?.allowances?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId, false);
                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            allowances.value = allRequests || [];
            // employees.value = data || [];
        } catch (error) {
            allowances.value = [];
            // Handle errors here
        }
    };
    const searchDeductionByEmployeeId = async (deductions, employeeId, loading) => {
        try {
            const url = `${baseURL}/deduction/by/${employeeId}`;

            const { data } = await fetchData(url, loading);
            // console.log('data===>', data);
            let allRequests = await Promise.all(
                data?.map(async (element) => {
                    const employee = await getEmployeeById(element?.employeeId, false);
                    return {
                        ...element,
                        employee: employee
                    };
                })
            );
            deductions.value = allRequests || [];
            // employees.value = data || [];
        } catch (error) {
            deductions.value = [];
            // Handle errors here
        }
    };
    const deleteAllowance = async (salary, allowances, generalError) => {
        if (!salary) {
            generalError.value = 'No Leave Request selected';
            return;
        }
        // console.log('designation');
        const url = `${baseURL}/salary/delete/${salary?.id}`;

        try {
            const data = await fetchData(url);
            if (!data?.data) {
                getAllowances(allowances, false);
            }
            console.log(data);
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
    const updateAllowance = async (allowanceDataToUpdate, allowanceData, allowances, successMessage, updateError, success, loading) => {
        updateError.value = '';

        try {
            let formData = {
                ...allowanceDataToUpdate.value,
                id: allowanceData?.value?.id
            };

            loading.value = true;
            let url = `${baseURL}/allowance/update`;

            if (allowanceData?.value?.allowanceType === 'OVERTIME') {
                url = `${baseURL}/allowance/update-overtime`;
                formData = {
                    employeeId: allowanceDataToUpdate.value?.employeeId,
                    endDate: allowanceDataToUpdate.value?.endDate,
                    gazettedDays: allowanceDataToUpdate.value?.gazettedDays,
                    id: allowanceData?.value?.id,
                    startDate: allowanceDataToUpdate.value?.startDate,
                    workingDays: allowanceDataToUpdate.value?.workingDays
                };
            } else if (allowanceData?.value?.allowanceType === 'TRANSFER') {
                url = `${baseURL}/allowance/update-transfer`;
                formData = {
                    employeeId: allowanceDataToUpdate.value?.employeeId,
                    endDate: allowanceDataToUpdate.value?.endDate,
                    id: allowanceData?.value?.id,
                    startDate: allowanceDataToUpdate.value?.startDate,
                    transferType: allowanceDataToUpdate.value?.transferType,
                    transportAllowance: allowanceDataToUpdate.value?.transportAllowance
                };
            } else if (allowanceData?.value?.allowanceType === 'TRAVEL_OUTSIDE') {
                url = `${baseURL}/allowance/update-travelOutside`;
                formData = {
                    allowanceSubType: allowanceDataToUpdate.value?.allowanceSubType,
                    employeeId: allowanceDataToUpdate.value?.employeeId,
                    endDate: allowanceDataToUpdate.value?.endDate,
                    id: allowanceData?.value?.id,
                    startDate: allowanceDataToUpdate.value?.startDate,
                    transportAllowance: allowanceDataToUpdate.value?.transportAllowance
                };
            } else {
                url = `${baseURL}/allowance/update`;
                formData = {
                    allowanceType: allowanceDataToUpdate.value?.allowanceType,
                    amount: allowanceDataToUpdate.value?.amount,
                    endDate: allowanceDataToUpdate.value?.endDate,
                    id: allowanceData?.value?.id,
                    startDate: allowanceDataToUpdate.value?.startDate
                };
            }

            console.log('allowance to update', formData);
            const data = await postData(url, formData, loading);
            if (data?.status === 200 || data?.status === 201) {
                successMessage.value = data?.message;

                loading.value = false;
                // showSuccess();
                success.value = true;
                loading.value = false;
                setTimeout(() => {
                    success.value = false;
                    successMessage.value = '';
                }, 1000);
                await getAllowances(allowances, loading);
                // return  data?.message;
            } else {
                // showError();
                updateError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            // showError();
            updateError.value = 'Failed';

            loading.value = false;
            console.log(error?.error);
        }
    };
    const updateDeduction = async (deductionDataToUpdate, deductionData, deductions, successMessage, updateError, success, loading) => {
        updateError.value = '';
        try {
            loading.value = true;
            let url = `${baseURL}/deduction/update`;
            if (deductionData?.value?.tinNumber) {
                url = `${baseURL}/deduction/update-paye`;
            } else if (deductionData?.value?.nssfNumber) {
                url = `${baseURL}/deduction/update-nssf`;
            }
            const formData = {
                ...deductionDataToUpdate.value,
                id: deductionData?.value?.id
            };
            const data = await postData(url, formData, loading);
            if (data?.status === 200 || data?.status === 201) {
                successMessage.value = data?.message;

                loading.value = false;

                success.value = true;
                setTimeout(() => {
                    success.value = false;
                    successMessage.value = '';
                }, 1000);
                // showSuccess();
                loading.value = false;
                await getDeductions(deductions, loading);
            } else {
                // showError();
                updateError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            // showError();
            updateError.value = 'Failed';
            loading.value = false;
            console.log(error?.error);
        }
    };
    const searchByDateRange = async (startDateSearch, endDateSearch, allowances, loading) => {
        try {
            const url = `${baseURL}/leave/request/date-range`;
            const queryParams = new URLSearchParams();
            queryParams.append('startDate', changeDateFormat(startDateSearch.value));
            queryParams.append('endDate', changeDateFormat(endDateSearch.value));
            const queryUrl = `${url}?${queryParams.toString()}`;
            const { data } = await fetchData(queryUrl, loading);
            console.log('search by range', data);
        } catch (error) {
            allowances.value = [];
            // Handle errors here
        }
    };

    return { getAllowances, getEmployeeById, getEmployees, searchByEmployeeId, deleteAllowance, searchEmployee, updateAllowance, searchByDateRange, getDeductions, getNssfDeductions, updateDeduction, searchDeductionByEmployeeId };
};
