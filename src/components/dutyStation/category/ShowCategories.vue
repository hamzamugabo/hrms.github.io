<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { baseAUTHURL } from '@/components/reuseables/FetchPostData';
import CreateCategory from '@/components/dutyStation/category/Create.vue';
// import AddButton from '@/components/reuseables/AddButton.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const categories = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);
const categoryData = ref('');
const categoryUpdatedName = ref('');
const success = ref(false);
const successMessage = ref('');
const updateError = ref('');
const getcategories = async () => {
    const url = `${baseAUTHURL}/category`;

    try {
        const { data } = await fetchData(url, loading);
        console.log('categories', data);
        categories.value = data;
    } catch (error) {
        categories.value = [];
        // Handle errors here
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const clearFilter = () => {
    initFilters();
};
const updateCategory = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseAUTHURL}/category/update`;
        const formData = {
            id: categoryData.value?.id,
            name: categoryUpdatedName?.value
        };

        const data = await postData(url, formData, loading);
        console.log('response', data);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            showSuccess('Success');
            setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);

            await getcategories();
        } else {
            showError(data?.message ? data?.message : data?.error);
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
const openModal = (category) => {
    categoryData.value = category;
    categoryUpdatedName.value = category?.name;
    visible.value = true;
};

onMounted(async () => {
    await getcategories();
});
initFilters();
const handleConfirmDelete = async (data) => {
    const url = `${baseAUTHURL}/category/delete/${data?.id}`;

    await confirmDelete(url, async () => {
        await getcategories();
    });
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {
//     addModalVisibility.value = true;
// };
const refresh = async () => {
    await getcategories();
};
</script>

<template>
    <Toast />

    <div class="flex justify-content-center">
        <!-- <Button label="Show" @click="visible = true" /> -->
        <Dialog v-model:visible="visible" header="Edit Category" :style="{ width: '25rem' }">
            <Message v-if="success" severity="success">{{ successMessage }}</Message>

            <Message v-if="updateError" severity="error">{{ updateError }}</Message>
            <!-- <span class="p-text-secondary block mb-5">Update {{ categoryData?.name }} category</span> -->
            <div class="flex align-items-center gap-3 mb-3">
                <label for="name" class="font-semibold w-6rem">Name</label>
                <InputText id="name" v-model="categoryUpdatedName" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button v-if="!loading" type="button" label="Update" @click="updateCategory"></Button>

                <SpinnerVue :loading="loading" size="3rem" />
            </div>
        </Dialog>
    </div>
    <div class="card">
        <div class="grid">
            <div class="col-12 xl:col-7">
                <DataTable v-model:filters="filters" :value="categories" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['name']">
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
                    <template #empty> No categories found. </template>
                    <template #loading> Loading categories data. Please wait. </template>
                    <Column :sortable="false" field="name" header="Name" style="min-width: 18rem">
                        <template #body="{ data }"> {{ data.name }} </template>
                        <!--   -->
                    </Column>

                    <Column style="min-width: 15rem">
                        <template #header>
                            <div class="flex justify-center">Actions</div>
                        </template>
                        <template #body="{ data }">
                            <div class="flex justify-center space-x-2">
                                <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                                    <span class="text-sm">Update</span>
                                </Button>
                                <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="handleConfirmDelete(data)" style="width: 5rem">
                                    <span class="text-sm">Delete</span>
                                </Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="col-12 xl:col-5">
                <CreateCategory @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
