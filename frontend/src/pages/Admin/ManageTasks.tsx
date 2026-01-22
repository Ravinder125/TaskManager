// Third party
import axiosInstance from '../../utils/axiosInstance';
import { LuFileSpreadsheet } from 'react-icons/lu';

// Components
import {
    DashboardLayout,
    ManageTasksSkeleton,
    NotAssigned,
    TaskCard,
    TaskStatusTabs
} from '../../components/index'

// hooks
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { API_PATHS } from '../../utils/apiPaths';
import Search from '../../components/Inputs/Search';

// types
import type {
    ManageTask,
    StatusValueType,
    Tab
} from '../../types/task.type';
import PaginationComp from '../../components/common/PaginationComp';
import { Pagination, Params } from '../../types/api.type';
import { getTasksApi } from '../../features/api/task.api';
import { useDebounce } from '../../utils/useDebounce';




export type FilterStatus = Omit<StatusValueType, "in-progress"> & "all";

const ManageTasks = () => {
    const [allTasks, setAllTasks] = useState<ManageTask[]>([]);

    const [tabs, setTabs] = useState<Tab[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [search, setSearch] = useState<string>("")
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [paginationData, setPaginationData] = useState<Pagination>({
        limit: 10,
        page: 1,
        totalItems: 0,
        totalPages: 1
    })


    const limit = 10

    const debounceSearch = useDebounce(search)

    const navigate = useNavigate();

    const getAllTasks = async () => {
        let params: Params = {
            page: paginationData.page,
            limit: paginationData.limit
        };

        if (filterStatus === "all") {
            params.status = ""
        } else if (filterStatus === "in Progress") {
            params.status = "in-progress"
        } else {
            params.status = filterStatus
        }

        if (debounceSearch?.trim()) {
            params = {
                page: 1,
                limit: limit
            }
            params.search = debounceSearch

        }

        try {

            setLoading(true)
            const response = await getTasksApi(params)
            const { tasks, pagination, statusSummary } = response.data
            setAllTasks(tasks)
            setPaginationData(pagination)
            // Map statusSummary data will fixed labels and order

            const statusArray: Tab[] = [
                { label: 'All', count: statusSummary.allTasks || 0 },
                { label: 'Pending', count: statusSummary.pendingTasks || 0 },
                { label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
                { label: 'Completed', count: statusSummary.completedTasks || 0 },
            ]
            setTabs(statusArray)
        } catch (error) {
            console.error(error.data?.message || error)
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (taskData: ManageTask) => {
        if (taskData && taskData._id) {
            navigate(`/admin/create-task?taskId=${taskData._id}`);
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
            link.parentNode!.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);

        }
    }

    useEffect(() => {
        getAllTasks();
    }, [
        filterStatus,
        paginationData.page,
        paginationData.limit,
        debounceSearch
    ])


    if (loading) return <ManageTasksSkeleton />
    return (
        <DashboardLayout activeMenu='Manage Tasks'>
            <div className='my-8 w-full '>
                <header className='flex flex-col gap-6 lg:items-center lg:justify-between'>
                    <div className='flex flex-col sm:flex-row lg:items-center justify-center sm:gap-4'>
                        <h2 className='text-2xl font-semibold text-neutral-800 dark:text-neutral-300'>My Tasks</h2>
                        <button
                            className='flex lg:hidden self-end lg:self-normal download-btn'
                            onClick={handleDownloadReport}
                        >
                            <LuFileSpreadsheet className='text-xl ' />
                            <span className='text-[13px] sm:text-normal'>Download Report</span>
                        </button>
                    </div>

                    <div className='mr-auto'>
                        <Search
                            placeholder='Search any task...'
                            input={search}
                            setInput={(value) => setSearch(value)}
                            isOpen={searchOpen}
                            onClose={() => {
                                setSearch("")
                                setSearchOpen(false)
                            }}
                            onOpen={() => setSearchOpen(true)}
                        />
                    </div>
                    {tabs.length > 0 && (
                        <nav className='w-full items-center gap-4 lg:my-10'>

                            <button
                                className='hidden ml-auto w-fit lg:flex download-btn'
                                onClick={handleDownloadReport}
                            >
                                <LuFileSpreadsheet className='text-xl' />
                                <span>Download Report</span>
                            </button>
                            <div className='my-2 w-[100%] sm:w-auto relative mx-auto'>
                                <div
                                    className="sticky top-0 z-20  max-[450px]:w-[80%] sm:w-fit max-w-fit  overflow-x-auto hide-scrollbar  bg-white dark:bg-neutral-900  shadow-sm dark:shadow-neutral-700">
                                    <TaskStatusTabs
                                        tabs={tabs}
                                        activeTab={filterStatus}
                                        setActiveTab={setFilterStatus}
                                    />
                                </div>
                            </div >
                        </nav>
                    )}
                </header>

                {allTasks.length === 0
                    ? <NotAssigned text='No Task found!' className='mt-10' />
                    : (
                        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 mt-6'>
                            {allTasks?.map((task) => (
                                <div
                                    key={task._id}
                                    className='transform-scale hover:scale-1.1 transition-scale duration-300'
                                >
                                    <TaskCard
                                        _id={task._id}
                                        title={task.title}
                                        description={task.description}
                                        priority={task.priority}
                                        status={task.status}
                                        progress={task.progress}
                                        dueTo={task.dueTo}
                                        createdAt={task.createdAt}
                                        assignedTo={task.assignedTo}
                                        attachmentCount={task.attachments.length}
                                        completedTodoCount={task.completedTodoCount}
                                        todoList={task.todoList}
                                        onClick={() => {
                                            handleClick(task)
                                        }}
                                    />
                                </div>
                            ))}
                        </section>
                    )}

                <footer className='my-6 mb-20'>
                    <PaginationComp
                        {...paginationData}
                        onPageChange={(page) => {
                            setPaginationData(prev => ({ ...prev, "page": page }))
                        }
                        }
                        onLimitChange={(limit: number) => {
                            setPaginationData(prev => ({ ...prev, "limit": limit }))
                        }}
                        isLimitChangeable={true}
                    />
                </footer>
            </div>
        </DashboardLayout >
    )
}

export default ManageTasks