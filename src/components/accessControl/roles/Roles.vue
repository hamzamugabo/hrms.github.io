<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, putData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import Create from '@/components/accessControl/roles/CreateRole.vue';
import { useAccessControlUtils } from '@/components/accessControl/useAccessControlUtil';
const { getRoles } = useAccessControlUtils();
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';
import { useRouter } from 'vue-router';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();

const roles = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const roleData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const description = ref('');
const name = ref('');

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};

const enabled = ref(true);

const updateRole = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/roles/update`;
        const formData = {
            description: description.value,

            name: name.value,
            permissions: roleData?.value?.permissions,
            permissionsToAdd: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
            permissionsToRemove: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
            roleId: roleData?.value?.id
        };

        const data = await putData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            loading.value = false;
            await getRoles(roles);
            showSuccess();
        } else {
            showSuccess();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (data) => {
    const roleId = data?.roleId;

    if (roleId) {
        router.push({ path: '/access-control/update-role', query: { roleId } });
    } 
};

onMounted(async () => {
    await getRoles(roles);
});
initFilters();
// eslint-disable-next-line no-unused-vars
const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/roles/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getRoles(roles);
    });
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getRoles(roles);
};
const router = useRouter();
const viewDetails = (data) => {
    const roleId = data?.roleId;

    if (roleId) {
        router.push({ path: '/access-control/roles-details', query: { roleId } });
    } 
};
</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Permission" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="field col-12 md:col-12">
                <label for="name">Role Name</label>
                <InputText required id="name" type="text" v-model="name" />
            </div>
            <div class="field col-12 md:col-12">
                <label for="description">Description</label>
                <InputText required id="description" type="text" v-model="description" />
            </div>
            <div class="field col-12 md:col-6 flex items-center">
                <label for="scoreWeight" class="mr-3">Enable</label>
                <InputSwitch v-model="enabled" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateRole"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-8">
                <DataTable v-model:filters="filters" :value="roles" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                            <IconField iconPosition="left">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No roles found. </template>
                    <template #loading> Loading roles data. Please wait. </template>
                    <Column :sortable="true" field="name" header="Name" style="min-width: 13rem">
                        <template #body="{ data }"> {{ data.name }} </template>
                    </Column>
                    <Column :sortable="true" field="description" header="Description" style="min-width: 15rem">
                        <template #body="{ data }"> {{ data.description }} </template>
                    </Column>

                    <Column style="min-width: 15rem">
                        <template #header>
                            <div class="flex justify-center">Actions</div>
                        </template>
                        <template #body="{ data }">
                            <div class="flex justify-center space-x-2">
                                <!-- <Button
                                    type="button"
                                    icon="pi pi-eye"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                    @click="viewDetails(data)"
                                    style="width: 2rem; cursor: pointer; margin-right: 5px; border-radius: 200px"
                                    @mouseover="showViewIcon = true"
                                    @mouseleave="showViewIcon = false"
                                >
                                    <i class="pi pi-eye"></i>
                                </Button> -->
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    class="text-white font-bold py-1 px-2 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold"
                                    @click="viewDetails(data)"
                                    style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e"
                                >
                                    <span class="text-sm">View</span>
                                </Button>
                                <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                                    <span class="text-sm">Update</span>
                                </Button>
                                <!-- <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleConfirmDelete(data)" style="width: 5rem">
                                    <span class="text-sm">Delete</span>
                                </Button> -->
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="col-12 xl:col-4">
                <Create @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
