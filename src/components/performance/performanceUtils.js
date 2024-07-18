import { ref } from 'vue';
import { baseURL, fetchData, baseAUTHURL } from '@/components/reuseables/FetchPostData';
export const usePerformanceUtils = () => {
    const loading = ref(false);

    const getOrganisationObjectives = async (objectives) => {
        const url = `${baseURL}/organizationalObjective`;

        try {
            const { data } = await fetchData(url, loading);

            objectives.value = data;
        } catch (error) {
            objectives.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getOrganisationObjectiveById = async (id) => {
        const url = `${baseURL}/organizationalObjective/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };

    const getDepartmentObjectives = async (objectives) => {
        const url = `${baseURL}/departmentObjective`;

        try {
            const { data } = await fetchData(url, loading);
            // console.log('department objective', data);
            if (Array.isArray(data) && data.length > 0) {
                let allDepartmentObjectives = await Promise.all(
                    data.map(async (element) => {
                        const organisation = await getOrganisationObjectiveById(element?.organizationalObjectiveId);

                        return {
                            ...element,
                            organisationObjectiveName: organisation?.name,
                            organisationObjectiveDescription: organisation?.description
                        };
                    })
                );

                objectives.value = allDepartmentObjectives;
            } else {
                objectives.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            objectives.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getDepartmentObjectivById = async (id) => {
        const url = `${baseURL}/departmentObjective/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getPerformanceAgreements = async (agreements) => {
        const url = `${baseURL}/performance_agreement`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allAgreements = await Promise.all(
                    data.map(async (element) => {
                        const employee = await getEmployeeById(element?.employeeId);

                        const supervisor = await getEmployeeById(element?.supervisorId);

                        return {
                            ...element,
                            employeeName: `${employee?.firstName} ${employee?.lastName}`,
                            supervisorName: `${supervisor?.firstName} ${supervisor?.lastName}`
                        };
                    })
                );
                // console.log('performance agreement', allAgreements);
                agreements.value = allAgreements;
            } else {
                agreements.value = []; // Handle case where data is not an array or is empty
            }
            // agreements.value = data;
        } catch (error) {
            agreements.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getPerformanceAgreementById = async (id) => {
        const url = `${baseURL}/performance_agreement/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching agreement:', error);
            // Handle errors here
        }
    };
    const getIndividualObjectives = async (objectives) => {
        const url = `${baseURL}/objective/individual`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('individual objective', data);
            if (Array.isArray(data) && data.length > 0) {
                let allIndividualObjectives = await Promise.all(
                    data.map(async (element) => {
                        const departmentObjective = await getDepartmentObjectivById(element?.departmentObjectiveId);
                        const agreement = await getPerformanceAgreementById(element?.performanceAgreementId);
                        const employee = await getEmployeeById(element?.employeeId);
                        return {
                            ...element,
                            employee: `${employee?.firstName} ${employee?.lastName}` || '',
                            departmentObjective: departmentObjective?.name || '',
                            performanceAgreement: agreement[0] || {}
                            // organisationObjectiveDescription: organisation?.description
                        };
                    })
                );
console.log('allIndividualObjectives', allIndividualObjectives)
                objectives.value = allIndividualObjectives;
            } else {
                objectives.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            objectives.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getAppraisals = async (stateData) => {
        const url = `${baseURL}/appraisal`;

        try {
            const { data } = await fetchData(url, loading);
            // console.log('appraisals', data);
            if (Array.isArray(data) && data.length > 0) {
                let allIndividualObjectives = await Promise.all(
                    data.map(async (element) => {
                        const agreement = await getPerformanceAgreementById(element?.performanceAgreementId);
                        console.log('agreement', agreement)
                        const employee = await getEmployeeById(element?.employeeId);
                        const supervisor = await getEmployeeById(element?.supervisorId);
                        return {
                            ...element,
                            employee: `${employee?.firstName} ${employee?.lastName}` || '',
                            supervisor: `${supervisor?.firstName} ${supervisor?.lastName}` || '',
                            performanceAgreement: agreement[0] || {}
                            // organisationObjectiveDescription: organisation?.description
                        };
                    })
                );

                stateData.value = allIndividualObjectives;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getAppraisalById = async (id) => {
        if (!id) {
            console.log('missing  id');
            return;
        }
        const url = `${baseURL}/appraisal/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);
            return data;
        } catch (error) {
            console.error('Error fetching employee:', error);
            // Handle errors here
        }
    };
    const getEmployeeById = async (employeeId) => {
        if (!employeeId) {
            console.log('missing employee id');
            return;
        }
        const url = `${baseURL}/employees/by-id/${employeeId}`;

        try {
            const { data } = await fetchData(url, loading);
            return data;
        } catch (error) {
            console.error('Error fetching employee:', error);
            // Handle errors here
        }
    };
    const getPerformanceMetrics = async (metrics) => {
        const url = `${baseURL}/performance-metrics`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('res data', data);

            metrics.value = data;
            if (Array.isArray(data) && data.length > 0) {
                let allIndividualObjectives = await Promise.all(
                    data.map(async (element) => {
                        const agreement = await getPerformanceAgreementById(element?.performanceAgreementId);
                        console.log('agreement', agreement);
                        const appraisal = await getAppraisalById(element?.appraisalId);

                        return {
                            ...element,
                            agreement: agreement,
                            appraisal: appraisal
                        };
                    })
                );

                metrics.value = allIndividualObjectives;
            } else {
                metrics.value = []; // Handle case where data is not an array or is empty
            }
        } catch (error) {
            metrics.value = [];
            console.error('Error fetching data:', error);
            // Handle errors here
        }
    };
    const getPerformanceMetricById = async (id) => {
        const url = `${baseURL}/performance-metrics/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const getAppraisalResults = async (stateData) => {
        const url = `${baseAUTHURL}/appraisal/result`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('appraisal results', data);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const agreement = await getPerformanceAgreementById(element?.performanceAgreementId);
                        const employee = await getEmployeeById(element?.employeeId);
                        const supervisor = await getEmployeeById(element?.supervisorId);
                        const appraisal = await getAppraisalById(element?.appraisalId);
                        return {
                            ...element,
                            employee: `${employee?.firstName} ${employee?.lastName}` || '',
                            supervisor: `${supervisor?.firstName} ${supervisor?.lastName}` || '',
                            performanceAgreement: agreement[0] || {},
                            appraisal: appraisal?.appraisalPhase
                            // organisationObjectiveDescription: organisation?.description
                        };
                    })
                );
                console.log('appraisal results allData', allData);

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getAppraisalAppeals = async (stateData) => {
        const url = `${baseURL}/appraisal/result`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('appraisal appeals', data);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const employee = await getEmployeeById(element?.employeeId);
                        const supervisor = await getEmployeeById(element?.supervisorId);
                        const appraisal = await getAppraisalById(element?.appraisalId);
                        return {
                            ...element,
                            employee: `${employee?.firstName} ${employee?.lastName}` || '',
                            supervisor: `${supervisor?.firstName} ${supervisor?.lastName}` || '',
                            appraisal: appraisal?.appraisalPhase
                            // organisationObjectiveDescription: organisation?.description
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getNominations = async (stateData) => {
        const url = `${baseURL}/nomination`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('nomination', data);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const nominee = await getEmployeeById(element?.nomineeId);
                        const nominator = await getEmployeeById(element?.nominatorId);
                        // const employee = await getEmployeeById(element?.employeeId);
                        return {
                            ...element,
                            nominee: `${nominee?.firstName} ${nominee?.lastName}` || '',
                            nominator: `${nominator?.firstName} ${nominator?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getNominationById = async (id) => {
        if (!id) {
            console.log('missing  id');
            return;
        }
        const url = `${baseURL}/nomination/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            // Handle errors here
        }
    };
    const getRewards = async (stateData) => {
        const url = `${baseURL}/reward`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('reward', data);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const employee = await getEmployeeById(element?.employeeId);
                        const nomination = await getNominationById(element?.nominationId);
                        // const employee = await getEmployeeById(element?.employeeId);
                        return {
                            ...element,
                            employee: `${employee?.firstName} ${employee?.lastName}` || '',
                            criteria: nomination?.recognitionCriteria || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };

    const getEmployeeBehavioralMetric = async (stateData) => {
        const url = `${baseURL}/performance_metric/employee_behavioral`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getSupervisorBehavioralMetric = async (stateData) => {
        const url = `${baseURL}/performance_metric/supervisor_behavioral`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getEmployeeCustomerMetric = async (stateData) => {
        const url = `${baseURL}/performance_metric/customer/create`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };

    const getSupervisorCustomerMetric = async (stateData) => {
        const url = `${baseURL}/performance_metric/supervisor_customerperformance_metric/customer/create`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };

    const getInternalProcessMetric = async (stateData) => {
        const url = `${baseAUTHURL}/performance_metric/internal_process`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    const getSupervisorInternalProcessMetric = async (stateData) => {
        const url = `${baseURL}/performance_metric/supervisor_internal_process`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };

    const getLearnGrowth = async (stateData) => {
        const url = `${baseURL}/performance_metric/learning_and_growth`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };

    const getFinancialMetric = async (stateData) => {
        const url = `${baseURL}/performance_metric/financial`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };

    const getSupervisorFinancialMetric = async (stateData) => {
        const url = `${baseURL}/performance_metric/supervisor_financial`;

        try {
            const { data } = await fetchData(url, loading);

            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const performanceMetric = await getPerformanceMetricById(element?.performanceMetricId);
                        const performanceAgreement = await getPerformanceAgreementById(performanceMetric?.performanceAgreementId);
                        const employee = await getEmployeeById(performanceAgreement?.employeeId);

                        return {
                            ...element,
                            performanceMetricMetricCategory: performanceMetric?.metricCategory,
                            employee: `${employee?.firstName} ${employee?.lastName}` || ''
                        };
                    })
                );

                stateData.value = allData;
            } else {
                stateData.value = []; // Handle case where data is not an array or is empty
            }
            // objectives.value = data;
        } catch (error) {
            stateData.value = [];
            console.error('Error fetching objectives:', error);
            // Handle errors here
        }
    };
    return {
        getOrganisationObjectives,
        getOrganisationObjectiveById,
        getDepartmentObjectives,
        getDepartmentObjectivById,
        getPerformanceAgreements,
        getIndividualObjectives,
        getAppraisals,
        getPerformanceMetrics,
        getAppraisalResults,
        getAppraisalAppeals,
        getNominations,
        getRewards,
        getEmployeeBehavioralMetric,
        getEmployeeCustomerMetric,
        getInternalProcessMetric,
        getLearnGrowth,
        getSupervisorBehavioralMetric,
        getFinancialMetric,
        getSupervisorFinancialMetric,
        getSupervisorInternalProcessMetric,
        getSupervisorCustomerMetric
    };
};
