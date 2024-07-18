import { defineStore } from 'pinia';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: null,
        generalError: ''
    }),
    getters: {
        userRole: (state) => (state.user ? state.user.role : 'Admin'),
        authError: (state) => state.generalError
    },
    actions: {
        updateUser(newUser) {
            this.user = newUser;
        },
        updateError(newError) {
            this.generalError = newError;
        }
    }
});
