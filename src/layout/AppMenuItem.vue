<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';

const route = useRoute();

const { layoutConfig, layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);

    const activeItem = layoutState.activeMenuItem;
    isActiveMenu.value = activeItem === itemKey.value || (activeItem ? activeItem.startsWith(itemKey.value + '-') : false);
});

watch(
    () => layoutConfig.activeMenuItem.value,
    (newVal) => {
        isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
    }
);

const itemClick = (event, item) => {
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    const { overlayMenuActive, staticMenuMobileActive } = layoutState;

    if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
        onMenuToggle();
    }

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    if (isActiveMenu.value) {
        setActiveMenuItem(props.parentItemKey || ''); // Close the menu
    } else {
        setActiveMenuItem(itemKey.value); // Open the menu
    }

    isActiveMenu.value = !isActiveMenu.value;
};

const checkActiveRoute = (item) => {
    return route.path === item.to;
};
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <!-- Root item label to show dropdown -->
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text" @click="itemClick($event, item)">
            {{ item.label }}
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
        </div>

        <!-- Non-root menu items or root items without children -->
        <a v-else-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item)" :class="item.class" :target="item.target" tabindex="0">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </a>

        <!-- Router link for menu items with navigation -->
        <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item)" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
        </router-link>

        <!-- Dropdown submenu -->
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="i" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
$borderRadius: 4px; /* Define a value for the border-radius */
$transitionDuration: 0.1s; /* Define a value for the transition duration */

.layout-root-menuitem {
    .layout-menuitem-root-text {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.857rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--surface-900);
        margin: 0.75rem 0;
        padding: 0.75rem 1rem; /* Add padding around root menu label */
        border-radius: 4px;
        transition: background-color $transitionDuration, box-shadow $transitionDuration;

        &:hover {
            background-color: var(--surface-hover);
        }
    }
}

.layout-menuitem-root-text i {
    transition: transform 0.3s ease;
}

.active-menuitem .layout-menuitem-root-text i {
    transform: rotate(180deg);
}

.layout-submenu {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.layout-menuitem-icon {
    margin-right: 0.5rem;
}

.layout-submenu-toggler {
    margin-left: auto;
}

a.active-route {
    font-weight: 700;
    color: var(--primary-color);
}
</style>
