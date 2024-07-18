<script setup>
import loadFromLocalStorage from '@/components/reuseables/getUser';
import ClockIn from './index.vue';

const user = loadFromLocalStorage();

const employeeId = user?.user?.id;
console.log(employeeId)
</script>

<template>
    <div>
        <template v-if="employeeId">
            <ClockIn :employeeId="employeeId" />
        </template>
        <template v-else>
            <p>Missing employee ID</p>
        </template>
    </div>
</template>

<style></style>
