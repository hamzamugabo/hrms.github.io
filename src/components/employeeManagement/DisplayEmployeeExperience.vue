<script setup>
defineProps(['employeeExperience']);
</script>

<template>
    <DataTable :value="employeeExperience" :rows="5" :paginator="true" responsiveLayout="scroll">
        <Column :sortable="false" field="companyName" header="Company Name" style="min-width: 12rem">
            <template #body="{ data }"> {{ data.companyName }}</template>
        </Column>
        <Column :sortable="false" field="jobTitle" header="Job Title" style="min-width: 12rem">
            <template #body="{ data }"> {{ data?.jobTitle }}</template>
        </Column>
        <Column :sortable="false" field="startDate" header="Start Date" style="min-width: 9rem">
            <template #body="{ data }"> {{ data?.startDate }} </template>
        </Column>
        <Column :sortable="false" field="endDate" header="End Date" style="min-width: 9rem">
            <template #body="{ data }"> {{ data.endDate }} </template>
        </Column>
        <Column :sortable="false" field="responsibilities" header="Responsibilities" style="min-width: 9rem">
            <template #body="{ data }"> {{ data.responsibilities }} </template>
        </Column>
        <Column :sortable="false" field="achievements" header="Achievements" style="min-width: 9rem">
            <template #body="{ data }"> {{ data.achievements }} </template>
        </Column>
    </DataTable>
</template>

<style></style>
