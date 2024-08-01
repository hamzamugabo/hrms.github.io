// import { useUserStore } from '@/piniaStore/userStore';
// import { useRouter } from 'vue-router'; // Import Vue Router and useRouter

import loadFromLocalStorage from './getUser';

const fetchData = async (url, loading, router) => {
    // const serverError = useUserStore();
    // const router = useRouter(); // Access the router instance

    try {
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'ngrok-skip-browser-warning': '69420'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data?.status === 200) {
                return data;
            } else {
                // console.log('data')
                // console.log('Invalid response:', data);
                return data;
                // throw data?.message;
            }
        } else if (response.status === 401) {
            // serverError.updateError('Unauthorized');
            // Redirect to login page using router.push
            router?.push('/auth/login'); // Adjust the path as per your actual login route
            throw new Error('Unauthorized');
        } else {
            const data = await response.json();
            return data;
            // throw new Error(`Request failed with status ${response.status}: ${data?.message}`);
        }
    } catch (error) {
        console.log('Error:', error);
        // throw error;
    } finally {
        if (loading) {
            loading.value = false;
        }
    }
};
const fetchDataWithPayload = async (url, loading) => {
    // const serverError = useUserStore();
    // const router = useRouter(); // Access the router instance

    try {
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'ngrok-skip-browser-warning': '69420'
            }
            // body: payload
        });

        if (response.ok) {
            const data = await response.json();
            if (data?.status === 200 || data?.status === 201) {
                return data;
            } else {
                console.log('Invalid response:', data);
                throw new Error('Invalid response status.');
            }
        } else if (response.status === 401) {
            // serverError.updateError('Unauthorized');
            // Redirect to login page using router.push
            // router.push('/auth/login'); // Adjust the path as per your actual login route
            throw new Error('Unauthorized');
        } else {
            const data = await response.json();
            return data;
            // throw new Error(`Request failed with status ${response.status}: ${data?.message}`);
        }
    } catch (error) {
        console.log('Error:', error);
        throw error;
    } finally {
        if (loading) {
            loading.value = false;
        }
    }
};
const fetchAUTHData = async (url, loading) => {
    // const serverError = useUserStore();
    // const router = useRouter(); // Access the router instance

    try {
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const data = response;
            // console.log('data=====>', data);
            if (data?.status === 200 && data) {
                return data; // Assuming you want to return the data if token is valid
            } else {
                console.log('Invalid response:', data);
                throw new Error('Invalid response status.');
            }
        } else if (response.status === 401) {
            // router.push('/auth/login'); // Adjust the path as per your actual login route
            throw new Error('Unauthorized');
        } else {
            const data = response;
            throw new Error(`Request failed with status ${response.status}: ${data?.message}`);
        }
    } catch (error) {
        console.log('Error:', error);
        // throw error;
    } finally {
        if (loading) {
            loading.value = false;
        }
    }
};

const postData = async (url, payload = {}, loading) => {
    console.log('this is the payload data', payload);
    // console.log('this is the payload data permissions' , payload?.permissions);
    // const serverError = useUserStore();
    // const router = useRouter(); // Access the router instance

    try {
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });
     

        if (response.ok) {
            const data = await response.json();
            if (data?.status === 200 || data?.status === 201) {
                return data;
            } else {
                console.log('Invalid response:', data);

                return data;
                // throw new Error('Invalid response status.');
            }
        } else if (response.status === 401) {
            // serverError.updateError('Unauthorized');
            // Redirect to login page using router.push
            // router.push('/auth/login'); // Adjust the path as per your actual login route
            throw new Error('Unauthorized');
        } else {
            const data = await response.json();
            return data;
            // throw new Error(`Request failed with status ${response.status}: ${data?.message}`);
        }
    } catch (error) {
        console.log('Error:', error);
        throw error;
    } finally {
        if (loading) {
            loading.value = false;
        }
    }
};
const putData = async (url, payload = {}, loading) => {
    // console.log('this is the payload data', payload);
    // const serverError = useUserStore();
    // const router = useRouter(); // Access the router instance

    try {
        const accessToken = loadFromLocalStorage()?.accessToken;
        if (!accessToken) {
            throw new Error('Access token not found.');
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            if (data?.status === 200 || data?.status === 201) {
                return data;
            } else {
                // console.log('Invalid response:', data);
                return data;

                // throw new Error('Invalid response status.');
            }
        } else if (response.status === 401) {
            // serverError.updateError('Unauthorized');
            // Redirect to login page using router.push
            // router.push('/auth/login'); // Adjust the path as per your actual login route
            throw new Error('Unauthorized');
        } else {
            const data = await response.json();
            return data;
            // throw new Error(`Request failed with status ${response.status}: ${data?.message}`);
        }
    } catch (error) {
        console.log('Error:', error);
        throw error;
    } finally {
        if (loading) {
            loading.value = false;
        }
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
                 
                return data; // Return the data if successful
            } else {
                console.log('Invalid response:', data?.message);
                return data;
                // throw new Error('Invalid response status.');
            }
        } else {
            const data = await response.json();
            console.log('Error response:', data);
            return data;
            // throw new Error(`Request failed with status ${response?.status}: ${data?.message}`);
        }
    } catch (error) {
        console.log('Error:', error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        if (loading) {
            loading.value = false; // Assuming loading is a ref and needs to be set to false
        }
    }
};

const baseURL = import.meta.env.VITE_APP_API_URL;
const baseAUTHURL = import.meta.env.VITE_APP_API_URL_AUTH;

export { fetchData, postData, baseURL, baseAUTHURL, fetchAUTHData, postDataUpload, fetchDataWithPayload, putData };
