import { AnimatePresence, motion } from 'framer-motion'
import { ModalAnimation } from '../../utils/motionAnimations';

type ModalProps = {
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void,
    title: string,
}

const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
    if (!isOpen) return null;

    const {
        initial,
        animate,
        exit,
        transition,
    } = ModalAnimation

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className='fixed top-0 right-0 left-0 z-100 flex justify-center items-center w-full h-screen overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50'
                >
                    <motion.div
                        initial={initial}
                        animate={animate}
                        exit={exit}
                        transition={{
                            ...transition,
                            type: "spring" // or "tween", depending on your animation needs 
                        }}
                        className='relative p-4 w-full max-w-2xl max-h-full '
                    >
                        {/* Modal content */}
                        <div className='relative blur-none bg-white border border-neutral-300 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border'>
                            {/* Modal header */}
                            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t border-neutral-200 dark:border-neutral-400'>
                                <h3 className='text-lg font-medium text-neutral-900 dark:text-neutral-300'>
                                    {title}
                                </h3>
                                <button
                                    className='text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center  
                                    cursor-pointer dark:hover:bg-neutral-600 dark:hover:text-neutral-200'
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
                            <div className='p-4 md:p-5 space-y-4 scrollbar'>
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