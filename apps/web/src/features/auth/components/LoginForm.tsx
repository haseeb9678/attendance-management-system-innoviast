import FormButton from '@/components/common/FormButton'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/common/FormInput'
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from '@attendance/shared-zod';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useLogin } from '../hooks/useAuthMutation';

const containerVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.04
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    })
    const navigate = useNavigate();

    const { mutate: loginMutation, isPending } = useLogin();

    const onSubmit = async (data) => {
        loginMutation(data, {
            onSuccess: (res) => {
                const user = res.data

                switch (user.role) {
                    case "admin":
                        navigate("/admin/dashboard", { replace: true });
                        break;

                    case "instructor":
                        navigate("/instructor/dashboard", { replace: true });
                        break;

                    case "student":
                        navigate("/student/dashboard", { replace: true });
                        break;
                }
            },

            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="border border-border bg-bg-card lg:bg-transparent
         lg:border-0 rounded-2xl p-5 w-full max-w-md
        flex flex-col gap-12
        "
        >
            <motion.div
                variants={itemVariants}
                className='flex flex-col gap-1 items-center justify-center'
            >
                <h2 className='font-bold text-3xl text-primary'>Welcome Back</h2>
                <p className='text-sm text-text-secondary'>Sign in to continue to your account</p>
            </motion.div>

            <div className='flex flex-col gap-5'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-5'
                    method="post">
                    <div className='grid grid-cols-1 gap-3'>
                        <motion.div variants={itemVariants}>
                            <FormInput
                                register={register}
                                type='email'
                                placeholder='Enter email'
                                name='email'
                                errors={errors}
                                label='Email'
                                Icon={Mail}
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <FormInput
                                register={register}
                                type='password'
                                placeholder='Enter password'
                                name='password'
                                errors={errors}
                                label='Password'
                                Icon={Lock}
                            />
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className='flex justify-end'>
                        <motion.button
                            whileHover={{ x: 2 }}
                            onClick={() => navigate("/forgot-password")}
                            type='button'
                            className='text-primary
                        hover:cursor-pointer transition-all duration-200
                        text-sm hover:underline hover:text-primary-hover'>
                            Forgot Password?
                        </motion.button>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FormButton
                            type={"submit"}
                            text={'Login'}
                            loadingText='Login..'
                            isLoading={isPending}
                        />
                    </motion.div>
                </form>
            </div>
        </motion.div>
    )
}

export default LoginForm