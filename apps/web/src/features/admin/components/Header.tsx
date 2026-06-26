import { AlignLeftIcon, ArrowRight, Bell, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react'
import React, { useState } from 'react'
import { useSidebarStore } from '../store/sidebar.store'
import { useThemeStore } from '../store/theme.store'

const Header = () => {

    const user = {
        name: "Haseeb Ali",
        role: "Admin",
        email: "haseeb963@gmail.com"
    }

    const [showMenu, setShowMenu] = useState(false)
    const openSidebar = useSidebarStore((s) => s.openSidebar)
    const closeSidebar = useSidebarStore((s) => s.closeSidebar)
    const isOpen = useSidebarStore((s) => s.isOpen)

    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    return (
        <header
            className='min-h-17 bg-bg-card text-text-secondary
            flex items-center justify-between px-5  border-b
             border-border
            '
        >
            <div>
                {
                    isOpen ? <AlignLeftIcon
                        onClick={closeSidebar}
                    /> : <ArrowRight
                        onClick={openSidebar}
                    />
                }
            </div>
            <div>
                <div className='flex items-center'>
                    <button
                        onClick={toggleTheme}
                        className='
                     p-3 backdrop-blur-lg rounded-full cursor-pointer
                      hover:bg-surface transition-all duration-300'>
                        {theme === "dark" ? (
                            <Sun size={20} />
                        ) : (
                            <Moon size={20} />
                        )}
                    </button>
                    <div className='
                     p-3 backdrop-blur-lg rounded-full cursor-pointer relative
                      hover:bg-surface transition-all duration-300'>
                        <Bell size={21} />
                        <div
                            className='bg-orange-500 flex items-center justify-center
                             w-4.5 h-4.5 font-semibold text-white absolute top-0 right-0 text-[11px] rounded-full'
                        >5</div>
                    </div>

                    <div
                        onClick={() => setShowMenu(!showMenu)}
                        className='flex items-center gap-3 cursor-pointer mx-5'>
                        <div className='flex items-center gap-3'>

                            <div className='h-8 w-8 rounded-full bg-surface font-bold text-md flex items-center justify-center
                                border border-border
                                '>
                                {user.name.charAt(0)}
                            </div>
                            <div className='hidden md:flex flex-col gap-0.5 text-xs'>
                                <h2 className='text-text-base font-medium'>{user?.name}</h2>
                                <h4 className='text-text-secondary'>{user?.role}</h4>
                            </div>

                            <div>
                                {
                                    showMenu ? <ChevronUp
                                        size={19}

                                    /> : <ChevronDown
                                        size={19}

                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </header >
    )
}

export default Header