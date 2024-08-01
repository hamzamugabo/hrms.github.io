import { baseURL, fetchData } from '@/components/reuseables/FetchPostData.js';
import loadFromLocalStorage from '@/components/reuseables/getUser.js';
// import { useToastPopup } from '@/components/reuseables/useToast.js';

export const useApplicant = () => {
    // const { showError, showSuccess } = useToastPopup();

    const addApplicantAcademicDocs = async (educationId, educationDoc, loading) => {
        loading.value = true;
        try {
            const uploadUrl = `${baseURL}/applicant/education/upload-academic-documents`;
            let successMessage = '';
            let errorMessage = '';

            if (educationDoc.value.length > 0) {
                const uploadPromises = educationDoc.value.map(async (element) => {
                    const formData = new FormData();
                    formData.append('id', educationId);
                    formData.append('file', element);

                    try {
                        const academicData = await postDataUploadImport_(uploadUrl, formData, loading);

                        if (academicData?.status === 200 || academicData?.status === 201) {
                            successMessage = academicData?.message || 'Upload successful';
                        } else {
                            errorMessage = `Failed to upload ${element.name}`;
                            console.log(`${element.name} not uploaded`);
                        }
                    } catch (error) {
                        errorMessage = `Error uploading ${element.name}: ${error.message}`;
                        console.log(`Error uploading ${element.name}: ${error.message}`);
                    }
                });

                await Promise.all(uploadPromises);
            }

            loading.value = false;
            return {
                successMessage,
                errorMessage
            };
        } catch (error) {
            loading.value = false;
            console.log('Error:', error);
            return {
                successMessage: '',
                errorMessage: 'An error occurred while uploading documents'
            };
        }
    };

    const postDataUploadImport_ = async (url, payload, loading) => {
        try {
            const accessToken = loadFromLocalStorage()?.accessToken;
            if (!accessToken) {
                throw new Error('Access token not found.');
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: payload
            });

            if (response.ok) {
                const data = await response.json();
                if (data?.status === 200 || data?.status === 201) {
                     
                    return data;
                } else {
                    console.error('Invalid response:', data?.message);
                    return data;
                }
            } else {
                const data = await response.json();
                console.error('Error response:', data);
                throw new Error(`Request failed with status ${response?.status}: ${data?.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        } finally {
            if (loading) {
                loading.value = false;
            }
        }
    };

    const updateCoverLetterImport = async (formData, loading) => {
        try {
            const url = `${baseURL}/applicant/upload-cover-letter`;

            const data = await postDataUploadImport_(url, formData, loading);
            let successMessage = '';
            let errorMessage = '';

            if (data?.status === 200 || data?.status === 201) {
                successMessage = data?.message;
            } else {
                errorMessage = data?.message ? data?.message : data?.error;
            }

            return { successMessage, errorMessage };
        } catch (error) {
            console.error('Error uploading cover letter:', error);
            return { successMessage: '', errorMessage: 'An unexpected error occurred while uploading the cover letter.' };
        }
    };

    const updateResumeImport = async (formData, loading) => {
        try {
            const url = `${baseURL}/applicant/upload-resume`;

            const data = await postDataUploadImport_(url, formData, loading);
            let successMessage = '';
            let errorMessage = '';

            if (data?.status === 200 || data?.status === 201) {
                successMessage = data?.message;
            } else {
                errorMessage = data?.message ? data?.message : data?.error;
            }

            return { successMessage, errorMessage };
        } catch (error) {
            console.error('Error uploading resume:', error);
            return { successMessage: '', errorMessage: 'An unexpected error occurred while uploading the resume.' };
        }
    };
    const getApplicantEductionQualifications = async (applicantId, responseData, loading) => {
        if (!applicantId) {
            console.log('missing applicant id');
            return;
        }
        const url = `${baseURL}/applicant/education/${applicantId}`;

        try {
            const { data } = await fetchData(url, loading);
            responseData.value = data;
        } catch (error) {
            console.error('Error fetching applicant:', error);
            // Handle errors here
        }
    };
    const getApplicantExperience = async (applicantId, responseData, loading) => {
        if (!applicantId) {
            console.log('missing applicant id');
            return;
        }
        const url = `${baseURL}/applicant/experience/${applicantId}`;

        try {
            const { data } = await fetchData(url, loading);
            responseData.value = data;
        } catch (error) {
            console.error('Error fetching applicant:', error);
            // Handle errors here
        }
    };
    return {
        addApplicantAcademicDocs,

        updateCoverLetterImport,
        updateResumeImport,
        getApplicantEductionQualifications,
        getApplicantExperience
    };
};
