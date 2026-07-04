import { useThemeStore } from '@/shared/store/theme.store';
import { Moon, Sun } from 'lucide-react';


const Header = () => {


    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);
    return (
        <header
            className='min-h-16 bg-bg-card text-text-secondary
             border-b border-border flex items-center'
        >
            <div
                className='flex items-center justify-end px-5 flex-1 h-full'
            >
                <button
                    onClick={toggleTheme}
                    className={`
                     p-3 backdrop-blur-lg rounded-full cursor-pointer
                      hover:bg-surface transition-all duration-300 text-text-secondary
                      ${theme === "dark" && "text-warning"}
                      `}>
                    {theme === "dark" ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>
            </div>
        </header>
    )
}

export default Header