import { defineStore } from 'pinia';

export const useApplicantStore = defineStore({
  id: 'applicantData',
  state: () => ({
    applicantData: null,
  }),
  actions: {
    setApplicantData(information) {
      this.applicantData = information;
    },
    getApplicantData() {
      return this.applicantData;
    },
  },
});
