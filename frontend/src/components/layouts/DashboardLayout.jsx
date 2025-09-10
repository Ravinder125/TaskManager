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
                <div className='w-screen grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-16 px-3 h-full overflow-hidden'>
                    {/* SideMenu: hidden on small screens, visible on lg+ */}
                    <div className='hidden lg:block w-full h-full rounded-2xl overflow-hidden lg:col-span-4 xl:col-span-2'>
                        <div className='w-full mt-5'>
                            <SideMenu activeMenu={activeMenu} />
                        </div>
                    </div>

                    {/* Main content: full width on small screens, reduced on lg+ */}
                    <main className='shrink-0 lg:px-2 w-full col-span-1 lg:col-span-12 xl:col-span-10 sm:mx-0 h-[calc(100vh-61px)] overflow-auto'>
                        {children}
                    </main>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout