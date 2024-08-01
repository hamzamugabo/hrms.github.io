<script setup>
import { onMounted, ref, watch } from 'vue';

import { postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
// import DisplayPermissionsComponent from '@/components/accessControl/roles/DisplayPermissions.vue';
import { useAccessControlUtils } from '@/components/accessControl/useAccessControlUtil';
const { getRoles, getPermissions } = useAccessControlUtils();
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const emit = defineEmits(['refresh']);

const loading = ref(false);
const visible = ref(false);
const success = ref(false);
const serverError = ref('');
const successMessage = ref('');
const description = ref('');

const name = ref('');
const roles = ref([]);
const permissions = ref([]);
const permissionIds = ref([]);
const groupedPermissions = ref({});
const groupChecked = ref({});

const baseURL = import.meta.env.VITE_APP_API_URL;

const submitForm = async () => {
    serverError.value = '';
    loading.value = true;
    const payload = {
        description: description.value,
        name: name.value,
        permissions: permissionIds.value
    };
    console.log('payload', payload);
    if (!payload?.name) {
        serverError.value = 'Add role name';
        loading.value = false;
        return;
    }
    if (permissionIds.value?.length < 1) {
        serverError.value = 'Add role permissions';
        showError('Add role permissions');
        loading.value = false;
        return;
    }
    const url = `${baseURL}/roles`;

    try {
        const data = await postData(url, payload);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            loading.value = false;
            name.value = '';
            description.value = '';
            permissionIds.value = [];
            showSuccess(data?.message);
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            emit('refresh');
        } else {
            name.value = '';
            description.value = '';
            permissionIds.value = [];
            emit('refresh');
            showSuccess(data?.message);
            serverError.value = data?.error || data?.message;
            loading.value = false;
        }
    } catch (error) {
        emit('refresh');
        showError('Failed');
        loading.value = false;
    }
};

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

// const toggleGroupPermissions = (groupName) => {
//     const groupCheckedStatus = groupChecked.value[groupName];
//     console.log('groupName', groupName);
//     const permissionsTospecificGroup = permissions.value
//         .filter((element) => element?.group === groupName)
//         .map((onlIds) => {
//             return onlIds?.id;
//         });
//     const allValuesExist = permissionsTospecificGroup.every((value) => permissionIds.value.includes(value));
//     if (allValuesExist) {
//         permissionIds.value = permissionIds.value.filter((id) => !permissionsTospecificGroup.includes(id));
//     } else {
//         groupedPermissions.value[groupName].forEach((permission) => {
//             const permissionIndex = permissionIds.value.indexOf(permission.id);
//             if (groupCheckedStatus && permissionIndex === -1) {
//                 console.log('push to array', permission.id);
//                 permissionIds.value.push(permission.id);
//             }
//         });
//     }
// };

onMounted(async () => {
    await getRoles(roles);
    await loadPermissions();
});

watch(permissionIds, () => {
    Object.keys(groupedPermissions.value).forEach((groupName) => {
        updateGroupCheckStatus(groupName);
    });
});
</script>

<template>
    <div class="form-container_">
        <Dialog v-model:visible="visible" header="Assign Permissions" :style="{ width: '60rem' }">
            <!-- <DisplayPermissionsComponent :permissionIds="permissionIds" :groupedPermissions="groupedPermissions" /> -->
            <div class="permission-groups">
                <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="permission-group">
            <!-- <h3>
                        <Checkbox :value="groupName" v-model="groupChecked[groupName]" @change="toggleGroupPermissions(groupName)" />

                        {{ groupName }}
                    </h3> -->
            <div v-for="permission in group" :key="permission.id" class="permission-item">
                        <Checkbox v-model="permissionIds" :value="permission.id" />
                        <label>{{ permission.name }}</label>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Done" @click="visible = false"></Button>
            </div>
        </Dialog>
        <form @submit.prevent="submitForm" class="form-content_">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Message v-if="success" severity="success">{{ successMessage }}</Message>
                        <Message v-if="serverError" severity="error">{{ serverError }}</Message>
                        <h5>Create Role</h5>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="name">Role Name</label>
                                <InputText required id="name" type="text" v-model="name" />
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="description">Description</label>
                                <InputText required id="description" type="text" v-model="description" />
                            </div>
                        </div>
                        <div style="display: flex; justify-content: center">
                            <Button type="button" label="Assign Permissions" @click="visible = true" style="background-color: grey; color: white; min-width: 10rem; white-space: nowrap"></Button>
                            <i class="pi pi-check mt-2 ml-2" v-if="permissionIds?.length > 0" style="color: slateblue;"></i>
                            <i class="pi pi-times mt-2 ml-2" v-if="permissionIds?.length < 1" style="color: slateblue;"></i>
                        </div>
                        <div style="display: flex; justify-content: center">
                            <SpinnerVue :loading="loading" size="3rem" />
                        </div>
                        <div v-if="!loading" class="mb-10" style="margin: 10px 0px">
                            <button :disabled="permissionIds?.length < 1" style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px; cursor: pointer" class="block mx-auto border-none pb-3">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
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
</style>
