<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useAccessControlUtils } from '@/components/accessControl/useAccessControlUtil';
import { useRoute, useRouter } from 'vue-router';
import { baseURL, putData } from '../../reuseables/FetchPostData';
import { useToastPopup } from '@/components/reuseables/useToast.js';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';

import SpinnerVue from '@/components/reuseables/Spinner.vue';

const { showError, showSuccess } = useToastPopup();
const { getRoleDetails, getPermissions } = useAccessControlUtils();
const { confirmRemove } = useConfirmDialog();
const permissions = ref([]);
const permissionIds = ref([]);
const groupedPermissions = ref({});
const groupChecked = ref({});
const route = useRoute();
const router = useRouter();
const goBack = () => {
    router.back();
};
const roleDetails = ref({});
const roleId = ref(route.query.roleId);
const description = ref('');
const name = ref('');
const successMessage = ref('');
const updateError = ref('');
const loading = ref(false);
const permissionsToAdd = ref([]);
const permissionsToRemove = ref([]);
const originalName = ref('');
const originalDescription = ref('');
const originalPermissionIds = ref([]);

const loadPermissions = async () => {
    await getPermissions(permissions);
    const groups = {};
    permissions.value.forEach((permission) => {
        if (!groups[permission.group]) {
            groups[permission.group] = [];
        }
        groups[permission.group].push(permission);
    });
    groupedPermissions.value = groups;
    Object.keys(groups).forEach((group) => {
        groupChecked.value[group] = false;
    });
};

const updateGroupCheckStatus = (groupName) => {
    const allChecked = groupedPermissions.value[groupName].every((permission) => permissionIds.value.includes(permission.id));
    groupChecked.value[groupName] = allChecked;
};

const updatePermissionsFromRoleDetails = () => {
    const ids = roleDetails.value?.permissions?.map((element) => element.permissionId) || [];
    permissionIds.value = ids;
    originalPermissionIds.value = [...ids];
};

const updatePermissionsChanges = () => {
    const currentPermissions = new Set(permissionIds.value);
    const originalPermissions = new Set(originalPermissionIds.value);

    permissionsToAdd.value = [...currentPermissions].filter((id) => !originalPermissions.has(id));
    permissionsToRemove.value = [...originalPermissions].filter((id) => !currentPermissions.has(id));
};

onMounted(async () => {
    if (roleId.value) {
        await getRoleDetails(roleId.value, roleDetails);
        await loadPermissions();
    }
});

watch(roleDetails, () => {
    name.value = roleDetails.value?.name;
    description.value = roleDetails.value?.description;
    originalName.value = roleDetails.value?.name;
    originalDescription.value = roleDetails.value?.description;
    updatePermissionsFromRoleDetails();
});

watch(permissionIds, () => {
    Object.keys(groupedPermissions.value).forEach((groupName) => {
        updateGroupCheckStatus(groupName);
    });
    updatePermissionsChanges();
});

const isModified = computed(() => {
    return name.value !== originalName.value || description.value !== originalDescription.value || permissionsToAdd.value.length > 0 || permissionsToRemove.value.length > 0;
});

const updateRole = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/roles/update`;
        const formData = {
            description: description.value,
            name: name.value,
            permissions: roleDetails.value?.permissions?.map((element) => element.permissionId) || [],
            permissionsToAdd: permissionsToAdd.value,
            permissionsToRemove: permissionsToRemove.value,
            roleId: roleDetails?.value?.roleId
        };
     
        const data = await putData(url, formData, loading);

        if (data) {
            roleDetails.value = data;
        }
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            loading.value = false;
            showSuccess();
        } else {
            showSuccess();

            loading.value = false;

            // updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};

const handleConfirmRemove = async (permissionId) => {
    const url = `${baseURL}/permissions/remove-permission/${permissionId}/${roleId?.value}`;
    await confirmRemove(url, async () => {
        await getRoleDetails(roleId.value, roleDetails);
    });
};
</script>

<template>
    <div class="flex justify-content-center">
        <div class="card min_width form-container_">
            <div class="flex justify-content-between align-items-center">
                <i @click="goBack" class="pi pi-arrow-left" style="color: black; font-size: 1.5rem; cursor: pointer"></i>
                <h3>{{ roleDetails?.name }}</h3>
                <Button v-if="!loading" type="button" label="Update" :disabled="!isModified" @click="updateRole" />
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
            <div class="field col-12 md:col-12">
                <label for="name">Role Name</label>
                <InputText required id="name" type="text" v-model="name" />
            </div>
            <div class="field col-12 md:col-12">
                <label for="description">Description</label>
                <InputText required id="description" type="text" v-model="description" />
            </div>
            <div class="permission-groups">
                <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="permission-group">
                    <h5>{{ groupName }}</h5>
                    <div v-for="permission in group" :key="permission.id" class="permission-item">
                        <Checkbox v-model="permissionIds" :value="permission.id" />
                        <div class="flex justify-content-between">
                            <label>{{ permission.name }}</label>
                            <span @click="handleConfirmRemove(permission.id)" class="remove-text">Remove</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.min_width {
    min-width: 500px; /* Adjust the min-width as needed */
}
.permission-groups {
    display: flex;
    flex-wrap: wrap;
}
.permission-group {
    flex: 1 1 calc(33.33% - 1rem);
    margin-bottom: 1rem;
    padding: 0.5rem;
    box-sizing: border-box;
}
.permission-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}
.permission-item label {
    margin-left: 0.5rem;
}
.remove-text {
    visibility: hidden;
    margin-left: 1rem;
    color: brown;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
}
.permission-item:hover .remove-text {
    visibility: visible;
}
</style>
