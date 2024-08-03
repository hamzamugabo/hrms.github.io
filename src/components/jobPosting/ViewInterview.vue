<script setup>
const props = defineProps(['interviewData', 'jobId']);

const emit = defineEmits(['handleEditInterview', 'handleDeleteInterview']);
const handleEditEmit = (interviewData) => {
    emit('handleEditInterview', interviewData);
};
const handleDeleteEmit = (interviewData) => {
    console.log('data to delete from child', props?.interviewData);
    emit('handleDeleteInterview', interviewData);
};
</script>

<template>
    <div class="col-12 md:col-12">
        <div class="card-container">
            <div class="scrollable-content">
                <div v-for="interview in interviewData.interviews" :key="interview.id" class="col-12 md:col-12 card interview-card">
                    <div class="grid p-fluid">
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">Date & Time</p>
                            <p class="bioValue">{{ interview?.dateTime }}</p>
                        </div>
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">Location</p>
                            <p class="bioValue">{{ interview?.location }}</p>
                        </div>
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">Feedback</p>
                            <p class="bioValue">{{ interview?.feedBack }}</p>
                        </div>
                        <div class="col-12 md:col-6"></div>
                        <div class="col-12 md:col-6">
                            <div class="button-container">
                                <p @click="handleEditEmit(interview)" class="action-button edit-button">
                                    <span>Edit</span>
                                </p>
                                <p @click="handleDeleteEmit(interview)" class="action-button delete-button">
                                    <span>Delete</span>
                                </p>
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
    background: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
}

.scrollable-content {
    height: 100%;
    overflow-y: auto;
}

.scrollable-content::-webkit-scrollbar {
    width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
    background: #e1e1e1;
    border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
    background: #0e9d6e;
    border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
    background: #05543e;
}

.scrollable-content {
    scrollbar-width: thin;
    scrollbar-color: #0e9d6e #e1e1e1;
}

.interview-card {
    background: linear-gradient(135deg, #0e9d6e 0%, #05543e 100%);
    color: white;
    border-radius: 12px;
    margin: 10px 0;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.interview-card:hover {
    transform: translateY(-5px);
}

.bioTitle {
    font-weight: bold;
    font-size: 14px;
    margin: 0;
}

.bioValue {
    font-size: 16px;
    margin: 0;
}

.button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
}

.action-button {
    cursor: pointer;
    border-radius: 8px;
    padding: 10px 15px;
    display: inline-block;
    text-align: center;
    user-select: none;
    transition: background-color 0.2s, transform 0.2s;
    font-size: 14px;
}

.action-button span {
    color: white;
}

.edit-button {
    background-color: #0e9d6e;
}

.edit-button:hover {
    background-color: #05543e;
    transform: scale(1.05);
}

.delete-button {
    background-color: #db0000;
}

.delete-button:hover {
    background-color: #a00000;
    transform: scale(1.05);
}
</style>
