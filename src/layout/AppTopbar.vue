<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/piniaStore/userStore';
const { layoutConfig, onMenuToggle } = useLayout();
import defaultProfile from '@/components/reuseables/defaultProfilePic';

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const user = useUserStore();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'image' : 'image'}.png`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};

const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
};

const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl?.isSameNode(event.target) || sidebarEl?.contains(event.target) || topbarEl?.isSameNode(event.target) || topbarEl?.contains(event.target));
};

const logout = () => {
    console.log('logout');
    localStorage.removeItem('userInfo');
    user.updateUser(null);
    router.push('/auth/login');
};

const profileOp = ref();
const notificationOp = ref();
const notifications = ref([
    { id: 1, title: 'New Leave Request', message: 'John Doe has requested leave for 3 days.', time: '10 mins ago' },
    { id: 2, title: 'Timesheet Submitted', message: 'Jane Smith submitted her timesheet.', time: '1 hour ago' },
    { id: 3, title: 'Policy Update', message: 'The vacation policy has been updated.', time: '3 hours ago' }
]);

const toggleProfile = (event) => {
    profileOp.value.toggle(event);
};

const toggleNotifications = (event) => {
    notificationOp.value.toggle(event);
};
</script>

<template>
    <div class="layout-topbar" style="background-color: #db0000">
        <button class="p-link layout-menu-button layout-topbar-button" style="margin-right: 2rem" @click="onMenuToggle()">
            <i class="pi pi-bars header-footer-content"></i>
        </button>
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span style="color: white">HRMS</span>
        </router-link>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <div class="flex justify-content-center">
                <button @click="toggleProfile" class="p-link layout-topbar-button">
                    <img :src="defaultProfile" alt="logo" style="width: 30px; height: 30px" />
                    <span>Profile</span>
                </button>
                <OverlayPanel ref="profileOp">
                    <div class="flex flex-column gap-3 w-10rem">
                        <ul class="list-none p-0 m-0 flex flex-column gap-3">
                            <li class="flex align-items-center gap-2">
                                <i class="pi pi-user"></i>
                                <div>
                                    <span class="font-medium">Profile</span>
                                </div>
                            </li>
                            <li @click="logout" class="flex align-items-center gap-2">
                                <i class="pi pi-sign-out"></i>
                                <div>
                                    <span class="font-medium">Logout</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </OverlayPanel>
            </div>
            <button class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
            <div class="flex justify-content-center">
                <button class="p-link layout-topbar-button" @click="toggleNotifications">
                    <i class="pi pi-bell"></i>
                    <span>Notification</span>
                    {{ notifications?.length }}
                </button>
                <OverlayPanel ref="notificationOp">
                    <div class="flex flex-column gap-3 w-25rem">
                        <div v-if="notifications.length">
                            <ul class="list-none p-0 m-0 flex flex-column gap-3">
                                <li v-for="notification in notifications" :key="notification.id" class="flex align-items-center gap-2">
                                    <i class="pi pi-info-circle text-primary"></i>
                                    <div>
                                        <span class="font-medium">{{ notification.title }}</span>
                                        <div class="text-sm text-color-secondary">{{ notification.message }}</div>
                                    </div>
                                    <div class="flex align-items-center gap-2 text-color-secondary ml-auto text-sm">
                                        <span>{{ notification.time }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            <span class="font-medium text-900 block mb-2">No new notifications</span>
                        </div>
                    </div>
                </OverlayPanel>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    padding: 8px 12px;
    cursor: pointer;
}

li:hover {
    background-color: #f9f9f9;
}
</style>
