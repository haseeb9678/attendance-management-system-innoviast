import FormButton from '@/components/common/FormButton'
import FormInput from '@/components/common/FormInput'
import { useMe } from '@/features/auth/hooks/useAuth'
import {
    updatePasswordSchema, updateUserSchema,
    type UpdatePasswordInput, type UpdateUserInput
} from '@attendance/shared-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {

    BadgeCheck, BriefcaseBusiness, Building2, Hash,
    KeyRound, Lock, Mail, PencilLine, Phone, User,
    X
} from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useUpdateInstructorProfile } from '../hooks/useInstructorMutation'
import { useUpdatePassword } from '@/features/users/hooks/useUserMutation'
import { Spinner } from '@/components/ui/spinner'

const InstructorProfile = () => {
    const { data, isPending, isError, error } = useMe()
    const user = data?.data
    const [isUpdateOpen, setIsUpdateOpen] = React.useState(false)
    const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false)

    if (isPending)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isPending && isError)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-text-secondary"
        >
            {error?.message || "Something went wrong"}
        </section>


    return (
        <>
            <section
                className="
            bg-bg-card
            border border-border
            rounded-md
            shadow-sm
            flex flex-col
            flex-1
            min-w-0
            h-max
            "
            >
                <div className="p-6 border-b border-dashed border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                My Profile
                            </h2>

                            <p className="text-sm text-text-muted mt-1">
                                Manage your profile information.
                            </p>
                        </div>

                        <div
                            className="
                        h-12 w-12
                        rounded-xl
                        bg-primary/10
                        flex items-center justify-center
                        "
                        >
                            <User
                                className="text-primary"
                                size={22}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row items-end justify-end  gap-3">
                        <FormButton
                            type="button"
                            text="Update"
                            Icon={PencilLine}

                            className="
                                min-w-max max-w-50 h-10! px-5 text-sm
                                bg-success hover:bg-success-hover
                            "
                            onClick={() => { setIsUpdateOpen(true) }}
                        />

                        <FormButton
                            type="button"
                            text="Change Password"
                            Icon={KeyRound}
                            className="
                                min-w-max max-w-50 h-10! px-5 text-sm
                                bg-warning hover:bg-warning-hover
                            "
                            onClick={() => { setIsChangePasswordOpen(true) }}
                        />
                    </div>
                    <ParentBox label="Personal Information">
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>

                            <ReadOnlyInput label="Name" value={user?.name} icon={<User size={18} />} />
                            <ReadOnlyInput label="Email" value={user?.email} icon={<Mail size={18} />} />
                            <ReadOnlyInput label="Phone Number" value={user?.phoneNumber} icon={<Phone size={18} />} />
                            <ReadOnlyInput label="Status" value={user?.status} icon={<BadgeCheck size={18} />} />

                        </div>
                    </ParentBox>
                    <ParentBox label="Role Information">
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>

                            <ReadOnlyInput label="Role" value={user?.role} icon={<BriefcaseBusiness size={18} />} />
                            <ReadOnlyInput label="Department" value={user?.department?.name + ' (' + user?.department?.code + ')'}
                                icon={<Building2 size={18} />} />
                            <ReadOnlyInput label="Employee ID" value={user?.employeeId} icon={<Hash size={18} />} />

                        </div>
                    </ParentBox>
                </div>
            </section>
            {
                isUpdateOpen && <UpdateProfile
                    user={user}
                    setIsOpen={setIsUpdateOpen} />
            }
            {
                isChangePasswordOpen && <ChangePassword
                    setIsOpen={setIsChangePasswordOpen} />
            }

        </>
    )
}

export default InstructorProfile

const UpdateProfile = ({ setIsOpen, user }
    : { setIsOpen: (open: boolean) => void, user: any }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(updateUserSchema),
    })

    const { mutate, isPending } = useUpdateInstructorProfile()
    const onSubmit = (data: UpdateUserInput) => {
        mutate(data, {
            onSuccess: () => {
                setIsOpen(false)
                toast.success("Profile updated successfully")
                window.location.reload()

            },
            onError: (err) => {
                toast.error(err.message)
            }
        })
    }

    useEffect(() => {
        reset({
            name: user?.name,
            phoneNumber: user?.phoneNumber,
        })
    }, [user])



    return (
        <div
            onClick={() => setIsOpen(false)}
            className="bg-black/70 fixed inset-0 flex items-center justify-center">
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-bg-card border border-border rounded-2xl shadow-md p-5
                 w-10/12 sm:min-w-md max-w-xl
            flex flex-col gap-8
            '>
                <div className='flex justify-between gap-2'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg font-semibold text-text-base'>Update Profile</h2>
                        <p className='text-sm text-text-muted'>Update your profile information.</p>
                    </div>
                    <div
                        onClick={() => setIsOpen(false)}
                        className="
                        h-10 w-10
                        rounded-xl
                        bg-surface
                        text-text-base
                        flex items-center justify-center
                        "
                    >
                        <X
                            size={22}
                        />
                    </div>
                </div>
                <form
                    className='flex flex-col gap-5'
                    onSubmit={handleSubmit(onSubmit)}
                    method="post">
                    <FormInput
                        register={register}
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Enter your name"
                        errors={errors}
                        Icon={User}
                    />
                    <FormInput
                        register={register}
                        name="phoneNumber"
                        label="Phone Number"
                        type="text"
                        placeholder="Enter your phone number"
                        errors={errors}
                        Icon={Phone}
                    />
                    <FormInput
                        register={register}
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        placeholder="Enter your current password"
                        errors={errors}
                        Icon={Lock}
                    />

                    <div className='flex flex-col gap-3 sm:flex-row'>

                        <FormButton
                            type="button"
                            text={"Cancel"}
                            className='bg-error text-white hover:bg-error-hover'
                            onClick={() => setIsOpen(false)}
                        />

                        <FormButton
                            type="submit"
                            text={"Update"}
                            className='bg-success text-white hover:bg-success-hover'
                            disabled={isPending}
                            isLoading={isPending}
                            loadingText="Updating"

                        />
                    </div>

                </form>

            </div>
        </div >
    )
}
const ChangePassword = ({ setIsOpen }
    : { setIsOpen: (open: boolean) => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(updatePasswordSchema),
    })

    const { mutate, isPending } = useUpdatePassword()
    const onSubmit = (data: UpdatePasswordInput) => {
        mutate({
            body: data
        }, {
            onSuccess: () => {
                setIsOpen(false)
                toast.success("Password updated successfully")

            },
            onError: (err) => {
                toast.error(err.message)
            }
        })
    }



    return (
        <div
            onClick={() => setIsOpen(false)}
            className="bg-black/70 fixed inset-0 flex items-center justify-center">
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-bg-card border border-border rounded-2xl shadow-md p-5
                 w-10/12 sm:min-w-md max-w-xl
            flex flex-col gap-8
            '>
                <div className='flex justify-between gap-2'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg font-semibold text-text-base'>Update Password</h2>
                        <p className='text-sm text-text-muted'>Update your password.</p>
                    </div>
                    <div
                        onClick={() => setIsOpen(false)}
                        className="
                        h-10 w-10
                        rounded-xl
                        bg-surface
                        text-text-base
                        flex items-center justify-center
                        "
                    >
                        <X
                            size={22}
                        />
                    </div>
                </div>
                <form
                    className='flex flex-col gap-5'
                    onSubmit={handleSubmit(onSubmit)}
                    method="post">

                    <FormInput
                        register={register}
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        placeholder="Enter your current password"
                        errors={errors}
                        Icon={Lock}
                    />
                    <FormInput
                        register={register}
                        name="newPassword"
                        label="New Password"
                        type="password"
                        placeholder="Enter your new password"
                        errors={errors}
                        Icon={Lock}
                    />
                    <FormInput
                        register={register}
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your new password"
                        errors={errors}
                        Icon={Lock}
                    />


                    <div className='flex flex-col gap-3 sm:flex-row'>

                        <FormButton
                            type="button"
                            text={"Cancel"}
                            className='bg-error text-white hover:bg-error-hover'
                            onClick={() => setIsOpen(false)}
                        />

                        <FormButton
                            type="submit"
                            text={"Change Password"}
                            className='bg-warning text-white hover:bg-warning-hover'
                            disabled={isPending}
                            isLoading={isPending}
                            loadingText="Updating"

                        />
                    </div>

                </form>

            </div>
        </div >
    )
}

const ReadOnlyInput = ({ label, value, icon }) => {
    return <div className='flex flex-col gap-2'>
        <h2 className='font-semibold text-sm text-text-base'>{label}</h2>
        <div className='h-12 w-full border capitalize p-3 truncate text-text-secondary
         flex items-center border-border rounded-md'>
            {icon && <div className='mr-2'>{icon}</div>}
            {value}
        </div>
    </div>
}

interface ParentBoxProps {
    label: string;
    children: React.ReactNode;
}

const ParentBox = ({
    label,
    children,
}: ParentBoxProps) => {
    return (
        <section
            className="
            overflow-hidden
            rounded-xl
            border border-border
            bg-bg-card
            shadow-sm"
        >
            <div className="h-1 w-full bg-primary" />

            <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-text-base">
                    {label}
                </h2>
            </div>

            <div className="space-y-5 p-6">
                {children}
            </div>
        </section>
    );
};