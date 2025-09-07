import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { Navbar } from '../index'
import { SideMenu } from '../index'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div className='hide-scrollbar'>
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className='flex'>
                    <div className='max-[1080px]:hidden'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    <div className='grow mx-5 hide-scrollbar'>{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout