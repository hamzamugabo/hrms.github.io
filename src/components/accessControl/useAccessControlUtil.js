import { ref } from 'vue';
import { baseURL, fetchData, putData } from '@/components/reuseables/FetchPostData';

export const useAccessControlUtils = () => {
    const loading = ref(false);

    const getPermissionGroups = async (responsData) => {
        const url = `${baseURL}/permission-group`;

        try {
            const data = await fetchData(url, loading);

            responsData.value = data;
        } catch (error) {
            responsData.value = [];
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getPermissionGroupById = async (id) => {
        const url = `${baseURL}/permission-group/${id}`;

        try {
            const data = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getPermissions = async (responsData) => {
        const url = `${baseURL}/permissions`;

        try {
            const data = await fetchData(url, loading);
            responsData.value = data;
        } catch (error) {
            responsData.value = [];
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getPermissionById = async (id) => {
        const url = `${baseURL}/permissions/${id}`;

        try {
            const { data } = await fetchData(url, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };

    const assignPermissionToRole = async (permissionId, roleId, responsData) => {
        const url = `${baseURL}/permissions/assign-permission/${permissionId}/${roleId}`;

        try {
            const { data } = await putData(url, {}, loading);

            responsData.value = data;
        } catch (error) {
            responsData.value = [];
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const disablePermissionGroup = async (permissionGroupId) => {
        const url = `${baseURL}/permission-group/disable-permission-group/${permissionGroupId}`;

        try {
            const data = await putData(url, {}, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const disablePermission = async (permissionId) => {
        const url = `${baseURL}/permissions/disable-permission/${permissionId}`;

        try {
            const { data } = await putData(url, {}, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const removePermissionFromRole = async (permissionId, roleId) => {
        const url = `${baseURL}/permissions/remove-permission/${permissionId}/${roleId}`;

        try {
            const { data } = await putData(url, {}, loading);

            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getRoles = async (responsData) => {
        const url = `${baseURL}/roles`;

        try {
            const data = await fetchData(url, loading);

            responsData.value = data;
        } catch (error) {
            responsData.value = [];
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getRoleDetails = async (roleId, responsData) => {
        const url = `${baseURL}/roles/${roleId}`;

        try {
            const data = await fetchData(url, loading);
       
            responsData.value = data;
        } catch (error) {
            responsData.value = {};
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    const getPermissionsByUserId = async (userId) => {
        const url = `${baseURL}/permissions/user/${userId}`;

        try {
            const { data } = await fetchData(url, loading);
            return data;
        } catch (error) {
            console.error('Error fetching :', error);
            // Handle errors here
        }
    };
    return { getPermissionGroups, getPermissions, getRoleDetails, getRoles, getPermissionById, assignPermissionToRole, disablePermissionGroup, disablePermission, removePermissionFromRole, getPermissionsByUserId, getPermissionGroupById };
};
