import React, { useEffect } from 'react'
import { DashboardLayout, UserCard } from '../../components/index'
import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'

const ManageEmployees = () => {
    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllUsers = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (response?.data?.data?.length > 0) {
                setAllUsers(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadReport = async () => { }

    useEffect(() => {
        getAllUsers();

        return () => {
            setAllUsers([]);
        }
    }, [])
    return (
        <DashboardLayout activeMenu='Team Members' >
            <div className='mt-5 mb-10'>
                <div className='flex md:flex-row flex-col justify-between md:items-center'>
                    <h2 className='text-xl md:text-xl font-medium'>Team Members</h2>

                    <button
                        className='flex md:flex download-btn'
                        onClick={handleDownloadReport}
                    >
                        <LuFileSpreadsheet className='text-lg' />
                        <span>Download</span>
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                    {allUsers?.map((user) => (
                        <UserCard key={user._id} userInfo={user} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ManageEmployees