import { motion } from "framer-motion";
import {
    BookOpen,
    Building2,
    GraduationCap,
    UserRound,
    BadgeInfo,
} from "lucide-react";

import { useMySubjects } from "@/features/student/hooks/useStudent";
import { SEO } from '@/shared/components/SEO';

interface StudentSubject {
    _id: string;

    subject: {
        _id: string;
        name: string;
        code: string;
        creditHours?: number;
    };

    department?: {
        _id: string;
        name: string;
        code: string;
    };

    instructor?: {
        _id: string;
        name: string;
        email: string;
    };
}

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 18,
        scale: 0.98,
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.35,
            ease: "easeOut" as const,
        },
    },
};

const Subjects = () => {
    const { data, isPending } = useMySubjects();

    const subjects =
        (data?.data as StudentSubject[] | undefined) ?? [];

    return (
        <>
            <SEO title="Subjects | Attendix" description="Browse your subjects, instructors, and course details in Attendix." noindex />

            <div
                className="
                flex
                flex-col
                gap-6
                flex-1
                h-max
                min-w-0
            "
            >
                <section
                    className="
                    bg-bg-card
                    border border-border
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                "
                >
                    {/* Header */}
                    <div className="p-6 border-b border-dashed border-border">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-text-base">
                                    My Subjects
                                </h2>

                                <p className="mt-1 text-text-secondary">
                                    View all subjects assigned to your class with instructor and department details.
                                </p>
                            </div>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.85,
                                    rotate: -8,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 0,
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeOut",
                                }}
                                className="
                                h-12
                                w-12
                                rounded-2xl
                                bg-primary/15
                                text-primary
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                            >
                                <BookOpen className="h-6 w-6" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isPending ? (
                            <div
                                className="
                                min-h-60
                                flex
                                items-center
                                justify-center
                                text-text-secondary
                            "
                            >
                                Loading subjects...
                            </div>
                        ) : subjects.length === 0 ? (
                            <div
                                className="
                                min-h-60
                                border
                                border-dashed
                                border-border
                                rounded-2xl
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-center
                                px-6
                            "
                            >
                                <div
                                    className="
                                    h-14
                                    w-14
                                    rounded-2xl
                                    bg-primary/10
                                    text-primary
                                    flex
                                    items-center
                                    justify-center
                                    mb-4
                                "
                                >
                                    <BookOpen className="h-7 w-7" />
                                </div>

                                <h3 className="text-lg font-semibold text-text-base">
                                    No subjects found
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-text-secondary">
                                    Your assigned subjects will appear here once they are available.
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-3
                                gap-5
                            "
                            >
                                {subjects.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        variants={cardVariants}
                                        whileHover={{
                                            y: -4,
                                            scale: 1.01,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                        className="
                                        relative
                                        rounded-2xl
                                        border border-border
                                        bg-bg
                                        p-5
                                        overflow-hidden
                                        shadow-sm
                                        hover:shadow-lg
                                        hover:border-primary/30
                                        transition-all
                                    "
                                    >
                                        {/* Top glow */}
                                        <div
                                            className="
                                            absolute
                                            -top-10
                                            -right-10
                                            h-28
                                            w-28
                                            rounded-full
                                            bg-primary/10
                                            blur-3xl
                                            pointer-events-none
                                        "
                                        />

                                        {/* Header */}
                                        <div className="relative flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-semibold text-text-base break-words">
                                                    {item.subject?.name ??
                                                        "--"}
                                                </h3>

                                                <p className="mt-1 text-sm text-text-secondary">
                                                    {item.subject?.code ??
                                                        "--"}
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                h-11
                                                w-11
                                                rounded-2xl
                                                bg-primary/12
                                                text-primary
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                            "
                                            >
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                        </div>

                                        {/* Credit Hours */}
                                        <div className="relative mt-5">
                                            <span
                                                className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                bg-primary/10
                                                text-primary
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-medium
                                            "
                                            >
                                                <BadgeInfo className="h-4 w-4" />
                                                {item.subject?.creditHours ??
                                                    0}{" "}
                                                Credit Hours
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div className="relative mt-6 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="
                                                    h-10
                                                    w-10
                                                    rounded-xl
                                                    bg-success/12
                                                    text-success
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                "
                                                >
                                                    <UserRound className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs uppercase tracking-wide text-text-secondary">
                                                        Instructor
                                                    </p>

                                                    <p className="mt-1 font-medium text-text-base break-words">
                                                        {item.instructor
                                                            ?.name ??
                                                            "--"}
                                                    </p>

                                                    <p className="text-sm text-text-secondary break-all">
                                                        {item.instructor
                                                            ?.email ??
                                                            "--"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="
                                                    h-10
                                                    w-10
                                                    rounded-xl
                                                    bg-warning/12
                                                    text-warning
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                "
                                                >
                                                    <Building2 className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs uppercase tracking-wide text-text-secondary">
                                                        Department
                                                    </p>

                                                    <p className="mt-1 font-medium text-text-base break-words">
                                                        {item.department
                                                            ?.name ??
                                                            "--"}
                                                    </p>

                                                    <p className="text-sm text-text-secondary">
                                                        {item.department
                                                            ?.code ??
                                                            "--"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div
                                            className="
                                            relative
                                            mt-6
                                            pt-4
                                            border-t
                                            border-dashed
                                            border-border
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                        "
                                        >
                                            <div className="flex items-center gap-2 text-text-secondary text-sm">
                                                <GraduationCap className="h-4 w-4" />
                                                <span>
                                                    Assigned Subject
                                                </span>
                                            </div>

                                            <span
                                                className="
                                                text-xs
                                                font-medium
                                                text-primary
                                                bg-primary/10
                                                px-3
                                                py-1
                                                rounded-full
                                            "
                                            >
                                                Active
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Subjects;