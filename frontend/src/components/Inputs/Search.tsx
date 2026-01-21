import { CiSearch } from "react-icons/ci"
import { IoCloseOutline } from "react-icons/io5";

interface SearchProps {
    input: string,
    placeholder?: string
    setInput: (value: string) => void,
    onClose: () => void,
    onOpen: () => void,
    isOpen: boolean,
}

const Search = ({
    input,
    placeholder = "For which task are you looking for..",
    setInput,
    isOpen,
    onClose,
    onOpen
}: SearchProps) => {
    return (

        <div className={`w-full flex items-center text-black ml-auto bg-neutral-100 border border-neutral-200 focus:rounded sm:w-fit dark:border-neutral-700 dark:bg-neutral-200 rounded-lg ${isOpen ? "gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]" : "hover:bg-neutral-300"} dark:text-white dark:bg-neutral-800`}
        >
            <input
                type="text"
                name="search"
                id="search"
                placeholder={placeholder}
                value={input}
                onChange={({ target }) => setInput(target.value)}
                className={`border-none outline-none overflow-hidden transition-all duration-300 ease-in-out dark:placeholder:text-neutral-400
      ${isOpen ? "w-full px-4 py-2 opacity-100" : "w-0 px-0 py-0 opacity-0"}`}
                style={{ minWidth: 0 }} // prevents flexbox from forcing width

            />
            <div className='flex
                             gap-1'>
                {isOpen
                    ? (
                        <IoCloseOutline className='text-2xl text-neutral-500 hover:text-black hover:bg-neutral-300 rounded-md w-fit h-[2.4rem] p-[4px] cursor-pointer 
                        dark:bg-neutral-800 dark:hover:bg-neutral-700 
                        dark:hover:text-neutral-50 dark:text-neutral-300  transition-all duration-200'
                            onClick={onClose}
                        />
                    ) : (
                        <CiSearch
                            className="text-2xl text-neutral-500 hover:text-black hover:bg-neutral-300 rounded-md w-fit h-[2.4rem] p-[4px] cursor-pointer dark:bg-neutral-800 dark:hover:bg-neutral-700 
                                        dark:hover:text-neutral-50
                                        dark:text-neutral-300 transition-all duration-200"
                            onClick={onOpen}
                        />

                    )}
            </div>

        </div >

    )
}

export default Search