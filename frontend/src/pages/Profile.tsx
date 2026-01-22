import { useContext, useEffect, useState } from "react";
import useUserAuth from "../hooks/useUserAuth";
import { UserContext } from "../context/userContext";
import {
    DashboardLayout,
    Input,
    Loading,
    Modal,
    ProfilePhotoSelector,
    SubmitButton
} from "../components";
import { formatName, validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { uploadImage } from "../utils/uploadImag";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { updateUserApi } from "../features/api/user.api";

/* -------------------- TYPES -------------------- */

type PageVariants = {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    exit: { opacity: number; y: number };
};

const Profile = () => {
    useUserAuth();

    const pageVariants: PageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };


    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("Profile must be used inside UserProvider");
    }

    const { user, updateUser } = userContext;


    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");

    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [modalOpen, setModalOpen] = useState<boolean>(false);


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setError("");

        if (!fullName && !email && !profilePic) {
            setError("Please fill at least one field to update your profile");
            return;
        }

        if (email && !validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (fullName && fullName.length < 3) {
            setError("Full name must be at least 3 characters long");
            return;
        }

        try {
            setLoading(true);

            if (profilePic && profilePic !== user?.profileImageUrl) {
                const imageUploadRes = await uploadImage(profilePic);
                setProfilePic(imageUploadRes?.data ?? profilePic);
                toast.success("Profile picture successfully updated");
            }

            if (
                user?.email !== email ||
                formatName(user.fullName) !== fullName
            ) {
                const [firstName = "", lastName = ""] = fullName.split(" ");
                const payload = {
                    fullName: {
                        firstName,
                        lastName
                    },
                    email: (email || user?.email)!
                }

                if (!validateEmail(email)) {
                    toast.error("Email is not validated")
                    return;
                } else if (!firstName?.trim()) {
                    toast.error("Full name is required")
                    return;
                }
                
                const response = await updateUserApi(payload)

                if (response.data) {
                    updateUser({
                        fullName: response.data.fullName ?? user?.fullName,
                        email: response.data.email ?? user?.email,
                        profileImageUrl: profilePic ?? user?.profileImageUrl,
                        role: user?.role!,
                    })

                    toast.success("Profile successfully updated");
                }
            }
        } catch (error: any) {
            console.error("Error while updating profile:", error);
            toast.error(
                error?.response?.data?.message ||
                "Something went wrong while updating profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (): Promise<void> => {
        setPasswordError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please fill all fields to change your password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirm password do not match");
            return;
        }

        try {
            const response = await axiosInstance.post(
                API_PATHS.AUTH.CHANGE_PASSWORD,
                {
                    currentPassword,
                    newPassword,
                    confirmPassword
                }
            );

            if (response?.data?.success) {
                toast.success("Password successfully changed");

                setModalOpen(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error: any) {
            console.error("Error while changing password:", error);
            setPasswordError(
                error?.response?.data?.message ||
                "Something went wrong while changing password"
            );
        }
    };

    /* -------------------- EFFECTS -------------------- */

    useEffect((): void => {
        setProfilePic(user?.profileImageUrl ?? null);
        setEmail(user?.email ?? "");
        setFullName(formatName(user?.fullName!) ?? "");
    }, [user]);

    /* -------------------- RENDER -------------------- */

    if (loading) return <Loading />;

    return (
        <DashboardLayout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="p-4 my-4"
            >
                <div className="grid grid-cols-1  md:grid-cols-4">
                    <div className="form-card col-span-3" >
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-xl dark:text-neutral-300">Your Profile</h2>
                        </div>

                        <div className="mt-4 ">
                            <form onSubmit={handleSubmit} >
                                <div className="grid grid-cols-1">

                                    <ProfilePhotoSelector setProfilePic={setProfilePic} profilePic={profilePic} />

                                    <Input
                                        label='Your Name'
                                        value={fullName}
                                        placeholder='Enter your full name'
                                        type='text'
                                        required={false}
                                        onChange={(value) => setFullName(value)}
                                    />
                                    <Input
                                        label='Your Email Address'
                                        value={email}
                                        placeholder='Enter your email address'
                                        type='text'
                                        required={false}
                                        onChange={(value) => setEmail(value)}
                                    />

                                    {/* z */}

                                    {modalOpen
                                        ? (
                                            <Modal
                                                title='Change Password'
                                                isOpen={modalOpen}
                                                onClose={() => setModalOpen(false)}

                                            >
                                                <Input
                                                    label='Current Password'
                                                    value={currentPassword}
                                                    placeholder='Enter current password'
                                                    type='password'
                                                    required={true}
                                                    onChange={(value) => setCurrentPassword(value)}
                                                />

                                                <Input
                                                    label='New Password'
                                                    value={newPassword}
                                                    placeholder='Enter new password'
                                                    type='password'
                                                    required={true}
                                                    onChange={(value) => setNewPassword(value)}
                                                />

                                                <Input
                                                    label='Confirm New Password'
                                                    value={confirmPassword}
                                                    placeholder='Confirm your password'
                                                    type='password'
                                                    required={true}
                                                    onChange={(value) => setConfirmPassword(value)}
                                                />

                                                {passwordError && (<p className="text-rose-600 text-xs">Error: {passwordError}</p>)}

                                                <SubmitButton
                                                    label='Change'
                                                    loading={loading}
                                                    onClick={handleChangePassword}
                                                />
                                            </Modal>
                                        )
                                        : (<button className="text-left text-[13px] sm:text-sm text-neutral-600 pb-2.5 dark:text-neutral-300">
                                            Want to change your password?
                                            <span onClick={() => setModalOpen(true)} className="text-primary font-medium ml-1 cursor-pointer dark:text-dark-primary">Click here</span>
                                        </button>)

                                    }

                                    {error && (<p className='text-rose-600 text-xs pb-2-5'>Error: {error}</p>)}

                                    <SubmitButton label='Submit' />
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default Profile;




