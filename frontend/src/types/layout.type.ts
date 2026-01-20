import { ReactNode } from 'react';

export type ActiveMenu = 'Create Task' | 'Dashboard' | 'Team Members' | 'Manage Tasks' | 'My Tasks'

export interface WithActiveMenu {
    activeMenu?: ActiveMenu;
}

export interface DashboardLayoutProps extends WithActiveMenu {
    children: ReactNode;
}
