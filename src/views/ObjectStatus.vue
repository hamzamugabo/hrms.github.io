<script setup>
defineProps({
    objectives: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <div class="col-12 xl:col-6">
        <div class="card" style="height:25rem">
            <h6>Oganisation Objective Status</h6>

            <div class="overflow-y-auto" style="max-height: 300px">
                <ul class="list-none p-0">
                    <li v-for="objective in objectives" :key="objective.id" class="flex justify-between items-center border-b py-2">
                        <div class="flex-1">
                            <span class="block">{{ objective.name }}</span>
                            <span class="block text-sm text-gray-500">Due: {{ objective.dueDate }}</span>
                        </div>
                        <Button
                            :label="objective?.progressUpdate?.progressStatus"
                            :class="[
                                'p-button-sm',
                                'small-button',
                                objective?.progressUpdate?.progressStatus === 'NOT_STARTED'
                                    ? 'not-started-status'
                                    : objective?.progressUpdate?.progressStatus === 'IN_PROGRESS'
                                    ? 'in-progress-status'
                                    : objective?.progressUpdate?.progressStatus === 'COMPLETED'
                                    ? 'completed-status'
                                    : objective?.progressUpdate?.progressStatus === 'ON_HOLD'
                                    ? 'on-hold-status'
                                    : objective?.progressUpdate?.progressStatus === 'CANCELLED'
                                    ? 'cancelled-status'
                                    : ''
                            ]"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

