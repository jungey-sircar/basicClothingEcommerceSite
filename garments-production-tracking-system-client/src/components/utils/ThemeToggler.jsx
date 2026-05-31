import { useEffect, useState } from "react";
import { MdSunny } from "react-icons/md";

export default function ThemeToggler() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // Apply theme to HTML element
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <label className="swap swap-rotate cursor-pointer">
            {/* hidden checkbox controls the state */}
            <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
            />
            {/* Sun icon */}
            <MdSunny className="swap-off h-8 w-8 text-yellow-500" />
            {/* Moon icon */}
            <svg
                className="swap-on h-8 w-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8,8,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10,10,0,1,0,22,14,1,1,0,0,0,21.64,13Z" />
            </svg>
        </label>
    );
}