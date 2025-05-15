import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(UserContext)

    if (loading) return null

    if (!user || !allowedRoles.includes(user.role)) {
        <Navigate to='/login' />
        return;
    }

    return <Outlet />
}

export default PrivateRoute