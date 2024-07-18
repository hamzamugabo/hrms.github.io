<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const profileImageUrl = ref('https://via.placeholder.com/150');
const update = () => {
    router.push('/update-employee');
};
</script>
<template>
    <div class="card">
        <div class="grid p-fluid">
            <div class="col-12 md:col-6 flex items-center">
                <h5 class="mr-auto">John Deo</h5>
                <!-- mr-auto for margin-right auto -->
            </div>
            <div class="col-12 md:col-6 flex items-center justify-end">
                <!-- flex and justify-end for alignment -->
                <button @click="update" class="bg-green-500 text-white px-4 py-2 rounded-lg border-none focus:outline-none">Update</button>
            </div>
        </div>
    </div>

    <div class="grid p-fluid">
        <div class="col-12 md:col-4">
            <div class="card" style="display: flex; align-items: center; justify-content: center">
                <div class="profileContainer_">
                    <h5 class="text-lg font-semibold mb-4">Profile Picture</h5>

                    <!-- Profile Picture -->
                    <div class="mb-4">
                        <img :src="profileImageUrl" alt="Profile Picture" style="border-radius: 100%" />
                    </div>

                    <!-- Update Profile Button -->
                    <div>
                        <p>
                            <button class="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none updateProfileButton">Update Profile</button>
                        </p>

                        <!-- Delete Profile Button -->
                        <p>
                            <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:bg-red-600 focus:outline-none deleteProfileButton">Delete Profile</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-8">
            <div class="card">
                <h5>Personal Details</h5>
                <div class="semiBio">
                    <p class="bioTitle">First Name</p>
                    <p class="bioValue">John Doe</p>
                </div>
                <div class="semiBio">
                    <p class="bioTitle">Last Name</p>
                    <p class="bioValue">John Doe</p>
                </div>

                <div class="semiBio">
                    <p class="bioTitle">Email Address</p>
                    <p class="bioValue">John Doe</p>
                </div>
                <div class="semiBio">
                    <p class="bioTitle">Roles</p>
                    <p class="bioValue">John Doe</p>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.bioTitle {
    font-size: 12px;
    color: #edc9c9;
    margin-bottom: -1px;
}
.semiBio {
    background: #eee;
    border-radius: 10px;
    padding: 10px 10px;
    margin-bottom: 10px;
}
.updateProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
}
.deleteProfileButton {
    border: none;
    padding: 5px;
    border-radius: 10px;
    width: 100%;

    /* width: 200px; */
}
.profileContainer {
    /* margin-left:15% */
}
</style>
