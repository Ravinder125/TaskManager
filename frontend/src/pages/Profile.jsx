import { useContext, useEffect, useState } from "react"
import useUserAuth from "../hooks/useUserAuth"
import { UserContext } from "../context/userContext"
import { DashboardLayout } from "../components";
import { formatName } from "../utils/helper";
import { IoMdRefresh } from 'react-icons/io'
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const Profile = () => {
    useUserAuth();
    const { user, inviteToken, setInviteToken } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [profileData, setProfileData] = useState({
        fullName: { firstName: '', lastName: '' },
        email: '',
        inviteToken: "",
    })
    const [profileImage, setProfileImage] = useState(null);

    const handleInputChange = (name, value) => {
        setProfileData(prev => ({ ...prev, [name]: value }))
    }

    const generateInviteToken = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.INVITE.GENERATE_INVITE_TOKEN(inviteToken))
            if (response?.data?.data?.token)
                setInviteToken(response.data.data.token)
        } catch (error) {
            console.error('Error while generating new invite token:', error)
        }
    }

    useEffect(() => {
        // This hook will handle the authentication check
        // and redirect to login if not authenticated
        // No need to do anything else here

        console.log('User Profile:', user);
        console.log('inviteToken', inviteToken)
    }, [user]);

    return (
        <DashboardLayout>
            <div className="p-4 my-4">
                <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="form-card col-span-3" >
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-xl">Your Information</h2>
                        </div>

                        <div className="mt-8">
                            <div className="">
                                <label className="form-label">Your Name</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={formatName(user?.fullName) || ''}
                                    onChange={({ target }) => handleInputChange(target.name, target.value)}
                                />
                            </div>

                            <div className="">
                                <label className="form-label">Your Email</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={user?.email || ''}
                                    onChange={({ target }) => handleInputChange(target.name, target.value)}
                                />
                            </div>

                            <div className="">
                                <label className="form-label">Your invite Token</label>

                                <div className="flex items-center ">
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={inviteToken}
                                        onChange={({ target }) => handleInputChange(target.name, target.value)}
                                    />
                                    <button
                                        className="flex items-center justify-center cursor-pointer ml-2 p-1  hover:bg-black/10 rounded-full"
                                        onClick={() => generateInviteToken && generateInviteToken()}
                                    >
                                        <IoMdRefresh className="text-3xl   " />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}

export default Profile