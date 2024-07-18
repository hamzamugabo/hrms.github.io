<script>
export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: '2rem'
        }
    }
};
</script>

<template>
    <i class="pi pi-spin pi-spinner" :style="{ fontSize: size }" v-if="loading"></i>
</template>
