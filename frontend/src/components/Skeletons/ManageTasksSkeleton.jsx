import { LuFileSpreadsheet } from "react-icons/lu"
import { DashboardLayout } from "../index"

const ManageTasksSkeleton = () => {
    return (
        <>
            <DashboardLayout activeMenu='Manage Tasks'>
                <div className='my-8  w-full animate-pulse '>
                    <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                        <div className='flex flex-col sm:flex-row lg:items-center justify-center sm:gap-4'>
                            <h2 className='text-2xl font-semibold text-neutral-800 dark:text-neutral-300'>My Tasks</h2>
                            <button
                                className='flex lg:hidden self-end lg:self-normal download-btn'
                            >
                                <LuFileSpreadsheet className='text-xl ' />
                                <span className='text-[13px] sm:text-normal'>Download Report</span>
                            </button>
                        </div>

                        <div className='mr-auto h-8 w-20 
                        bg-neutral-200 dark:bg-neutral-600 rounded-md'>
                        </div>
                        <div className="sm:w-1/2 mx-auto grid grid-cols-4 w-full mt-5 justify-center items-center gap-4">
                            {[1, 2, 3, 4].map((_, idx) => (
                                <div key={idx} className="dark-skeleton h-6 w-full rounded "></div>
                            ))}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mt-20'>
                        {
                            [1, 2, 3, 4, 5, 6].map((_, idx) => (
                                <div key={idx} className="w-full flex flex-col gap-5 shadow-md p-5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                    <div className="flex justify-between items-center">
                                        <div className="dark-skeleton h-4 w-20 rounded"></div>
                                        <div className="dark-skeleton h-4 w-20 rounded"></div>
                                    </div>

                                    <h2 className="dark-skeleton h-6 w-full rounded "></h2>
                                    <p className="dark-skeleton h-20 w-full rounded "></p>

                                    <div className="flex justify-between items-center">
                                        <div className="dark-skeleton h-4 w-20 rounded"></div>
                                        <div className="dark-skeleton h-4 w-20 rounded"></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </DashboardLayout >
        </>
    )
}


export default ManageTasksSkeleton