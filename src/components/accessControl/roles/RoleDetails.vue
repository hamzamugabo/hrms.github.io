<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useAccessControlUtils } from '@/components/accessControl/useAccessControlUtil';
import { useRoute, useRouter } from 'vue-router';

const { getRoleDetails, getPermissions } = useAccessControlUtils();

// const visible = ref(false);
const permissions = ref([]);
const permissionIds = ref([]);
const groupedPermissions = ref({});
const groupChecked = ref({});
const route = useRoute();
const router = useRouter();

const roleDetails = ref({});
const roleId = ref(route.query.roleId);

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
};

const checkedPermissions = computed(() => {
    const filteredGroups = {};
    Object.keys(groupedPermissions.value).forEach((group) => {
        const checkedGroupPermissions = groupedPermissions.value[group].filter((permission) => permissionIds.value.includes(permission.id));
        if (checkedGroupPermissions.length > 0) {
            filteredGroups[group] = checkedGroupPermissions;
        }
    });
    return filteredGroups;
});

onMounted(async () => {
    if (roleId.value) {
        await getRoleDetails(roleId.value, roleDetails);
        await loadPermissions();
    }
});

watch(roleDetails, () => {
    updatePermissionsFromRoleDetails();
});

watch(permissionIds, () => {
    Object.keys(groupedPermissions.value).forEach((groupName) => {
        updateGroupCheckStatus(groupName);
    });
});
const goBack = () => {
    router.back();
};
</script>

<template>
    <div class="flex justify-content-center">
        <div class="card min_width form-container_">
            <div>
                <div class="flex align-items-center">
                    <i @click="goBack" class="pi pi-arrow-left" style="color: black; font-size: 1.5rem; cursor: pointer; margin-right: 10rem"></i>
                    <h3>{{ roleDetails?.name }}</h3>
                </div>
            </div>
            <hr />
            <div class="permission-groups">
                <div v-for="(group, groupName) in checkedPermissions" :key="groupName" class="permission-group">
                    <h5>{{ groupName }}</h5>
                    <div v-for="permission in group" :key="permission.id" class="permission-item">
                        <Checkbox v-model="permissionIds" :value="permission.id" disabled />
                        <label>{{ permission.name }}</label>
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
</style>
