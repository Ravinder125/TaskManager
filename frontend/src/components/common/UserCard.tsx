import { LuUser } from 'react-icons/lu';
import { formatName } from '../../utils/helper';

const UserCard = ({ userInfo }) => {
    if (!userInfo) return null;
    return (
        <div className='user-card p-2'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {userInfo?.profileImageUrl
                        ? (
                            <img
                                src={userInfo?.profileImageUrl}
                                alt={userInfo?.fullName}
                                className='w-12 h-12 rounded-full border-1 border-white dark:border-neutral-500'
                            />
                        ) : (
                            <LuUser className='text-4xl text-primary rounded-full dark:text-dark-primary bg-inherit w-12 h-12 border-2' />
                        )

                    }

                    <div>
                        <p className='text-sm font-medium'>
                            {formatName(userInfo?.fullName)}
                        </p>
                        <p className='text-xs text-neutral-500 dark:text-neutral-200'>{userInfo?.email}</p>
                    </div>
                </div>
            </div>
            <div className='flex items-end gap-5 mt-5'>
                <StatCard
                    label='Pending'
                    count={userInfo?.pendingTasks || 0}
                    status='pending'
                />
                <StatCard
                    label='In Progress'
                    count={userInfo?.inProgressTasks || 0}
                    status='inProgress'
                />
                <StatCard
                    label='Completed'
                    count={userInfo?.completedTasks || 0}
                    status='completed'
                />
            </div>
        </div>
    )
}

export default UserCard

const StatCard = ({ label, count, status }) => {

    const getStatusColor = (status) => {
        switch (status) {
            case 'inProgress':
                return 'text-cyan-500 bg-gray-100 dark:text-cyan-300 dark:bg-neutral-600';
            case 'completed':
                return 'text-indigo-500 bg-gray-100 dark:text-indigo-300 dark:bg-neutral-600';
            default:
                return 'text-violet-500 bg-gray-100 dark:text-violet-300 dark:bg-neutral-600';
        }
    }

    return (
        <div
            className={`flex-1 text-[10px] font-medium px-4 py-2 rounded-md ${getStatusColor(status)}`}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={label}
        >
            <span className='text-[12px] font-semibold'>{count}</span> <br />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: '100%', }}>
                {label}
            </span>
        </div>
    )
}