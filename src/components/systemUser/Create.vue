<script setup>
import { onMounted, ref, watch } from 'vue';
import { useAccessControlUtils } from '@/components/accessControl/useAccessControlUtil';
const { getRoles } = useAccessControlUtils();

const emit = defineEmits(['handleDataEmitted']);
const prop = defineProps(['fName', 'lName', 'pass', 'phone', 'acc', 'oldRoles', 'oldEmail']);

const firstName = ref(prop?.fName || '');
const lastName = ref(prop?.lName || '');
const password = ref(prop?.pass || '');
const email = ref(prop?.email || '');
const phoneNumber = ref(prop?.phone || null);
const accountType = ref(prop?.acc || '');

const roleIds = ref([]);
const roles = ref([]);
const autoFilteredRoles = ref([]);

const handleData = () => {
    const data = {
        accountType: accountType.value,
        name: `${firstName.value} ${lastName.value}`,
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        password: password.value,
        email: email.value,
        roleIds: roleIds.value?.map((item) => item.roleId)
    };

    console.log('submit', data);
    emit('handleDataEmitted', data);
};

onMounted(async () => {
    await getRoles(roles);
    filterRoles(); // Initialize filtered roles on mount
});

const filterRoles = () => {
    // Remove selected roles from the list of available roles
    const selectedRoleIds = roleIds.value.map((role) => role.roleId);
    autoFilteredRoles.value = roles.value.filter((role) => !selectedRoleIds.includes(role.roleId));
};

const searchRoles = (event) => {
    if (!event.query.trim().length) {
        filterRoles();
    } else {
        // Check if roles.value is iterable and not null/undefined
        if (Array.isArray(roles.value)) {
            const filteredRoles = roles.value.filter((role) => {
                return role.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
            const selectedRoleIds = roleIds.value.map((role) => role.roleId);
            autoFilteredRoles.value = filteredRoles.filter((role) => !selectedRoleIds.includes(role.roleId));
        } else {
            autoFilteredRoles.value = [];
        }
    }
};

watch([firstName, lastName, phoneNumber, password, email, roleIds, accountType], () => {
    handleData();
    filterRoles(); // Update filtered roles whenever roleIds changes
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Personal details</h5>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="firstname">First Name</label>
                        <InputText required id="firstname" type="text" v-model="firstName" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="lastname">Last Name</label>
                        <InputText required id="lastname" type="text" v-model="lastName" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="email">Email</label>
                        <InputText id="email" type="text" v-model="email" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="phoneNumber">Phone Number</label>
                        <InputNumber v-model="phoneNumber" :useGrouping="false" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="password">Password</label>
                        <InputText id="password" type="password" v-model="password" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="accountType">Account Type</label>
                        <InputText required id="accountType" type="text" v-model="accountType" />
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="firstName">Roles</label>
                        <AutoComplete placeholder="Search" id="role" :dropdown="true" :multiple="true" v-model="roleIds" :suggestions="autoFilteredRoles" @complete="searchRoles($event)" field="name" />
                        <p v-if="roles?.length === 0" class="text-red-500">No Roles found.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
