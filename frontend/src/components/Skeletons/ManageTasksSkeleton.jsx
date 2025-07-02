import { DashboardLayout } from "../index"

const ManageTasksSkeleton = () => {
    return (
        <>
            <DashboardLayout activeMenu='Manage Tasks'>
                <div className='my-8  w-full animate-pulse '>
                    <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                        <div className='flex flex-col sm:flex-row lg:items-center justify-center sm:gap-4'>
                            <h2 className='text-2xl font-semibold bg-slate-200 w-33 h-8 rounded text-gray-800'></h2>
                            <button className='flex lg:hidden self-end lg:self-normal bg-slate-200 rounded h-8 w-20'></button>
                        </div>

                        <div className="grid grid-cols-4 w-full mt-5 justify-center items-center gap-4">
                            {[1, 2, 3, 4].map((_, idx) => (
                                <div key={idx} className="bg-slate-200 h-6 w-full rounded "></div>
                            ))}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mt-20'>
                        {
                            [1, 2, 3, 4, 5, 6].map((_, idx) => (
                                <div key={idx} className="bg-white w-full flex flex-col gap-5 shadow-md p-5 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div className="bg-slate-200 h-4 w-20 rounded"></div>
                                        <div className="bg-slate-200 h-4 w-20 rounded"></div>
                                    </div>

                                    <h2 className="bg-slate-200 h-6 w-full rounded "></h2>
                                    <p className="bg-slate-200 h-20 w-full rounded "></p>

                                    <div className="flex justify-between items-center">
                                        <div className="bg-slate-200 h-4 w-20 rounded"></div>
                                        <div className="bg-slate-200 h-4 w-20 rounded"></div>
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