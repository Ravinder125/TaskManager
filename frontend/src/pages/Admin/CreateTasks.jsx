import React, { useState, useEffect } from 'react';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import {
    DashboardLayout,
    SelectUsers,
    SelectDropdown,
    TodoListInput,
    AddAttachmentsInput,
    Loading
} from '../../components/index';

const CreateTasks = () => {
    const { taskId } = useParams(); // for future use when updating
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: '',
        dueTo: '',
        assignedTo: [],
        todoList: [],
        attachments: [],
    });

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    // Handle input change
    const handleInputChange = (key, value) => {
        setTaskData((prev) => ({ ...prev, [key]: value }));
    };

    const clearData = () => {
        setTaskData({
            title: '',
            description: '',
            priority: '',
            dueTo: '',
            assignedTo: [],
            todoList: [],
            attachments: [],
        });
        setSelectedUsers([]);
    };

    // Create task
    const createTask = async () => {
        setError("")
        const payload = {
            ...taskData,
            assignedTo: selectedUsers,
            dueTo: new Date((taskData.dueTo).toString()),
        };
        console.log(payload)

        // Validate required fields
        const isInvalid = Object.entries(payload).some(([key, value]) => {
            if (key === 'dueTo' || key === 'priority') return false;
            if (Array.isArray(value)) {
                const validated = value.length === 0 && (key === 'assignedTo' || key === 'todoList')
                if (validated) {
                    key === 'assignedTo' ? setError('Task not assigned to any member') : setError('Add at least on todo')
                }
                return validated
            }
            setError(`${key.charAt(0).toUpperCase()}${key.slice(1, key.length)} is required`)
            return typeof value === 'string' && value.trim() === '';
        });
        if (isInvalid) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setError("")
        try {
            setLoading(true);
            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, payload);
            console.log(response.data.message, response.data.data)
            clearData();
            toast.success('Task created successfully')
            // navigate('/admin/tasks');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong');
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    // Future features
    const updateTask = () => { };
    const getTaskById = () => { };
    const deleteTask = () => { };

    if (loading) return <Loading />
    return (
        <DashboardLayout activeMenu='Create Task'>
            <div className='' >
                <div className='grid grid-cols-1 md:grid-cols-4 my-4'>
                    <div className='form-card col-span-3'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-xl font-medium'>
                                {taskId ? 'Update Task' : 'Create Task'}
                            </h2>
                            {taskId && (
                                <button
                                    className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300'
                                    onClick={() => setOpenDeleteAlert(true)}
                                >
                                    <LuTrash2 className='text-base' />
                                    Delete
                                </button>
                            )}
                        </div>

                        <div className='mt-4'>
                            <label htmlFor='title' className='text-xs font-medium text-slate-600'>
                                Task Title
                            </label>
                            <input
                                id='title'
                                name='title'
                                type='text'
                                className='form-input'
                                placeholder='e.g. Build landing page UI'
                                value={taskData.title}
                                onChange={({ target }) => handleInputChange(target.name, target.value)}
                            />
                        </div>

                        <div className='mt-3'>
                            <label htmlFor='description' className='text-xs font-medium text-slate-600'>
                                Description
                            </label>
                            <textarea
                                id='description'
                                name='description'
                                className='form-input max-h-30'
                                placeholder='Describe the task details'
                                value={taskData.description}
                                onChange={({ target }) => handleInputChange(target.name, target.value)}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-4'>
                            <div className='w-full'>
                                <label htmlFor='priority' className='text-xs font-medium text-slate-600'>
                                    Priority
                                </label>
                                <SelectDropdown
                                    id='priority'
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleInputChange('priority', value)}
                                    placeholder='Select Priority'
                                />
                            </div>

                            <div className='w-full'>
                                <label htmlFor='dueTo' className='text-xs font-medium text-slate-600'>
                                    Due Date
                                </label>
                                <input
                                    id='dueTo'
                                    type='date'
                                    name='dueTo'
                                    className='form-input'
                                    value={taskData.dueTo}
                                    onChange={({ target }) => handleInputChange(target.name, target.value)}
                                />
                            </div>

                            <div className='w-full'>
                                <label htmlFor='assignTo' className='text-xs font-medium text-slate-600'>
                                    Assign To
                                </label>
                                <SelectUsers
                                    selectedUsers={selectedUsers}
                                    setSelectedUsers={setSelectedUsers}
                                />
                            </div>

                        </div>
                        <div className='mt-3 w-full'>
                            <label className='text-xs font-medium text-slate-600' >
                                TODO Checklist
                            </label>

                            <TodoListInput
                                todoList={taskData?.todoList}
                                setTodoList={(value) =>
                                    handleInputChange("todoList", value)
                                }
                            />
                        </div>

                        <div className='mt-3'>
                            <label className='text-xs font-medium text-slate-600'>
                                Add Attachments
                            </label>

                            <AddAttachmentsInput
                                attachments={taskData.attachments}
                                setAttachments={(value) =>
                                    handleInputChange("attachments", value)
                                }
                            />
                        </div>

                        {error && (
                            <div className='text-xs font-mdedium text-red-500 mt-5'>{error}</div>
                        )}
                        <div className='mt-7 flex justify-end mt-7'>
                            {taskId ? (
                                <button
                                    disabled={loading}
                                    onClick={updateTask}
                                    className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
                                >
                                    Update Task
                                </button>
                            ) : (
                                <button
                                    disabled={loading}
                                    onClick={createTask}
                                    className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
                                >
                                    Create Task
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateTasks;
