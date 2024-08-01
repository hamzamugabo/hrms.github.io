<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppConfig from './AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';
// import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { baseAUTHURL, fetchAUTHData } from '@/components/reuseables/FetchPostData';
import loadFromLocalStorage from '@/components/reuseables/getUser';

const router = useRouter();
const loading = ref(false);
const tokenValidationMessage = ref('');
const token = ref('');
const tokenAuth = async () => {
    const user = loadFromLocalStorage();
    const accessToken = user?.accessToken;
    token.value = accessToken;
    const url = `${baseAUTHURL}/validate/${accessToken}`;
    // console.log('url',url)

    try {
        if (accessToken) {
            const data = await fetchAUTHData(url, loading, router);
            // console.log('token validation', data);
            tokenValidationMessage.value = data;
            if (data?.status !== 200 && !data?.ok) {
                router.push('/auth/login');
            }
        } else {
            console.log('no access token');
            router.push('/auth/login');
        }
    } catch (error) {
        // Handle errors here
    }
};
onMounted(async () => {
    await tokenAuth();
});

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-theme-light': layoutConfig.darkTheme.value === 'light',
        'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-ripple-disabled': layoutConfig.ripple.value === false
    };
});
const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive.value = false;
                layoutState.staticMenuMobileActive.value = false;
                layoutState.menuHoverActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl?.isSameNode(event.target) || sidebarEl?.contains(event.target) || topbarEl?.isSameNode(event.target) || topbarEl?.contains(event.target));
};
// tokenValidationMessage?.status === 200 && tokenValidationMessage?.ok
</script>

<template>
    <div v-if="token" class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-sidebar">
            <app-sidebar></app-sidebar>
        </div>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
        <app-config></app-config>
        <div class="layout-mask"></div>
    </div>
    <ConfirmDialog></ConfirmDialog>
    <Toast />
</template>

<style lang="scss" scoped></style>
