import React, { useState } from 'react'
import useUserAuth from '../../hooks/useUserAuth'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { DashboardLayout } from '../../components/index'

const EmployeeDashboard = () => {
    useUserAuth();
    const [activeMenu, setActiveMenu] = useState(false)

    const { user } = useContext(UserContext);
    const data = JSON.stringify(user)
    return (
        <DashboardLayout activeMenu={''}>
            <div>Dashboard</div>
        </DashboardLayout>
    )
}

export default EmployeeDashboard