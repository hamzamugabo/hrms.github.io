<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { baseURL, putData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
// import Create from '@/components/accessControl/permissionGroup/Create.vue';
import { useAccessControlUtils } from '@/components/accessControl/useAccessControlUtil';
const { getPermissionGroups, getPermissionGroupById } = useAccessControlUtils();
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete, confirmDisable } = useConfirmDialog();

const groups = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const groupData = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const description = ref('');
const name = ref('');
const enabled = ref(true);
const newPermissions = ref([]);
const updatedPermissions = ref([]);
const permissionIds = ref([]); // To keep track of checked permissions

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};

const updateGroup = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/permission-group`;
        const formData = {
            description: description.value,
            enabled: enabled.value,
            name: name?.value,
            permissionGroupId: groupData.value?.id,
            permissions: updatedPermissions.value // Use checked permissions
        };

    

        const data = await putData(url, formData, loading);
      
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;
            loading.value = false;
            await getPermissionGroups(groups);
            showSuccess();
        } else {
            showSuccess();
            loading.value = false;
            // showError(data?.message || 'Update failed');
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;

        console.log('error', error);
    }
};

const openModal = async (group) => {
    const groupDetails = await getPermissionGroupById(group?.id);
  

    groupData.value = groupDetails;
    name.value = group?.name;
    description.value = group?.description;
    permissionIds.value = groupDetails.permissions.map((permission) => permission.id); // Set initial checked permissions
    newPermissions.value = groupDetails.permissions;
    visible.value = true;
};

const handleCheckboxChange = (permissionId, checked) => {
    if (checked) {
        if (!permissionIds.value.includes(permissionId)) {
            permissionIds.value.push(permissionId);
        }
    } else {
        permissionIds.value = permissionIds.value.filter((id) => id !== permissionId);
    }
};

onMounted(async () => {
    await getPermissionGroups(groups);
});
initFilters();

// eslint-disable-next-line no-unused-vars
const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/permission-group/${data?.id}`;
    await confirmDelete(url, async () => {
        await getPermissionGroups(groups);
    });
};
watch(permissionIds, () => {
    const filteredArray = newPermissions?.value?.filter((item) => permissionIds?.value?.includes(item.id));
    updatedPermissions.value = filteredArray;

});


const handleDisable = async (data) => {
    const url = `${baseURL}/permission-group/disable-permission-group/${data?.id}`;
    await confirmDisable(url, async () => {
        await getPermissionGroups(groups);
    });
};

</script>

<template>
    <div class="flex justify-content-center">
        <Dialog v-model:visible="visible" header="Edit Permission Group" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>
            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="flex align-items-center gap-3 mb-3">
                <label for="name">Group Name</label>
                <InputText required id="name" type="text" v-model="name" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="description">Description</label>
                <InputText required id="description" type="text" v-model="description" />
            </div>
            <div class="permission-groups">
                <div class="permission-group">
                    <h5>Permissions</h5>
                    <div v-for="permission in newPermissions" :key="permission.id" class="permission-item">
                        <!-- <Checkbox :value="permission.id" :modelValue="permissionIds.includes(permission.id)" @change="(event) => handleCheckboxChange(permission.id, event.target.checked)" /> -->
                        <Checkbox v-model="permissionIds" :value="permission.id" @change="(event) => handleCheckboxChange(permission.id, event.target.checked)" disabled />
                        <label>{{ permission.name }}</label>
                    </div>
                </div>
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateGroup"></Button>
                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-12">
                <DataTable v-model:filters="filters" :value="groups" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
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
                    <template #empty> No permission groups found. </template>
                    <template #loading> Loading groups data. Please wait. </template>
                    <Column :sortable="true" field="name" header="Name" style="min-width: 18rem">
                        <template #body="{ data }"> {{ data.name }} </template>
                    </Column>
                    <Column :sortable="true" field="description" header="Description" style="min-width: 18rem">
                        <template #body="{ data }"> {{ data.description }} </template>
                    </Column>

                    <Column style="min-width: 15rem">
                        <template #header>
                            <div class="flex justify-center">Actions</div>
                        </template>
                        <template #body="{ data }">
                            <div class="flex justify-center space-x-2">
                                <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                                    <span class="text-sm">Update</span>
                                </Button>

                                <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleDisable(data)" style="width: 5rem">
                                    <span class="text-sm">Disable</span>
                                </Button>

                                <!-- <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleConfirmDelete(data)" style="width: 5rem">
                                    <span class="text-sm">Disable</span>
                                </Button> -->
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <!-- <div class="col-12 xl:col-5">
                <Create @refresh="refresh" />
            </div> -->
        </div>
    </div>
</template>
