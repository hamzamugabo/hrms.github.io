<script setup>
import { ref, onBeforeMount } from 'vue';

const currentYear = ref('');

onBeforeMount(() => {
    currentYear.value = new Date().getFullYear();
});
</script>

<template>
    <div class="layout-footer">
        <span class="font-medium" style="text-align: right; color: red">Powered by GovNet Services Limited &copy; {{ currentYear }}</span>
    </div>
</template>
