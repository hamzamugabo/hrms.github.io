import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AddEmployee from '@/components/employeeManagement/AddEmployee.vue';
// import CreateApplicant from '@/components/applicant/addApplicant/AddApplicant.vue';
import UpdateEmployee from '@/components/employeeManagement/EmployeeUpdate.vue';
// import UpdateApplicant from '@/components/applicant/UpdateApplicant.vue';
import ShowEmployee from '@/components/employeeManagement/ShowEmployee.vue';
import ShowEmployees from '@/components/employeeManagement/Employees.vue';
// Applicant
import CreateApplicant from '@/components/applicant/AddApplicant.vue';
// import CreateApplicant from '@/components/applicant/addApplicant/AddApplicant.vue';
import UpdateApplicant from '@/components/applicant/ApplicantUpdate.vue';
// import UpdateApplicant from '@/components/applicant/UpdateApplicant.vue';
import ShowApplicant from '@/components/applicant/ShowApplicant.vue';
import ShowApplicants from '@/components/applicant/Applicants.vue';

// import ShowApplicant from '@/components/applicant/showApplicant/ShowApplicant.vue';
// import ShowApplicants from '@/components/applicant/Applicants.vue';
// import ApplicantQulification from '@/components/applicant_/QualificationFormTemplate.vue';
import PostJob from '@/components/jobPosting/PostJob.vue';
import DisplayJobs from '@/components/jobPosting/DisplayJobs.vue';
import EditJob from '@/components/jobPosting/EditJob.vue';
import ViewJob from '@/components/jobPosting/ViewJob.vue';
import { useUserStore } from '@/piniaStore/userStore';
import AddUser from '@/components/systemUser/Create.vue';
import UpdateUser from '@/components/systemUser/Update.vue';
import ShowUser from '@/components/systemUser/Show.vue';
import ShowUsers from '@/components/systemUser/ShowUsers.vue';
// import CreateProgram from '@/components/training/trainingProgram/Create.vue';
// import ShowPrograms from '@/components/training/trainingProgram/ShowPrograms.vue';
// import ShowProgram from '@/components/training/trainingProgram/ShowProgram.vue';
// import UpdateProgram from '@/components/training/trainingProgram/Update.vue';
import CreateNationality from '@/components/nationality/Create.vue';
import CreateRegion from '@/components/dutyStation/region/Create.vue';
import ShowRegions from '@/components/dutyStation/region/ShowRegions.vue';
import CreateCategory from '@/components/dutyStation/category/Create.vue';
import ShowCategories from '@/components/dutyStation/category/ShowCategories.vue';
import CreateContact from '@/components/dutyStation/contact/Create.vue';
import ShowContacts from '@/components/dutyStation/contact/ShowContacts.vue';
import CreateStation from '@/components/dutyStation/station/Create.vue';
import ShowStations from '@/components/dutyStation/station/ShowStations.vue';
import UpdateNationality from '@/components/nationality/Update.vue';
import ShowNationalities from '@/components/nationality/ShowNationalities.vue';

import CreateDesignation from '@/components/designation/Create.vue';
import UpdateDesignation from '@/components/designation/Update.vue';
import ShowDesignations from '@/components/designation/ShowDesignations.vue';

import CreateDepartment from '@/components/department/Create.vue';
import UpdateDepartment from '@/components/department/Update.vue';
import ShowDepartments from '@/components/department/ShowDepartments.vue';
import CreateLeaveRequest from '@/components/leave/leaveRequest/Create.vue';
import CreateLeaveType from '@/components/leave/leaveType/Create.vue';
import ShowLeaveTypes from '@/components/leave/leaveType/ShowLeaveTypes.vue';
import ShowLeaveRequests from '@/components/leave/leaveRequest/ShowLeaveRequests.vue';
import CreateAwardingInstitution from '@/components/awardingInstitution/Create.vue';
import Institutions from '@/components/awardingInstitution/ShowInstitutions.vue';
import CreateQualificationType from '@/components/qualification/Create.vue';
import QualificationTypes from '@/components/qualification/ShowQualifications.vue';
import CreateEmployeeQualification from '@/components/employeeEductionQualification/Create.vue';
import ShowApplications from '@/components/application/ViewApplications.vue';
import CreateInterview from '@/components/interview/index.vue';
import AttendanceClockIn from '@/components/attendance/ClockIn.vue';
import AttendanceClockOut from '@/components/attendance/ClockOut.vue';
import Attendance from '@/components/attendance/attendance/DisplayAll.vue';
import AttendanceView from '@/components/attendance/attendance/DisplayOne.vue';
import CreateSalary from '@/components/payroll/salary/Index.vue';
import Salaries from '@/components/payroll/salary/DisplaySalaries.vue';
import SalaryConfiguration from '@/components/payroll/salaryConfig/ShowConfigs.vue';
import CreateAllowance from '@/components/payroll/allowances/Index.vue';
import Allowances from '@/components/payroll/allowances/DisplayAllowances.vue';
import CreateDeduction from '@/components/payroll/deductions/Create.vue';
import Deductions from '@/components/payroll/deductions/Deductions.vue';
import CreatePayroll from '@/components/payroll/payroll/Index.vue';
import Payrolls from '@/components/payroll/payroll/DisplayAllPayrolls.vue';
import loadFromLocalStorage from '@/components/reuseables/getUser';
import CreateOrganistionObjectives from '@/components/performance/organisationalObjectives/Create.vue';
import OrganistionObjectives from '@/components/performance/organisationalObjectives/Objectives.vue';
import CreateDepartmentObjectives from '@/components/performance/departmentObjectives/Create.vue';
import CreatePerformanceAgreement from '@/components/performance/performanceAgreement/Create.vue';
import DepartmentObjectives from '@/components/performance/departmentObjectives/Objectives.vue';
import Agreements from '@/components/performance/performanceAgreement/Agreements.vue';
import CreateIndividualObjectives from '@/components/performance/individualObjectives/Create.vue';
import IndividualObjectives from '@/components/performance/individualObjectives/Objectives.vue';
import CreateAppraisal from '@/components/performance/appraisal/Create.vue';
import Appraisal from '@/components/performance/appraisal/Appraisal.vue';
import CreatePerformanceMetric from '@/components/performance/performanceMetrics/Create.vue';
import PerformanceMetric from '@/components/performance/performanceMetrics/Metrics.vue';
import CreateAppraisalResult from '@/components/performance/appraisalResult/Create.vue';
import AppraisalResults from '@/components/performance/appraisalResult/Results.vue';
import CreateAppraisalAppeal from '@/components/performance/appraisalAppeal/Create.vue';
import AppraisalAppeals from '@/components/performance/appraisalAppeal/Appeals.vue';
import StatusUpdates from '@/components/performance/statusUpdate/organisationUpdate/ShowUpdates.vue';
import DepartmentStatusUpdates from '@/components/performance/statusUpdate/departmentUpdate/ShowUpdates.vue';
import IndividualStatusUpdates from '@/components/performance/statusUpdate/individualUpdate/ShowUpdates.vue';
import CreateJobDescription from '@/components/jobDescription/Create.vue';
import JobDescriptions from '@/components/jobDescription/JobDescriptions.vue';
import CreateNomination from '@/components/performance/nomination/Create.vue';
import Nominations from '@/components/performance/nomination/Nominations.vue';
import CreateReward from '@/components/performance/reward/Create.vue';
import Rewards from '@/components/performance/reward/Rewards.vue';
import CreateEmployeeBehavioralMetric from '@/components/performance/metrics/employeBehavioralMetric/Create.vue';
import EmployeeBehavioralMetrics from '@/components/performance/metrics/employeBehavioralMetric/EmployeeBehavioralMetrics.vue';

import CreateEmployeeCustomerMetric from '@/components/performance/metrics/employeeCustomerMetric/Create.vue';
import EmployeeCustomerMetrics from '@/components/performance/metrics/employeeCustomerMetric/EmployeeCustomerMetrics.vue';
import CreateFinancialMetric from '@/components/performance/metrics/financialMetric/Create.vue';
import FinancialMetrics from '@/components/performance/metrics/financialMetric/FinancialMetrics.vue';
import CreateInternalProcess from '@/components/performance/metrics/internalProcessMetric/Create.vue';
import InternalProcessMetrics from '@/components/performance/metrics/internalProcessMetric/InternalProcessMetrics.vue';
import Courses from '@/components/training/course/Courses.vue';
import TrainingModule from '@/components/training/trainingModule/TrainingModules.vue';
import PermissionGroups from '@/components/accessControl/permissionGroup/GroupPermissions.vue';
import Permissions from '@/components/accessControl/permission/Permissions.vue';
import Roles from '@/components/accessControl/roles/Roles.vue';
import RoleDetails from '@/components/accessControl/roles/RoleDetails.vue';
import UpdateRole from '@/components/accessControl/roles/UpdateRole.vue';

import TrainingAssesment from '@/components/training/trainingAssesment/Assesments.vue';
import TrainingQuestion from '@/components/training/trainingQuestions/Questions.vue';
import TrainingAnswers from '@/components/training/trainingAnswer/Answers.vue';
import Lessons from '@/components/training/lesson/Lessons.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { roles: ['HR', 'Manager', 'Supervisor', 'Employee'] }
                },
                // Sytsem User
                {
                    path: '/add-user',
                    name: 'User',
                    component: AddUser,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/update-user',
                    name: 'UpdateUser',
                    component: UpdateUser,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/user',
                    name: 'SystemUser',
                    component: ShowUser,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/users',
                    name: 'Users',
                    component: ShowUsers,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Employee
                {
                    path: '/add-employee',
                    name: 'Employee',
                    component: AddEmployee,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/update-employee',
                    name: 'UpdateEmployee',
                    component: UpdateEmployee,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/employee',
                    name: 'BioData',
                    component: ShowEmployee,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/employees',
                    name: 'Employees',
                    component: ShowEmployees,

                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Applicant
                {
                    path: '/applicant/create',
                    name: 'CreateApplicant',
                    component: CreateApplicant,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/update-applicant',
                    name: 'UpdateApplicant',
                    component: UpdateApplicant,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/applicant',
                    name: 'Applicant',
                    component: ShowApplicant,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // {
                //     path: '/applicant/education/create',
                //     name: 'ApplicantQulification',
                //     component: ApplicantQulification,

                //     meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                // },
                {
                    path: '/applicants',
                    name: 'Applicants',
                    component: ShowApplicants,

                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Job Posting
                {
                    path: '/post-joB',
                    name: 'PostJob',
                    component: PostJob,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/edit-job',
                    name: 'EditJob',
                    component: EditJob,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                {
                    path: '/jobs',
                    name: 'Jobs',
                    component: DisplayJobs,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/view-job',
                    name: 'ViewJob',
                    component: ViewJob,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/interview',
                    name: 'CreateInterview',
                    component: CreateInterview,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Attendance
                {
                    path: '/attendance/clock-in',
                    name: 'AttendanceClockIn',
                    component: AttendanceClockIn,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/attendance/clock-out',
                    name: 'AttendanceClockOut',
                    component: AttendanceClockOut,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/attendance',
                    name: 'Attendance',
                    component: Attendance,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/attendance/view',
                    name: 'AttendanceView',
                    component: AttendanceView,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Applicants
                {
                    path: '/applications',
                    name: 'ShowApplications',
                    component: ShowApplications,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // {
                //     path: '/edit-job',
                //     name: 'EditJob',
                //     component: EditJob,
                //     meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                // },

                // Training Program
                // {
                //     path: '/training-program/add',
                //     name: 'Program',
                //     component: CreateProgram,
                //     meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                // },
                // {
                //     path: '/training-program/update',
                //     name: 'UpdateProgram',
                //     component: UpdateProgram,
                //     meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                // },
                // {
                //     path: '/training-program/show-program',
                //     name: 'ShowProgram',
                //     component: ShowProgram,
                //     meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                // },
                // {
                //     path: '/training-program/show-programs',
                //     name: 'ShowPrograms',
                //     component: ShowPrograms,
                //     meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                // },

                // Nationality
                {
                    path: '/nationality/add',
                    name: 'CreateNationality',
                    component: CreateNationality,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/nationality/update',
                    name: 'UpdateNationality',
                    component: UpdateNationality,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/nationality/show-nationalities',
                    name: 'ShowNationalities',
                    component: ShowNationalities,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Region
                {
                    path: '/region/create',
                    name: 'CreateRegion',
                    component: CreateRegion,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/region',
                    name: 'ShowRegions',
                    component: ShowRegions,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // category
                {
                    path: '/category/create',
                    name: 'CreateCategory',
                    component: CreateCategory,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/category',
                    name: 'ShowCategories',
                    component: ShowCategories,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // contact
                {
                    path: '/contact-details/create',
                    name: 'CreateContact',
                    component: CreateContact,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/contact-details',
                    name: 'ShowContacts',
                    component: ShowContacts,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // station
                {
                    path: '/duty-station/create',
                    name: 'CreateStation',
                    component: CreateStation,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/duty-station',
                    name: 'ShowStations',
                    component: ShowStations,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Department
                {
                    path: '/department/add',
                    name: 'CreateDepartment',
                    component: CreateDepartment,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                {
                    path: '/department/update',
                    name: 'UpdateDepartment',
                    component: UpdateDepartment,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/department/show-departments',
                    name: 'ShowDepartments',
                    component: ShowDepartments,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Designation
                {
                    path: '/designation/add',
                    name: 'CreateDesignation',
                    component: CreateDesignation,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/designation/update',
                    name: 'UpdateDesignation',
                    component: UpdateDesignation,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/designation/show-designations',
                    name: 'ShowDesignations',
                    component: ShowDesignations,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Leave
                {
                    path: '/leave/request/create',
                    name: 'CreateLeaveRequest',
                    component: CreateLeaveRequest,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/leave/type/create',
                    name: 'CreateLeaveType',
                    component: CreateLeaveType,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/leave/type',
                    name: 'ShowLeaveTypes',
                    component: ShowLeaveTypes,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/leave/request',
                    name: 'ShowLeaveRequests',
                    component: ShowLeaveRequests,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Payroll
                {
                    path: '/salary/create',
                    name: 'CreateSalary',
                    component: CreateSalary,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/salary',
                    name: 'Salaries',
                    component: Salaries,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/allowance/create',
                    name: 'CreateAllowance',
                    component: CreateAllowance,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/allowance',
                    name: 'Allowances',
                    component: Allowances,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                {
                    path: '/deduction/create',
                    name: 'CreateDeduction',
                    component: CreateDeduction,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/deduction',
                    name: 'Deductions',
                    component: Deductions,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                {
                    path: '/payroll/create',
                    name: 'CreatePayroll',
                    component: CreatePayroll,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/payroll',
                    name: 'Payrolls',
                    component: Payrolls,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/salary/configuration',
                    name: 'SalaryConfiguration',
                    component: SalaryConfiguration,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Awarding Institution
                {
                    path: '/awarding-institution/create',
                    name: 'CreateAwardingInstitution',
                    component: CreateAwardingInstitution,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/awarding-institution',
                    name: 'Institutions',
                    component: Institutions,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Qualification type
                {
                    path: '/qualification-type/create',
                    name: 'CreateQualificationType',
                    component: CreateQualificationType,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/qualification-type',
                    name: 'QualificationTypes',
                    component: QualificationTypes,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Employee Eduction Qualification
                {
                    path: '/employees/qualification/create',
                    name: 'CreateEmployeeQualification',
                    component: CreateEmployeeQualification,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Performance/Organisation
                {
                    path: '/performance/organisation-objective/create',
                    name: 'CreateOrganistionObjectives',
                    component: CreateOrganistionObjectives,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/organisation-objective',
                    name: 'OrganistionObjectives',
                    component: OrganistionObjectives,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Performance/department
                {
                    path: '/performance/department-objective/create',
                    name: 'CreateDepartmentObjectives',
                    component: CreateDepartmentObjectives,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/department-objective',
                    name: 'DepartmentObjectives',
                    component: DepartmentObjectives,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Performance/performance agreement
                {
                    path: '/performance/performance-agreement/create',
                    name: 'CreatePerformanceAgreement',
                    component: CreatePerformanceAgreement,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/performance-agreement',
                    name: 'Agreements',
                    component: Agreements,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Performance/Individual
                {
                    path: '/performance/individual-objective/create',
                    name: 'CreateIndividualObjectives',
                    component: CreateIndividualObjectives,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/individual-objective',
                    name: 'IndividualObjectives',
                    component: IndividualObjectives,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Performance/Appraial
                {
                    path: '/performance/appraisal/create',
                    name: 'CreateAppraisal',
                    component: CreateAppraisal,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/appraisal',
                    name: 'Appraisal',
                    component: Appraisal,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Performance/performance metrics
                {
                    path: '/performance/performance-metrics/create',
                    name: 'CreatePerformanceMetric',
                    component: CreatePerformanceMetric,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/performance-metrics',
                    name: 'PerformanceMetric',
                    component: PerformanceMetric,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Performance/Appraisal result
                {
                    path: '/performance/appraisal-result/create',
                    name: 'CreateAppraisalResult',
                    component: CreateAppraisalResult,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/appraisal-result',
                    name: 'AppraisalResults',
                    component: AppraisalResults,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Performance/Appraisal Appeal
                {
                    path: '/performance/appraisal-appeal/create',
                    name: 'CreateAppraisalAppeal',
                    component: CreateAppraisalAppeal,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/appraisal-appeal',
                    name: 'AppraisalAppeals',
                    component: AppraisalAppeals,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/status-update',
                    name: 'StatusUpdates',
                    component: StatusUpdates,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/status-update/department',
                    name: 'DepartmentStatusUpdates',
                    component: DepartmentStatusUpdates,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/status-update/individual',
                    name: 'IndividualStatusUpdates',
                    component: IndividualStatusUpdates,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Performance/Nomination StatusUpdates
                {
                    path: '/performance/nomination/create',
                    name: 'CreateNomination',
                    component: CreateNomination,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/nomination',
                    name: 'Nominations',
                    component: Nominations,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Performance/Reward
                {
                    path: '/performance/reward/create',
                    name: 'CreateReward',
                    component: CreateReward,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance/reward',
                    name: 'Rewards',
                    component: Rewards,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Job Description
                {
                    path: '/job-description/create',
                    name: 'CreateJobDescription',
                    component: CreateJobDescription,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/job-description',
                    name: 'JobDescriptions',
                    component: JobDescriptions,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Employee Behavioral Metric
                {
                    path: '/performance-metric/employee-behavioral/create',
                    name: 'CreateEmployeeBehavioralMetric',
                    component: CreateEmployeeBehavioralMetric,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance-metric/employee-behavioral',
                    name: 'EmployeeBehavioralMetrics',
                    component: EmployeeBehavioralMetrics,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Employee Customer Metric
                {
                    path: '/performance-metric/employee-customer/create',
                    name: 'CreateEmployeeCustomerMetric',
                    component: CreateEmployeeCustomerMetric,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance-metric/employee-customer',
                    name: 'EmployeeCustomerMetrics',
                    component: EmployeeCustomerMetrics,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                // Financial Metric
                {
                    path: '/performance-metric/financial/create',
                    name: 'CreateFinancialMetric',
                    component: CreateFinancialMetric,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance-metric/financial',
                    name: 'FinancialMetrics',
                    component: FinancialMetrics,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },

                // Internal process Metric
                {
                    path: '/performance-metric/internal-process/create',
                    name: 'CreateInternalProcess',
                    component: CreateInternalProcess,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/performance-metric/internal-process',
                    name: 'InternalProcessMetrics',
                    component: InternalProcessMetrics,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/training/course',
                    name: 'Courses',
                    component: Courses,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/training/module',
                    name: 'TrainingModule',
                    component: TrainingModule,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/access-control/permission-group',
                    name: 'PermissionGroups',
                    component: PermissionGroups,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/access-control/permission',
                    name: 'Permissions',
                    component: Permissions,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/access-control/roles',
                    name: 'Roles',
                    component: Roles,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/access-control/roles-details',
                    name: 'RoleDetails',
                    component: RoleDetails,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/access-control/update-role',
                    name: 'UpdateRole',
                    component: UpdateRole,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/training/assessment',
                    name: 'TrainingAssesment',
                    component: TrainingAssesment,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/training/questions',
                    name: 'TrainingQuestion',
                    component: TrainingQuestion,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/training/answers',
                    name: 'TrainingAnswers',
                    component: TrainingAnswers,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                },
                {
                    path: '/training/lesson',
                    name: 'Lessons',
                    component: Lessons,
                    meta: { roles: ['HR', 'Manager', 'Supervisor'] }
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/:catchAll(.*)', // Define a catch-all route parameter
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
            // meta: { roles: ['HR', 'Manager', 'Supervisor'] }
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

// Navigation Guard to check if user is authorized to access a route
router.beforeEach((to, from, next) => {
    // eslint-disable-next-line no-unused-vars
    const userStore = useUserStore();
    const userData = loadFromLocalStorage(); // Load user data from local storage
    const userRole = userData?.userRole;
    const accessToken = userData?.accessToken;

    // Check if the user is trying to access the login page
    if (to.path === '/auth/login') {
        next(); // Allow access to login page
        return;
    }

    // Check if the access token is missing
    if (!accessToken) {
        next('/auth/login'); // Redirect to login if access token is not present
        return;
    }

    // Check if the route has meta roles defined and if the user's role is authorized
    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        next('/auth/login'); // Redirect to login page or any other route if unauthorized
    } else {
        next(); // Authorized access, proceed to the route
    }
});

export default router;
