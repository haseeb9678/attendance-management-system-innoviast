import Combobox from '@/components/common/Combobox'
import FormButton from '@/components/common/FormButton'
import FormInput from '@/components/common/FormInput'
import { Spinner } from '@/components/ui/spinner'
import { classFields } from '@/features/class/constants/class.fields'
import { useClass } from '@/features/class/hooks/useClass'
import { useDepartmentOptions } from '@/features/department/hooks/useDepartmentOptions'
import { statusOptions } from '@/shared/constants/filters'
import { classFormSchema } from '@attendance/shared-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { SEO } from '@/shared/components/SEO';


const ViewClass = () => {

    const { register, formState: { errors }, control, reset } = useForm({
        resolver: zodResolver(classFormSchema),
        defaultValues: {
            status: statusOptions[1],
        },
    })

    const { id } = useParams()

    const { data, isPending: isClassLoading, isError, error } = useClass(id as string)

    const navigate = useNavigate()
    const { options: departmentOptions } = useDepartmentOptions()

    const getOptions = (fieldName: unknown) => {
        if (fieldName === "department")
            return departmentOptions
        return []
    }

    const originalValue = (value: string, options) => options.find((item) => item.value === value)

    useEffect(() => {

        if (!id || !data || isClassLoading)
            return

        reset(
            {
                ...data,
                department: originalValue(data?.department?._id, departmentOptions),
                status: originalValue(data?.status, statusOptions)
            }
        )

    }, [id, isClassLoading, data, reset, departmentOptions])


    if (isClassLoading)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isClassLoading && isError)
        return <section
            className="flex flex-col justify-center items-center gap-2 flex-1 text-text-secondary"
        >
            {error?.message || "Something went wrong"}
            <FormButton
                type="button"
                text="Go Back"
                Icon={ArrowLeft}
                onClick={() =>
                    navigate(-1)
                }
                className="
                                h-9!
                                px-4
                                text-sm
                                max-w-fit
                            "
            />
        </section>


    return (
        <>
            <SEO title="View Class | Attendix" description="Review class details within Attendix." noindex />
            <section className="bg-bg-card border border-border rounded-md
        flex flex-col gap-3
        shadow-sm flex-1 min-w-0 h-max">

                <div className='p-4 flex items-center gap-2'>
                    <div className='
                     p-2 backdrop-blur-lg rounded-full cursor-pointer relative
                      hover:bg-surface text-text-base ransition-all duration-300'>
                        <ArrowLeft
                            size={20}
                            onClick={() => navigate(-1)}
                            className='cursor-pointer '
                        />
                    </div>

                    <h2 className='text-text-base text-2xl font-bold'>Class Info</h2>
                </div>
                <div className='border-t border-dashed border-border' />
                <div className='p-6'>
                    <form

                        className='flex flex-col gap-8'
                        method="post">
                        <div
                            className='grid grid-cols-1 xl:grid-cols-2 
                        gap-8'
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
                                                placeholder={field.label}
                                                type={field.type as string}
                                                Icon={field.Icon}
                                                disabled={true}
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
                                                    <Combobox
                                                        showTopLabel
                                                        label={field.label}
                                                        option={controllerField.value}
                                                        setOption={controllerField.onChange}
                                                        options={field.isApi ? getOptions(field.name) : field.options}
                                                        error={errors[field.name]?.message}
                                                        className="h-12! rounded-3xl!"
                                                        disabled={true}
                                                    />
                                                )}
                                            />
                                        );
                                    }

                                    return null;
                                })}
                        </div>

                    </form>

                </div>


            </section >
        </>
    )
}

export default ViewClass


