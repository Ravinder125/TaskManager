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
    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_TASKS, {
                responseType: 'blob',
            })

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('Download', 'tasks_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);

        }
    }

    useEffect(() => {
        getAllTasks();
    }, [filterStatus])

    if (loading) return <Loading />
    return (
        <DashboardLayout activeMenu='Manage Tasks'>
            <div className='my-8 w-full '>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex flex-col sm:flex-row lg:items-center justify-center sm:gap-4'>
                        <h2 className='text-2xl font-semibold text-gray-800'>My Tasks</h2>
                        <button
                            className='flex lg:hidden self-end lg:self-normal download-btn'
                            onClick={handleDownloadReport}
                        >
                            <LuFileSpreadsheet className='text-xl ' />
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
                                className='hidden self-end w-fit lg:flex download-btn'
                                onClick={handleDownloadReport}
                            >
                                <LuFileSpreadsheet className='text-xl' />
                                <span>Download Report</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4'>
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