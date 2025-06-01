import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ViewTaskDetails = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getStatusTagColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'text-cyan-500 bg-cyan-50 border broder-cyan-500/10';
            case 'Completed':
                return 'text-lime-500 bg-lime-50 border border-lime-500/10';
            default:
                return 'text-violet-500 bg-violet-50 border border-violet-500/10';
        }
    }

    // Get Task info by ID
    const getTaskById = async () => {
        try {
            setError("");
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

    // handle todo check list
    const updateTodoCheckList = async (index) => { }

    // handle attachment Link click
    const handleLinkClick = (link) => { }
    return (
        <div>ViewTaskDetails</div>
    )

    useEffect(() => {
        if (taskId) {
            getTaskById();
        }

        return () => { };
    }, [taskId])
}

export default ViewTaskDetails