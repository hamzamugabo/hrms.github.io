import { defineStore } from 'pinia';

export const useJobStore = defineStore({
  id: 'jobData',
  state: () => ({
    jobData: null,
  }),
  actions: {
    setJobData(information) {
      this.jobData = information;
    },
    getJobData() {
      return this.jobData;
    },
  },
});
