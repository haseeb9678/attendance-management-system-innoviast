import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    ClipboardCheck,
    Clock3,
    GraduationCap,
    Loader2,
    MapPin,
    Save,
    User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useSessionAttendance } from "@/features/attendance/hooks/useAttendance";
import { useSession } from "@/features/session/hooks/useSession";
import { useMyStudents } from "../hooks/useInstructor";
import { useFieldArray, useForm } from "react-hook-form";
import type { AttendanceFormInput } from "@attendance/shared-zod";
import { useEffect, useMemo } from "react";
import DataTable from "@/components/common/Table";
import { attendanceColumns } from "@/features/attendance/constants/attendanceColumns";
import FormButton from "@/components/common/FormButton";
import { useUpdateAttendance } from "@/features/attendance/hooks/useAttendanceMutation";
import { toast } from "sonner";
import { formatSessionTime } from "@/lib/date";

const InstructorMarkAttendance = () => {
    const { id } = useParams();

    const {
        data: attendanceData,
        isPending: isAttendanceLoading,
    } = useSessionAttendance(id as string);

    const {
        data: sessionResponse,
        isPending: isSessionLoading,
    } = useSession(id as string);

    const session = sessionResponse?.data;

    const { data: studentsData, isPending: isStudentsLoading } = useMyStudents(
        session?.teacherAssignment?.class?._id
    );

    const loading =
        isAttendanceLoading || isSessionLoading;

    const {
        control,
        register,
        reset,
        handleSubmit,
    } = useForm<AttendanceFormInput>();

    const { fields } = useFieldArray({
        control,
        name: "students",
    });

    const tableData = attendanceData?.data?.length
        ? fields.map((field, index) => ({
            ...attendanceData.data[index].student,
            ...field,
        }))
        : fields.map((field, index) => ({
            ...studentsData?.data?.[index],
            ...field,
        }));

    const columns = useMemo(
        () =>
            attendanceColumns({
                control,
                register,
            }),
        [control, register]
    );

    const { mutate, isPending: isUpdating } = useUpdateAttendance()
    const navigate = useNavigate()

    const onSubmit = (data: AttendanceFormInput) => {
        if (!id) return;

        mutate(
            {
                sessionId: id,
                body: data,
            },
            {
                onSuccess: (res) => {
                    toast.success(res.message)
                },
                onError: (err: any) => {
                    toast.error(err.message)
                },
            }
        );
    };

    useEffect(() => {
        if (!id) return;

        // Attendance already exists
        if (attendanceData?.data?.length) {
            reset({
                session: id,
                students: attendanceData.data.map(
                    (item) => ({
                        student: item.student._id,
                        status: item.status,
                        remarks: item.remarks ?? "",
                    })
                ),
            });

            return;
        }

        // No attendance yet
        if (studentsData?.data) {
            reset({
                session: id,
                students: studentsData.data.map(
                    (student) => ({
                        student: student._id,
                        status: "present",
                        remarks: "",
                    })
                ),
            });
        }
    }, [
        id,
        attendanceData,
        studentsData,
        reset,
    ]);


    if (!id) {
        return (
            <section
                className="
                bg-bg-card
                border border-border
                rounded-md
                shadow-sm
                flex-1
                flex
                items-center
                justify-center
                min-h-max
                "
            >
                <p className="text-text-base font-semibold">
                    Invalid Session Id.
                </p>
            </section>
        );
    }

    return (
        <section
            className="
            bg-bg-card
            border border-border
            rounded-md
            shadow-sm
            flex
            flex-col
            flex-1
            h-max
            min-w-0
            "
        >
            {/* Header */}

            <div className="p-6 border-b border-dashed border-border">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">

                        <button
                            onClick={() => navigate(-1)}
                            className="
                            h-max w-max
                    p-2 backdrop-blur-lg rounded-full
                    cursor-pointer relative
                    hover:bg-surface
                    text-text-base
                    transition-all duration-300"
                        >
                            <ArrowLeft
                                size={20}

                                className="cursor-pointer"
                            />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                Session Attendance
                            </h2>

                            <p className="mt-1 text-sm text-text-muted">
                                Mark attendance for this teaching session.
                            </p>
                        </div>

                    </div>

                    <div
                        className="
                        h-12
                        w-12
                        rounded-xl
                        bg-primary/10
                        flex
                        items-center
                        justify-center
                        "
                    >
                        <ClipboardCheck
                            size={22}
                            className="text-primary"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div
                    className="
                    flex-1
                    flex
                    items-center
                    justify-center
                    py-20
                    "
                >
                    <Loader2
                        className="
                        animate-spin
                        text-primary
                        "
                    />
                </div>
            ) : (
                <div className="p-6 space-y-6">
                    {/* Session Information */}

                    <div
                        className="
                        border
                        border-border
                        rounded-xl
                        overflow-hidden
                        "
                    >
                        <div
                            className="
                            px-5
                            py-4
                            border-b
                            border-dashed
                            border-border
                            "
                        >
                            <h3
                                className="
                                text-lg
                                font-semibold
                                text-text-base
                                "
                            >
                                Session Details
                            </h3>
                        </div>

                        <div
                            className="
                            p-5
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-5
                            "
                        >
                            <InfoCard
                                icon={<BookOpen size={18} />}
                                label="Subject"
                                value={`${session?.teacherAssignment.subject.name} (${session?.teacherAssignment.subject.code})`}
                            />

                            <InfoCard
                                icon={<GraduationCap size={18} />}
                                label="Class"
                                value={`${session?.teacherAssignment.class.name} (${session?.teacherAssignment.class.code})`}
                            />

                            <InfoCard
                                icon={<User size={18} />}
                                label="Instructor"
                                value={`${session?.teacherAssignment.instructor.name}`}
                            />

                            <InfoCard
                                icon={<CalendarDays size={18} />}
                                label="Date"
                                value={new Date(
                                    session?.date
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            />

                            <InfoCard
                                icon={<Clock3 size={18} />}
                                label="Time"
                                value={formatSessionTime(
                                    session?.startTime,
                                    session?.endTime
                                )}
                            />

                            <InfoCard
                                icon={<MapPin size={18} />}
                                label="Room"
                                value={
                                    session?.room ||
                                    "Not Assigned"
                                }
                            />
                        </div>
                    </div>

                    {/* Attendance */}

                    <div
                        className="
                        border
                        border-border
                        rounded-xl
                        "
                    >
                        <div
                            className="
                            px-5
                            py-4
                            border-b
                            border-dashed
                            border-border
                            "
                        >
                            <h3
                                className="
                                text-lg
                                font-semibold
                                text-text-base
                                "
                            >
                                Students Attendance
                            </h3>

                            <p
                                className="
                                text-sm
                                text-text-secondary
                                mt-1
                                "
                            >
                                {attendanceData?.data
                                    ?.length
                                    ? "Attendance already exists for this session."
                                    : "Attendance has not been marked yet."}
                            </p>
                        </div>

                        <div className="p-5">
                            <form
                                className="flex flex-col gap-5"
                                onSubmit={handleSubmit(onSubmit)}
                                method="post">
                                {attendanceData?.data
                                    .length ? <div className="flex justify-end">
                                    <FormButton
                                        type="submit"
                                        text="Save"
                                        isLoading={isUpdating}
                                        loadingText="Saving"
                                        Icon={Save}
                                        className=" max-w-40 px-5"
                                    />
                                </div> : null}
                                {/* DataTable goes here */}
                                <DataTable
                                    data={tableData}
                                    columns={columns}
                                    loading={isStudentsLoading}
                                    showCheckbox={false}
                                    message="No students found for this class."
                                />

                            </form>

                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InstructorMarkAttendance;

type InfoCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

const InfoCard = ({
    icon,
    label,
    value,
}: InfoCardProps) => (
    <div
        className="
        border
        border-border
        rounded-lg
        p-4
        flex
        gap-4
        "
    >
        <div
            className="
            h-10
            w-10
            rounded-lg
            bg-primary/10
            text-primary
            flex
            items-center
            justify-center
            shrink-0
            "
        >
            {icon}
        </div>

        <div className="min-w-0">
            <p
                className="
                text-xs
                uppercase
                tracking-wide
                text-text-secondary
                "
            >
                {label}
            </p>

            <p
                className="
                mt-1
                font-medium
                text-text-base
                break-words
                "
            >
                {value}
            </p>
        </div>
    </div>
);