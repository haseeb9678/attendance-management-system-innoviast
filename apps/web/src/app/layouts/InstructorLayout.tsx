
import Sidebar from '@/components/common/Sidebar'
import { useThemeStore } from '@/shared/store/theme.store'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { instructorSidebarItems } from '@/shared/constants/sidebarItems'
import Header from '@/features/instructor/components/Header'

const InstructorLayout = () => {
    const initializeTheme = useThemeStore((s) => s.initializeTheme);

    useEffect(() => {
        initializeTheme();
    }, [initializeTheme]);
    return (
        <div className='flex h-screen w-screen'>
            <Sidebar
                sidebarItems={instructorSidebarItems}
            />
            <div className='flex flex-col flex-1 min-w-0'>
                <Header />
                <main
                    className='flex-1 flex bg-bg p-5 min-w-0 overflow-y-auto'
                >
                    <Outlet />
                </main>
            </div>

        </div>
    )
}

export default InstructorLayout