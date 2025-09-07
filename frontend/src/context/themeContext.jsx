import { useContext, createContext, useState, Children, useEffect } from 'react'

export const ThemeContext = createContext({
    theme: "light" || "dark",
    toggleTheme: () => { }
})

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light"
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


