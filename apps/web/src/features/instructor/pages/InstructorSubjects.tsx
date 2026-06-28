import {
    BookOpenCheck,
    ChevronRight,
    GraduationCap,
    Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useMySubjects } from "../hooks/useInstructor";

const InstructorSubjects = () => {
    const navigate = useNavigate();

    const {
        data,
        isPending,
    } = useMySubjects();

    return (
        <section
            className="
            bg-bg-card
            border border-border
            rounded-md
            shadow-sm
            flex flex-col
            flex-1
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

            {isPending ? (
                <div className="p-6">
                    Loading...
                </div>
            ) : (
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
                                            `/instructor/subjects/${item.subject._id}`
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
                                    "
                                >
                                    <GraduationCap size={18} />
                                    View Details
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/instructor/subjects/${item.subject._id}`
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
                                    "
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default InstructorSubjects;