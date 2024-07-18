<script setup>
defineProps(['employeeDependants']);
const emit = defineEmits(['handleAdd', 'handleEditDependant', 'handleDeleteDependant']);
const handleAddEmit = (name) => {
    emit('handleAdd', name);
};
const handleEditDependantEmit = (data) => {
    emit('handleEditDependant', data);
};

const handleDeleteDependantEmit = (data) => {
    emit('handleDeleteDependant', data);
};
</script>

<template>
    <div class="col-12 md:col-6">
        <div style="display: flex; justify-content: space-between">
            <h5>Dependants</h5>
           <Button
                type="button"
                icon="pi pi-trash"
                @click="handleAddEmit('next Of Kin')"
                style="width:10rem;padding:4px;cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; background-color: #db0000"
                @mouseover="showUpdateIcon = true"
                @mouseleave="showUpdateIcon = false"
            >
                <!-- <i class="pi pi-plus-circle"></i> -->
                Add Dependant
            </Button>
        </div>
        <div class="card-container">
            <div class="card scrollable-content">
                <div v-for="dependent in employeeDependants" :key="dependent.id" class="col-12 md:col-12 card">
                    <!-- <h5>Personal Details</h5> -->
                    <div class="grid p-fluid">
                        <!-- <h5>Job related information</h5> -->
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">Name</p>
                            <p class="bioValue">{{ dependent?.name }}</p>
                            <!-- <p class="bioValue">{{ nextOfKin?.firstName }}</p> -->
                        </div>
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">phone Number</p>
                            <p class="bioValue">{{ dependent?.phoneNumber }}</p>
                        </div>
                        <div class="col-12 md:col-6"></div>
                        <div class="col-12 md:col-6">
                            <div class="flex justify-center">
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    @click="handleEditDependantEmit(dependent)"
                                    style="width: 100; cursor: pointer; margin-right: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: green"
                                    @mouseover="showUpdateIcon = true"
                                    @mouseleave="showUpdateIcon = false"
                                >
                                    <i class="pi pi-file-edit"></i>
                                </Button>
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    @click="handleDeleteDependantEmit(dependent)"
                                    style="width: 100; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000"
                                    @mouseover="showUpdateIcon = true"
                                    @mouseleave="showUpdateIcon = false"
                                >
                                    <i class="pi pi-trash"></i>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card-container {
    height: 300px; /* Adjust this height as needed */
    overflow: hidden;
}

.scrollable-content {
    height: 100%;
    overflow-y: auto;
}

.scrollable-content::-webkit-scrollbar {
    width: 8px; /* Width of the scrollbar */
}

.scrollable-content::-webkit-scrollbar-track {
    background: #f1f1f1; /* Background of the scrollbar track */
}

.scrollable-content::-webkit-scrollbar-thumb {
    background: #888; /* Color of the scrollbar thumb */
    border-radius: 4px; /* Rounded corners for the scrollbar thumb */
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
    background: #555; /* Color of the scrollbar thumb when hovered */
}

.scrollable-content {
    scrollbar-width: thin; /* Firefox property to make the scrollbar thin */
}
</style>
