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
            className={`bg-neutral-300 flex cursor-pointer w-12 h-8 p-1 rounded-full dark:bg-neutral-600`}>
            <div
                className={`bg-neutral-100 flex justify-center items-center w-6 h-full rounded-full transition-transform duration-200 dark:bg-neutral-500`}
                style={{
                    transform: isOn ? 'translateX(16px)' : 'translateX(0)'
                }}
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