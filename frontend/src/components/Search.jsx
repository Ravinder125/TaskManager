import { useState } from "react"
import { CiSearch } from "react-icons/ci"
import { IoMdClose } from "react-icons/io"

const Search = ({
    input,
    setInput,
    isOpen,
    onClose,
    setIsOpen,
    handleSearch,
    placeholder = "For which task are you looking for.."
}) => {
    return (
        <div className={`w-full flex items-center text-black bg-gray-200 focus:rounded-sm sm:w-fit dark:bg-neutral-600 rounded-lg ${isOpen ? "gap-2" : "hover:bg-gray-300"} dark:text-white`}
        >
            <div className={`w-full flex items-center text-black ml-auto bg-gray-200 focus:rounded-sm sm:w-fit dark:bg-neutral-600 rounded-lg ${isOpen ? "gap-2" : "hover:bg-gray-300"} dark:text-white`}
            >
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder={placeholder}
                    value={input}
                    onChange={({ target }) => setInput(target.value)}
                    className={`border-none outline-none overflow-hidden transition-all duration-300 ease-in-out 
      ${isOpen ? "w-full px-4 py-2 opacity-100" : "w-0 px-0 py-0 opacity-0"}`}
                    style={{ minWidth: 0 }} // prevents flexbox from forcing width
                />
                <div className='flex
                             gap-1'>
                    <CiSearch
                        className="text-2xl bg-neutral-200 hover:bg-neutral-300 rounded-md w-fit h-[2.4rem] p-[4px] cursor-pointer"
                        onClick={handleSearch}

                    />
                    {isOpen && (
                        <IoMdClose className='text-2xl bg-neutral-200 hover:bg-neutral-300 rounded-md w-fit h-[2.4rem] p-[4px] cursor-pointer'
                            onClick={onClose}
                        />
                    )}
                </div>
            </div>

        </div>

    )
}

export default Search