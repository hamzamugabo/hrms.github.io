import { ref } from 'vue';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
import trainingModules from '@/samples/trainingModule';

export const useTrainingUtils = () => {
    const loading = ref(false);

    const getCourses = async (responsData) => {
        const url = `${baseURL}/course`;

        try {
            const { data } = await fetchData(url, loading);

            responsData.value = data;
        } catch (error) {
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
            console.log('responsData====>', responsData);
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
                if (trainingModules) {
                    let allData = await Promise.all(
                        trainingModules?.data.map(async (element) => {
                            const course = await getCourseByid(element?.courseId);

                            return {
                                ...element,
                                courseTitle: course?.title
                            };
                        })
                    );

                    console.log('allData', allData)

                    responsData.value = allData;
                }else{
                    responsData.value = [];

                }
            }
        } catch (error) {
            // if (trainingModules) {
            //     let allData = await Promise.all(
            //         trainingModules?.data.map(async (element) => {
            //             const course = await getCourseByid(element?.courseId);

            //             return {
            //                 ...element,
            //                 courseTitle: course?.title
            //             };
            //         })
            //     );

            //     console.log('allData', allData)

            //     responsData.value = allData;
            // }else{
            //     responsData.value = [];

            // }
            console.error('Error fetching======> :', error);
            // Handle errors here
        }
    };

    return { getCourses, getCourseByid, getTrainingModule };
};
