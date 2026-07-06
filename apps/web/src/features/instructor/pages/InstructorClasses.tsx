import {
    BookOpen,
    ChevronRight,
    GraduationCap,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyClasses } from "../hooks/useInstructor";
import { Spinner } from "@/components/ui/spinner";
import { SEO } from '@/shared/components/SEO';


const InstructorClasses = () => {
    const navigate = useNavigate();

    const {
        data,
        isPending,
        error,
        isError
    } = useMyClasses();

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
            <SEO title="Instructor Classes | Attendix" description="Manage instructor classes in Attendix with attendance and academic workflows." noindex />
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
                                My Classes
                            </h2>

                            <p className="text-sm text-text-muted mt-1">
                                Manage your assigned classes and students.
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
                            <GraduationCap
                                className="text-primary"
                                size={22}
                            />
                        </div>
                    </div>
                </div>


                <div
                    className="
                    p-6
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    xl:grid-cols-3
                    gap-5
                    "
                >
                    {data?.data?.map((item: any) => (
                        <div
                            key={item._id}
                            className="
                            border border-border
                            rounded-xl
                            p-5
                            bg-bg/80
                            backdrop-blur-md
                            hover:border-primary/40
                            hover:shadow-lg
                            transition-all
                            duration-300
                            "
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3
                                        className="
                                        text-lg
                                        font-semibold
                                        text-text-base
                                        "
                                    >
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-text-secondary">
                                        {item.code}
                                    </p>
                                </div>

                                <BookOpen
                                    className="text-primary"
                                    size={22}
                                />
                            </div>

                            <div className="mt-5 space-y-3 text-text-secondary">
                                <div
                                    className="
                                    flex items-center justify-between
                                    "
                                >
                                    <span className=" text-sm">
                                        Department
                                    </span>

                                    <span className="font-medium text-sm">
                                        {item.department.name}
                                    </span>
                                </div>

                                <div
                                    className="
                                    flex items-center justify-between
                                    "
                                >
                                    <span className="text-text-secondary text-sm">
                                        Status
                                    </span>

                                    <span
                                        className={`
                                            px-2 py-1 rounded-full text-xs font-medium
                                            ${item.status === "active"
                                                ? "bg-success/10 text-success"
                                                : "bg-danger/10 text-danger"
                                            }
                                        `}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="
                                mt-6
                                flex gap-3
                                text-text-secondary
                                "
                            >
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/instructor/classes/${item._id}/students`
                                        )
                                    }
                                    className="
                                    flex-1
                                    h-10
                                    rounded-lg
                                    border
                                    border-border
                                    hover:bg-bg-secondary
                                    transition
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    cursor-pointer
                                    hover:bg-surface
                                    "
                                >
                                    <Users size={18} />
                                    Students
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/instructor/classes/${item._id}`
                                        )
                                    }
                                    className="
                                    h-10
                                    w-10
                                    rounded-lg
                                    bg-primary
                                    hover:bg-primary-hover
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    transition
                                    cursor-pointer
                                    "
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </>
    );
};

export default InstructorClasses;