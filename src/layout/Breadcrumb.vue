<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const home = ref({
    icon: 'pi pi-home',
    to: '/'
});

const route = useRoute();
const router = useRouter();

const items = computed(() => {
    const routePathArray = [];
    let currentRoute = route;

    // Traverse up the matched array to build the breadcrumb trail
    currentRoute.matched.forEach((routeRecord) => {
        const breadcrumbName = routeRecord.meta?.breadcrumbName;
        if (breadcrumbName) {
            routePathArray.push({
                label: breadcrumbName,
                to: routeRecord.path,
                command: () => {
                    router.push(routeRecord.path);
                }
            });
        }
    });

    return routePathArray;
});
</script>

<template>
    <div class="card flex justify-content-center">
        <Breadcrumb :home="home" :model="items" />
    </div>
</template>
