<script setup>
defineProps(['educationQualifications'])
</script>

<template>
    <DataTable :value="educationQualifications" :rows="5" :paginator="true" responsiveLayout="scroll">
        <Column :sortable="false" field="name" header="Qualification Name" style="min-width: 18rem">
            <template #body="{ data }"> {{ data.name }}</template>
        </Column>
        <Column :sortable="false" field="qualificationType" header="Qualification Type" style="min-width: 18rem">
            <template #body="{ data }"> {{ data?.qualificationType?.name }}</template>
        </Column>
        <Column :sortable="false" field="awardingInstitution" header="Awarding Institution/school" style="min-width: 9rem">
            <template #body="{ data }"> {{ data?.awardingInstitution?.name }} </template>
        </Column>
        <Column :sortable="false" field="yearOfAward" header="Date/Year of the award" style="min-width: 9rem">
            <template #body="{ data }"> {{ data.yearOfAward }} </template>
        </Column>
    </DataTable>
</template>

<style></style>
