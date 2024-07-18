import { baseAUTHURL, baseURL, fetchData } from '@/components/reuseables/FetchPostData';

export const useDutyStationUtils = () => {
    const getStationById = async (id) => {
        const url = `${baseAUTHURL}/duty-station/by-id/${id}`;

        try {
            const { data } = await fetchData(url, false);
            return data;
        } catch (error) {
            // Handle errors here
        }
    };
    const getRegionById = async (id) => {
        const url = `${baseURL}/region/by-id/${id}`;

        try {
            const { data } = await fetchData(url, false);
            return data;
        } catch (error) {
            // Handle errors here
        }
    };
    const getContactById = async (id) => {
        const url = `${baseURL}/contact-details/by-id/${id}`;

        try {
            const { data } = await fetchData(url, false);
            return data;
        } catch (error) {
            // Handle errors here
        }
    };

    return { getStationById, getRegionById, getContactById };
};
