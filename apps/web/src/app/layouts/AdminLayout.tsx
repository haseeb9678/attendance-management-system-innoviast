import Header from '@/features/admin/components/Header'
import Sidebar from '@/components/common/Sidebar'
import { useThemeStore } from '@/shared/store/theme.store'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { adminSidebarItems } from '@/shared/constants/sidebarItems'

const AdminLayout = () => {
    const initializeTheme = useThemeStore((s) => s.initializeTheme);

    useEffect(() => {
        initializeTheme();
    }, [initializeTheme]);
    return (
        <div className='flex h-screen w-screen'>
            <Sidebar
                sidebarItems={adminSidebarItems}
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

export default AdminLayout