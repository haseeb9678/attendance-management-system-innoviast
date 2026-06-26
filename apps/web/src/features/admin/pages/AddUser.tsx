import FormButton from '@/components/common/FormButton'
import FormInput from '@/components/common/FormInput'
import SelectBox from '@/components/common/SelectBox'
import { divisons, formFields, instructorFields, studentFields }
    from '@/features/users/constants/user.fields'
import { roleOptions, statusOptions } from '@/shared/constants/filters'
import { userFormSchema } from '@attendance/shared-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const AddUser = () => {

    const { register, handleSubmit, formState: { errors }, control, watch } = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            role: roleOptions[1],
            status: statusOptions[1],
        },
    })

    const renderFields = (fields: typeof formFields) =>
        fields.map((field) => {
            if (field.component === "input") {
                return (
                    <FormInput
                        key={field.id}
                        register={register}
                        errors={errors}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        type={field.type}
                        Icon={field.Icon}
                    />
                );
            }

            return (
                <Controller
                    key={field.id}
                    control={control}
                    name={field.name}
                    render={({ field: controllerField }) => (
                        <SelectBox
                            showTopLabel
                            label={field.label}
                            option={controllerField.value}
                            setOption={controllerField.onChange}
                            options={field.options}
                            error={errors[field.name]?.message}
                            className="h-12! rounded-3xl!"
                        />
                    )}
                />
            );
        });
    const roleFields = {
        student: {
            title: "Student Information",
            fields: studentFields,
        },
        instructor: {
            title: "Instructor Information",
            fields: instructorFields,
        },
    };
    const role = watch("role")?.value
    const currentRole = roleFields[role as keyof typeof roleFields];

    const onSubmit = (data) => {
        console.log(data)
    }
    console.log("errors", errors)

    const navigate = useNavigate()

    return (
        <section className="bg-white border border-gray-200 rounded-md
        flex flex-col gap-3
         shadow-sm flex-1 min-w-0 h-max">
            <div className='p-4 flex items-center gap-2'>
                <div className='
                     p-2 backdrop-blur-lg rounded-full cursor-pointer relative
                      hover:bg-gray-100 transition-all duration-300'>
                    <ArrowLeft
                        size={20}
                        onClick={() => navigate(-1)}
                        className='cursor-pointer '
                    />
                </div>
                <h2 className='text-text-base text-2xl font-bold'>Add User</h2>
            </div>
            <div className='border-t border-dashed border-gray-300' />
            <div className='p-6'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-8'
                    method="post">
                    <div
                        className='grid grid-cols-1 xl:grid-cols-2 gap-8'
                    >
                        {
                            divisons.map(division => (
                                <ParentBox
                                    key={division.id}
                                    label={division.label}
                                >
                                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-3'>
                                        {formFields
                                            .filter((field) => field.division === division.division)
                                            .map((field) => {
                                                if (field.component === "input") {
                                                    return (
                                                        <FormInput
                                                            key={field.id}
                                                            register={register}
                                                            errors={errors}
                                                            name={field.name}
                                                            label={field.label}
                                                            placeholder={field.placeholder}
                                                            type={field.type}
                                                            Icon={field.Icon}
                                                        />
                                                    );
                                                }

                                                if (field.component === "select") {
                                                    return (
                                                        <Controller
                                                            key={field.id}
                                                            control={control}
                                                            name={field.name}
                                                            render={({ field: controllerField }) => (
                                                                <SelectBox
                                                                    showTopLabel
                                                                    label={field.label}
                                                                    option={controllerField.value}
                                                                    setOption={controllerField.onChange}
                                                                    options={field.options}
                                                                    error={errors[field.name]?.message}
                                                                    className="h-12! rounded-3xl!"
                                                                />
                                                            )}
                                                        />
                                                    );
                                                }

                                                return null;
                                            })}
                                    </div>
                                </ParentBox>
                            ))
                        }

                        {currentRole && (
                            <ParentBox label={currentRole.title}>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                    {renderFields(currentRole.fields)}
                                </div>
                            </ParentBox>
                        )}
                    </div>
                    <div className='flex justify-end'>
                        <FormButton
                            type={"submit"}
                            text={'Add'}
                            className='max-w-50'
                        />
                    </div>


                </form>
            </div>
        </section>
    )
}

export default AddUser

interface ParentBoxProps {
    label: string;
    children: React.ReactNode;
}

const ParentBox = ({ label, children }: ParentBoxProps) => {
    return (
        <section
            className="
        overflow-hidden rounded-xl
        border border-gray-200
        bg-white shadow-sm
      "
        >
            <div className="h-1 w-full bg-primary" />

            <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-text-base">
                    {label}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                    Fill in the required information below.
                </p>
            </div>

            <div className="space-y-5 p-6">
                {children}
            </div>
        </section>
    );
};

