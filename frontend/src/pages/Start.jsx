import { Link } from 'react-router-dom'
import hero from '../assets/hero.webp'

const Start = () => {
    return (
        <div >
            <header className='start-container flex flex-col sm:flex-row justify-between items-center px-2'>
                <div>
                    <h3 className='text-2xl font-semibold '>Task Manager</h3>
                </div>
                <nav className='flex gap-x-8'>
                    <button className='auth-btn'>
                        <Link to='/login'>Login</Link>
                    </button>
                    <button className='auth-btn'>
                        <Link to='/register'>Register</Link>
                    </button>
                </nav>
            </header>
            <main>
                <div className='start-container grid sm:grid-cols-2 grid-cols-1 items-center justify-center p-6'>
                    <div className='order-2 mb-3 mt-3 sm:mt-0 sm:mb-0 sm:order-1'>
                        <h1 className='text-6xl font-bold text-primary'>TASK</h1>
                        <h2 className='text-3xl font-semibold'>MANAGER</h2>
                        <p className='mt-3 mb-6 text-xs text-slate-700'>Take control of your productivity with our powerful task manager. Whether you're managing personal goals or leading a team, our intuitive platform helps you create, assign, and track tasks effortlessly—all in one place. Prioritize what matters, stay focused, and achieve more every day</p>
                        <button className='auth-btn'>Login</button>
                    </div>

                    <div className='order-1 sm:order-2 flex justify-center items-center'>
                        <img
                            src={hero}
                            alt="A girl creating a task"
                            className='sm:w-[82%] w-[70%] h-full '
                        />
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Start