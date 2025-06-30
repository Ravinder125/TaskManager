import { DashboardLayout } from "../index"

function DashboardSkeleton() {
    return (
        <DashboardLayout activeMenu='Dashboard'>
            <div className='card my-5 animate-pulse'>
                <div>
                    <div className='flex flex-col sm:flex-row sm:justify-between md:justify-start md:gap-4'>
                        <span className='text-xl md:text-2xl bg-slate-200 rounded w-32 h-6 mb-2'></span>
                        <span className='text-xl md:text-2xl font-semibold bg-slate-200 rounded w-40 h-6'></span>
                    </div>
                    <div className='text-xs md:text-[13px] text-gray-400 mt-1.5 bg-slate-200 rounded w-48 h-4'></div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6 mt-5'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='h-20 bg-slate-200 rounded'></div>
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 my-4'>
                <div>
                    <div className='card animate-pulse'>
                        <div className='flex items-center justify-between mb-2'>
                            <div className='h-5 w-32 bg-slate-200 rounded'></div>
                        </div>
                        <div className='h-64 mx-auto w-64 bg-slate-200 flex items-center justify-center rounded-full'>
                            <div className='h-[85%] w-[85%] bg-slate-100 rounded-full'></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='card animate-pulse'>
                        <div className='flex items-center justify-between mb-2'>
                            <div className='h-5 w-40 bg-slate-200 rounded'></div>
                        </div>
                        <div className='h-48 bg-slate-200 rounded'></div>
                    </div>
                </div>
                <div className='md:col-span-2'>
                    <div className='card animate-pulse'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='h-6 w-32 bg-slate-200 rounded'></div>
                            <div className='h-8 w-24 bg-slate-200 rounded'></div>
                        </div>
                        <div className='h-32 bg-slate-200 rounded'></div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )

}

export default DashboardSkeleton