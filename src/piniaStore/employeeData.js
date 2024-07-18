import { defineStore } from 'pinia';

export const useEmployeeStore = defineStore({
  id: 'employeeData',
  state: () => ({
    employeeData: null,
  }),
  actions: {
    setEmployeeData(information) {
      this.employeeData = information;
    },
    getEmployeeData() {
      return this.employeeData;
    },
  },
});
