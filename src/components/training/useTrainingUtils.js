import { ref } from 'vue';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';

import { utils } from '@/components/payroll/allowances/allowanceUtils.js';

export const useTrainingUtils = () => {
    const loading = ref(false);
    const { getEmployeeById } = utils();
    const getCourses = async (responsData) => {
        const url = `${baseURL}/course`;

        try {
            const { data } = await fetchData(url, loading);

            responsData.value = data;
        } catch (error) {
            responsData.value = [];

            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getCourseByid = async (id) => {
        const url = `${baseURL}/course/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getTrainingModule = async (responsData) => {
        const url = `${baseURL}/modules`;

        try {
            const { data } = await fetchData(url, loading);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const course = await getCourseByid(element?.courseId);

                        return {
                            ...element,
                            courseTitle: course?.title
                        };
                    })
                );

                responsData.value = allData;
            } else {
                responsData.value = [];
            }
        } catch (error) {
            responsData.value = [];

            console.error('Error fetching======> :', error);
            // Handle errors here
        }
    };

    const getTrainingAssesment = async (responsData) => {
        const url = `${baseURL}/training/assessment`;

        try {
            const { data } = await fetchData(url, loading);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const course = await getCourseByid(element?.courseId);
                        const employee = await getEmployeeById(element?.employeeId);

                        return {
                            ...element,
                            courseTitle: course?.title,
                            employee: `${employee?.firstName} ${employee?.lastName}`
                        };
                    })
                );

                responsData.value = allData;
            } else {
                responsData.value = [];
            }
        } catch (error) {
            responsData.value = [];

            console.error('Error fetching======> :', error);
            // Handle errors here
        }
    };
    const getTrainingAssessmentByid = async (id) => {
        const url = `${baseURL}/training/assessment/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getTrainingQuestionByid = async (id) => {
        const url = `${baseURL}/questions/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getTrainingModuleById = async (id) => {
        const url = `${baseURL}/modules/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getTrainingQuestions = async (responsData) => {
        const url = `${baseURL}/questions`;

        try {
            const { data } = await fetchData(url, loading);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const assessment = await getTrainingAssessmentByid(element?.trainingAssessmentId);

                        return {
                            ...element,
                            assessment: assessment?.title
                        };
                    })
                );

                responsData.value = allData;
            } else {
                responsData.value = [];
            }
        } catch (error) {
            responsData.value = [];

            console.error('Error fetching======> :', error);
            // Handle errors here
        }
    };
    const getTrainingAnswers = async (responsData) => {
        const url = `${baseURL}/training_answer`;

        try {
            const { data } = await fetchData(url, loading);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const question = await getTrainingQuestionByid(element?.trainingQuestionId);

                        return {
                            ...element,
                            question: question?.questionText
                        };
                    })
                );

                responsData.value = allData;
            } else {
                responsData.value = [];
            }
        } catch (error) {
            responsData.value = [];

            console.error('Error fetching======> :', error);
            // Handle errors here
        }
    };

    const getLessons = async (responsData) => {
        const url = `${baseURL}/lessons`;

        try {
            const { data } = await fetchData(url, loading);
            if (Array.isArray(data) && data.length > 0) {
                let allData = await Promise.all(
                    data.map(async (element) => {
                        const module = await getTrainingModuleById(element?.trainingModuleId);

                        return {
                            ...element,
                            moduleTitle: module?.title
                        };
                    })
                );
                console.log('lessons', allData);
                responsData.value = allData;
            } else {
                responsData.value = [];
            }
        } catch (error) {
            responsData.value = [];

            console.error('Error fetching======> :', error);
            // Handle errors here
        }
    };
    return { getCourses, getCourseByid, getTrainingModule, getTrainingAssesment, getTrainingQuestions, getTrainingAnswers, getLessons };
};
