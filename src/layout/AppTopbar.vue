<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/piniaStore/userStore';
const { layoutConfig, onMenuToggle } = useLayout();

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
// const onSettingsClick = () => {
//     topbarMenuActive.value = false;
//     router.push('/documentation');
// };
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
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl?.isSameNode(event.target) || sidebarEl?.contains(event.target) || topbarEl?.isSameNode(event.target) || topbarEl?.contains(event.target));
};
const dropdownOpen = ref(false);

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const logout = () => {
    console.log('logout');
    localStorage.removeItem('userInfo');
    user.updateUser(null);
    router.push('/auth/login');

    // Implement logout logic here
};

const goToProfile = () => {
    // Implement navigation to profile page here
};
</script>

<template>
    <div class="layout-topbar" style="background-color: #db0000">
          <button class="p-link layout-menu-button layout-topbar-button" style="margin-right:2rem" @click="onMenuToggle()">
            <i class="pi pi-bars header-footer-content"></i>
        </button>
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span style="color: white">HRMS</span>
        </router-link>

      

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>
        <!-- <div style="margin-left:10%">Hello</div> -->
        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <div class="dropdown-container">
                <!-- <i class="pi pi-user" @click="toggleDropdown"></i> -->

                <div v-if="dropdownOpen" class="dropdown">
                    <ul>
                        <li @click="goToProfile">Profile</li>
                        <li @click="logout">Logout</li>
                    </ul>
                </div>
            </div>
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-user" @click="toggleDropdown"></i>
                <span>Profile</span>
            </button>
            <button class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dropdown-container {
    position: relative;
    display: inline-block;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

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
// .header-footer-content{
//     color:white
// }
</style>
