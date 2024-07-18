import { defineStore } from 'pinia';

export const useAttendanceStore = defineStore({
  id: 'attendanceData',
  state: () => ({
    attendanceData: null,
  }),
  actions: {
    setAttendanceData(information) {
      this.attendanceData = information;
    },
    getAttendanceData() {
      return this.attendanceData;
    },
  },
});
