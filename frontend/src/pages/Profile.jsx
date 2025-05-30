import { useContext, useEffect, useState } from "react"
import useUserAuth from "../hooks/useUserAuth"
import { UserContext } from "../context/userContext"
import { DashboardLayout, Input, Loading, Modal, ProfilePhotoSelector, SubmitButton } from "../components";
import { formatName, validateEmail } from "../utils/helper";
import { IoMdRefresh } from 'react-icons/io'
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { uploadImage } from "../utils/uploadImag";
import toast from "react-hot-toast";

const Profile = () => {
    useUserAuth();
    const { user, updateUser, inviteToken, setInviteToken } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [profilePic, setProfilePic] = useState(null);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        setError("");
        e.preventDefault();

        if (!fullName && !email && !profilePic) {
            setError('Please fill at least one field to update your profile');
            return;
        }

        if (email && !validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (fullName && fullName.length < 3) {
            setError('Full name must be at least 3 characters long');
            return;
        }

        try {
            setLoading(true)
            if (profilePic !== user.profileImageUrl) {
                const imageUploadRes = await uploadImage(profilePic);
                setProfilePic(imageUploadRes?.data || profilePic);
                toast.success('Profile picture successfully updated');
            }

            if (user.email !== email || formatName(user.fullName) !== fullName) {
                const response = await axiosInstance.put(
                    API_PATHS.AUTH.UPDATE_PROFILE, {
                    fullName: {
                        firstName: fullName?.split(' ')[0],
                        lastName: fullName?.split(' ')[1] || ''
                    } || user.fullName,
                    email: email || user.email
                })

                if (response?.data?.data) {
                    const { fullName, email } = response.data.data;
                    updateUser({
                        fullName: fullName || user.fullName,
                        email: email || user.email,
                        profileImageUrl: profilePic || user.profileImageUrl,
                        role: user.role
                    })
                    toast.success('Profile successfully updated');
                }

            }

        } catch (error) {
            console.error('Error while updating profile:', error);
            toast.error(response?.data?.message || 'Something went wrong while updating profile')
        } finally {
            // window.location.reload();
            setLoading(false);
        }

    }

    const handleChangePassword = async () => {
        if (!password || !newPassword || !confirmPassword) {
            setError('Please fill all fields to change your password')
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        try {
            const response = await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
                currentPassword,
                newPassword,
                confirmPassword,
            })

            if (response?.data?.success) {
                toast.success('Password successfully changed');
                setModalOpen(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Error while changing password:', error);
        }
    }

    const generateInviteToken = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.INVITE.GENERATE_INVITE_TOKEN(inviteToken))
            setInviteToken(response?.data?.data?.inviteToken || inviteToken)
        } catch (error) {
            console.error('Error while generating new invite token:', error)
        }
    }

    useEffect(() => {
        // This hook will handle the authentication check
        // and redirect to login if not authenticated
        // No need to do anything else here
        setProfilePic(user?.profileImageUrl || null);
        setEmail(user?.email || '');
        setFullName(formatName(user?.fullName) || '');
    }, [user]);

    if (loading) return <Loading />;
    return (
        <DashboardLayout>
            <div className="p-4 my-4">
                <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="form-card col-span-3" >
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-xl">Your Profile</h2>
                        </div>

                        <div className="mt-4">
                            <form onSubmit={handleSubmit} >
                                <div className="grid grid-cols-1  gap-4">

                                    <ProfilePhotoSelector setProfilePic={setProfilePic} profilePic={profilePic} />

                                    <Input
                                        label='Your Name'
                                        value={fullName}
                                        placeholder='Enter your full name'
                                        type='text'
                                        required={false}
                                        onChange={({ target }) => setFullName(target.value)}
                                    />
                                    <Input
                                        label='Your Email Address'
                                        value={email}
                                        placeholder='Enter your email address'
                                        type='text'
                                        required={false}
                                        onChange={({ target }) => setEmail(target.value)}
                                    />

                                    <div className="flex items-center gap-x-2">
                                        <div className="flex-1">
                                            <Input
                                                label='Your invite Code'
                                                value={inviteToken || ''}
                                                placeholder='Enter your full name'
                                                type='password'
                                                required={false}
                                            />
                                        </div>

                                        {user?.role === 'admin' && (
                                            <button
                                                className="p-2 mt-2 rounded-lg hover:bg-gray-200 transition-bg duration-300 ease-in-out cursor-pointer"
                                                onClick={() => generateInviteToken()}
                                            >
                                                <IoMdRefresh className="text-2xl " />
                                            </button>
                                        )}
                                    </div>

                                    {modalOpen
                                        ? (
                                            <Modal
                                                title='Change Password'
                                                isOpen={modalOpen}
                                                onClose={() => setModalOpen(false)}

                                            >
                                                <Input
                                                    label='Current Password'
                                                    value={password}
                                                    placeholder='Enter new password'
                                                    type='password'
                                                    required={true}
                                                    onChange={({ target }) => setPassword(target.value)}
                                                />

                                                <Input
                                                    label='New Password'
                                                    value={password}
                                                    placeholder='Enter new password'
                                                    type='password'
                                                    required={true}
                                                    onChange={({ target }) => setPassword(target.value)}
                                                />

                                                <Input
                                                    label='Confirm New Password'
                                                    value={password}
                                                    placeholder='Enter new password'
                                                    type='password'
                                                    required={true}
                                                    onChange={({ target }) => setPassword(target.value)}
                                                />
                                            </Modal>
                                        )
                                        : (<button className="text-left text-sm">
                                            Want to change your password?
                                            <span onClick={() => setModalOpen(true)} className="text-xs text-primary font-medium ml-1">Click here</span>
                                        </button>)

                                    }

                                    {error && <p className="text-rose-600 text-xs">{error}</p>}

                                    <SubmitButton />
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout >
    )
}

export default Profile