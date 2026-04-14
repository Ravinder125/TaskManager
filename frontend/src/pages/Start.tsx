import { motion } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from 'react-icons/fa6'
import { IoMdCheckboxOutline, IoMdClose } from "react-icons/io";
import { MdCalendarToday, MdOutlinePrivacyTip } from 'react-icons/md';
import { FiLock } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";


import { Link } from 'react-router-dom';
import { IconType } from 'react-icons/lib';
import { useState } from 'react';

export const  StartHeaderItems = [
    {
        label: "Home",
        url: "/"
    },
    {
        label: "Login",
        url: "/login"
    },
    {
        label: "Register",
        url: "/register"
    },
]

const Start = () => {
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="h-screen overflow-y-auto overflow-x-hidden"
        >
            <header className={`start-container relative  mt-6 flex justify-between items-center px-4 `}>
                <div>
                    <h3 className="text-2xl font-semibold tracking  text-neutral-800 ">
                        Taskify
                    </h3>
                </div>
                <button className='text-2xl sm:hidden' onClick={()=> setIsNavOpen(true)}>
                    <GiHamburgerMenu />
                </button>
                <nav className={`gap-8 -top-6 p-10 sm:p-0 flex-col sm:flex-row sm:static absolute w-full bg-neutral-100 sm:justify-end sm:items-center sm:bg-white h-screen sm:h-auto flex ${isNavOpen? "left-0": "-right-[100%]"} transition-all duration-200`}>
                    <div className='relative'>
                        <button className='text-3xl sm:hidden block' onClick={()=> setIsNavOpen(false)}>
                            <IoMdClose />
                        </button>
                        <ul className={`flex flex-col sm:flex-row gap-8 items-center text-sm`}>
                        {StartHeaderItems.map((i,idx)=> (
                        <li key={idx} className='text-neutral-500 hover:text-neutral-800 transition-all duration-200'>
                            <Link to={i.url}>{i.label}</Link>
                        </li>
                        ))}
                        </ul>
                    </div>
                    
                    <button className='btn-started'>
                        <Link to="/register">
                            Get Started
                        </Link>
                    </button>

                </nav>
            </header>
            <main>
                {/* sm: */}
                <div className="start-container grid lg:grid-cols-2 grid-cols-1 items-center justify-center p-8 gap-8 py-20">
                    <div className="mb-6 mt-6 sm:mt-0 sm:mb-0 sm:order-1">
                        <div className="mb-6">
                            <h1 className="text-5xl font-semibold leading-tight mb-2 ">
                                Manage your tasks, stay organized, and get things done.
                            </h1>
                        </div>
                        <p className="mt-4 mb-8 text- text-neutral-600 dark:text-neutral-400 leading-relaxed">
                         A simple task management system to help you track your work and stay productive
                        </p>

                    <div className='flex gap-10'>
                        <button className='btn-started flex gap-x-2 items-center'>
                            <Link to="/register">
                                Get Started
                            </Link>

                            <FaArrowRight />
                        </button>
                        <button className='btn-started flex gap-x-2 items-center bg-inherit text-neutral-800 border-neutral-200 hover:border-neutral-800 hover:bg-neutral-100 transition-all duration-200 '>
                            <Link to="/login">
                                Login
                            </Link>

                            <FaArrowRight />
                        </button>
                    </div>
                    </div>

                    {/* Hero-right section */}
                    <div className="order-1 sm:order-2 flex items-center w-full border border-neutral-200 rounded-xl p-8">
                    <div className='w-full'>

                        <div className='flex gap-3'>
                            <span className='w-3 h-3 bg-red-400 rounded-full'></span>
                            <span className='w-3 h-3 bg-yellow-400 rounded-full'></span>
                            <span className='w-3 h-3 bg-green-400 rounded-full'></span>
                        </div>

                        <div className='mt-8 flex flex-col gap-8'>
                            <div className='flex items-center gap-5'>
                                <span className='border-2 border-primary w-4 h-4 rounded'></span>

                                <span className='h-2 w-25 sm:w-35 bg-blue-100 opacity-40 rounded-full'></span>
                                <div></div>
                                <div className='px-2 bg-primary/15 text-primary text-xs rounded-lg ml-auto'>In Progress</div>
                            </div>

                            <div className='flex items-center gap-5'>
                                <span className='border-2 border-green-400 bg-green-400 w-4 h-4 rounded flex items-center justify-center'>
                                    <FaCheck  className='text-white'/>
                                </span>

                                <span className='h-2 w-35 bg-blue-100 opacity-40 rounded-full'></span>
                                <div></div>
                                <div className='px-2 bg-green-100 text-green-500 text-xs rounded-2xl ml-auto'>done</div>
                            </div>
                            <div className='flex items-center gap-5'>
                                <span className='border-2 border-neutral-400 w-4 h-4 rounded'></span>

                                <span className='h-2 w-35 bg-blue-100 opacity-40 rounded-full'></span>
                                <div></div>
                                <div className='px-2 bg-neutral-200 text-xs rounded-lg ml-auto'>pending</div>
                            </div>
                            <div className='flex items-center gap-5'>

                                <span className='border-2 border-neutral-400 w-4 h-4 rounded'></span>

                                <span className='h-2 w-35 bg-blue-100 opacity-40 rounded-full'></span>
                                <div></div>
                                 <div className='px-2 bg-neutral-200 text-xs rounded-lg ml-auto'>pending</div>
                            </div>
                        </div>
                     </div>
                    </div>
                </div>
            </main>

            <section className='py-20 px-10 bg-neutral-100'>
                <div className='start-container'>
                    <h2 className='text-3xl font-semibold text-center'>Simple features, powerful results</h2>
                    <p className='text-neutral-600 text-center mt-3'>Everything you need to stay organized and productive.</p>
                <div className='widget-list grid lg:grid-cols-2 gap-6 md:gap-8 mt-10'>
                    
                        <StartWidget 
                            Icon={IoMdCheckboxOutline}
                            title='Create and manage tasks'
                            para='Easily create, edit, and organize your tasks in one place.'    
                        />
                        <StartWidget 
                            Icon={MdOutlinePrivacyTip}
                            title='Role-based access'
                            para='Control permissions with admin and user roles for your team.'    
                        />
                        <StartWidget 
                            Icon={MdCalendarToday}
                            title='Organize your daily work'
                            para='Keep track of your daily activities and stay on top of deadlines.'    
                        />
                        <StartWidget 
                            Icon={FiLock}
                            title='Secure authentication'
                            para='Your data is protected with a secure login system.'    
                        />
                </div>
                </div>
            </section>

            <footer>
                <div className='start-container pt-30 pb-10 px-10'>
                    <div className='p-10 sm:p-20 bg-black/98 rounded-2xl w-full mx-auto relative'>
                        <h2 className='text-white text-3xl text-center font-medium '>Start organizing your tasks today</h2>
                        <p className='text-neutral-300 mt-4 text-sm text-center'>Get started with Taskify and take control of your productivity.</p>
                        <button className='btn-started flex gap-x-2 items-center text-neutral-800 border-neutral-200 mx-auto  hover:border-neutral-800 bg-white mt-8 hover:bg-neutral-100 transition-all duration-200 '>
                            <Link to="/register">Create Free Account</Link>
                            <FaArrowRight />
                        </button>

                        <div className='absolute -left-20 -top-20 size-60 rounded-full bg-primary/20 blur-3xl'></div>
                        <div className='absolute -bottom-20 -right-20 size-60 rounded-full bg-primary/20 blur-3xl'></div>
                    </div>

                    <div className='mt-30'>
                        <h3 className='text-xl text-center'>Taskify</h3>

                        <div className='mt-10 text-center flex  justify-center gap-5'>
                            <Link to="/login" className='text-neutral-500 hover:text-neutral-800 transition-all duration-200'>
                                <p>Login</p>
                            </Link>
                            <Link to="/register" className='text-neutral-500 hover:text-neutral-800 transition-all duration-200'>
                                <p>Register</p>
                            </Link>
                        </div>

                        <p className='mt-20 text-sm text-center'>@ 2026 Taskify, All rights reserved</p>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
};

export default Start;


type StartWidgetProps = {
    title?:string,
    para?:string,
    Icon:IconType,
}

export const StartWidget = ({
    title,
    Icon,
    para
}:StartWidgetProps)=> {
return  (
       <div className='widget bg-white p-6 border border-neutral-200 rounded-xl hover:shadow-sm hover:shadow-primary/15'>
            <div className='widget-container'>

                <div className='px-2 py-1 text-3xl text-primary bg-primary/10 rounded-md w-fit'>
                    <Icon />
                </div>

                    <h3 className='mt-6 text-lg font-medium'>{title}</h3>
                    <p className='text-neutral-700 mt-3 text-sm'>{para}</p>
            </div>
        </div>
)
}