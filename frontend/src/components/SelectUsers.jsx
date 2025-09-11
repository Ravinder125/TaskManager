import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { LuUsers } from 'react-icons/lu';
import { Modal, AvatarGroup } from './index';
import { formatName } from '../utils/helper';
import toast from 'react-hot-toast';

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const getAllUsers = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get(
                API_PATHS.USERS.GET_ALL_USERS,
                { withCredentials: true }
            );
            if (response?.data?.data?.length > 0) {
                setAllUsers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching the users", error);
            toast.error("Please try again, Error fetching the users")
        } finally {
            setIsLoading(false)
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAssign = () => {
        const uniqueNewUsers = tempSelectedUsers.filter(
            (id) => !selectedUsers?.includes(id)
        );

        setSelectedUsers((prev) => [...prev, ...uniqueNewUsers]);
        setIsModalOpen(false);
    };

    const selectedUsersAvatar = allUsers
        .filter((user) => selectedUsers?.includes(user?._id))
        .map((user) => user?.profileImageUrl);

    console.log(selectedUsersAvatar)


    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        setTempSelectedUsers(selectedUsers?.length > 0 ? selectedUsers : []);
        selectedUsersAvatar
    }, [selectedUsers]);


    if (allUsers || selectedUsers) {
        return (
            <div className='space-y-4 mt-2'>
                {selectedUsersAvatar.length === 0 ? (
                    <button className='member-btn' onClick={() => setIsModalOpen(true)}>
                        <LuUsers className='text-sm' /> Add Members
                    </button>
                ) : (
                    <div className='cursor-pointer' onClick={() => setIsModalOpen(true)}>
                        <AvatarGroup avatars={selectedUsersAvatar} maxVisible={3} />
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title='Select Users'
                >
                    {isLoading ? (
                        <div className='mx-auto w-fit text-black dark:text-white '>Loading...</div>
                    ) : (
                        <div className='h-[60vh] overflow-y-auto'>
                            {allUsers.map((user, idx) => (
                                <div
                                    key={`user-${idx}`}
                                    className='flex items-center gap-4 p-3 border-b border-neutral-100 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    onClick={() => toggleUserSelection(user?._id)}
                                >
                                    {user?.profileImageUrl
                                        ? (
                                            <img
                                                src={user.profileImageUrl}
                                                alt={user.fullName}
                                                className='w-12 h-12 rounded-full border-1 border-white dark:border-neutral-500'
                                            />
                                        ) : (
                                            <LuUsers className='text-4xl text-primary rounded-full dark:text-dark-primary bg-inherit w-12 h-12 border-2' />
                                        )

                                    }
                                    <div className='flex-1'>
                                        <p className='font-medium text-neutral-600 dark:text-neutral-200'>
                                            {formatName(user?.fullName)}
                                        </p>
                                        <p className='text-[13px] text-neutral-500 dark:text-neutral-400'>{user?.email}</p>
                                    </div>
                                    <input
                                        className='w-4 h-4 text-primary bg-neutral-100 border-neutral-300 rounded-sm outline-none'
                                        type='checkbox'
                                        onChange={() => toggleUserSelection(user?._id)}
                                        checked={tempSelectedUsers.includes(user?._id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='flex justify-between items-center'>
                        <button className='add-btn' onClick={() => setIsModalOpen(false)}>
                            CANCEL
                        </button>
                        <button className='card-btn-fill' onClick={handleAssign}>
                            DONE
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
};

export default SelectUsers;
