<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, putData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
// import Create from '@/components/accessControl/permission/Create.vue';
import { useAccessControlUtils } from '@/components/accessControl/useAccessControlUtil';
const { getPermissions } = useAccessControlUtils();
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete, confirmDisable } = useConfirmDialog();

const permissions = ref([]);
const filters = ref(null);
const loading = ref(false);
const visible = ref(false);
const permissionData = ref('');
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

const updateGroup = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/permission-group`;
        const formData = {
            description: description.value,
            enabled: enabled.value,
            name: name.value,
            permissionId: permissionData?.value?.id
        };
        // Perform form submission logic (e.g., send data to backend)

        // loading.value = false;

        const data = await putData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            // success.value = true;
            loading.value = false;
            await getPermissions(permissions);
            showSuccess();
        } else {
            showError();
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};


onMounted(async () => {
    await getPermissions(permissions);
});
initFilters();
// eslint-disable-next-line no-unused-vars
const handleConfirmDelete = async (data) => {
    const url = `${baseURL}/permission-group/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getPermissions(permissions);
    });
};
const handleDisable = async (data) => {
    const url = `${baseURL}/permissions/disable-permission/${data?.id}`;
    await confirmDisable(url, async () => {
        await getPermissions(permissions);
    });
};

</script>

<template>
    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Permission" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>

            <div class="field col-12 md:col-12">
                <label for="name">Permission Name</label>
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
                <Button v-if="!loading" type="button" label="Update" @click="updateGroup"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-12">
                <DataTable v-model:filters="filters" :value="permissions" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
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
                    <template #empty> No permission permissions found. </template>
                    <template #loading> Loading permissions data. Please wait. </template>
                    <Column :sortable="true" field="name" header="Name" style="min-width: 13rem">
                        <template #body="{ data }"> {{ data.name }} </template>
                    </Column>
                    <Column :sortable="true" field="group" header="Group" style="min-width: 15rem">
                        <template #body="{ data }"> {{ data.group }} </template>
                    </Column>

                    <Column style="min-width: 15rem">
                        <template #header>
                            <div class="flex justify-center">Actions</div>
                        </template>
                        <template #body="{ data }">
                            <div class="flex justify-center space-x-2">
                                <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleDisable(data)" style="width: 5rem">
                                    <span class="text-sm">Disable</span>
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
