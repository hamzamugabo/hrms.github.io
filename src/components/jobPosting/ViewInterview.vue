<script setup>
import { ref } from 'vue';
import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import UpdateInterviewer from '../interview/CreateInterviewer.vue';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const { confirmDelete } = useConfirmDialog();
const props = defineProps(['interviewData', 'jobId']);

const emit = defineEmits(['handleEditInterview', 'handleDeleteInterview']);
const handleEditEmit = (interviewData) => {
    emit('handleEditInterview', interviewData);
};
const handleDeleteEmit = (interviewData) => {
    console.log('data to delete from child', props?.interviewData);
    emit('handleDeleteInterview', interviewData);
};
const loading = ref(false);
const successMessageUpdateInterviewer = ref('');
const successUpdateInterviewer = ref(false);
const updateInterviewerError = ref(false);
const interviewerData = ref({});
const interviewerDataUpdate = ref({});
const interviewDataUpdate = ref({});
const modalVisibilty = ref(false);
const deletingInterviewer = ref(false);
const modalVisibiltyAddInterviewer = ref(false);
const interviewDataState = ref(props?.interviewData);

// eslint-disable-next-line no-unused-vars
const handleUpdateInterviewer = async () => {
    updateInterviewerError.value = '';
    loading.value = true;

    const formData = {
        availability: interviewDataUpdate?.value?.dateTime,
        expertiseArea: interviewerDataUpdate?.value?.expertiseArea,
        id: interviewerData?.value?.id,
        name: interviewerDataUpdate?.value?.name
    };
    try {
        const url = `${baseURL}/interviewers/update`;

         

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageUpdateInterviewer.value = data?.message;
            // successUpdateInterviewer.value = true;
            showSuccess();
            loading.value = false;
            setTimeout(() => {
                successUpdateInterviewer.value = false;
                successUpdateInterviewer.value = '';
            }, 1000);
        } else {
            showError();
            successUpdateInterviewer.value = false;
            successUpdateInterviewer.value = '';
            loading.value = false;
            updateInterviewerError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        console.log('update interviwer:', formData);
        showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
const handleAddInterviewer = async () => {
    loading.value = true;
    updateInterviewerError.value = '';
    const formData = {
        availability: interviewDataUpdate?.value?.dateTime,
        expertiseArea: interviewerDataUpdate?.value?.expertiseArea,

        name: interviewerDataUpdate?.value?.name
    };
    try {
        const url = `${baseURL}/interviewers/create/${interviewDataUpdate?.value?.id}`;

         

        const data = await postData(url, formData, loading);

        if (data?.status === 200 || data?.status === 201) {
            successMessageUpdateInterviewer.value = data?.message;
            // successUpdateInterviewer.value = true;\
            showSuccess();
            loading.value = false;
            setTimeout(() => {
                successUpdateInterviewer.value = false;
                successMessageUpdateInterviewer.value = '';
            }, 1000);
            await getInterviews();
        } else {
            showError();
            successUpdateInterviewer.value = false;
            successMessageUpdateInterviewer.value = '';
            loading.value = false;
            updateInterviewerError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        console.log('update interviwer:', formData);
        showError('Failed');

        loading.value = false;
        console.log(error?.error);
    }
};
const openInterviewerModal = (interviewer, interview) => {
    interviewerData.value = interviewer;
    interviewDataUpdate.value = interview;
    modalVisibilty.value = true;
    successMessageUpdateInterviewer.value = '';
    updateInterviewerError.value = '';
    successUpdateInterviewer.value = false;
};
const openAddInterviewerModal = (interview) => {
    // console.log('interview', interview);
    interviewDataUpdate.value = interview;
    modalVisibiltyAddInterviewer.value = true;
    successMessageUpdateInterviewer.value = '';
    updateInterviewerError.value = '';
    successUpdateInterviewer.value = false;
};
const handleInterviewer = (data) => {
    interviewerDataUpdate.value = data;
};
const getInterviews = async () => {
    const url = `${baseURL}/interviews/interview/${props?.jobId}`;

    try {
        const { data } = await fetchData(url, loading);
        console.log('interviews', data);
        interviewDataState.value = data;
    } catch (error) {
        interviewDataState.value = [];
        // Handle errors here
    }
};

// const handleDeleteInterviewer = async (interviewerToDelete) => {
//     interviewerData.value = interviewerToDelete;
//     deletingInterviewer.value = true;
//     console.log('interviewer data to delete', interviewerToDelete);
//     try {
//         const url = `${baseURL}/interviewers/delete/${interviewerToDelete?.id}`;

//         const data = await fetchData(url, loading);
//         deletingInterviewer.value = false;
//         await getInterviews();
//         console.log('delete data', data);
//     } catch (error) {
//         // loadingDisable.value = false;
//         deletingInterviewer.value = false;

//         console.error('Error deleting interview:', error.message);
//     }
// };
const handleDeleteInterviewer = async (data) => {
    const url = `${baseURL}/interviewers/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getInterviews();
    });
    refresh();
};

const refresh = async () => {
    await getInterviews();
};
</script>

<template>
    <div v-if="modalVisibilty === true || modalVisibiltyAddInterviewer === true" class="flex justify-content-center">
        <Dialog
            v-model:visible="modalVisibiltyAddInterviewer"
            modal
            :pt="{
                root: 'border-none',
                mask: {
                    style: 'backdrop-filter: blur(2px)'
                }
            }"
        >
            <template #container="{}">
                <div class="flex flex-column px-5 py-5 gap-4" style="border-radius: 12px; background-image: radial-gradient(circle at left top, var(--primary-lightest-color), var(--primary-lightest-colo))">
                    <Message v-if="successUpdateInterviewer" severity="success">{{ successMessageUpdateInterviewer }}</Message>
                    <Message v-if="updateInterviewerError" severity="error">{{ updateInterviewerError }}</Message>
                    <UpdateInterviewer @handleInterviewer="handleInterviewer" />
                    <div class="flex justify-content-end align-items-center gap-3">
                        <Button type="button" label="Cancel" severity="secondary" @click="modalVisibiltyAddInterviewer = false"></Button>
                        <SpinnerVue :loading="loading" size="3rem" />
                        <Button v-if="!loading" type="button" label="Submit" @click="handleAddInterviewer"></Button>
                    </div>
                </div>
            </template>
        </Dialog>

        <Dialog
            v-model:visible="modalVisibilty"
            modal
            :pt="{
                root: 'border-none',
                mask: {
                    style: 'backdrop-filter: blur(2px)'
                }
            }"
        >
            <template #container="{}">
                <div class="flex flex-column px-5 py-5 gap-4" style="border-radius: 12px; background-image: radial-gradient(circle at left top, var(--primary-lightest-color), var(--primary-lightest-colo))">
                    <Message v-if="successUpdateInterviewer" severity="success">{{ successMessageUpdateInterviewer }}</Message>
                    <Message v-if="updateInterviewerError" severity="error">{{ updateInterviewerError }}</Message>
                    <UpdateInterviewer :interviewer="interviewerData" @handleInterviewer="handleInterviewer" />
                    <div class="flex justify-content-end align-items-center gap-3">
                        <Button type="button" label="Cancel" severity="secondary" @click="modalVisibilty = false"></Button>
                        <SpinnerVue :loading="loading" size="3rem" />
                        <Button v-if="!loading" type="button" label="Update" @click="handleUpdateInterviewer"></Button>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
    <div class="col-12 md:col-12">
        <div style="display: flex; justify-content: space-between">
            <h5>Interview</h5>
            <!-- <Button
                type="button"
                icon="pi pi-trash"
                @click="handleAddEmit('next Of Kin')"
                style="width: 100; cursor: pointer; margin-left: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: #db0000"
                @mouseover="showUpdateIcon = true"
                @mouseleave="showUpdateIcon = false"
            >
                <i class="pi pi-plus-circle"></i>
            </Button> -->
        </div>

        <div class="card-container">
            <div class="card scrollable-content">
                <div v-for="interview in interviewDataState" :key="interview.id" class="col-12 md:col-12 card">
                    <div class="flex justify-content-end align-items-center gap-3">
                        <div class="flex justify-content-center align-items-center" style="cursor: pointer">
                            <Button
                                type="button"
                                icon="pi pi-trash"
                                @click="openAddInterviewerModal(interview)"
                                style="width: 100; cursor: pointer; margin-right: 5px; border-radius: 10px; margin-bottom: 0px; height: 30px; background-color: #db0000"
                                @mouseover="showUpdateIcon = true"
                                @mouseleave="showUpdateIcon = false"
                            >
                                <i class="pi pi-plus-circle"></i>
                            </Button>
                            <span @click="openAddInterviewerModal(interview)" class="font-bold">Interviewer</span>
                        </div>
                    </div>
                    <div class="grid p-fluid">
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">dateTime</p>
                            <p class="bioValue">{{ interview?.dateTime }}</p>
                        </div>
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">location</p>
                            <p class="bioValue">{{ interview?.location }}</p>
                        </div>
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">feedBack</p>
                            <p class="bioValue">{{ interview?.feedBack }}</p>
                        </div>
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">Questions</p>
                            <p class="bioValue">{{ interview?.interviewQuestionsAndTools?.questions }}</p>
                        </div>
                        <div class="col-12 md:col-6">
                            <p class="bioTitle">assessmentTools</p>
                            <p class="bioValue">{{ interview?.interviewQuestionsAndTools?.assessmentTools }}</p>
                        </div>
                        <div class="col-12 md:col-11 ml-3">
                            <div v-for="interviewer in interview?.interviewerList" :key="interviewer.id" class="grid p-fluid card">
                                <div class="col-12 md:col-5">
                                    <p class="bioTitle">Name</p>
                                    <p class="bioValue">{{ interviewer?.name }}</p>
                                </div>
                                <div class="col-12 md:col-5">
                                    <p class="bioTitle">expertiseArea</p>
                                    <p class="bioValue">{{ interviewer?.expertiseArea }}</p>
                                </div>
                                <div class="col-12 md:col-2">
                                    <div class="flex justify-center items-center p-2">
                                        <i @click="openInterviewerModal(interviewer, interview)" class="pi pi-file-edit" style="color: green; margin-right: 20px; cursor: pointer; font-size: 24px"></i>
                                        <i v-if="!deletingInterviewer || interviewerData?.id !== interviewer?.id" @click="handleDeleteInterviewer(interviewer)" class="pi pi-trash" style="color: red; cursor: pointer; font-size: 24px"></i>
                                        <i v-if="deletingInterviewer && interviewerData?.id === interviewer?.id" class="pi pi pi-spin pi-spinner" style="color: gey; cursor: pointer; font-size: 24px"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-6"></div>
                        <div class="col-12 md:col-6">
                            <div class="flex justify-center">
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    @click="handleEditEmit(interview)"
                                    style="width: 100; cursor: pointer; margin-right: 5px; border-radius: 10px; margin-bottom: 10px; height: 30px; background-color: green"
                                    @mouseover="showUpdateIcon = true"
                                    @mouseleave="showUpdateIcon = false"
                                >
                                    <i class="pi pi-file-edit"></i>
                                </Button>
                                <Button
                                    type="button"
                                    icon="pi pi-trash"
                                    @click="handleDeleteEmit(interview)"
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
