import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { Navbar } from '../index'
import { SideMenu } from '../index'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    return (
        <div className='min-h-screen'>
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className='flex  h-full'>
                    <div className='max-[1080px]:hidden'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    <div className='h-full grow mx-5'>{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout