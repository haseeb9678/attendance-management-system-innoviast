import Header from '@/features/admin/components/Header'
import Sidebar from '@/features/admin/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />
            <div className='flex flex-col flex-1 min-w-0'>
                <Header />
                <main
                    className='flex-1 flex bg-gray-100 p-5 min-w-0 overflow-y-auto'
                >
                    <Outlet />
                </main>
            </div>

        </div>
    )
}

export default AdminLayout