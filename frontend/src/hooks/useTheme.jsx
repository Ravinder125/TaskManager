import { useContext } from "react"
import { ThemeContext } from "../context/themeContext"


const useTheme = () => {
    const context = useContext(ThemeContext)
    if(!context) throw new Error("useTheme must be used with ThemeProvider")
    return context;
}

export default useTheme 