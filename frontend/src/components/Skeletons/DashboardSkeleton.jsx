import { DashboardLayout } from "../index"

function DashboardSkeleton() {
    return (
        <DashboardLayout activeMenu='Dashboard'>
            <div className='card my-5 animate-pulse'>
                <div>
                    <div className='flex flex-col sm:flex-row sm:justify-between md:justify-start md:gap-4 '>
                        <span className='md:text-2xl rounded w-32 h-6 mb-2 dark-skeleton'></span>
                        <span className='md:text-2xl font-semibold bg-neutral-200 rounded w-40 h-6 dark-skeleton'></span>
                    </div>
                    <div className='mt-1.5 bg-neutral-200 rounded w-48 h-4 dark-skeleton'></div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6 mt-5'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='h-20 bg-neutral-200 rounded dark-skeleton'></div>
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 my-4'>
                <div>
                    <div className='card animate-pulse'>
                        <div className='flex items-center justify-between mb-2'>
                            <div className='h-5 w-32 bg-neutral-200 rounded dark-skeleton'></div>
                        </div>
                        <div className='h-64 mx-auto w-64 bg-neutral-200 flex items-center justify-center rounded-full dark-skeleton'>
                            <div className='h-[85%] w-[85%] bg-neutral-100 rounded-full dark:bg-neutral-400'></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='card animate-pulse'>
                        <div className='flex items-center justify-between mb-2'>
                            <div className='h-5 w-40 bg-neutral-200 rounded dark-skeleton'></div>
                        </div>
                        <div className='h-48 bg-neutral-200 rounded dark-skeleton'></div>
                    </div>
                </div>
                <div className='md:col-span-2'>
                    <div className='card animate-pulse'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='h-6 w-32 dark-skeleton rounded'></div>
                            <div className='h-8 w-24 dark-skeleton rounded'></div>
                        </div>
                        <div className='h-32 dark-skeleton rounded'></div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )

}

export default DashboardSkeleton