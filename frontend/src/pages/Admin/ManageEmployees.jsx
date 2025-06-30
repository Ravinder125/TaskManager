import React, { useEffect } from 'react'
import { DashboardLayout, Loading, UserCard } from '../../components/index'
import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import ManageEmployeeSkeleton from '../../components/Skeletons/ManageEmployeeSkeleton'

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

    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_USERS, {
                responseType: 'blob', // Important for downloading files
            })
            // Create a Url for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url
            link.setAttribute('Download', 'users_report.xlsx'); // Set the file name
            document.body.appendChild(link);
            link.click(); // Trigger the download
            link.parentNode.removeChild(link); // Clean up the link element
            window.URL.revokeObjectURL(url); // Free up memory
        } catch (error) {
            console.error('Error downloading report:', error);

        }
    }

    useEffect(() => {
        getAllUsers();

        return () => {
            setAllUsers([]);
        }
    }, [])

    if (loading) return <ManageEmployeeSkeleton />
    return (
        <DashboardLayout activeMenu='Team Members' >
            <div className='mt-5 mb-10'>
                <div className='flex md:flex-row gap-2 md:gap-0 flex-col justify-between md:items-center'>
                    <h2 className='text-xl md:text-xl  font-medium'>Team Members</h2>

                    <button
                        className='flex self-end md:flex w-fit download-btn'
                        onClick={handleDownloadReport}
                    >
                        <LuFileSpreadsheet className='text-lg' />
                        <span>Download Report</span>
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