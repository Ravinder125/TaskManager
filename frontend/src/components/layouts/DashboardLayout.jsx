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
                <div className='w-screen grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden'>
                    {/* SideMenu: hidden on small screens, visible on lg+ */}
                    <div className='hidden lg:block w-full h-full rounded-2xl overflow-hidden lg:col-span-3 xl:col-span-3 2xl:col-span-2 m'>
                        <div className='mx-4 mt-5'>
                            <SideMenu activeMenu={activeMenu} />
                        </div>
                    </div>

                    {/* Main content: full width on small screens, reduced on lg+ */}
                    <main className='w-full col-span-1 lg:col-span-9 xl:col-span-9 2xl:col-span-10 mx-2 sm:mx-4 lg:mx-5 h-[calc(100vh-61px)] overflow-auto'>
                        {children}
                    </main>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout