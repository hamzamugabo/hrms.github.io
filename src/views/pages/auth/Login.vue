<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useUserStore } from '@/piniaStore/userStore';
import { useRouter } from 'vue-router';
import { baseAUTHURL } from '@/components/reuseables/FetchPostData';

const router = useRouter();
const { layoutConfig } = useLayout();
const username = ref('');
const password = ref('');
const checked = ref(false);
const loginError = ref('');
const loading = ref(false);
const userToStore = useUserStore();

const baseURL = import.meta.env.VITE_APP_API_URL;
console.log('base url', baseURL);
const login = async () => {
    console.log('login initiated');
    loading.value = true;
    // Check if username and password are provided and meet criteria

    const userData = {
        username: username.value,
        password: password.value
        // role: 'HR'
    };
    const url = `${baseAUTHURL}/sign-in`;
    // const url = `/api/sign-in`;
    console.log('making request to:', url);

    try {
        // Send POST request to the login endpoint
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        // console.log('===>', response);
        if (!response.ok) {
            loading.value = false;
            console.log('response not ok', response);

            // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (response.ok) {
            console.log('response ok');
            // Extract user data from the response
            const data = await response.json();
            if (data?.status === 200) {
                console.log('response status 200');
                const user = data.data;
                user.userRole = 'HR';
                // Save user data to local storage
                localStorage.setItem('userInfo', JSON.stringify(user)); // Ensure data is stringified before saving

                // Update user context or perform other actions
                userToStore.updateUser(user);

                // Redirect to dashboard or another page
                router.push('/');
                loading.value = false;
            } else {
                console.log('response status not 200', data?.status);
            }
        } else {
            const data = await response.json();
            loginError.value = data?.message ? data?.message : data?.error;

            // Handle unsuccessful login (e.g., invalid credentials)
            console.error('Login failed:', data);
            // Display error message to the user
            loading.value = false;
        }
    } catch (error) {
        console.log('login failed');

        console.error('Login error:', error);
        // Handle network or server errors
        // Display error message to the user
        loading.value = false;
    }
    console.log('bottom login');
};

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'image' : 'image'}.png`;
});
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <i class="pi pi-spin pi-spinner" style="font-size: 2rem" v-if="loading"></i>
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-3xl font-medium mb-3" style="color: red">{{ loginError }}</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="username" type="text" placeholder="Username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <!-- <InputText id="password" type="password" placeholder="Password" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="password" /> -->

                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }">
                            <template #header>
                                <h6>Pick a password</h6>
                            </template>
                            <template #footer>
                                <Divider />
                                <p class="mt-2">Suggestions</p>
                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                    <li>At least one lowercase</li>
                                    <li>At least one uppercase</li>
                                    <li>At least one numeric</li>
                                    <li>Minimum 6 characters</li>
                                </ul>
                            </template>
                        </Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button style="" @click="login" label="Sign In" class="w-full p-3 text-xl no-hover-button" :disabled="loading"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
.no-hover-button {
    background-color: #db0000;
    border: none;
}

.no-hover-button:hover {
    background-color: #db0000;
    border: none;
    /* Add any other properties you want to override */
}
</style>
