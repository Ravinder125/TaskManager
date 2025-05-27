import { useContext, useEffect, useState } from "react"
import useUserAuth from "../hooks/useUserAuth"
import { UserContext } from "../context/userContext"
import { DashboardLayout } from "../components";
import { formatName } from "../utils/helper";

const Profile = () => {
    useUserAuth();
    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [profileData, setProfileData] = useState({
        fullName: { firstName: '', lastName: '' },
        email: '',
    })
    const [profileImage, setProfileImage] = useState(null);

    const handleInputChange = (name, value) => {

    }



    useEffect(() => {
        // This hook will handle the authentication check
        // and redirect to login if not authenticated
        // No need to do anything else here

        console.log('User Profile:', user);
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
                            <form>
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

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}

export default Profile