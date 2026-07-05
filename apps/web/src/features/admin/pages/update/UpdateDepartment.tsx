import FormButton from '@/components/common/FormButton'
import FormInput from '@/components/common/FormInput'
import SelectBox from '@/components/common/SelectBox'
import { departmentFields } from '@/features/department/constants/department.fields'
import { useDepartment } from '@/features/department/hooks/useDepartment'
import { useCreateDepartment, useUpdateDepartment } from '@/features/department/hooks/useDepartmentMutation'
import { statusOptions } from '@/shared/constants/filters'
import { departmentFormSchema, type CreateDepartmentInput, type DepartmentFormInput } from '@attendance/shared-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const UpdateDepartment = () => {

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
        resolver: zodResolver(departmentFormSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            status: statusOptions[0]
        },
    })

    const navigate = useNavigate()

    const { mutate, isPending: isUpdating } = useUpdateDepartment()

    const { id } = useParams()

    const { data, isPending: isDepartmentLoading } = useDepartment(id as string)


    const onSubmit = (data: DepartmentFormInput) => {

        const formattedData: CreateDepartmentInput = {
            name: data.name,
            code: data.code,
            description: data.description,
            status: data.status.value as "active" | "inactive",
        }

        mutate({
            id: id as string,
            body: formattedData
        }, {
            onSuccess: (res) => {
                toast.success(res?.message)
                navigate(-1)
            },
            onError: (err) => {
                toast.error(err?.message)
            },
        })
    }

    useEffect(() => {

        if (!id || !data || isDepartmentLoading)
            return

        reset(
            { ...data, status: status(data.status) }
        )

    }, [id, isDepartmentLoading, data, reset])

    const status = (status: string) => statusOptions.find((item) => item.value === status)



    return (
        <section className="bg-bg-card border border-border rounded-md
        flex flex-col gap-3
         shadow-sm flex-1 min-w-0 h-max">
            <div className='p-4 flex items-center gap-2'>
                <div className='
                     p-2 backdrop-blur-lg rounded-full cursor-pointer relative
                      hover:bg-surface text-text-base transition-all duration-300'>
                    <ArrowLeft
                        size={20}
                        onClick={() => navigate(-1)}
                        className='cursor-pointer '
                    />
                </div>

                <h2 className='text-text-base text-2xl font-bold'>Update Department</h2>
            </div>
            <div className='border-t border-dashed border-border' />
            <div className='p-6'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-8'
                    method="post">
                    <div
                        className='grid grid-cols-1 xl:grid-cols-2 gap-8'
                    >

                        {departmentFields
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
                            text={'Update'}
                            isLoading={isUpdating}
                            className='max-w-50'
                        />
                    </div>
                </form>

            </div>


        </section >
    )
}

export default UpdateDepartment


