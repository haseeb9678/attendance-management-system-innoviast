import { SEO } from '@/shared/components/SEO'
import ResetPasswordForm from '../components/ResetPasswordForm'

const ResetPasswordPage = () => {
    return (
        <>
            <SEO
                title="Reset Password | Attendix"
                description="Sign in to Attendix to manage attendance, classes, departments, teachers, and student records securely."
                noindex
            />

            <section
                className="
                flex items-center justify-center
                 px-4 py-8 flex-1 max-w-xl mx-auto 
            "
            >
                <div
                    className="
                    flex justify-center items-center w-full mx-auto overflow-hidden
                    rounded-2xl lg:border lg:border-border lg:bg-bg-card
                     lg:shadow-xl
                    h-[55vh] xl:h-[50vh] max-h-150
                    
                "
                >

                    <ResetPasswordForm />

                </div>
            </section>

        </>
    )
}

export default ResetPasswordPage