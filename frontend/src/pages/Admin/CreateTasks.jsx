import React, { useState } from 'react'
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import {
    DashboardLayout,
    SelectUsers,
    SelectDropdown,
} from '../../components/index';

const CreateTasks = () => {
    const location = useLocation();
    const { toast } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "",
        dueTo: null,
        assignedTo: [],
        todoList: [],
        attachments: [],
    })

    const [currentTask, setCurrentTask] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const handleInputChange = (key, value) => {
        setTaskData((prev) => ({ ...prev, [key]: value }))
    }

    const [selectedUser, setSelectedUsers] = useState([]);

    const taskId = null;
    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "",
            dueTo: null,
            assignedTo: [],
            todoList: [],
            attachments: [],
        })
    }

    // Create task 
    const createTask = () => { };

    // Update task
    const updateTask = () => { };

    // Get task by id
    const getTaskById = () => { };

    // Delete task 
    const deleteTask = () => { };
    return (
        <DashboardLayout activeMenu='Create Task' >
            <div className='mt-5'>
                <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
                    <div className='form-card col-span-3'>
                        <div className='flex justify-bewteen items-center'>
                            <h2 className='text-xl md:text-xl font-medium'>
                                {taskId ? "Update Task" : "Create Task"}
                            </h2>

                            {taskId && (
                                <button
                                    className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor pointer'
                                    onClick={() => setOpenDeleteAlert(true)}
                                >
                                    <LuTrash2 className='text-base' />
                                    Delete
                                </button>
                            )}
                        </div>

                        <div className='mt-4'>
                            <label
                                htmlFor="Title"
                                className='text-xs font-medium text-slate-600'
                            >
                                Task title
                            </label>

                            <input
                                className='form-input'
                                name='title'
                                type="text"
                                placeholder='Create App Ui'
                                value={taskData.title}
                                onChange={({ target }) => handleInputChange(target.name, target.value)}
                            />
                        </div>

                        <div className='mt-3'>
                            <label
                                htmlFor="Description"
                                className='text-xs font-medium text-slate-600'
                            >
                                Description
                            </label>

                            <textarea
                                className='form-input max-h-30'
                                name='description'
                                value={taskData.description}
                                onChange={({ target }) => handleInputChange(target.name, target.value)}
                                placeholder='Describe task'
                            />
                        </div>

                        <div className='grid grid-cols-12 gap-4 mt-2'>
                            <div className='col-span-6 md:col-span-4'>
                                <label
                                    htmlFor="Priority"
                                    className='text-xs font-medium text-slate-600 '
                                >
                                    Priority
                                </label>

                                <SelectDropdown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleInputChange("priority", value)}
                                    placeholder='Select Priority'
                                />
                            </div>

                            <div className='col-span-6 md:col-span-4 '>
                                <label
                                    htmlFor="Due Date"
                                    className="text-xs text-slate-600 font-medium"
                                >
                                    Due Date
                                </label>

                                <input
                                    className="form-input"
                                    placeholder='Create App Ui'
                                    type="date"
                                    name='dueTo'
                                    value={taskData.dueTo}
                                    onChange={({ target }) => handleInputChange(target.name, target.value)}
                                />
                            </div>

                            <div className='col-span-12 md:col-span-3'>
                                <label
                                    htmlFor="Select User"
                                    className='text-xs font-medium text-slate-600'
                                >
                                    Assign To
                                </label>

                                <SelectUsers
                                    selectedUser={taskData.assignedTo}
                                    setSelectedUsers={(value) => handleInputChange("assignedTo", value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default CreateTasks