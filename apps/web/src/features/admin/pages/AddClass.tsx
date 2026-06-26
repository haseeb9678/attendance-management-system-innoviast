import FormButton from '@/components/common/FormButton'
import FormInput from '@/components/common/FormInput'
import SelectBox from '@/components/common/SelectBox'
import { classFields } from '@/features/class/constants/class.fields'
import { statusOptions } from '@/shared/constants/filters'
import { classFormSchema } from '@attendance/shared-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const AddClass = () => {

    const { register, handleSubmit, formState: { errors }, control } = useForm({
        resolver: zodResolver(classFormSchema),
        defaultValues: {
            status: statusOptions[1],
        },
    })

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

                <h2 className='text-text-base text-2xl font-bold'>Add Class</h2>
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

                        {classFields
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
                    <div className='flex justify-end'>
                        <FormButton
                            type={"submit"}
                            text={'Add'}
                            className='max-w-50'
                        />
                    </div>
                </form>

            </div>


        </section >
    )
}

export default AddClass


