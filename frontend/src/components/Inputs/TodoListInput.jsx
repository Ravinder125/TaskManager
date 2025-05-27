import React, { useState } from 'react'
import { HiOutlineTrash, HiMiniPlus } from 'react-icons/hi2'

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
            i === idx ? { ...todo, completed: target.checked } : todo
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
            {todoList?.map((todo, idx) => (
                <div
                    key={idx}
                    className='flex gap-2 bg-gray-50  items-center border border-gray-100 px-3 py-2 rounded-sm mb-3 mt-2'
                >
                    <input
                        className='self-start'
                        name={idx}
                        type="checkbox"
                        checked={todo.completed}
                        disabled={!isUpdate}
                        onChange={({ target }) => handleInputChange(target, idx)}
                    />
                    <p className='text-xs text-black self-start  overflow-hidden line-clamp-1'>
                        <span className='text-xs text-gray-400 font-semibold mr-2'>
                            {idx < 9 ? `0${idx + 1}` : idx + 1}
                        </span>
                        {todo.text}
                    </p>

                    <button
                        className='cursor-pointer  ml-auto'
                        onClick={() => {
                            handleDeleteOption(idx)
                        }}
                    >
                        <HiOutlineTrash className='text-lg text-red-500' />
                    </button>


                </div >
            ))}

            <div className='flex items-center gap-5 mt-4'>
                <input
                    type="text"
                    placeholder='Enter Task'
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-3 rounded-md'
                />

                <button className='card-btn text-nowwrap' onClick={handleAddOption}>
                    <HiMiniPlus className='text-lg' />
                    Add
                </button>
            </div>
        </div >
    )
}

export default TodoListInput