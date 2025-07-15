import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext'
import { Link, useNavigate } from 'react-router-dom';
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


    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_EMPLOYEE_DATA);
        }
    }, [user])
    return (
        <div className='z-100 bg-white w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
            <div className='flex flex-col items-center justify-center mb-7 pt-5'>
                <div className='relative '>
                    {user?.profileImageUrl
                        ? <img
                            src={user?.profileImageUrl}
                            alt="Profile Image"
                            className='w-20 h-20 bg-slate-400 rounded-full '
                        />
                        : <LuUser className='text-4xl text-primary rounded-full w-20 h-20  border-2' />
                    }
                </div>

                {user?.role === 'admin' && (
                    <div className='text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1'>
                        Admin
                    </div>
                )}

                <div className='leading-4 mt-2'>
                    <h5 className='text-gray-700 font-medium mt-3'>
                        {user?.fullName && formatName(user?.fullName)}
                    </h5>
                    <p className='text-[12px] text-gray-400'>{user?.email || ''}</p>
                </div>

                <Link to='/profile' className='rounded-md font-medium  px-5 py-1 bg-blue-500 hover:bg-primary transition-bg duration-300 ease-in-out  text-white mt-4 mb-8 cursor-pointer'>
                    Edit Profile
                </Link>

                {sideMenuData.map((item, idx) => (
                    <button
                        key={`menu_${idx}`}
                        className={`w-full flex items-center gap-4 text-[15px] 
                    ${activeMenu == item.label
                                ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                                : ''} py-3 px-6 mb-3 cursor-pointer`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className={`text-xl ${item.label === 'Logout' ? 'text-rose-600' : ''}`} />
                        {item.label}
                    </button>
                ))}
            </div>
        </div >
    )
}

export default SideMenu