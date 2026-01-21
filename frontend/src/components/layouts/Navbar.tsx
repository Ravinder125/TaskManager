import { useState } from 'react'
import { SideMenu } from '../index';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import ThemeSwitch from '../common/ThemeSwitch';
import { WithActiveMenu } from '../../types/layout.type';



const Navbar = ({ activeMenu }: WithActiveMenu) => {
  const [openSideMenu, setOpenSideMenu] = useState(false)

  return (
    <nav
      // onBlur={() => setOpenSideMenu(false)}
      className='flex gap-5 bg-white border border-b border-gray-100 backdrop-blur-[2px] py-2 px-7 shadow-sm sticky top-0 z-30 dark:bg-dark-card dark:text-white dark:border-dark-border dark:shadow-dark-shadow'>
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
          fixed z-60 top-[61px] shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] -left-1 bg-white transition-transform duration-300 ease-in-out rounded-xl
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