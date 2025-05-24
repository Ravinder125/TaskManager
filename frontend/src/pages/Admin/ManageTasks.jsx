import React, { useEffect, useState } from 'react'
import {
    DashboardLayout,
    Loading,
    TaskCard,
    TaskStatusTabs
} from '../../components/index'
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
                    status: filterStatus === 'all'
                        ? ''
                        : (filterStatus === 'in Progress'
                            ? 'in-progress'
                            : filterStatus)
                },
                withCredentials: true,
            });

            setAllTasks(response.data?.data.tasks.length > 0 ? response.data.data.tasks : [])
            // Map statusSummary data will fixed labels and order
            const statusSummary = response.data?.data?.statusSummary
            console.log(statusSummary)
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
        if (taskData && taskData._id) {
            console.log(taskData._id)
            navigate('/admin/create-task', { state: { taskId: taskData._id } });
        }
    }

    // Download task report
    const handleDownloadReport = () => { };

    useEffect(() => {
        getAllTasks();
    }, [filterStatus])

    if (loading) return <Loading />
    return (
        <DashboardLayout activeMenu='Manage Tasks'>
            <div className='my-8 w-full '>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex items-center justify-between gap-4'>
                        <h2 className='text-2xl font-semibold text-gray-800'>My Tasks</h2>
                        <button
                            className='flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-green-700 transition-colors duration-150 lg:hidden'
                            onClick={handleDownloadReport}
                        >
                            <LuFileSpreadsheet className='text-xl' />
                            <span className='text-[13px] sm:text-normal'>Download Report</span>
                        </button>
                    </div>

                    {tabs.length > 0 && (
                        <div className='flex items-center gap-4'>
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />

                            <button
                                className='hidden lg:flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-green-700 transition-colors duration-150'
                                onClick={handleDownloadReport}
                            >
                                <LuFileSpreadsheet className='text-xl' />
                                <span>Download Report</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className='grid grid-cols1 md:grid-cols-3 gap-4 mt-4'>
                    {allTasks?.map((task, idx) => (
                        <TaskCard
                            key={idx}
                            title={task.title}
                            description={task.description}
                            priority={task.priority}
                            status={task.status}
                            progress={task.progress}
                            dueData={task.dueTo}
                            createdAt={task.createdAt}
                            assignedTo={task.assignedTo}
                            attachmentCount={task.attachments.length}
                            completedTodoCount={task.completedTodoCount}
                            todoCheckList={task.todoList}
                            onClick={() => {
                                handleClick(task)
                            }}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ManageTasks