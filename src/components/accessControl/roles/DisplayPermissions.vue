<script setup>
import { ref } from 'vue';

const props = defineProps(['groupedPermissions', 'permissionIds']);
const permissionIdsHere = ref(props?.permissionIds || []);
</script>

<template>
    <div class="permission-groups">
        <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="permission-group">
            <h5>
                <!-- <Checkbox :value="groupName" v-model="groupChecked[groupName]" @change="toggleGroupPermissions(groupName)" /> -->

                {{ groupName }}
            </h5>
            <div v-for="permission in group" :key="permission.id" class="permission-item">
                <Checkbox v-model="permissionIdsHere" :value="permission.id" />
                <label>{{ permission.name }}</label>
            </div>
        </div>
    </div>
</template>

<style></style>
