// Third party
import { LuTrash2 } from 'react-icons/lu';
import { createTaskSchema } from '../../features/zodSchemas/create.schema';
import { toast } from 'react-hot-toast';

// Components
import {
    DashboardLayout,
    SelectUsers,
    SelectDropdown,
    TodoListInput,
    AddAttachmentsInput,
    Modal,
    DeleteAlert,
    CreateTaskSkeleton
} from '../../components/index';

// Hooks
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Utils
import { PRIORITY_DATA } from '../../utils/data';

// Types
import { TaskType, TodoType } from '../../types/task.type';
import { AssignedUser } from '../../types/user.type';
import { validateFields } from '../../utils/validateFields';

// Api
import {
    createTaskApi,
    getTaskByIdApi,
    toggleDeleteTaskApi,
    updateTaskApi
} from '../../features/api/task.api'

const InitialTask: TaskType = {
    title: '',
    description: '',
    priority: '',
    dueTo: new Date(),
    assignedTo: [],
    todoList: [],
    attachments: [],
}

const CreateTasks = () => {
    const [searchParams] = useSearchParams()
    const taskId: string | null = searchParams.get("taskId")

    const navigate = useNavigate();

    const [taskData, setTaskData] = useState<TaskType>(InitialTask);

    const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<AssignedUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);

    function handleInputChange<T>(key: string, value: T | string): void {
        setTaskData((prev) => ({ ...prev, [key]: value }));
    };

    const clearData = () => {
        setTaskData(InitialTask);
        setSelectedUsers([]);
    };

    const createTask = async () => {
        setError("");

        taskData.todoList = taskData.todoList
        const payload = {
            ...taskData,
            assignedTo: selectedUsers.map((user: any) =>
                typeof user === 'string' ? user : user._id
            ),
            dueTo: new Date(taskData.dueTo),
        };

        const {
            success = false,
            data = null,
            message = "Something went wrong",
        } = validateFields<TaskType>(payload, createTaskSchema)
        if (!success) {
            toast.error(message)
            setError(message)
            return
        }

        try {
            setLoading(true);
            await createTaskApi(data!)
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
            assignedTo: selectedUsers.map((user: any) =>
                typeof user === 'string' ? user : user._id
            ),
            dueTo: new Date(taskData.dueTo),
        };

        const { success, data, message } = validateFields(payload, createTaskSchema)
        if (!success) {
            toast.error(message)
            setError(message)
            return;
        }

        try {
            if (!taskId?.trim()) throw new Error("Task Id is provided")
            setLoading(true);

            await updateTaskApi(taskId, data!)
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

    const getTaskById = async (taskId: string) => {
        setError("");
        try {
            if (!taskId?.trim()) throw new Error("Task Id is provided")

            setLoading(true);
            const response = await getTaskByIdApi(taskId);
            if (response.data) {
                const taskInfo = response.data;
                setTaskData({
                    title: taskInfo.title,
                    description: taskInfo.description,
                    priority: taskInfo.priority,
                    dueTo: taskInfo.dueTo ? (taskInfo.dueTo).toLocaleString()
                        .split('T')[0] : new Date(),
                    assignedTo: taskInfo.assignedTo || [],
                    todoList: taskInfo.todoList?.map((todo: TodoType) => (
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

    const deleteTask = async (taskId: string | null) => {
        try {
            if (!taskId?.trim()) throw new Error("Task Id is provided")
            setLoading(true)
            await toggleDeleteTaskApi(taskId)
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

    if (loading) return <CreateTaskSkeleton />;

    return (
        <DashboardLayout activeMenu='Create Task'>
            <div className='my-5'>
                <div className='grid grid-cols-1 md:grid-cols-4 my-4 '>
                    <div className='form-card col-span-3 '>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-xl font-medium text-black dark:text-neutral-100'>
                                {taskId ? 'Update Task' : 'Create Task'}
                            </h2>
                            {taskId && (
                                <button
                                    className='flex items-center gap-1.5 text-[13px] font-medium cursor-pointer text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 dark:bg-rose-500 
                                    dark:border-rose-500
                                    dark:text-rose-200 dark:hover:border-rose-100'
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

                        <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4'>
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
                                    value={taskData.dueTo.toString()}
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
                                setTodoList={(value) => handleInputChange<TodoType[]>("todoList", value)}
                            />
                        </div>

                        <div className='mt-3'>
                            <label className='form-label'>
                                Add Attachments
                            </label>
                            <AddAttachmentsInput
                                attachments={taskData.attachments}
                                setAttachments={(value) => handleInputChange<string[]>("attachments", value)}
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
                                    className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer'
                                >
                                    Update Task
                                </button>
                            ) : (
                                <button
                                    disabled={loading}
                                    onClick={createTask}
                                    className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer'
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
