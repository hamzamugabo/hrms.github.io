<script setup>
import { ref } from 'vue';

const props = defineProps(['addmodalVisibility']);
const emits = defineEmits(['update:addmodalVisibility']);

// const visible = ref(false);
const addmodalVisibility = ref(props.addmodalVisibility);

// Watch for changes in addmodalVisibility and emit the update event
const updateVisibility = () => {
    emits('update:addmodalVisibility', addmodalVisibility.value);
};

</script>

<template>
    <div class="card flex justify-content-center">
       
        <Dialog :visible="addmodalVisibility" modal header="Edit Profile" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Update your information.</span>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Username</label>
                <InputText id="username" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="email" class="font-semibold w-6rem">Email</label>
                <InputText id="email" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="addmodalVisibility = false"></Button>
                <Button type="button" label="Save" @click="updateVisibility"></Button>
            </div>
        </Dialog>
    </div>
</template>
