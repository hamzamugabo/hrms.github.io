<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['handleAdd']);

const handleClick = () => {
    emit('handleAdd');
};

const buttonLabel = computed(() => `Add ${props.label}`);
</script>

<template>
    <Button type="button" icon="pi pi-plus" class="ml-4 mb-2" :label="buttonLabel" outlined @click="handleClick" style="float: right; width: auto; background-color: #db0000; color: white" />
</template>

<style></style>
