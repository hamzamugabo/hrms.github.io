<script setup>
import { ref } from 'vue';

const props = defineProps(['filters', 'users', 'loading', 'allRoles']);
const emit = defineEmits(['viewUser', 'clearFilter', 'deleteUser']);
const newFilter = ref(props.filters);
const viewUser = (data) => {
    emit('viewUser', data);
};
const deleteUser = (data) => {
    emit('deleteUser', data);
};

const clearFilter = () => {
    emit('clearFilter');
};
</script>
<template>
    <div class="card">
        <DataTable v-model:filters="newFilter" :value="users" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['firstName', 'lastName', 'email', 'roleRequests']">
            <template #header>
                <div class="flex justify-content-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="newFilter['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No users found. </template>
            <template #loading> Loading users data. Please wait. </template>
            <Column :sortable="true" field="firstName" header="First Name" style="min-width: 18rem">
                <template #body="{ data }">
                    {{ data.firstname }}
                </template>
                 
            </Column>
            <Column :sortable="true" field="lastName" header="Last Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.lastName }}
                </template>
            </Column>
            <Column :sortable="true" field="email" header="Email" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.email }}
                </template>
            </Column>
            <Column :sortable="false" field="allRoles" header="Roles" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    <div v-if="data.roleRequests && data.roleRequests.length">
                        <template v-for="role in data.roleRequests" :key="role.name">
                            <span>{{ role.name }}</span>
                            <span v-if="role !== data.roleRequests[data.roleRequests.length - 1]">, </span>
                        </template>
                    </div>
                    <div v-else>No roles assigned</div>
                </template>
                <!-- <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Roles" optionLabel="name" placeholder="Any" class="p-column-filter">
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template> -->
            </Column>

            <Column style="min-width: 15rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button type="button" icon="pi pi-eye" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" @click="viewUser(data)" style="width: 5rem; margin-right: 5px">
                            <span class="text-sm">View</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteUser(data)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
