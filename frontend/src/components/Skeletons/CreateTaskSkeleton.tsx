import { DashboardLayout } from '../index';

const CreateTaskSkeleton = () => {
    return (
        <DashboardLayout activeMenu='Create Task'>
            <div className=''>
                <div className='grid grid-cols-1 md:grid-cols-4 my-4'>
                    <div className='form-card col-span-3'>
                        <div className='flex justify-between items-center'>
                            <h2 className='h-8 w-35 rounded bg-slate-200'></h2>

                            <button className='h-6 w-25 rounded bg-slate-200'></button>
                        </div>

                        <div className='mt-10'>
                            {[1, 2, 3].map((_, idx) => (
                                <div key={idx} className='mt-6 '>
                                    <h3 className='h-6 w-30 rounded bg-slate-200'></h3>
                                    <div className='mt-3 w-full h-8 bg-slate-200 rounded '></div>
                                </div>
                            ))}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-4'>
                            {[1, 2, 3].map((_, idx) => (
                                <div key={idx} className='mt-6 '>
                                    <h3 className='h-6 w-30 rounded bg-slate-200'></h3>
                                    <div className='mt-3 w-full h-8 bg-slate-200 rounded '></div>
                                </div>
                            ))}
                        </div>

                        <div className='mt-3 w-full'>
                            <h3 className='w-20 h-7 rounded bg-slate-200'></h3>

                            <div className='mt-10'>
                                {[1, 2, 3].map((_, idx) => (
                                    <div key={idx} className='flex items-center gap-3 mt-3'>
                                        <span className='h-6 w-10 bg-slate-200'></span>
                                        <p className='h-6 flex-1 bg-slate-200'></p>
                                        <span className='h-6 w-10 bg-slate-200'></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='mt-3'>

                        </div>

                        <div className='text-xs font-medium text-red-500 mt-5'></div>

                        <div className='mt-7 flex justify-end'>

                        </div>
                    </div>
                </div>
            </div>

        </DashboardLayout >
    )
}

export default CreateTaskSkeleton