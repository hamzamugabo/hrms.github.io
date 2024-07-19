<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
const userRole = ref('admin');
const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },

    {
        label: 'Employee Management',
        icon: 'pi pi-fw pi-user',

        items: [
            {
                label: 'Employee',
                icon: 'pi pi-fw pi-user',
                items: [
                    { label: 'Add Employee', icon: 'pi pi-fw pi-user-plus', to: '/add-employee', roles: ['admin', 'manager'] },

                    { label: 'Employees', icon: 'pi pi-fw pi-id-card', to: '/employees', roles: ['admin', 'employee'] }
                ]
            },

            {
                label: 'Leave',
                icon: 'pi pi-fw pi-user-minus',

                items: [
                    {
                        label: 'Leave Type',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            // {
                            //     label: 'Create Leave Type',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/leave/type/create'
                            // },
                            {
                                label: 'Leave Types',
                                icon: 'pi pi-fw pi-bars',
                                to: '/leave/type'
                            }
                        ]
                    },
                    {
                        label: 'Leave Request',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            // {
                            //     label: 'Create Leave Request',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/leave/request/create'
                            // },
                            {
                                label: 'Leave Requests',
                                icon: 'pi pi-fw pi-bars',
                                to: '/leave/request'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Attendance',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    { label: 'Clock In', icon: 'pi pi-fw pi-clock', to: '/attendance/clock-in', roles: ['admin', 'manager'] },
                    { label: 'Clock Out', icon: 'pi pi-fw pi-stopwatch', to: '/attendance/clock-out', roles: ['admin', 'employee'] },
                    { label: 'Attendance', icon: 'pi pi-fw pi-users', to: '/attendance', roles: ['admin', 'employee'] }
                ]
            },

            {
                label: 'Duty Station',
                icon: 'pi pi-fw pi-user-minus',

                items: [
                    {
                        label: 'Station',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            // {
                            //     label: 'Create station',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/duty-station/create'
                            // },
                            {
                                label: 'Stations',
                                icon: 'pi pi-fw pi-bars',
                                to: '/duty-station'
                            }
                        ]
                    },
                    {
                        label: 'Category',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            // {
                            //     label: 'Create Category',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/category/create'
                            // },
                            {
                                label: 'Categories',
                                icon: 'pi pi-fw pi-bars',
                                to: '/category'
                            }
                        ]
                    },
                    {
                        label: 'Region',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            // {
                            //     label: 'Create Region',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/region/create'
                            // },
                            {
                                label: 'Regions',
                                icon: 'pi pi-fw pi-bars',
                                to: '/region'
                            }
                        ]
                    },
                    {
                        label: 'Contact',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            // {
                            //     label: 'Create contact',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/contact-details/create'
                            // },
                            {
                                label: 'Contact Details',
                                icon: 'pi pi-fw pi-bars',
                                to: '/contact-details'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    {
        label: 'Job Posting Management',
        items: [
            {
                label: 'Job Posting',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    { label: 'Post Job', icon: 'pi pi-fw pi-plus-circle', to: '/Post-JoB' },
                    { label: 'Jobs', icon: 'pi pi-fw pi-briefcase', to: '/Jobs' }
                ]
            },
            {
                label: 'Applications',
                icon: 'pi pi-fw pi-list',
                items: [{ label: 'Applications', icon: 'pi pi-fw pi-align-justify', to: '/applications' }]
            },
            {
                label: 'Applicant',
                icon: 'pi pi-fw pi-verified',
                items: [
                    { label: 'Add Applicant', icon: 'pi pi-fw pi-user-plus', to: '/applicant/create', roles: ['admin', 'manager'] },
                    // { label: 'Update Employee', icon: 'pi pi-fw pi-user-edit', to: '/update-employee', roles: ['admin', 'manager'] },
                    // { label: 'Show Employee', icon: 'pi pi-fw pi-id-card', to: '/employee', roles: ['admin', 'employee'] },
                    { label: 'Applicants', icon: 'pi pi-fw pi-id-card', to: '/applicants', roles: ['admin', 'employee'] }
                ]
            }
        ]
    },
    {
        label: 'Payroll Management',
        icon: 'pi pi-fw pi-wallet',

        items: [
            {
                label: 'Salary',
                icon: 'pi pi-fw pi-dollar',
                items: [
                    // {
                    //     label: 'Create Salary',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/salary/create'
                    // },
                    {
                        label: 'Salaries',
                        icon: 'pi pi-fw pi-bars',
                        to: '/salary'
                    }
                ]
            },
            {
                label: 'Allowance',
                icon: 'pi pi-fw pi-dollar',
                items: [
                    // {
                    //     label: 'Create Allowance',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/allowance/create'
                    // },
                    {
                        label: 'Allowances',
                        icon: 'pi pi-fw pi-bars',
                        to: '/allowance'
                    }
                ]
            },
            {
                label: 'Deductions',
                icon: 'pi pi-fw pi-minus-circle',
                items: [
                    // {
                    //     label: 'Create Deduction',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/deduction/create'
                    // },
                    {
                        label: 'Deductions',
                        icon: 'pi pi-fw pi-bars',
                        to: '/deduction'
                    }
                ]
            },
            {
                label: 'Payroll',
                icon: 'pi pi-fw pi-dollar',
                items: [
                    // {
                    //     label: 'Create Payroll',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/payroll/create'
                    // },
                    {
                        label: 'Payrolls',
                        icon: 'pi pi-fw pi-bars',
                        to: '/payroll'
                    }
                ]
            }
        ]
    },
    {
        label: 'Performance Management',
        icon: 'pi pi-fw pi-user',

        items: [
            {
                label: 'Organistion Objectives',
                icon: 'pi pi-fw pi-building',
                items: [
                    // {
                    //     label: 'Create Objective',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/organisation-objective/create'
                    // },
                    {
                        label: 'Objectives',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/organisation-objective'
                    }
                ]
            },
            {
                label: 'Department Objectives',
                icon: 'pi pi-fw pi-building',
                items: [
                    // {
                    //     label: 'Create Objective',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/department-objective/create'
                    // },
                    {
                        label: 'Objectives',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/department-objective'
                    }
                ]
            },
            {
                label: 'Performance Agreement',
                icon: 'pi pi-fw pi-check-square',
                items: [
                    // {
                    //     label: 'Create Agreement',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/performance-agreement/create'
                    // },
                    {
                        label: 'Agreements',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/performance-agreement'
                    }
                ]
            },
            {
                label: 'Individual Objectives',
                icon: 'pi pi-fw pi-user',
                items: [
                    // {
                    //     label: 'Create Objective',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/individual-objective/create'
                    // },
                    {
                        label: 'Objectives',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/individual-objective'
                    }
                ]
            },
            {
                label: 'Appraisal',
                icon: 'pi pi-fw pi-thumbs-up',
                items: [
                    // {
                    //     label: 'Create Appraisal',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/appraisal/create'
                    // },
                    {
                        label: 'Appraisals',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/appraisal'
                    }
                ]
            },
            {
                label: ' Metrics',
                icon: 'pi pi-fw pi-chart-line',
                items: [
                    {
                        label: 'Performance Metric',
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
                            // {
                            //     label: 'Create Metric',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/performance/performance-metrics/create'
                            // },
                            {
                                label: 'Metrics',
                                icon: 'pi pi-fw pi-bars',
                                to: '/performance/performance-metrics'
                            }
                        ]
                    },
                    {
                        label: 'Employee Behavioral Metric',
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
                            // {
                            //     label: 'Create Metric',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/performance-metric/employee-behavioral/create'
                            // },
                            {
                                label: 'Metrics',
                                icon: 'pi pi-fw pi-bars',
                                to: '/performance-metric/employee-behavioral'
                            }
                        ]
                    },
                    {
                        label: 'Employee Customer Metric',
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
                            // {
                            //     label: 'Create Metric',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/performance-metric/employee-customer/create'
                            // },
                            {
                                label: 'Metrics',
                                icon: 'pi pi-fw pi-bars',
                                to: '/performance-metric/employee-customer'
                            }
                        ]
                    },
                    {
                        label: 'Financial Metric',
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
                            // {
                            //     label: 'Create Metric',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/performance-metric/employee-customer/create'
                            // },
                            {
                                label: 'Metrics',
                                icon: 'pi pi-fw pi-bars',
                                to: '/performance-metric/financial'
                            }
                        ]
                    },
                    {
                        label: 'Internal Process Metric',
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
                            // {
                            //     label: 'Create Metric',
                            //     icon: 'pi pi-fw pi-plus-circle',
                            //     to: '/performance-metric/employee-customer/create'
                            // },
                            {
                                label: 'Metrics',
                                icon: 'pi pi-fw pi-bars',
                                to: '/performance-metric/internal-process'
                            }
                        ]
                    }
                ]
            },

            {
                label: 'Appraisal Result',
                icon: 'pi pi-fw pi-thumbs-up',
                items: [
                    // {
                    //     label: 'Create Results',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/appraisal-result/create'
                    // },
                    {
                        label: 'Results',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/appraisal-result'
                    }
                ]
            },
            {
                label: 'Appraisal Appeal',
                icon: 'pi pi-fw pi-thumbs-up',
                items: [
                    // {
                    //     label: 'Create Appeal',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/appraisal-appeal/create'
                    // },
                    {
                        label: 'Appeals',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/appraisal-appeal'
                    }
                ]
            },
            {
                label: 'Nomination',
                icon: 'pi pi-fw pi-thumbs-up',
                items: [
                    // {
                    //     label: 'Create Nomination',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/nomination/create'
                    // },
                    {
                        label: 'Nominations',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/nomination'
                    }
                ]
            },
            {
                label: 'Reward',
                icon: 'pi pi-fw pi-gift',
                items: [
                    // {
                    //     label: 'Create Reward',
                    //     icon: 'pi pi-fw pi-plus-circle',
                    //     to: '/performance/reward/create'
                    // },
                    {
                        label: 'Rewards',
                        icon: 'pi pi-fw pi-bars',
                        to: '/performance/reward'
                    }
                ]
            }
        ]
    },

    {
        label: 'Training Management',
        icon: 'pi pi-fw pi-user',

        items: [
            {
                label: 'Course',
                icon: 'pi pi-fw pi-thumbs-up',
                items: [
                    {
                        label: 'Courses',
                        icon: 'pi pi-fw pi-bars',
                        to: '/training/course'
                    }
                ]
            },
            {
                label: 'Training Modules',
                icon: 'pi pi-fw pi-thumbs-up',
                items: [
                    {
                        label: 'Modules',
                        icon: 'pi pi-fw pi-bars',
                        to: '/training/module'
                    }
                ]
            }
        ]
    },
    {
        label: 'Settings',
        items: [
            {
                label: 'Designation',
                icon: 'pi pi-fw pi-user',
                items: [
                    // { label: 'Create Designation', icon: 'pi pi-fw pi-plus-circle', to: '/designation/add' },
                    { label: 'designations', icon: 'pi pi-fw pi-bars', to: '/designation/show-designations' }
                ]
            },
            {
                label: 'Department',
                icon: 'pi pi-fw pi-building',
                items: [
                    // { label: 'Create Department', icon: 'pi pi-fw pi-plus-circle', to: '/department/add' },
                    { label: 'Departments', icon: 'pi pi-fw pi-th-large', to: '/department/show-departments' }
                ]
            },
            {
                label: 'Nationality',
                icon: 'pi pi-fw pi-globe',
                items: [
                    // { label: 'Create Nationality', icon: 'pi pi-fw pi-plus-circle', to: '/nationality/add' },
                    { label: 'Nationalities', icon: 'pi pi-fw pi-bars', to: '/nationality/show-nationalities' }
                ]
            },
            {
                label: 'Education qualification',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    { label: 'Instituion', icon: 'pi pi-fw pi-plus-circle', to: '/awarding-institution' },
                    { label: 'Qualification', icon: 'pi pi-fw pi-plus-circle', to: '/qualification-type' }
                    // { label: 'Nationalities', icon: 'pi pi-fw pi-briefcase', to: '/nationality/show-nationalities' }
                ]
            },
            {
                label: 'Job Description',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    // { label: 'Create Job Description', icon: 'pi pi-fw pi-plus-circle', to: '/job-description/create' },
                    { label: 'Job Descriptions', icon: 'pi pi-fw pi-bars', to: '/job-description' }
                    // { label: 'Nationalities', icon: 'pi pi-fw pi-briefcase', to: '/nationality/show-nationalities' }
                ]
            },
            {
                label: 'Salary Configuration',
                 icon: 'pi pi-fw pi-dollar',
                items: [
                    // { label: 'Create Job Description', icon: 'pi pi-fw pi-plus-circle', to: '/job-description/create' },
                    { label: 'Configurations', icon: 'pi pi-fw pi-bars', to: '/salary/configuration' }
                    // { label: 'Nationalities', icon: 'pi pi-fw pi-briefcase', to: '/nationality/show-nationalities' }
                ]
            },
             {
                label: 'Objective Status',
                 icon: 'pi pi-fw pi-sync',
                items: [
                    // { label: 'Create Job Description', icon: 'pi pi-fw pi-plus-circle', to: '/job-description/create' },
                    { label: 'Organisation Update', icon: 'pi pi-fw pi-bars', to: '/performance/status-update' },
                    { label: 'Department Update', icon: 'pi pi-fw pi-bars', to: '/performance/status-update/department' },
                    { label: 'Individual Update', icon: 'pi pi-fw pi-bars', to: '/performance/status-update/individual' }
                    // { label: 'Nationalities', icon: 'pi pi-fw pi-briefcase', to: '/nationality/show-nationalities' }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <!-- Check if the item is accessible based on user role -->
            <template v-if="!item.roles || item.roles.includes(userRole.value)">
                <app-menu-item :item="item" :index="i"></app-menu-item>
            </template>
        </template>
        <!-- <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template> -->
        <li></li>
    </ul>
</template>

<style lang="scss" scoped></style>
