import { DashboardLayout } from '../index'
const ManageEmployeeSkeleton = () => {
    return (
        <DashboardLayout activeMenu='Team Members' >
            <div className='mt-5 mb-10 animate-pulse'>
                <div className='flex md:flex-row gap-2 md:gap-0 flex-col justify-between md:items-center'>
                    <h2 className='text-2xl font-semibold bg-slate-200 w-33 h-6 rounded text-gray-800'></h2>
                    <button className='flex self-end lg:self-normal bg-slate-200 rounded h-6 w-20'></button>

                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-20 mt-20'>
                    {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                        <div key={idx} className='w-full flex gap-5 flex-col '>
                            <div className='w-full flex items-center gap-2'>
                                <span className='bg-slate-200 h-15 w-20 rounded-full'></span>
                                <div className='w-full'>
                                    <div className='bg-slate-200 mb-2 h-4 w-full rounded'></div>
                                    <div className='bg-slate-200 mb-2 h-4 w-full rounded'></div>
                                </div>
                            </div>

                            <div className='flex items-end gap-5 mt-5'>
                                {[1, 2, 3].map((_, idx) => (
                                    <div key={idx} className='w-40 h-20 bg-slate-200 rounded'>
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