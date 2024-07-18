<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['filters', 'programList', 'loading', 'allCatelogs']);
const emit = defineEmits(['viewProgram', 'clearFilter', 'deleteProgram']);
const newPrograms = ref(props.programList);
const searchText = ref('');

const viewProgram = (data) => {
    emit('viewProgram', data);
};

// const deleteProgram = (data) => {
//     emit('deleteProgram', data);
// };

// const clearFilter = () => {
//     emit('clearFilter');
// };

// Function to perform search
const performSearch = () => {
    const keyword = searchText.value.toLowerCase().trim();
    if (keyword === '') {
        newPrograms.value = props.programList;
        return;
    }

    newPrograms.value = props.programList.filter(
        (program) =>
            program.instructor.toLowerCase().includes(keyword) ||
            program.startDate.toLowerCase().includes(keyword) ||
            program.endDate.toLowerCase().includes(keyword) ||
            program.programName.toLowerCase().includes(keyword) ||
            program.durationInHours.toString().toLowerCase().includes(keyword)
    );
};

// Watch for changes in search input and perform search
watch(searchText, () => {
    performSearch();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <IconField iconPosition="left">
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="searchText" placeholder="Keyword Search" />
            </IconField>
        </div>
        <div class="col-12 md:col-4" style="cursor: pointer" v-for="program in newPrograms" :key="program.programName">
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
                <p @click="viewProgram" class="mt-5" style="text-align: center">Show more <i class="pi pi-angle-down ml-1"></i></p>
            </div>
        </div>
    </div>
</template>
