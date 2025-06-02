import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
} from 'react-icons/lu';

const SIDE_MENU_DATA = [
    {
        id: '01',
        label: 'Dashboard',
        icon: LuLayoutDashboard,
        path: '/admin/dashboard',
    },
    {
        id: '02',
        label: 'Manage Tasks',
        icon: LuClipboardCheck,
        path: '/admin/tasks',
    },
    {
        id: '03',
        label: 'Create Task',
        icon: LuSquarePlus,
        path: '/admin/create-task',
    },
    {
        id: '04',
        label: 'Team Members',
        icon: LuUsers,
        path: '/admin/employees',
    },
    {
        id: '05',
        label: 'Logout',
        icon: LuLogOut,
        path: '/logout',
    },
];

const SIDE_MENU_EMPLOYEE_DATA = [
    {
        id: '01',
        label: 'Dashboard',
        icon: LuLayoutDashboard,
        path: '/employee/dashboard'
    },
    {
        id: '02',
        label: 'My Tasks',
        icon: LuClipboardCheck,
        path: '/employee/tasks'
    },
    {
        id: '03',
        label: 'Logout',
        icon: LuLogOut,
        path: '/logout'
    },
]

const PRIORITY_DATA = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
];

const STATUS_DATA = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
]

export {
    SIDE_MENU_DATA,
    SIDE_MENU_EMPLOYEE_DATA,
    PRIORITY_DATA,
    STATUS_DATA,
}