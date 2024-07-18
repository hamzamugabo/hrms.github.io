<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EditProgram from './Update.vue';

const router = useRouter();
const profileImageUrl = ref('https://via.placeholder.com/150');
const modalVisibility = ref(false);
const updateProgram = () => {
    console.log('update', modalVisibility);
    modalVisibility.value = true;
};
const closeModal = () => {
    modalVisibility.value = false;
};
const deleteProgram = () => {
    router.push('/update-employee');
};
const visible = ref(false);
const program = ref({
    programName: 'Graphic Design Fundamentals',
    programDescription: 'Discover the essentials of graphic design principles.',
    durationInHours: 18,
    instructor: 'Olivia Thomas',
    startDate: '2024-05-15',
    endDate: '2024-06-10',
    catalogRequests: [
        {
            category: 'Design',
            description: 'Basic design skills for creative professionals.',
            provider: 'Design Studio'
        }
    ]
});
</script>
<template>
    <div class="button-container mb-1">
        <button @click="visible = true" class="bg-green-500 text-white px-4 py-2 rounded-lg border-none focus:outline-none mr-4">Update</button>
        <button @click="deleteProgram" class="bg-red-500 text-white px-4 py-2 rounded-lg border-none focus:outline-none">Delete</button>
    </div>

    <div class="grid p-fluid">
        <Dialog v-model:visible="visible" modal header="Edit Profile" >
            <div class="flex align-items-center gap-3 mb-3">
                <label for="programName" class=" w-6rem">Program Name</label>
                <InputText id="programName" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-2">
                <label for="programDescription" class=" w-6rem">program Description</label>
                <Textarea id="programDescription" rows="3" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="durationInHours" class=" w-6rem">Duration In Hours</label>
                <InputText id="durationInHours" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="instructor" class=" w-6rem">Instructor</label>
                <InputText id="instructor" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="startEnd" class=" w-6rem">Start Date</label>
                <Calendar :showIcon="true" :showButtonBar="true"></Calendar>
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="endDate" class=" w-6rem">End Date</label>
                <Calendar :showIcon="true" :showButtonBar="true"></Calendar>

            </div>
            <template #footer>
                <Button label="Cancel" text severity="secondary" @click="visible = false" autofocus />
                <Button label="Save" outlined severity="secondary" @click="visible = false" autofocus />
            </template>
        </Dialog>
        <div class="col-12">
            <div class="card" style="display: flex; align-items: center; justify-content: center">
                <div class="card p-fluid">
                    <h5>{{ program.programName }}</h5>
                    <div>
                        <span class="mr-4"><i class="pi pi-clock mr-1"></i>{{ program.durationInHours }}hrs</span>
                        <span><i class="pi pi-user mr-1"></i>{{ program.instructor }}</span>
                    </div>
                    <hr />
                    <div class="mb-4">
                        <span><i class="pi pi-calendar-minus mr-1"></i>{{ program.startDate }} - <i class="pi pi-calendar-plus mr-1"></i>{{ program.endDate }}</span>
                    </div>

                    <div>
                        <p>{{ program.programDescription }}</p>
                    </div>
                    <h5>catalogRequests</h5>

                    <div v-for="catalog in program.catalogRequests" :key="program.category">
                        <div class="field col-12 md:col-12">
                            <div class="card p-fluid">
                                <p><strong>category:</strong> {{ catalog.category }}</p>
                                <p><strong>description:</strong> {{ catalog.description }}</p>
                                <p><strong>provider:</strong> {{ catalog.provider }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.bioTitle {
    font-size: 12px;
    color: #edc9c9;
    margin-bottom: -1px;
}
.semiBio {
    background: #eee;
    border-radius: 10px;
    padding: 10px 10px;
    margin-bottom: 10px;
}
.updateProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
}
.deleteProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;

    /* width: 200px; */
}
.profileContainer {
    /* margin-left:15% */
}
.button-container {
    display: flex;
    justify-content: flex-end;
}
</style>
