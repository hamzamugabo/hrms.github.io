const sampleRoles = [
    {
        roleId: 'c47df0c6-02e5-41ff-bbd3-007003f123ee',
        name: 'Back Office',
        description: 'All Permissions',
        permissions: [
            {
                permissionId: '79281dd0-6a83-4eeb-808d-8dea7c35d823',
                permission: 'Delete one',
                group: 'Employee management'
            },
            {
                permissionId: 'adf69983-d997-4d80-8b0a-55c6fcd61612',
                permission: 'Delete All',
                group: 'Employee management'
            },
            {
                permissionId: 'ea98b93b-7042-4b3b-a6ce-2bfe20596ede',
                permission: 'Create',
                group: 'Employee management'
            },
            {
                permissionId: 'e0221f68-c7f0-441d-9b09-055fbd428d1f',
                permission: 'Update',
                group: 'Employee management'
            },
            {
                permissionId: '2c48bb58-0ba3-4516-acbf-15713a05859e',
                permission: 'update',
                group: 'Roles'
            },
            {
                permissionId: '17318ac1-3dea-4298-b75b-d2248d866eba',
                permission: 'Delete',
                group: 'Roles'
            },
            {
                permissionId: '57f7005d-caf2-4fb9-a618-0a82ba18a14c',
                permission: 'view_attendance',
                group: 'Attendance'
            },
            {
                permissionId: '1ac897c7-5c1c-46c8-948f-54a9c64ecab1',
                permission: 'create_attendance',
                group: 'Attendance'
            },
            {
                permissionId: 'be540eeb-97d8-4dd0-aa99-078f6db1a392',
                permission: 'update_attendance',
                group: 'Attendance'
            },
            {
                permissionId: '892b3a87-9735-4e23-b303-39863e0efa16',
                permission: 'delete_attendance',
                group: 'Attendance'
            },
            {
                permissionId: '8516630a-f425-46d7-8026-2bb495f492df',
                permission: 'mark_attendance',
                group: 'Attendance'
            },
            {
                permissionId: '35fdd3c1-f56c-4c78-b200-14caa556bdb8',
                permission: 'view_department',
                group: 'Department'
            },
            {
                permissionId: 'a7419445-c0c1-49ca-867e-c3c3ad931e44',
                permission: 'create_department',
                group: 'Department'
            },
            {
                permissionId: '1fd237f8-27bf-4827-80dc-518e712f5812',
                permission: 'update_department',
                group: 'Department'
            },
            {
                permissionId: 'f42a33ff-5550-446c-af90-90a2b06dec11',
                permission: 'delete_department',
                group: 'Department'
            },
            {
                permissionId: 'a033a524-36f8-4542-9186-f08a26143a3f',
                permission: 'view_designation',
                group: 'Designation'
            },
            {
                permissionId: 'fab9b316-fb86-4d28-9614-e3d577c8997f',
                permission: 'create_designation',
                group: 'Designation'
            },
            {
                permissionId: 'c66414bb-172a-4a09-8f74-8a31ee607c87',
                permission: 'update_designation',
                group: 'Designation'
            },
            {
                permissionId: 'd688efb0-44e7-47c7-9ff2-594ad9258087',
                permission: 'view_region',
                group: 'Region'
            },
            {
                permissionId: '5fae4b00-f7f2-4f12-80fc-5d98017191d5',
                permission: 'create_region',
                group: 'Region'
            },
            {
                permissionId: '4517b297-5f72-4a8b-bb05-8d8e9a6c0332',
                permission: 'update_region',
                group: 'Region'
            }
        ]
    },
    {
        roleId: '316694b6-d21c-4717-80ba-d96057710d79',
        name: 'Supervisor',
        description: 'Supervises employees',
        permissions: [
            {
                permissionId: '57f7005d-caf2-4fb9-a618-0a82ba18a14c',
                permission: 'view_attendance',
                group: 'Attendance'
            },
            {
                permissionId: 'a033a524-36f8-4542-9186-f08a26143a3f',
                permission: 'view_designation',
                group: 'Designation'
            },
            {
                permissionId: 'd688efb0-44e7-47c7-9ff2-594ad9258087',
                permission: 'view_region',
                group: 'Region'
            },
            {
                permissionId: 'aa6ec00b-e8c6-45d9-b5c9-b256140902fb',
                permission: 'view_contact_details',
                group: 'Contact Details'
            },
            {
                permissionId: '2a719de5-6536-4e1b-9aca-b5d4b3403c63',
                permission: 'view_nationality',
                group: 'Nationality'
            },
            {
                permissionId: 'd5a8615a-8bb1-44bf-896d-1fbfec1abb95',
                permission: 'view_appraisals',
                group: 'Performance Management'
            },
            {
                permissionId: '6aeb5f0a-2d4c-4abc-ab0c-e5d6c658b3ed',
                permission: 'view_job_descriptions',
                group: 'Performance Management'
            },
            {
                permissionId: '5e4b1a05-7481-475e-8e4e-5a4a2c7caeb4',
                permission: 'view_performance_metrics',
                group: 'Performance Management'
            }
        ]
    }
];

export default sampleRoles;
