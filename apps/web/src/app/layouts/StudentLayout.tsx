
import Sidebar from '@/components/common/Sidebar'
import { Outlet } from 'react-router-dom'
import { studentSidebarItems } from '@/shared/constants/sidebarItems'
import Header from '@/features/student/components/Header'

const StudentLayout = () => {

    return (
        <div className='flex h-screen w-screen'>
            <Sidebar
                sidebarItems={studentSidebarItems}
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

export default StudentLayout