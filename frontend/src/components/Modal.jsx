import { AnimatePresence, motion } from 'framer-motion'

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: 'linear',
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                    }}
                    className='fixed top-0 right-0 left-0 z-100 flex justify-center items-center w-full h-full max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50'
                >
                    <motion.div
                        initial={{ scale: 0.95, x: 300 }}
                        animate={{ scale: 1, x: 0 }}
                        exit={{ scale: 0.95, y: 300 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className='relative p-4 w-full max-w-2xl max-h-full'
                    >
                        {/* Modal content */}
                        <div className='relative bg-white rounded-lg shadow-sm'>
                            {/* Modal header */}
                            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200'>
                                <h3 className='text-lg font-medium text-gray-900'>
                                    {title}
                                </h3>
                                <button
                                    className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover-bg-gray-600 cursor-pointer'
                                    type='button'
                                    onClick={onClose}
                                >
                                    <svg
                                        className='w-3 h-3'
                                        aria-hidden='true'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 14 14'
                                    >
                                        <path
                                            stroke='currentColor'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M1 1l12 12M13 1L1 13'
                                        />
                                    </svg>
                                </button>
                            </div>
                            {/* Modal body */}
                            <div className='p-4 md:p-5 space-y-4'>
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Modal