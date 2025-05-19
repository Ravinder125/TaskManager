import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { SIDE_MENU_DATA, SIDE_MENU_EMPLOYEE_DATA, } from '../../utils/data';
import { LuUser } from 'react-icons/lu';
import { formatName } from '../../utils/helper';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);

    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === 'logout') {
            handleLogout();
            return;
        }

        navigate(route)
    };

    const handleLogout = async () => {
        try {
            const response = axiosInstance.get(API_PATHS.AUTH.LOGOUT, { withCredentials: true })
            console.log(response.data.message)
        } catch (error) {
            if (error.response && error.response.data?.message)
                console.error('Error while logout the user :', error.response.data.message)
        } finally {
            clearUser();
            navigate('/logout');
        }
    }

    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_EMPLOYEE_DATA);
        }

        return () => { };
    }, [user])
    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
            <div className='flex flex-col items-center justify-center mb-7 pt-5'>
                <div className='relative '>
                    {user?.profilImageUrl ?
                        <img
                            src={user?.profileImageUrl}
                            alt="Profile Image"
                            className='w-20 h-20 bg-slate-400 rounded-full object-cover'
                        /> :
                        <LuUser className='text-4xl text-primary rounded-full w-20 h-20  border-2' />

                    }
                </div>

                {user?.role === 'admin' && (
                    <div className='text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1'>
                        Admin
                    </div>
                )}

                <h5 className='text-gray-950 font-medium leading-6 mt-3'>
                    {user?.fullName && formatName(user?.fullName)}
                </h5>

                <p className='text-[12px] text-gray-500 mb-8'>{user?.email || ''}</p>

                {sideMenuData.map((item, idx) => (
                    <button
                        key={`menu_${idx}`}
                        className={`w-full flex items-center gap-4 text-[15px] 
                    ${activeMenu == item.label
                                ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                                : ''} py-3 px-6 mb-3 cursor-pointer`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className='text-xl' />
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SideMenu