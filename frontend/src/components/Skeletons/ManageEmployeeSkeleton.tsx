import { DashboardLayout } from '../index'
const ManageEmployeeSkeleton = () => {
    return (
        <DashboardLayout activeMenu='Team Members' >
            <div className='mt-5 mb-10 animate-pulse'>
                <div className='flex md:flex-row gap-2 md:gap-0 flex-col justify-between md:items-center'>
                    <h2 className='dark-skeleton w-33 h-6 rounded '></h2>
                    <button className='flex self-end lg:self-normal dark-skeleton rounded h-6 w-20'></button>

                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-20'>
                    {[...Array(9)].map((_, idx) => (
                        <div key={idx} className='bg-white w-full flex gap-5 flex-col shadow-md p-5 rounded-lg dark:bg-neutral-800'>
                            <div className='w-full flex items-center gap-2'>
                                <span className='dark-skeleton h-15 w-20 rounded-full'></span>
                                <div className='w-full'>
                                    <div className='dark-skeleton mb-2 h-4 w-full rounded'></div>
                                    <div className='dark-skeleton mb-2 h-4 w-full rounded'></div>
                                </div>
                            </div>

                            <div className='flex items-end gap-5 mt-2'>
                                {[1, 2, 3].map((_, idx) => (
                                    <div key={idx} className='w-40 h-20 dark-skeleton rounded'>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ManageEmployeeSkeleton