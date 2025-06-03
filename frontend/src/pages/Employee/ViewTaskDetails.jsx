import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { AvatarGroup, DashboardLayout, Loading } from '../../components/index'
import moment from 'moment';
import { formatName } from '../../utils/helper';
import { LuSquareArrowRight } from 'react-icons/lu';

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
                                <h2 className='text-sm md:text-xl font-semibold'>
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

                            <div className='mt-4'>
                                <InfoBox label='Descpription' value={task?.description} />
                            </div>

                            <div className='grid grid-cols-12 gap-4 mt-4'>
                                <div className='col-span-6 md:col-span-4'>
                                    <InfoBox label='Priority' value={formatName(task?.priority)} />
                                </div>
                                <div className='col-span-6 md:col-span-4'>
                                    <InfoBox label='Due Data'
                                        value={
                                            task?.dueTo
                                                ? moment(task?.dueTo).format('Do MMM YYYY')
                                                : 'N/A'
                                        } />
                                </div>

                                <div className='col-span-6 md:col-span-4'>
                                    <label className='text-xs font-medium text-slate-500'>
                                        Assinged To
                                    </label>

                                    <AvatarGroup avatars={
                                        task?.assignedTo?.map((user) => user?.profileImageUrl)
                                    }
                                        maxVisible={task?.assignedTo?.length}
                                    />
                                </div>
                            </div>

                            <div className='mt-2'>
                                <label className='text-xs font-medium text-slate-500'>
                                    Todo Checklist
                                </label>

                                {task?.todoList?.map((todo, idx) => (
                                    <TodoCheclist
                                        key={`todo_${idx}`}
                                        text={todo.text}
                                        isChanged={todo?.completed}
                                        onChange={() => updateTodoCheckList(idx)}
                                    />
                                ))}
                            </div>

                            {task?.attachments?.length > 0 && (
                                <div className='mt-2'>
                                    <label className='text-xs font-medium text-slate-500'>
                                        Attachments
                                    </label>

                                    {task?.attachments?.map((link, idx) => (
                                        <Attachment
                                            key={`link_${idx}`}
                                            link={link}
                                            index={idx}
                                            onClick={() => handleLinkClick(link)}
                                        />
                                    ))}
                                </div>
                            )}
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
        <>
            <label className='text-xs font-medium text-slate-500'>{label}</label>

            <p className='text-[11px] md:text-[13px] font-medium text-gray-700 mt-0.5'>
                {value}
            </p>
        </>
    )
}

const TodoCheclist = ({ text, isChanged, onChange }) => {
    return (
        <div className='flex items-center gap-3 p-3'>
            <input
                className='w-4 h-4 text-primary bg-gray-200 border-gray-300 rounded-sm cursor-pointer'
                type="text"
                checked={isChanged}
                onChange={onChange}
            />

            <p className='text-[13px] text-gray-800'>{text}</p>
        </div>
    )
}