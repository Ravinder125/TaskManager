import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import { Loading } from '../components'

const PrivateRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useContext(UserContext)
    if (loading) return <Loading />
    if (
        !isAuthenticated ||
        !(allowedRoles.includes(user?.role))
    ) {
        return <Navigate to='/login' />
    } else {
        return <Outlet />;
    }

}

export default PrivateRoute 