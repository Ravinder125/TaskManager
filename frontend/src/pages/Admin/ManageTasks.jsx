import React, { useEffect, useState } from 'react'
import { DashboardLayout, Loading, TaskStatusTabs } from '../../components/index'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';

const ManageTasks = () => {
    const [allTasks, setAllTasks] = useState([]);

    const [tabs, setTabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const navigate = useNavigate();


    const getAllTasks = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === 'all' ? '' : filterStatus
                },
                withCredentials: true,
            });

            setAllTasks(response.data?.data.tasks.length > 0 ? response.data.data.tasks : [])
            console.log(response.data.data.tasks);

            // Map statusSummary data will fixed labels and order
            const statusSummary = response.data?.data?.statusSummary

            const statusArray = [
                { label: 'All', count: statusSummary.allTasks || 0 },
                { label: 'Pending', count: statusSummary.pendingTasks || 0 },
                { label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
                { label: 'Completed', count: statusSummary.completedTasks || 0 },
            ]
            setTabs(statusArray)
        } catch (error) {
            console.error(error.data?.message || ('Error fetching tasks ', error))
        } finally {
            setLoading(false);
        }
    };


    const handleClick = (taskData) => {
        navigate('/admin/create/task', { state: { taskId: taskData._id } })
    }

    // Download task report
    const handleDownloadReport = () => { };

    useEffect(() => {
        const see = async () => {
            await getAllTasks();
            console.log(allTasks.length > 0)

        }
        see()
    }, [filterStatus])

    if (loading) return <Loading />
    return (
        <DashboardLayout activeMenu='Manage Tasks' >
            <div className='my-5'>
                <div className=' flex flex-col lg:flex-row md:items-center justify-center'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>

                        <button
                            className='flex lg:hidden download-btn'
                            onClick={handleDownloadReport}
                        >
                            <LuFileSpreadsheet className='text-lg' />
                            Download Report
                        </button>
                    </div>

                    {allTasks.length > 0 && (
                        <div className='flex items-center gap-3'>
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />

                            <button
                                className='hidden lg:flex download-btn'
                                onClick={handleDownloadReport}
                            >
                                <LuFileSpreadsheet className='text-lg' />
                                Download Report
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ManageTasks