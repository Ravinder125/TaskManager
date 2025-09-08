import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { LuUsers } from 'react-icons/lu';
import { Modal, AvatarGroup } from './index';
import { formatName } from '../utils/helper';

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.USERS.GET_ALL_USERS,
                { withCredentials: true }
            );
            if (response?.data?.data?.length > 0) {
                setAllUsers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching the users", error);
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


    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        setTempSelectedUsers(selectedUsers?.length > 0 ? selectedUsers : []);
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
                    <div className='space-y-4 h-[60vh] overflow-y-auto'>
                        {allUsers.map((user, idx) => (
                            <div
                                key={`user-${idx}`}
                                className='flex items-center gap-4 p-3 border-b border-gray-200 cursor-pointer'
                                onClick={() => toggleUserSelection(user?._id)}
                            >
                                <img
                                    src={user?.profileImageUrl}
                                    alt={formatName(user?.fullName)}
                                    className='w-10 h-10 rounded-full'
                                />
                                <div className='flex-1'>
                                    <p className='font-medium text-gray-600 '>
                                        {formatName(user?.fullName)}
                                    </p>
                                    <p className='text-[13px] text-gray-500'>{user?.email}</p>
                                </div>
                                <input
                                    className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none'
                                    type='checkbox'
                                    onChange={() => toggleUserSelection(user?._id)}
                                    checked={tempSelectedUsers.includes(user?._id)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-between items-center'>
                        <button className='card-btn' onClick={() => setIsModalOpen(false)}>
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
