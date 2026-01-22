// Third Party
import { AxiosResponse } from 'axios'
import { LuFileSpreadsheet } from 'react-icons/lu'
import axiosInstance from '../../utils/axiosInstance'
import { motion } from 'motion/react'

// Components
import { DashboardLayout, ManageEmployeeSkeleton, UserCard } from '../../components/index'

// Hooks
import { useEffect, useState } from 'react'

// Utils
import Search from '../../components/Inputs/Search'

// Types
import { AssignedUser, ManageAllUsers, UserTaskSummary } from '../../types/user.type'

// Api
import { API_PATHS } from '../../utils/apiPaths'
import { useDebounce } from '../../utils/useDebounce'
import { getAllUsersApi } from '../../features/api/user.api'
import { Pagination, Params } from '../../types/api.type'
import PaginationComp from '../../components/common/PaginationComp'

const ManageEmployees = () => {
    const [allUsers, setAllUsers] = useState<ManageAllUsers[] | []>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")
    const [paginationData, setPaginationData] = useState<Pagination>({
        limit: 10,
        page: 1,
        totalItems: 0,
        totalPages: 1
    })

    const debounceSearch = useDebounce(search, 1000)
    const limit = 10

    const getAllUsers = async () => {
        try {
            setLoading(true)
            let params: Params = { limit: paginationData.limit, page: paginationData.page }
            if (debounceSearch?.trim()) {
                params = {
                    page: 1,
                    limit: limit
                }
                params.search = debounceSearch.trim()

            }

            const response = await getAllUsersApi(params)
            const { users, pagination } = response.data
            setAllUsers(users)
            setPaginationData(pagination)
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_USERS, {
                responseType: 'blob', // Important for downloading files
            })
            // Create a Url for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url
            link.setAttribute('Download', 'users_report.xlsx'); // Set the file name
            document.body.appendChild(link);
            link.click(); // Trigger the download
            link.parentNode!.removeChild(link); // Clean up the link element
            window.URL.revokeObjectURL(url); // Free up memory
        } catch (error) {
            console.error('Error downloading report:', error);

        }
    }

    useEffect(() => {
        getAllUsers();

        return () => {
            setAllUsers([]);
        }
    }, [debounceSearch, paginationData.page, paginationData.limit])

    if (loading) return <ManageEmployeeSkeleton />
    return (
        <DashboardLayout activeMenu='Team Members' >
            <div className='mt-5 mb-10'>
                <div className='flex md:flex-row gap-2 md:gap-0 flex-col justify-between md:items-center'>
                    <h2 className='text-xl md:text-xl font-medium dark:text-neutral-300'>Team Members</h2>

                    <button
                        className='flex self-end md:flex w-fit download-btn'
                        onClick={handleDownloadReport}
                    >
                        <LuFileSpreadsheet className='text-lg mx-2' />
                        <span>Download Report</span>
                    </button>
                </div>

                <div className='mr-auto w-fit mt-5'>
                    <Search
                        placeholder='ex. john1@gmail.com'
                        input={search}
                        setInput={(value) => setSearch(value)}
                        isOpen={isOpen}
                        onClose={() => {
                            setSearch("")
                            setIsOpen(false)
                        }}
                        onOpen={() => setIsOpen(true)}
                    />
                </div>

                <section className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                    {allUsers?.map((user: AssignedUser) => (
                        <motion.div
                            initial={{ filter: "blur(5px)", opacity: 0, y: 100 }}
                            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0, }}
                            transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
                            key={user._id}
                        >
                            <UserCard userInfo={user} />
                        </motion.div>
                    ))}
                </section>

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
        </DashboardLayout>
    )
}

export default ManageEmployees