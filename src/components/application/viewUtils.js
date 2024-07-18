import { baseURL, fetchData } from '@/components/reuseables/FetchPostData';

export const viewApplicant = () => {
    const getApplications = async (applications, loading) => {
        const url = `${baseURL}/application`;

        try {
            const { data } = await fetchData(url, loading);

            let allApplications = await Promise.all(
                data.map(async (element) => {
                    const applicant = await getApplicantId(element?.applicantId);
                    const jobPost = await getJobPostId(element?.jobPostingId);
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
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const getApplicantId = async (id) => {
        const url = `${baseURL}/applicant/by-id/${id}`;

        try {
            const { data } = await fetchData(url);
            const applicant = {
                id: data?.id,
                firstName: data?.firstName,
                lastName: data?.lastName
            };
            return applicant;
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    const getJobPostId = async (id) => {
        const url = `${baseURL}/job-posting/by-id/${id}`;

        try {
            const { data } = await fetchData(url);
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
            console.error('Error fetching job posting:', error);
        }
    };

    const searchByStatus = async (searchTerm, applications, loading) => {
        try {
            const url = `${baseURL}/application/status/${searchTerm.value?.name}`;

            const { data } = await fetchData(url, loading);

            let allApplications = await Promise.all(
                data.map(async (element) => {
                    const applicant = await getApplicantId(element?.applicantId);
                    const jobPost = await getJobPostId(element?.jobPostingId);
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
        } catch (error) {
            applications.value = [];
            console.error('Error searching by status:', error);
        }
    };

    const searchByApplicantId = async (applicantId, applications, loading) => {
        try {
            const url = `${baseURL}/application/applicant/${applicantId.value?.id}`;

            const { data } = await fetchData(url, loading);

            let allApplications = await Promise.all(
                data.map(async (element) => {
                    const applicant = await getApplicantId(element?.applicantId);
                    const jobPost = await getJobPostId(element?.jobPostingId);
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
        } catch (error) {
            applications.value = [];
            console.error('Error searching by applicant ID:', error);
        }
    };

    return {
        getApplications,
        getApplicantId,
        getJobPostId,
        searchByStatus,
        searchByApplicantId
    };
};

// Other functions like searchApplicant, handleStatus, deleteApplication, updateApplication can be added similarly

//  these functions if needed
//  { getApplications, getApplicantId, getJobPostId, searchByStatus, searchByApplicantId };
