
import FormButton from '@/components/common/FormButton'
import { useForm } from 'react-hook-form'
import FormInput from '@/components/common/FormInput'
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from '@attendance/shared-zod';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { useLogin } from '../hooks/useAuthMutation';

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
                        navigate("/admin/dashboard", {
                            replace: true,
                        });
                        break;

                    case "instructor":
                        navigate("/instructor/dashboard", {
                            replace: true,
                        });
                        break;

                    case "student":
                        navigate("/student/dashboard", {
                            replace: true,
                        });
                        break;
                }
            },

            onError: (error) => {
                toast.error(error.message);
            },
        });
    };
    return (
        <div className="border border-gray-300 lg:border-0 rounded-2xl p-5 w-full max-w-md
        flex flex-col gap-12
        ">
            <div className='flex flex-col gap-1 items-center justify-center'>
                <h2 className='font-bold text-3xl text-primary'>Welcome Back</h2>
                <p
                    className='text-sm text-text-secondary'
                >Sign in to continue to your account</p>
            </div>
            <div
                className='flex flex-col gap-5'
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-5'
                    method="post">
                    <div className='grid grid-cols-1 gap-3'>
                        <FormInput
                            register={register}
                            type='email'
                            placeholder='Enter email'
                            name='email'
                            errors={errors}
                            label='Email'
                            Icon={Mail}
                        />
                        <FormInput
                            register={register}
                            type='password'
                            placeholder='Enter password'
                            name='password'
                            errors={errors}
                            label='Password'
                            Icon={Lock}
                        />
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            className='text-primary
                        hover:cursor-pointer transition-all duration-200
                        text-sm hover:underline hover:text-primary-hover'>
                            Forgot Password?
                        </button>
                    </div>
                    <FormButton
                        type={"submit"}
                        text={'Login'}
                        isLoading={isPending}
                    />
                </form>

            </div>

        </div>

    )
}

export default LoginForm

