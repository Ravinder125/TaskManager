import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { DashboardLayout, Loading } from '../../components/index'

const ViewTaskDetails = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getStatusTagColor = (status) => {
        switch (status) {
            case 'InProgress':
                return 'text-cyan-500 bg-cyan-50 border broder-cyan-500/10';
            case 'completed':
                return 'text-lime-500 bg-lime-50 border border-lime-500/10';
            default:
                return 'text-violet-500 bg-violet-50 border border-violet-500/10';
        }
    }

    // Get Task info by ID
    const getTaskById = async () => {
        try {
            setError("");
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
            if (response?.data?.data) {
                setTask(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching task details:', error);
            setError(error?.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false);
        }
    }

    const updateTodoCheckList = async (index) => { }

    // handle attachment Link click
    const handleLinkClick = (link) => {
        window.open(link, "_blank")
    }

    useEffect(() => {
        if (taskId) {
            getTaskById();
        }

        return () => { };
    }, [taskId])

    // handle todo check list
    if (loading) return <Loading />
    return (
        <DashboardLayout activeMenu='My Tasks'>
            <div className='mt-5'>
                {task && (
                    <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
                        <div className='form-card col-span-3'>
                            <div className='flex items-cneter justify-between'>
                                <h2 className='text-xl md:text-xl font-medium'>
                                    {task?.title}
                                </h2>

                                <div
                                    className={`text-[13px] font-medium ${getStatusTagColor(
                                        task?.status
                                    )} px-4 py-0.5 rounded`}
                                >
                                    {task?.status}
                                </div>
                            </div>

                            <div className=''>
                                <InfoBox label='Descpription' value={task?.Description} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default ViewTaskDetails

const InfoBox = ({ label, value }) => {
    return (
        <div className=''>{label}</div>
    )
} 