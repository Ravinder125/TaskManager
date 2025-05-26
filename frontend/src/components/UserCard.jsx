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
            <div className='flex items-end gap-3 mt-5'></div>
        </div>
    )
}

export default UserCard