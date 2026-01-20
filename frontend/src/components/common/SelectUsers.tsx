import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUsers } from 'react-icons/lu';
import { Modal, AvatarGroup } from '../index';
import { formatName } from '../../utils/helper';
import toast from 'react-hot-toast';
import { AssignedUser, SelectUsersProps } from '../../types/user.type';

const SelectUsers = ({ selectedUsers, setSelectedUsers }: SelectUsersProps) => {
    const [allUsers, setAllUsers] = useState<AssignedUser[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState<AssignedUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllUsers = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(
                API_PATHS.USERS.GET_ALL_USERS,
                { withCredentials: true }
            );

            if (response?.data?.data?.length > 0) {
                setAllUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching the users', error);
            toast.error('Please try again, Error fetching the users');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUserSelection = (userId: string) => {
        setTempSelectedUsers((prev) => {
            const assigned = allUsers.find((u) => u._id === userId);
            if (!assigned) return prev;

            return prev.some((user) => user._id === userId)
                ? prev.filter((user) => user._id !== userId)
                : [...prev, assigned];
        });
    };

    const handleAssign = () => {
        const uniqueNewUsers = tempSelectedUsers.filter(
            (assigned) =>
                !selectedUsers.some((user) => user._id === assigned._id)
        );

        setSelectedUsers((prev) => [...prev, ...uniqueNewUsers]);
        setIsModalOpen(false);
    };

    const selectedUsersAvatar = allUsers
        .filter((user) =>
            selectedUsers.some((assigned) => assigned._id === user._id)
        )
        .map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        setTempSelectedUsers(selectedUsers.length > 0 ? selectedUsers : []);
    }, [selectedUsers]);

    return (
        <div className="space-y-4 mt-2">
            {selectedUsersAvatar.length === 0 ? (
                <button
                    className="member-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    <LuUsers className="text-sm" /> Add Members
                </button>
            ) : (
                <div
                    className="cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AvatarGroup avatars={selectedUsersAvatar} maxVisible={3} />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Users"
            >
                {isLoading ? (
                    <div className="mx-auto w-fit">Loading...</div>
                ) : (
                    <div className="h-[60vh] overflow-y-auto scrollbar">
                        {allUsers.map((user) => (
                            <div
                                key={`user-${user._id}`}
                                className="flex items-center gap-4 p-3 border-b cursor-pointer hover:bg-neutral-100"
                                onClick={() => toggleUserSelection(user._id!)}
                            >
                                {user.profileImageUrl ? (
                                    <img
                                        src={user.profileImageUrl}
                                        alt={formatName(user.fullName)}
                                        className="w-12 h-12 rounded-full"
                                    />
                                ) : (
                                    <LuUsers className="w-12 h-12 text-3xl" />
                                )}

                                <div className="flex-1">
                                    <p className="font-medium">
                                        {formatName(user.fullName)}
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                        {user.email}
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={tempSelectedUsers.some(
                                        (u) => u._id === user._id
                                    )}
                                    onChange={() =>
                                        toggleUserSelection(user._id!)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <button
                        className="add-btn"
                        onClick={() => setIsModalOpen(false)}
                    >
                        CANCEL
                    </button>
                    <button
                        className="card-btn-fill"
                        onClick={handleAssign}
                    >
                        DONE
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SelectUsers;
