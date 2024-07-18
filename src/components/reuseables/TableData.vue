<script setup>
import { computed, ref } from 'vue';
const props = defineProps(['products', 'title', 'pagenationRows']);


const keys = computed(() => {
    if (props.products.length > 0) {
        return Object.keys(props.products[0]);
    }
    return [];
});

const filters = ref({});

const filteredProducts = computed(() => {
    if (Object.keys(filters.value).length === 0) {
        return props.products;
    }
    return props.products.filter((product) => {
        return Object.keys(filters.value).every((key) => {
            const filterValue = filters.value[key].toLowerCase();
            const productValue = String(product[key]).toLowerCase();
            return productValue.includes(filterValue);
        });
    });
});

function formatCurrency(price) {
    return `$${price}`;
}

const formatHeader = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
};
</script>

<template>
    <div class="grid">
        <div class="card">
            <h5>{{ title }}</h5>
            <DataTable :value="filteredProducts" :rows="pagenationRows" :paginator="true" responsiveLayout="scroll">
                <Column v-for="key in keys" :key="key" :field="key" :header="formatHeader(key)" :sortable="true" style="padding-bottom: 0px">
                    <template #body="{ data }">
                        {{ key === 'price' ? formatCurrency(data[key]) : data[key] }}
                    </template>
                </Column>
              
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
/* Add custom styles if needed */
</style>
