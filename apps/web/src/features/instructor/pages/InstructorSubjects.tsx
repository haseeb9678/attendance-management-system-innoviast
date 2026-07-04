import {
    BookOpenCheck,
    ChevronRight,
    GraduationCap,
    Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useMySubjects } from "../hooks/useInstructor";
import { Spinner } from "@/components/ui/spinner";

const InstructorSubjects = () => {
    const navigate = useNavigate();

    const {
        data,
        isPending,
        error,
        isError
    } = useMySubjects();

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
                            My Subjects
                        </h2>

                        <p className="text-sm text-text-muted mt-1">
                            View and manage the subjects assigned to you.
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
                        <BookOpenCheck
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
                                    {item.subject.name}
                                </h3>

                                <p className="text-sm text-text-secondary">
                                    {item.subject.code}
                                </p>
                            </div>

                            <Layers
                                className="text-primary"
                                size={22}
                            />
                        </div>

                        <div className="mt-5 space-y-3 text-text-secondary">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">
                                    Class
                                </span>

                                <span className="font-medium text-sm">
                                    {item.class.name}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm">
                                    Department
                                </span>

                                <span className="font-medium text-sm">
                                    {item.department.name}
                                </span>
                            </div>

                            {item.subject.creditHours && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">
                                        Credit Hours
                                    </span>

                                    <span className="font-medium text-sm">
                                        {item.subject.creditHours}
                                    </span>
                                </div>
                            )}
                        </div>


                    </div>
                ))}
            </div>

        </section>
    );
};

export default InstructorSubjects;