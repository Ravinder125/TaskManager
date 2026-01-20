import { useContext, createContext, useState, useEffect } from 'react'

type ThemeType = "light" | "dark"

type ThemeContextType = {
    theme: ThemeType;
    toggleTheme: Function
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { }
})

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>(
        () => localStorage.getItem("theme") === "light" ? "light" : "dark"
    )

    useEffect(() => {
        localStorage.setItem("theme", theme)

        const html = document.querySelector("html");
        if (!html) return;

        html.classList.remove("light", "dark");
        html.classList.add(theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
}


