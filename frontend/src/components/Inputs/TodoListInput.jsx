import { useState } from 'react'
import { HiOutlineTrash, HiMiniPlus } from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion';
import { todoListAnimation } from '../../utils/motionAnimations';



const TodoListInput = ({ isUpdate, todoList, setTodoList }) => {
    const [option, setOption] = useState("");
    const [isDone, setIsDone] = useState(false)

    // Function to handle adding an option
    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, { text: option.trim(), completed: false }]);
            setOption("");
        }
    }

    const handleInputChange = (target, idx) => {
        const updatedTodos = todoList.map((todo, i) => (
            i === idx
                ? { ...todo, completed: target.checked }
                : todo
        ))
        setTodoList(updatedTodos);
    }

    // Function to handle deleting an option
    const handleDeleteOption = (index) => {
        const updateArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updateArr);
    }
    return (
        <div>
            <AnimatePresence>
                {todoList?.map((todo, idx) => (
                    <motion.div
                        initial={todoListAnimation.initial}
                        animate={todoListAnimation.animate}
                        duration={todoListAnimation.duration}
                        exit={todoListAnimation.exit}
                        key={idx}
                        className='flex gap-2 bg-neutral-100 items-center border border-neutral-300 px-3 py-2 rounded-sm mb-3 mt-2 dark:bg-neutral-700 dark:border-dark-border'
                    >
                        <input
                            className='self-start'
                            name={idx}
                            type="checkbox"
                            checked={todo.completed}
                            disabled={!isUpdate}
                            onChange={({ target }) => handleInputChange(target, idx)}
                        />
                        <p
                            className='text-xs self-start overflow-hidden line-clamp-1  duration-200'
                        >
                            <span className='text-xs text-neutral-600 font-semibold mr-2 dark:text-neutral-300'>
                                {idx < 9 ? `0${idx + 1}` : idx + 1}
                            </span>
                            <span className='text-black dark:text-neutral-100'
                                style={{
                                    textDecoration: todo.completed ? "line-through" : "none",
                                }}
                            >
                                {todo.text}
                            </span>
                        </p>

                        <button
                            className='cursor-pointer ml-auto'
                            onClick={() => {
                                handleDeleteOption(idx)
                            }}
                        >
                            <HiOutlineTrash className='text-lg text-red-500 dark:text-red-400' />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div
                className='flex items-center gap-5 mt-4'
            >
                <input
                    type="text"
                    placeholder='Enter Task'
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    className='w-full text-[13px] text-black outline-none bg-inherit border border-neutral-200 px-3 py-3 rounded-md dark:text-neutral-200  dark:border-neutral-600 dark:placeholder:text-neutral-400'
                />

                <button className='add-btn text-nowrap' onClick={handleAddOption}>
                    <HiMiniPlus className='text-lg ' />
                    Add
                </button>
            </div>
        </div >
    )
}

export default TodoListInput