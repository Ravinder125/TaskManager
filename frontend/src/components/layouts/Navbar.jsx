import { useState } from 'react'
import { SideMenu } from '../index';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import ThemeSwitch from '../ThemeSwitch';



const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false)

  return (
    <nav className='flex gap-5 bg-white border border-b border-gray-100 backdrop-blur-[2px] py-2 px-7 sticky top-0 z-30 dark:bg-[var(--dark-bg-card)] dark:text-white dark:border-[var(--dark-bg-card)]'>
      <button
        className='block lg:hidden text-black dark:text-white'
        onClick={() => {
          setOpenSideMenu(prev => !prev);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className='text-2xl' />
        ) : (
          <HiOutlineMenu className='text-2xl' />
        )}
      </button>

      <h2 className='text-lg font-medium text-black dark:text-white'>Task Manager</h2>

      <div className='ml-auto'>
        <ThemeSwitch />
      </div>

      {/* SideMenu with smooth transition */}
      <div
        className={`
          fixed z-60 top-[61px] left-0  bg-white transition-transform duration-300 ease-in-out
          ${openSideMenu ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ minWidth: '220px' }}
      >
        <SideMenu activeMenu={activeMenu} />
      </div>
    </nav>
  )
}

export default Navbar