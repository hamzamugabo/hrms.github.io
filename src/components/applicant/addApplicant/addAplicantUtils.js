import { postData, baseURL } from '@/components/reuseables/FetchPostData.js';
import loadFromLocalStorage from '@/components/reuseables/getUser.js';
import { useToastPopup } from '@/components/reuseables/useToast.js';

export const useApplicant = () => {
const { showError, showSuccess } = useToastPopup();

    const changeDateFormat = (dateString) => {
        const dateObject = new Date(dateString);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const addApplicantEducationImport = async (applicantId, applicantEducationDetails, educationDoc, loading, successMessageAddEducation, successMessageUpload, successUpload, addEducationError, successAddEducation) => {
        loading.value = true;
        try {
            const url = `${baseURL}/applicant/education/create/${applicantId}`;

            if (!applicantEducationDetails?.value?.schoolName?.trim()) {
                alert('Please enter School name.');
                return;
            }

            const formData = {
                award: applicantEducationDetails?.value?.award,
                endDate: changeDateFormat(applicantEducationDetails?.value?.endDate),
                fieldOfStudy: applicantEducationDetails?.value?.fieldOfStudy,
                schoolName: applicantEducationDetails?.value?.schoolName,
                startDate: changeDateFormat(applicantEducationDetails?.value?.startDate)
            };

            const data = await postData(url, formData, loading);
            const educationId = data?.data?.id;
            if (data?.status === 200 || data?.status === 201) {
                successMessageAddEducation.value = data?.message;
                showSuccess(data?.message);
                const uploadUrl = `${baseURL}/applicant/education/upload-academic-documents`;
                if (educationDoc.value.length > 0) {
                    educationDoc.value.forEach(async (element) => {
                        const formData = new FormData();
                        formData.append('id', educationId);
                        formData.append('file', element);
                        const academicData = await postDataUploadImport_(uploadUrl, formData, loading);

                        if (academicData?.status === 200 || academicData?.status === 201) {
                            successMessageUpload.value = academicData?.message;
                            successUpload.value = true;
                showSuccess(academicData?.message);
                            
                        } else {
                            showError('Failed')
                            console.log(`${element} not uploaded`);
                        }
                    });
                }

                loading.value = false;
                applicantEducationDetails.value = {};
                successAddEducation.value = true;
                loading.value = false;
            } else {
                addEducationError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            loading.value = false;
            console.error('Login error:', error);
        }
    };

    const addApplicantExperienceImport = async (applicantId, applicantExperienceDetails, baseURL, loading, successMessageAddExperience, successAddExperience, addExperienceError) => {
        loading.value = true;
        try {
            const url = `${baseURL}/applicant/experience/create/${applicantId}`;

            if (!applicantExperienceDetails?.value?.companyName?.trim()) {
                alert('Please enter Company name.');
                return;
            }

            const formData = {
                achievements: applicantExperienceDetails?.value?.achievements,
                companyName: applicantExperienceDetails?.value?.companyName,
                endDate: changeDateFormat(applicantExperienceDetails?.value?.endDate),
                jobTitle: applicantExperienceDetails?.value?.jobTitle,
                responsibilities: applicantExperienceDetails?.value?.responsibilities,
                startDate: changeDateFormat(applicantExperienceDetails?.value?.startDate)
            };

            const data = await postData(url, formData, loading);

            if (data?.status === 200 || data?.status === 201) {
                successMessageAddExperience.value = data?.message;
                loading.value = false;
                applicantExperienceDetails.value = {};
                successAddExperience.value = true;
                loading.value = false;
                showSuccess();
            } else {
                showError();
                addExperienceError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            showError('Failed');

            loading.value = false;
            console.error('Login error:', error);
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
                    console.log('Data:', data);
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

    const updateCoverLetterImport = async (formData, baseURL, loading, successMessageCover, successCover, uploadCoverError) => {
        try {
            const url = `${baseURL}/applicant/upload-cover-letter`;

            console.log('formData', formData);

            const data = await postDataUploadImport_(url, formData, loading);

            if (data?.status === 200 || data?.status === 201) {
                successMessageCover.value = data?.message;
                successCover.value = true;
            } else {
                uploadCoverError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const updateResumeImport = async (formData, baseURL, loading, successMessageResume, successResume, uploadResumeError) => {
        try {
            const url = `${baseURL}/applicant/upload-resume`;

            console.log('formData', formData);

            const data = await postDataUploadImport_(url, formData, loading);

            if (data?.status === 200 || data?.status === 201) {
                successMessageResume.value = data?.message;
                successResume.value = true;
            } else {
                uploadResumeError.value = data?.message ? data?.message : data?.error;
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };





    return {
        addApplicantEducationImport,
        addApplicantExperienceImport,
        updateCoverLetterImport,
        updateResumeImport,
      
    };
};
