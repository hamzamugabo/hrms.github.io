<script setup>
import { ref } from 'vue';
const submitForm = () => {
    const data = {
        firstname: firstName.value,
        lastName: lastName.value,
        password: password.value,
        email: email.value,
        isActive: true,
        roleRequests: role.value.filter((data) => ({
            name: data.name
        }))
    };
    console.log('submit', data);
};

const firstName = ref('');
const lastName = ref('');
const password = ref('');
const email = ref('');
const role = ref([]);
const allRoles = ref([{ name: 'HR' }, { name: 'Supervisor' }, { name: 'Employee' }, { name: 'Admin' }]);
</script>
<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Personal details</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="firstname">First Name</label>
                            <InputText required id="firstname" type="text" v-model="firstName" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="lastname">Last Name</label>
                            <InputText required id="lastname" type="text" v-model="lastName" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="password">Password</label>
                            <InputText id="password" type="password" v-model="password" />
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="email">Email</label>
                            <InputText id="email" type="text" v-model="email" />
                        </div>
                        <div class="field col-12 md:col-8">
                            <label for="role">Roles</label>
                            <!-- <Dropdown v-model="role" :options="allRoles" optionLabel="name" placeholder="Select a Role" class="w-full md:w-14rem" /> -->
                            <MultiSelect v-model="role" :options="allRoles" optionLabel="name" placeholder="Select roles" :maxSelectedLabels="3" class="w-full md:w-20rem" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-10" style="margin: 50px 0px">
            <button style="background-color: #db0000; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.5rem; padding-bottom: 40px" class="block mx-auto border-none pb-3">Add User</button>
        </div>
    </form>
</template>

<style></style>
