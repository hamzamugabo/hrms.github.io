<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { baseURL, fetchData, postData } from '@/components/reuseables/FetchPostData';
import SpinnerVue from '@/components/reuseables/Spinner.vue';
import changeDateFormat from '@/components/reuseables/changeDateFormat';
import { useRouter } from 'vue-router';
import { useConfirmDialog } from '@/components/reuseables/useConfirmDialog.js';


const { confirmDelete } = useConfirmDialog();
import { useToastPopup } from '@/components/reuseables/useToast.js';

const { showError, showSuccess } = useToastPopup();
const router = useRouter();
const applications = ref([]);
const filters = ref(null);
const loading = ref(true);
const visible = ref(false);

const success = ref(false);
const successUpdateStatus = ref(false);
const successMessage = ref('');
const successMessageUpdatedStatus = ref('');
const updateError = ref('');
const updateStatusError = ref('');
const generalError = ref('');

const searchTerm = ref('');
const applicantId = ref('');

const appDate = ref('');
const appStatus = ref('');
const applicationData = ref({});
const applicants = ref([]);
const autoFilteredApplicants = ref([]);

const getApplications = async () => {
    const url = `${baseURL}/application`;

    try {
        const { data } = await fetchData(url, loading, router);

        let allApplications = await Promise.all(
            data.map(async (element) => {
                const applicant = await getApplicantId(element?.applicantId);
                const jobPost = await getJobPostId(element?.jobPostingId);
                // console.log('element', element)
                return {
                    id: element?.id,
                    applicationStatus: element?.applicationStatus,
                    applicationDate: element?.applicationDate,
                    applicant: applicant,
                    ...jobPost
                };
            })
        );

        applications.value = allApplications;

        // Assign allRequests to your reactive variable if needed
    } catch (error) {
        applications.value = [];
        console.error('Error fetching requests:', error);
        // Handle errors here
    }
};

const getApplicantId = async (id) => {
    const url = `${baseURL}/applicant/by-id/${id}`;

    try {
        const { data } = await fetchData(url, loading, router);
        // console.log('employee', data);

        const applicant = {
            id: data?.id,
            firstName: data?.firstName,
            lastName: data?.lastName
        };

        return applicant;
    } catch (error) {
        console.error('Error fetching employee:', error);
        // Handle errors here
    }
};

const getJobPostId = async (id) => {
    const url = `${baseURL}/job-posting/by-id/${id}`;

    try {
        const { data } = await fetchData(url, loading, router);

        return {
            jobId: data?.id,
            jobName: data?.jobName,
            jobDescription: data?.jobDescription,
            jobQualifications: data?.jobQualifications,
            salaryRange: data?.salaryRange,
            companyInformation: data?.companyInformation,
            applicationProcess: data?.applicationProcess,
            postingPlatform: data?.postingPlatform,
            datePosted: data?.datePosted,
            expirationDate: data?.expirationDate
        };
    } catch (error) {
        console.error('Error fetching employee:', error);
        // Handle errors here
    }
};
const searchByStatus = async () => {
    try {
        const url = `${baseURL}/application/status/${searchTerm.value?.name}`;

        const { data } = await fetchData(url, loading, router);
        console.log('data===>', data);
        let allApplications = await Promise.all(
            data.map(async (element) => {
                const applicant = await getApplicantId(element?.applicantId);
                const jobPost = await getJobPostId(element?.jobPostingId);
                // console.log('element', element)
                return {
                    id: element?.id,
                    applicationStatus: element?.applicationStatus,
                    applicationDate: element?.applicationDate,
                    applicant: applicant,
                    ...jobPost
                };
            })
        );

        // applications.value = allApplications;
        applications.value = allApplications || [];
        // employees.value = data || [];
    } catch (error) {
        applications.value = [];
        // Handle errors here
    }
};

const searchByApplicantId = async () => {
    try {
        const url = `${baseURL}/application/applicant/${applicantId.value?.id}`;

        const { data } = await fetchData(url, loading, router);
        console.log('data===>', data);
        let allApplications = await Promise.all(
            data.map(async (element) => {
                const applicant = await getApplicantId(element?.applicantId);
                const jobPost = await getJobPostId(element?.jobPostingId);
                // console.log('element', element)
                return {
                    id: element?.id,
                    applicationStatus: element?.applicationStatus,
                    applicationDate: element?.applicationDate,
                    applicant: applicant,
                    ...jobPost
                };
            })
        );

        applications.value = allApplications || [];
        // employees.value = data || [];
    } catch (error) {
        applications.value = [];
        // Handle errors here
    }
};
const searchApplicant = (event) => {
    if (!event.query.trim().length) {
        autoFilteredApplicants.value = [...applicants.value];
    } else {
        autoFilteredApplicants.value = applicants.value.filter((employee) => {
            const firstNameMatches = employee.firstName.toLowerCase().startsWith(event.query.toLowerCase());
            const lastNameMatches = employee.lastName.toLowerCase().includes(event.query.toLowerCase());
            return firstNameMatches || lastNameMatches;
        });
    }
};
const handleStatus = async (application) => {
    updateStatusError.value = '';
    console.log('application', application?.applicationStatus);
    if (application) {
        console.log('application', application?.applicant);

        // return
    }
    try {
        let url = '';
        if (checkStatus(application?.applicationStatus) === 'Reject') {
            url = `${baseURL}/application/reject/${application?.id}`;
        }
        if (checkStatus(application?.applicationStatus) === 'Shortlist') {
            url = `${baseURL}/application/shortlist/${application?.id}`;
        }

        const formData = {};
        // console.log('request', formData);
        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessageUpdatedStatus.value = data?.message;

            loading.value = false;

            successUpdateStatus.value = true;
            loading.value = false;
            showSuccess();
            setTimeout(() => {
                successUpdateStatus.value = false;
                successMessageUpdatedStatus.value = '';
            }, 1000);
            await getApplications();
        } else {
        showError(data?.message ? data?.message : data?.error);
            successUpdateStatus.value = false;
            successMessageUpdatedStatus.value = '';
            updateStatusError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
        showError('Failed');
        loading.value = false;
        console.log('==>', error);
    }
};
// const deleteApplication = async (application) => {
//     if (!application) {
//         generalError.value = 'No Leave Request selected';
//         return;
//     }
//     // console.log('designation');
//     const url = `${baseURL}/application/delete/${application?.id}`;

//     try {
//         const data = await fetchData(url, false, router);
//         if (!data?.data) {
//             await getApplications();
//         }
//         console.log(data);
//         await getApplications();
//     } catch (error) {
//         // Handle errors here
//     }
// };

const updateApplication = async () => {
    updateError.value = '';
    try {
        loading.value = true;
        const url = `${baseURL}/application/update`;
        const formData = {
            applicationDate: changeDateFormat(appDate?.value) || applicationData?.value?.applicationDate,
            applicationStatus: appStatus?.value?.name || applicationData?.value?.applicationStatus,
            id: applicationData?.value?.id
        };
        if (!applicationData?.value?.id) {
            // console.log('misssing application id', applicationData.value);
            loading.value = false;
            return;
        }
        console.log('request', formData);

        const data = await postData(url, formData, loading);
        if (data?.status === 200 || data?.status === 201) {
            successMessage.value = data?.message;

            loading.value = false;

            success.value = true;
            loading.value = false;
            showSuccess();
             setTimeout(() => {
                success.value = false;
                successMessage.value = '';
            }, 1000);
            await getApplications();
        } else {
            showError(data?.message ? data?.message : data?.error);
            updateError.value = data?.message ? data?.message : data?.error;
        }
    } catch (error) {
         showError('Failed');
        loading.value = false;
        console.log(error?.error);
    }
};
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        applicationStatus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

// eslint-disable-next-line no-unused-vars
const clearFilter = () => {
    initFilters();
    getApplications();
};

const openModal = (application) => {
    // console.log('application', application?.id);
    applicationData.value = application;
    appStatus.value = application?.applicationStatus;
    appDate.value = application?.applicationDate;
    visible.value = true;
};

onMounted(async () => {
    await getApplications();

    // console.log( getStatusColor('PENDING'))
});
initFilters();

const ApplicationStatus = [
    { name: 'PENDING', code: 'PENDING' },
    { name: 'REVIEWED', code: 'REVIEWED' },
    { name: 'SHORTLISTED', code: 'SHORTLISTED' },
    { name: 'REJECTED', code: 'REJECTED' }
];
const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'pending-color';
        case 'REVIEWED':
            return 'reviewed-color';
        case 'SHORTLISTED':
            return 'shortlisted-color';
        case 'REJECTED':
            return 'rejected-color';
        default:
            return 'default-color';
    }
};
const checkStatus = (status) => {
    if (status !== 'REJECTED') {
        return 'Reject';
    }
    if (status !== 'REJECTED' || status !== 'SHORTLISTED') {
        return 'Shortlist';
    }
    console.log('status', status);
};

watch(searchTerm, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && searchTerm.value?.name?.length > 0) {
        await searchByStatus();
    } else {
        await getApplications();
    }
});
watch(applicantId, async (newVal, oldVal) => {
    // console.log('searchedArray', searchedEmployees)
    if (newVal !== oldVal && applicantId.value?.id?.length > 0) {
        await searchByApplicantId();
    } else {
        await getApplications();
    }
});
const deleteApplication = async (data) => {
    const url = `${baseURL}/application/delete/${data?.id}`;
    // await confirmDelete(url);
    await confirmDelete(url, async () => {
        await getApplications();
    });
    refresh();
};
// const addModalVisibility = ref(false);
// const handleAdd = () => {

//     addModalVisibility.value = true;
// };

const refresh = async () => {
    await getApplications();
};
</script>

<template>
    <div class=" flex justify-content-center">
     
    </div>
    <Dialog v-model:visible="visible" header="Edit Application" :style="{ width: '50rem' }">
        <Message v-if="success" severity="success">{{ successMessage }}</Message>

        <Message v-if="updateError" severity="error">{{ updateError }}</Message>

        <div class="flex align-items-center gap-3 mb-3">
            <label for="name" class="font-semibold w-6rem">Application Status </label>
            <Dropdown v-model="appStatus" :options="ApplicationStatus" optionLabel="name" placeholder="Select a Leave Status" required />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
            <label for="jobTitle" class="font-semibold w-6rem">Application Date</label>
            <Calendar :showIcon="true" :showButtonBar="true" v-model="appDate"></Calendar>
        </div>

        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button v-if="!loading" type="button" label="Update" @click="updateApplication"></Button>

            <SpinnerVue :loading="loading" size="3rem" />
        </div>
    </Dialog>
    <div class="card">
        <Message v-if="successUpdateStatus" severity="success">{{ successMessageUpdatedStatus }}</Message>

        <Message v-if="updateStatusError" severity="error">{{ updateStatusError }}</Message>
        <Message v-if="generalError" severity="error">{{ generalError }}</Message>

        <DataTable v-model:filters="filters" :value="applications" paginator showGridlines :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" :globalFilterFields="['leaveStatus']">
            <template #header>
                <div v-if="applications?.length > 0" class="flex justify-content-between flex-wrap">
                    <!-- <Button type="button" icon="pi pi-filter-slash" class="mr-2 mb-2" label="Clear" outlined @click="clearFilter()" /> -->

                    <div class="flex flex-wrap gap-2">
                        <AutoComplete
                            placeholder="Search by applicant"
                            id="applicant"
                            optionLabel="lastName"
                            :dropdown="true"
                            :multiple="false"
                            v-model="applicantId"
                            :suggestions="autoFilteredApplicants"
                            @complete="searchApplicant($event)"
                            field="firstName"
                            style="width: calc(50% - 1rem)"
                        >
                            <template #option="slotProps">
                                <div class="flex align-options-center">
                                    <div>{{ slotProps?.option?.firstName }}</div>
                                    <div>&nbsp;</div>
                                    <!-- Space character -->
                                    <div>{{ slotProps?.option?.lastName }}</div>
                                </div>
                            </template>
                        </AutoComplete>

                        <Dropdown class="mt-1" style="width: calc(50% - 1rem)" v-model="searchTerm" :options="ApplicationStatus" optionLabel="name" placeholder="Search by status" required />
                    </div>
                </div>
            </template>
            <template #empty> No Applications found. </template>
            <template #loading> Loading Applications data. Please wait. </template>

            <Column :sortable="true" field="applicant" header="Applicant" style="min-width: 12rem">
                <template #body="{ data }"> {{ data?.applicant?.firstName }} {{ data?.applicant?.lastName }} </template>
            </Column>
            <Column :sortable="true" field="jobName" header="Job Name" style="min-width: 18rem">
                <template #body="{ data }"> {{ data?.jobName }}</template>
            </Column>
            <Column :sortable="false" field="applicationDate" header="Applied On" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.applicationDate }} </template>
            </Column>
            <Column :sortable="false" field="expirationDate" header="Expiration" style="min-width: 9rem">
                <template #body="{ data }"> {{ data?.expirationDate }} </template>
            </Column>

            <Column :sortable="false" field="applicationStatus" header="Status" style="min-width: 9rem">
                <template #body="{ data }">
                    <span :class="getStatusColor(data?.applicationStatus)">{{ data.applicationStatus }}</span>
                </template>
            </Column>

            <Column style="min-width: 15rem">
                <template #header>
                    <div class="flex justify-center">Actions</div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-center space-x-2">
                        <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="handleStatus(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #f0f0f0; color: black">
                            <span class="text-sm" style="color: black">{{ checkStatus(data?.applicationStatus) }}</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="text-white font-bold py-1 px-2 rounded" @click="openModal(data)" style="width: 5rem; width: 5rem; margin-right: 5px; background-color: #0e9d6e">
                            <span class="text-sm">Update</span>
                        </Button>
                        <Button type="button" icon="pi pi-trash" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteApplication(data)" style="width: 5rem">
                            <span class="text-sm">Delete</span>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>
.pending-color {
    color: orange; /* Adjust color as needed */
}

.reviewed-color {
    color: green; /* Adjust color as needed */
}

.shortlisted-color {
    color: blue; /* Adjust color as needed */
}

.rejected-color {
    color: red; /* Adjust color as needed */
}
.default-color {
    color: black; /* Adjust color as needed */
}
.autocomplete-custom .p-autocomplete-input {
    width: 150px; /* Adjust the width as needed */
}
@media (max-width: 768px) {
    .flex-column-sm {
        flex-direction: column;
    }
    .gap-3-sm > * {
        margin-bottom: 1rem;
    }
}
</style>
