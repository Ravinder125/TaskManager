import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { AvatarGroup, CreateTaskSkeleton, DashboardLayout, Loading } from '../../components/index'
import moment from 'moment';
import { formatName } from '../../utils/helper';
import { LuArrowBigLeft, LuArrowLeft, LuSquareArrowOutUpRight } from 'react-icons/lu';

const ViewTaskDetails = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getStatusTagColor = (status) => {
        switch (status) {
            case 'In progress':
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

    const updateTodoCheckList = async (index) => {
        const todoChecklist = [...task?.todoList];

        if (todoChecklist && todoChecklist[index]) {
            todoChecklist[index].completed = !todoChecklist[index].completed;

            try {
                const response = await axiosInstance.put(
                    API_PATHS.TASKS.UPDATE_TASK_TODO_CHECKLIST(taskId),
                    { todoChecklist }
                )

                if (response.status = 200) {
                    setTask(response?.data?.data || task)
                } else {
                    // OPtionally revert the toggle if the API call fails
                    todoChecklist[index].completed = !todoChecklist[index].completed
                }
            } catch (err) {
                console.error('Error while updating todo list', err)
                setError(err?.response?.data?.message || 'something went wrong')
            }
        }
    }

    // handle attachment Link click
    const handleLinkClick = (link) => {
        if (!/^https?:\/\//i.test(link)) {
            link = "https://" + link; // Default to HTTPs
        }
        window.open(link, "_blank")
    }

    useEffect(() => {
        if (taskId) {
            getTaskById();
        }

        return () => { };
    }, [taskId, setTask])

    // handle todo check list
    if (loading) return <CreateTaskSkeleton />
    return (
        <DashboardLayout activeMenu='My Tasks'>
            <div className='my-5'>
                {task && (
                    <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
                        <div className='form-card col-span-3'>
                            <div className='flex flex-col'>
                                <Link
                                    to='/employee/tasks'
                                    className='w-fit hover:bg-black/10 hover:text-black text-gray-600 rounded-lg px-2 py-2 transition-all duration-200 ease-in-out'>
                                    <LuArrowLeft className='text-xl' />
                                </Link>

                                <div className='flex items-cneter justify-between'>
                                    <h2 className='text-sm md:text-xl font-semibold'>
                                        {task?.title}
                                    </h2>

                                    <div
                                        className={`text-[13px] font-medium ${getStatusTagColor(
                                            task.status === 'in-progress' ?
                                                task?.status[0].toUpperCase() + task?.status?.slice(1).replace('-', ' ')
                                                : task?.status
                                        )} px-4 py-0.5 rounded`}
                                    >
                                        {task.status === 'in-progress' ?
                                            task?.status[0].toUpperCase() + task?.status?.slice(1).replace('-', ' ')
                                            : formatName(task?.status)}
                                    </div>
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

                            {error && (<p className='text-xs text-rose-600 mt-4'>Error: {error}</p>)}
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
        <div className='flex items-center gap-3 p-3 mt-2 rounded-md'>
            <input
                className='w-4 h-4 text-primary border border-gray-400 rounded-sm cursor-pointer'
                type="checkbox"
                checked={isChanged}
                onChange={onChange}
            />

            <p className='text-[13px] font-medium text-gray-800'>{text}</p>
        </div>
    )
}

const Attachment = ({ link, index, onClick }) => {
    return (
        <div
            className='flex justify-between bg-gray-50 border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer'
            onClick={onClick}
        >
            <div className='flex-1 flex items-center gap-3'>
                <div className='flex items-center text-sm gap-x-2 '>
                    <span className='font-semibold text-xs text-gray-600'>
                        {index < 9 ? `0${index + 1}` : index + 1}
                    </span>

                    <p className='text-xs text-black'>{link}</p>
                </div>

            </div>
            <LuSquareArrowOutUpRight />

        </div>
    )
}