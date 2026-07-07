import { SEO } from '@/shared/components/SEO'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

const ForgotPasswordPage = () => {
    return (
        <>
            <SEO
                title="Forgot Password | Attendix"
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
                    h-[50vh] xl:h-[45vh] max-h-100
                    
                "
                >

                    <ForgotPasswordForm />

                </div>
            </section>

        </>
    )
}

export default ForgotPasswordPage