import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { AvatarGroup, CreateTaskSkeleton, DashboardLayout, Loading, Modal } from '../../components/index'
import moment from 'moment';
import { formatName } from '../../utils/helper';
import { LuArrowBigLeft, LuArrowLeft, LuSquareArrowOutUpRight, LuUsers } from 'react-icons/lu';
import { StatusValueType, TaskType } from '../../types/task.type';

type Task = TaskType & { status: StatusValueType }

const ViewTaskDetails: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();

    const [task, setTask] = useState<Task | null>(null);
    const [viewUsers, setViewUsers] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const getStatusTagColor = (status: string): string => {
        switch (status) {
            case 'in-progress':
                return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
            case 'completed':
                return 'text-lime-500 bg-lime-50 border border-lime-500/10';
            default:
                return 'text-violet-500 bg-violet-50 border border-violet-500/10';
        }
    };

    const getTaskById = async (): Promise<void> => {
        try {
            setError("");
            setLoading(true);

            const response = await axiosInstance.get(
                API_PATHS.TASKS.GET_TASK_BY_ID(taskId!)
            );

            if (response?.data?.data) {
                setTask(response.data.data);
            }
        } catch (err: any) {
            console.error('Error fetching task details:', err);
            setError(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const updateTodoCheckList = async (index: number): Promise<void> => {
        if (!task) return;

        const todoChecklist = [...task.todoList];
        todoChecklist[index].completed = !todoChecklist[index].completed;

        try {
            const response = await axiosInstance.put(
                API_PATHS.TASKS.UPDATE_TASK_TODO_CHECKLIST(taskId!),
                { todoChecklist }
            );

            if (response.status === 200) {
                setTask(response.data.data);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Something went wrong');
        }
    };

    const handleLinkClick = (link: string): void => {
        if (!/^https?:\/\//i.test(link)) {
            link = `https://${link}`;
        }
        window.open(link, "_blank");
    };

    useEffect(() => {
        if (taskId) {
            getTaskById();
        }
    }, [taskId]);

    if (loading) return <CreateTaskSkeleton />;

    return (
        <DashboardLayout activeMenu='My Tasks'>
            <div className='my-5'>
                {task && (
                    <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
                        <div className='form-card col-span-3'>
                            <div className='flex flex-col'>
                                <Link
                                    to='/employee/tasks'
                                    className='w-fit hover:bg-black/10 hover:text-black text-neutral-600 rounded-lg px-2 py-2 transition-all duration-200 ease-in-out dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-stone-700'>
                                    <LuArrowLeft className='text-xl' />
                                </Link>

                                <div className='flex items-center justify-between'>
                                    <h2 className='text-sm md:text-xl font-semibold '>
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
                                <InfoBox label='Description' value={task?.description} />
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

                                <div className='col-span-6 md:col-span-4' onClick={() => setViewUsers(true)}>
                                    <label className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>
                                        Assigned To
                                    </label>

                                    <AvatarGroup avatars={
                                        task?.assignedTo?.map((user) => user?.profileImageUrl)
                                    }
                                        maxVisible={task?.assignedTo?.length >= 5 ? 5 : task?.assignedTo?.length}
                                    />
                                </div>
                            </div>

                            <div className='mt-2'>
                                <label className='text-xs font-base dark:text-neutral-200m text-neutral-500 dark:text-neutral-300'>
                                    Todo Checklist
                                </label>

                                {task?.todoList?.map((todo, idx) => (
                                    <TodoChecklist
                                        key={`todo_${todo.text}`}
                                        idx={idx}
                                        text={todo.text}
                                        isChanged={todo?.completed}
                                        onChange={() => updateTodoCheckList(idx)}
                                        completed={todo.completed}
                                    />
                                ))}
                            </div>

                            {task?.attachments?.length > 0 && (
                                <div className='mt-2'>
                                    <label className='text-xs font-medium text-neutral-500 dark:text-neutral-300'>
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

            {/* Assigned users */}
            <Modal
                isOpen={viewUsers}
                onClose={() => setViewUsers(false)}
                title="View Users" >
                {loading ? (
                    <div className='mx-auto w-fit text-black dark:text-white '>Loading...</div>
                ) : (
                    <div className='h-[60vh] overflow-y-auto'>
                        {task?.assignedTo?.map((user) => (
                            <div
                                key={`user-${user._id}`}
                                className='flex items-center gap-4 p-3 border-b border-neutral-100 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'
                            >
                                {user?.profileImageUrl
                                    ? (
                                        <img
                                            src={user.profileImageUrl}
                                            alt={formatName(user.fullName)}
                                            className='w-12 h-12 rounded-full border-1 border-white dark:border-neutral-500'
                                        />
                                    ) : (
                                        <LuUsers className='text-4xl text-primary rounded-full dark:text-dark-primary bg-inherit w-12 h-12 border-2' />
                                    )

                                }
                                <div className='flex-1'>
                                    <p className='font-medium text-neutral-600 dark:text-neutral-200'>
                                        {formatName(user?.fullName)}
                                    </p>
                                    <p className='text-[13px] text-neutral-500 dark:text-neutral-400'>{user?.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </Modal>
        </DashboardLayout >
    )
}

export default ViewTaskDetails

const InfoBox = ({ label, value }) => {
    return (
        <>
            <label className='text-xs font-medium text-neutral-500 dark:text-neutral-300'>{label}</label>

            <p className='text-[11px] md:text-[13px] font-medium text-neutral-700 mt-0.5 dark:text-neutral-100'>
                {value}
            </p>
        </>
    )
}

const TodoChecklist = ({ text, isChanged, onChange, idx, completed }) => {
    return (
        <div className='flex gap-2 bg-neutral-200 items-center border border-neutral-300 px-3 py-2 rounded-sm mb-3 mt-2 dark:bg-neutral-700 dark:border-dark-border'
        >
            <input
                className='w-4 h-4 text-primary border border-neutral-400 rounded-sm cursor-pointer'
                type="checkbox"
                checked={isChanged}
                onChange={onChange}
            />

            <p
                className='text-xs self-start overflow-hidden line-clamp-1  duration-200'
            >
                <span className='text-xs text-neutral-600 font-semibold mr-2 dark:text-neutral-300'>
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                </span>
                <span className='text-black dark:text-neutral-100'
                    style={{
                        textDecoration: completed ? "line-through" : "none",
                    }}
                >
                    {text}
                </span>
            </p>
        </div >
    )
}

const Attachment = ({ link, index, onClick }) => {
    return (
        <div
            className='flex gap-2 bg-neutral-200 items-center border border-neutral-300 px-3 py-2 rounded-sm mb-3 mt-2 dark:bg-neutral-700 dark:border-dark-border'

            onClick={onClick}
        >
            <div className='flex-1 flex items-center gap-3'>
                <div className='flex items-center text-xs gap-x-2 dark:text-neutral-200 text-neutral-900'>
                    <span className='font-semibold'>
                        {index < 9 ? `0${index + 1}` : index + 1}
                    </span>

                    <p className='text-xs '>{link}</p>
                </div>

            </div>
            <LuSquareArrowOutUpRight />

        </div>
    )
}