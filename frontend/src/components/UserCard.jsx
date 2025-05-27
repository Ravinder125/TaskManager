import React from 'react'
import { formatName } from '../utils/helper';

const UserCard = ({ userInfo }) => {
    if (!userInfo) return null;
    return (
        <div className='user-card p-2'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <img
                        src={userInfo?.profileImageUrl}
                        alt={userInfo?.fullName}
                        className='w-12 h-12 rounded-full border-2 border-white'
                    />

                    <div className=''>
                        <p className='text-sm font-medium'>{formatName(userInfo?.fullName)}</p>
                        <p className='text-xs text-gray-500'>{userInfo?.email}</p>
                    </div>
                </div>
            </div>
            <div className='flex  flex-wrap items-end gap-3 mt-5'>
                <StatCard
                    lable='Pending'
                    count={userInfo?.pendingTasks || 0}
                    status='pending'
                />
                <StatCard
                    lable='In Progress'
                    count={userInfo?.inProgressTasks || 0}
                    status='inProgress'
                />
                <StatCard
                    lable='Completed'
                    count={userInfo?.completedTasks || 0}
                    status='completed'
                />
            </div>
        </div>
    )
}

export default UserCard

const StatCard = ({ lable, count, status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'inProgress':
                return 'text-cyan-500 bg-gray-100';
            case 'completed':
                return 'text-indigo-500 bg-gray-100';
            default:
                return 'text-violet-500 bg-gray-100';
        }
    }

    return (
        <div className={`flex-1 text-[10px] font-medium px-4 py-2 rounded-md  ${getStatusColor(status)}`}>
            <span className='text-[12px] font-semibold'>{count}</span> <br />
            {lable}
        </div>
    )
}