import React, { useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/index'

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await axiosInstance.get(API_PATHS.AUTH.LOGOUT);
                navigate('/login')
            } catch (error) {
                console.error('Error logout the user:', error)
            }
        }
        handleLogout();
    }, [])
    return (
        <Loading />
    )
}

export default Logout