import { ref } from 'vue';
import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';
export const useJobDescription = () => {
    const loading = ref(false);
    const getDepartmentById = async (departmentId) => {
        if (!departmentId) {
            console.log('missing department id');
            return;
        }
        const url = `${baseURL}/department/by-id/${departmentId}`;

        try {
            const { data } = await fetchData(url, loading);
            return data;
        } catch (error) {
            console.error('Error fetching department:', error);
        }
    };
    const getJobDescriptions = async (dataState) => {
        const url = `${baseURL}/job-description`;

        try {
            const { data } = await fetchData(url, loading);
            console.log('descriptions', data);
            let allData = await Promise.all(
                data.map(async (element) => {
                    const department = await getDepartmentById(element?.departmentId);

                    return {
                        ...element,
                        department: department?.name
                    };
                })
            );
            console.log('all data', allData);

            dataState.value = allData || data;
        } catch (error) {
            // Handle errors here
        }
    };
    const getJobDescriptionById = async (id) => {
        if (!id) {
            console.log('missing  id');
            return;
        }
        const url = `${baseURL}/job-description/by-id/${id}`;

        try {
            const { data } = await fetchData(url, loading);
            return data;
        } catch (error) {
            console.error('Error fetching department:', error);
        }
    };
    return {
        getJobDescriptions,
        getJobDescriptionById
    };
};
