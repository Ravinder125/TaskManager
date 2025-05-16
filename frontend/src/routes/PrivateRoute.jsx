import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(UserContext)

    if (loading) return null

    console.log(user.role, allowedRoles)
    console.log(allowedRoles.includes(user.role))
    if (!user || !(allowedRoles.includes(user.role))) {
        { console.log(<Outlet />) }
        return <Navigate to='/login' />
    } else {
        return <Outlet />;
    }

}

export default PrivateRoute