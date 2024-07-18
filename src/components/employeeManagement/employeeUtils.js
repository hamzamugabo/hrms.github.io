import { fetchData, postData, baseURL, baseAUTHURL } from '@/components/reuseables/FetchPostData.js';
import loadFromLocalStorage from '@/components/reuseables/getUser.js';

export const useEmployee = () => {
    // const baseURL = 'your_base_url_here';

    const getEmployeeById = async (employeeId, employeeInfor, loading) => {
        if (!employeeId) {
            console.log('missing employee id');
            return;
        }
        const url = `${baseURL}/employees/by-id/${employeeId}`;

        try {
            const { data } = await fetchData(url, loading);
            employeeInfor.value = data;
        } catch (error) {
            console.error('Error fetching employee:', error);
            // Handle errors here
        }
    };

    const getEmployeeDependants = async (employeeId, employeeDependants, loading) => {
        const url = `${baseURL}/employees/dependent/by-employeeId/${employeeId}`;
        if (!employeeId) {
            console.log('missing employee id');
            return;
        }
        try {
            const { data } = await fetchData(url, loading);
            employeeDependants.value = data;
        } catch (error) {
            console.error('Error fetching employee dependants:', error);
            // Handle errors here
        }
    };

    const getEmployeeNextOfKins = async (employeeId, employeeNextOfKins, loading) => {
        const url = `${baseURL}/employees/next-of-kin/by-employeeId/${employeeId}`;
        if (!employeeId) {
            console.log('missing employee id');
            return;
        }
        try {
            const { data } = await fetchData(url, loading);
            employeeNextOfKins.value = data;
        } catch (error) {
            console.error('Error fetching employee next of kins:', error);
            // Handle errors here
        }
    };

    const getEmployeeExperience = async (employeeId, employeeExperience, loading) => {
        const url = `${baseURL}/employees/experience/by-EmployeeId/${employeeId}`;
        if (!employeeId) {
            console.log('missing employee id');
            return;
        }

        try {
            const { data } = await fetchData(url, loading);
            console.log('employee experience', data)
            employeeExperience.value = data;
        } catch (error) {
            console.error('Error fetching employee experience:', error);
            // Handle errors here
        }
    };

    const getNationality = async (nationalityId, nationality, nationalityError, loading) => {
        if (!nationalityId) {
            console.log('missing nationality id');
            return;
        }
        const url = `${baseURL}/nationality/by-id/${nationalityId}`;

        try {
            const { data } = await fetchData(url, loading);
            nationality.value = data?.name;
        } catch (error) {
            nationalityError.value = error;
            console.error('Error fetching nationality:', error);
        }
    };

    const getDepartment = async (departmentId, department, departmentError, loading) => {
        if (!departmentId) {
            console.log('missing department id');
            return;
        }
        const url = `${baseURL}/department/by-id/${departmentId}`;

        try {
            const { data } = await fetchData(url, loading);
            department.value = data?.name;
        } catch (error) {
            departmentError.value = error;
            console.error('Error fetching department:', error);
        }
    };

    const getProfilePicture = async (employeeId, profilePhoto, loading) => {
        if (!employeeId) {
            console.log('missing employee id');
            return;
        }
        const url = `${baseURL}/employees/display-profile-picture/${employeeId}`;

        try {
            if (url && employeeId) {
                const data = await fetchData(url, loading);
                console.log('profilePhoto', data);

                // employees.value = data;
                profilePhoto.value = data;
            }
        } catch (error) {
            // departmentError.value = error;
            console.log('get profile picture', error);
            // console.error('Error searching employees:', error.message);
        }
    };

    const getEductionQualifications = async (employeeId, educationQualifications, departmentError, loading) => {
        const url = `${baseURL}/employees/qualifications/by-employeeId/${employeeId}`;

        try {
            const { data } = await fetchData(url, loading);
            educationQualifications.value = data;
        } catch (error) {
            departmentError.value = error;
            console.error('Error fetching education qualifications:', error);
        }
    };

    const addEmployeeNextOfKin = async (employeeNextOfKinDetails, employeeId, employeeNextOfKins, loadingAddNextOfKin, successMessageAddNextOfKin, addNextOfKinError, successAddNextOfKin) => {
        const formData = {
            email: employeeNextOfKinDetails?.value?.email,
            employeeId: employeeId,
            firstName: employeeNextOfKinDetails?.value?.firstName,
            lastName: employeeNextOfKinDetails?.value?.lastName,
            phoneNumber: employeeNextOfKinDetails?.value?.phoneNumber,
            physicalAddress: employeeNextOfKinDetails?.value?.physicalAddress,
            relationship: employeeNextOfKinDetails?.value?.relationship
        };

        loadingAddNextOfKin.value = true;
        try {
            const url = `${baseURL}/employees/next-of-kin/create`;
            const data = await postData(url, formData, loadingAddNextOfKin);

            if (data?.status === 200 || data?.status === 201) {
                successMessageAddNextOfKin.value = data?.message;
                loadingAddNextOfKin.value = false;
                successAddNextOfKin.value = true;
                getEmployeeNextOfKins(employeeId, employeeNextOfKins, false);
            } else {
                loadingAddNextOfKin.value = false;
                addNextOfKinError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            loadingAddNextOfKin.value = false;
            console.error('Error adding next of kin:', error);
        }
    };

    const updateEmployeeNextOfKin = async (id, employeeNextOfKinDetails, loadingAddNextOfKin, successMessageAddNextOfKin, addNextOfKinError, successAddNextOfKin, employeeId, employeeNextOfKins) => {
        loadingAddNextOfKin.value = true;
        const formData = {
            email: employeeNextOfKinDetails?.value?.email,
            id: id,
            firstName: employeeNextOfKinDetails?.value?.firstName,
            lastName: employeeNextOfKinDetails?.value?.lastName,
            phoneNumber: employeeNextOfKinDetails?.value?.phoneNumber,
            physicalAddress: employeeNextOfKinDetails?.value?.physicalAddress,
            relationship: employeeNextOfKinDetails?.value?.relationship
        };

        try {
            const url = `${baseURL}/employees/next-of-kin/update`;
            const data = await postData(url, formData, loadingAddNextOfKin);

            if (data?.status === 200 || data?.status === 201) {
                successMessageAddNextOfKin.value = data?.message;
                loadingAddNextOfKin.value = false;
                successAddNextOfKin.value = true;
                getEmployeeNextOfKins(employeeId, employeeNextOfKins, false);
            } else {
                loadingAddNextOfKin.value = false;
                addNextOfKinError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            loadingAddNextOfKin.value = false;
            console.error('Error updating next of kin:', error);
        }
    };

    const addEmployeeDependant = async (employeeDependantDetails, employeeId, employeeDependants, loadingAddDependant, successMessageAddDependant, addDependantError, successAddDependant) => {
        loadingAddDependant.value = true;
        const formData = {
            employeeId: employeeId,
            name: `${employeeDependantDetails?.value?.firstName} ${employeeDependantDetails?.value?.lastName}`,
            phoneNumber: employeeDependantDetails?.value?.phoneNumber
        };
        try {
            const url = `${baseURL}/employees/dependent/create`;
            const data = await postData(url, formData, loadingAddDependant);

            if (data?.status === 200 || data?.status === 201) {
                successMessageAddDependant.value = data?.message;
                loadingAddDependant.value = false;
                successAddDependant.value = true;
                getEmployeeDependants(employeeId, employeeDependants, false);
            } else {
                loadingAddDependant.value = false;
                addDependantError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            loadingAddDependant.value = false;
            console.error('Error adding dependant:', error);
        }
    };

    const updateEmployeeDependant = async (id, employeeDependantDetails, loadingAddDependant, successAddDependant, successMessageAddDependant, addDependantError, employeeId, employeeDependants) => {
        loadingAddDependant.value = true;
        const formData = {
            id: id,
            name: `${employeeDependantDetails?.value?.firstName} ${employeeDependantDetails?.value?.lastName}`,
            phoneNumber: employeeDependantDetails?.value?.phoneNumber
        };

        try {
            const url = `${baseURL}/employees/dependent/update`;
            const data = await postData(url, formData, loadingAddDependant);
            if (data?.status === 200 || data?.status === 201) {
                successMessageAddDependant.value = data?.message;
                loadingAddDependant.value = false;
                successAddDependant.value = true;
                getEmployeeDependants(employeeId, employeeDependants, false);
            } else {
                loadingAddDependant.value = false;
                addDependantError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            loadingAddDependant.value = false;
            console.error('Error updating dependant:', error);
        }
    };

    const postDataUpload = async (url, payload, loading) => {
        try {
            const accessToken = loadFromLocalStorage()?.accessToken;
            if (!accessToken) {
                throw new Error('Access token not found.');
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: payload // Send payload directly
            });

            if (response.ok) {
                const data = await response.json();
                if (data?.status === 200 || data?.status === 201) {
                    console.log('Data:', data);
                    return data; // Return the data if successful
                } else {
                    console.error('Invalid response:', data?.message);
                    return data;
                    // throw new Error('Invalid response status.');
                }
            } else {
                const data = await response.json();
                console.error('Error response:', data);
                throw new Error(`Request failed with status ${response?.status}: ${data?.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error for handling in the calling function
        } finally {
            if (loading) {
                loading.value = false; // Assuming loading is a ref and needs to be set to false
            }
        }
    };

    const getEmployeeDutyStation = async (dutyStation, employeeId) => {
        const url = `${baseAUTHURL}/duty-station/dutyStation/${employeeId}`;

        try {
            const { data } = await fetchData(url, false);
            // console.log('employee duty station', data)
            dutyStation.value = data;
        } catch (error) {
            // dut.value = error;
            console.error('Error fetching education qualifications:', error);
        }
    };
    const getDutyStationById = async (dutyStationId, dutyStation) => {
        const url = `${baseAUTHURL}/duty-station/by-id/${dutyStationId}`;

        try {
            const { data } = await fetchData(url, false);
            dutyStation.value = data;
        } catch (error) {
            // dut.value = error;
            console.error('Error fetching education qualifications:', error);
        }
    };
    const getEmployees = async (employees, loading) => {
        const url = `${baseURL}/employees`;

        try {
            const { data } = await fetchData(url, loading);
            employees.value = data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Handle errors here
        }
    };
    const getSupervisors = async (supervisors, loading) => {
        const url = `${baseURL}/employees`;

        try {
            const { data } = await fetchData(url, loading);
            supervisors.value = data;
        } catch (error) {
            console.error('Error fetching supervisors:', error);
            // Handle errors here
        }
    };

    return {
        getEmployeeById,
        getEmployeeDependants,
        getEmployeeNextOfKins,
        getEmployeeExperience,
        getNationality,
        getDepartment,
        getProfilePicture,
        getEductionQualifications,
        addEmployeeNextOfKin,
        updateEmployeeNextOfKin,
        addEmployeeDependant,
        updateEmployeeDependant,
        postDataUpload,
        getEmployeeDutyStation,
        getDutyStationById,
        getEmployees,
        getSupervisors
    };
};
