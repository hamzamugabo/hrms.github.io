import { ref } from 'vue';
import { baseAUTHURL, fetchData } from '@/components/reuseables/FetchPostData';

export const useAuthUtils = () => {
    const loading = ref(false);
    const getUsers = async (responseData) => {
        const url = `${baseAUTHURL}/users`;

        try {
            const {data} = await fetchData(url, loading);

            responseData.value = data;
        } catch (error) {
            responseData.value = [];
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    return { getUsers };
};
