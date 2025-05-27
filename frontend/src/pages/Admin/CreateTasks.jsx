import { useState, useEffect } from 'react';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import {
    DashboardLayout,
    SelectUsers,
    SelectDropdown,
    TodoListInput,
    AddAttachmentsInput,
    Loading,
    Modal,
    DeleteAlert,
} from '../../components/index';

const CreateTasks = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
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

    const [currentTask, setCurrentTask] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

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

    const validateFields = (payload) => {
        switch (true) {
            case !payload.title:
                setError("Title is required");
                return false;
            case !payload.description:
                setError("Description is required");
                return false;
            case !payload.priority:
                setError("Priority is required");
                return false;
            case !payload.dueTo:
                setError("Due date is required");
                return false;
            case !Array.isArray(payload.assignedTo) || payload.assignedTo.length === 0:
                setError("Task not assigned to any member");
                return false;
            case !Array.isArray(payload.todoList) || payload.todoList.length === 0:
                setError("Add at least one todo");
                return false;
            default:
                return true;
        }
    };

    const createTask = async () => {
        setError("");

        taskData.todoList = taskData.todoList
        const payload = {
            ...taskData,
            assignedTo: selectedUsers.map(user =>
                typeof user === 'string' ? user : user._id
            ),
            dueTo: new Date(taskData.dueTo),
        };

        if (!validateFields(payload)) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, payload);
            clearData();
            toast.success('Task created successfully');
            navigate('/admin/tasks');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong');
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async () => {
        setError("");
        const todoList = taskData.todoList

        const payload = {
            ...taskData,
            todoList,
            assignedTo: selectedUsers.map(user =>
                typeof user === 'string' ? user : user._id
            ),
            dueTo: new Date(taskData.dueTo),
        };

        if (!validateFields(payload)) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), payload);
            toast.success('Task successfully updated');
            navigate('/admin/tasks');
        } catch (error) {
            console.error('Error updating the task', error);
            setError(error.response?.data?.message || 'Something went wrong');
            toast.error('Failed to update task');
        } finally {
            setLoading(false);
        }
    };

    const getTaskById = async (taskId) => {
        setError("");
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
            if (response?.data?.data) {
                const taskInfo = response.data.data;
                setCurrentTask(taskInfo);
                setTaskData({
                    title: taskInfo.title,
                    description: taskInfo.description,
                    priority: taskInfo.priority,
                    dueTo: taskInfo.dueTo ? moment(taskInfo.dueTo).format('YYYY-MM-DD') : '',
                    assignedTo: taskInfo.assignedTo || [],
                    todoList: taskInfo.todoList?.map((todo) => (
                        { text: todo.text, completed: todo.completed }
                    )) || [],
                    attachments: taskInfo.attachments || [],
                });
                setSelectedUsers(taskInfo.assignedTo);
            }
        } catch (error) {
            console.error('Error while fetching task data', error);
            setError(error.response?.data?.message || 'Something went wrong');
            toast.error('Failed to fetch task');
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.TOGGLE_DELETE_TASK(taskId));
            toast.success('Task deleted successfully');
            navigate('/admin/tasks');
        } catch (error) {
            console.error('Error deleting task', error);
            setError(error.response?.data?.message || 'Something went wrong');
            toast.error('Failed to delete task');
        }
    };
    useEffect(() => {
        if (taskId) {
            getTaskById(taskId);
        } else {
            // If not editing, clear task data and currentTask
            clearData();
            setCurrentTask(null);
            setSelectedUsers([]);
        }
    }, [taskId]);

    if (loading) return <Loading />;

    return (
        <DashboardLayout activeMenu='Create Task'>
            <div className=''>
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
                            <label htmlFor='title' className='form-label'>
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
                            <label htmlFor='description' className='form-label'>
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
                                <label htmlFor='priority' className='form-label'>
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
                                <label htmlFor='dueTo' className='form-label'>
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
                                <label htmlFor='assignTo' className='form-label'>
                                    Assign To
                                </label>
                                <SelectUsers
                                    selectedUsers={selectedUsers}
                                    setSelectedUsers={setSelectedUsers}
                                />
                            </div>
                        </div>

                        <div className='mt-3 w-full'>
                            <label className='form-label'>
                                TODO Checklist
                            </label>
                            <TodoListInput
                                isUpdate={!!taskId}
                                todoList={taskData.todoList}
                                setTodoList={(value) => handleInputChange("todoList", value)}
                            />
                        </div>

                        <div className='mt-3'>
                            <label className='form-label'>
                                Add Attachments
                            </label>
                            <AddAttachmentsInput
                                attachments={taskData.attachments}
                                setAttachments={(value) => handleInputChange("attachments", value)}
                            />
                        </div>

                        {error && (
                            <div className='text-xs font-medium text-red-500 mt-5'>{error}</div>
                        )}

                        <div className='mt-7 flex justify-end'>
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

            <Modal
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title='Delete Task'
            >
                <DeleteAlert
                    content="Are you really want to delete this task?"
                    onDelete={() => deleteTask(taskId)}
                />
            </Modal>
        </DashboardLayout>
    );
};

export default CreateTasks;
