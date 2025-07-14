import { Link } from 'react-router-dom'
import hero from '../assets/hero.webp'
import { motion } from 'framer-motion'

const Start = () => {
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    }
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
        >
            <header className="start-container mt-6 flex flex-col sm:flex-row justify-between items-center px-4">
                <div>
                    <h3 className="text-3xl font-bold tracking-wide text-primary mb-2">Task Manager</h3>
                </div>
                <nav className="flex gap-x-8 mt-4">
                    <Link to="/login">
                        <button className="auth-btn px-6 py-2 rounded-lg shadow-md hover:bg-primary hover:text-white transition-all duration-200">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="auth-btn ">
                            Register
                        </button>
                    </Link>
                </nav>
            </header>
            <main>
                <div className="start-container grid sm:grid-cols-2 grid-cols-1 items-center justify-center p-8 gap-8">
                    <div className="order-2 mb-6 mt-6 sm:mt-0 sm:mb-0 sm:order-1">
                        <div className="mb-6">
                            <h1 className="text-6xl font-extrabold text-primary leading-tight mb-2 drop-shadow-lg">TASK</h1>
                            <h2 className="text-3xl font-semibold text-gray-800 tracking-wider mb-4">MANAGER</h2>
                        </div>
                        <p className="mt-4 mb-8 text-base text-slate-700 leading-relaxed">
                            Take control of your productivity with our powerful task manager.<br />
                            Whether you're managing personal goals or leading a team, our intuitive platform helps you create, assign, and track tasks effortlessly—all in one place.<br />
                            <span className="font-medium text-primary">Prioritize what matters, stay focused, and achieve more every day.</span>
                        </p>
                        <Link to="/login">
                            <button className="auth-btn rounded-lg bg-primary  font-semibold shadow-lg hover:bg-primary-dark">
                                Get Started
                            </button>
                        </Link>
                    </div>
                    <div className="order-1 sm:order-2 flex justify-center items-center">
                        <img
                            src={hero}
                            alt="A girl creating a task"
                            className="sm:w-[82%] w-[70%] h-full rounded-xl shadow-xl"
                        />
                    </div>
                </div>
            </main>
        </motion.div>
    )
}

export default Start