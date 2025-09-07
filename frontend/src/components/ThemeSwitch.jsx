import { useEffect, useState } from 'react'
import { MdNightlight, MdWbSunny } from 'react-icons/md'
import useTheme from '../hooks/useTheme';



const ThemeSwitch = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        setIsOn(() => theme === "dark" ? true : false)
    }, [theme])
    return (
        <div
            onClick={() => toggleTheme()}
            className={`bg-gray-500 flex cursor-pointer w-12 h-8 p-1 rounded-full ${isOn ? "justify-end" : "justify-start"}`}>
            <div
                className={`bg-gray-300 flex justify-center items-center w-6 h-full rounded-full transition-all duration-500`}
            >
                {isOn
                    ? <MdNightlight />
                    : <MdWbSunny />
                }
            </div>
        </div>
    )
}

export default ThemeSwitch