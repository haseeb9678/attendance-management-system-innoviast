import Header from '@/features/auth/components/Header'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {


    return (
        <div className='flex flex-col gap-5 min-h-screen bg-bg'>
            <Header />
            <main className='flex-1 flex'>
                <Outlet />
            </main>

        </div>
    )
}

export default AuthLayout