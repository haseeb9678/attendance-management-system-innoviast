import { motion } from "framer-motion";
import {
    BookOpen,
    Building2,
    GraduationCap,
    UserRound,
    BadgeInfo,
} from "lucide-react";

import { useMySubjects } from "@/features/student/hooks/useStudent";
import { SEO } from "@/shared/components/SEO";

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
            staggerChildren: 0.06,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 16,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.28,
            ease: "easeOut" as const,
        },
    },
};

interface InfoItemProps {
    label: string;
    value: string;
    icon: React.ElementType;
    color: string;
    secondaryValue?: string;
}

const InfoItem = ({
    label,
    value,
    icon: Icon,
    color,
    secondaryValue,
}: InfoItemProps) => {
    return (
        <div className="flex items-start gap-3 min-w-0">
            <div
                className={`
                    h-9 w-9 rounded-xl flex items-center justify-center shrink-0
                    ${color}
                `}
            >
                <Icon className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-text-secondary">
                    {label}
                </p>

                <p className="mt-0.5 text-sm font-semibold text-text-base break-words">
                    {value || "--"}
                </p>

                {secondaryValue ? (
                    <p className="text-xs text-text-secondary break-all mt-0.5">
                        {secondaryValue}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

const Subjects = () => {
    const { data, isPending } = useMySubjects();

    const subjects =
        (data?.data as StudentSubject[] | undefined) ?? [];

    return (
        <>
            <SEO
                title="Subjects | Attendix"
                description="Browse your subjects, instructors, and course details in Attendix."
                noindex
            />

            <section
                className="
                    bg-bg-card
                    border border-border
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                    flex flex-col
                    flex-1
                    min-w-0
                    h-max
                "
            >
                {/* Header */}
                <div className="p-6 border-b border-dashed border-border">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                My Subjects
                            </h2>

                            <p className="mt-1 text-sm text-text-secondary max-w-2xl">
                                View all subjects assigned to your class with instructor and department details.
                            </p>
                        </div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.88,
                                rotate: -8,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: 0,
                            }}
                            transition={{
                                duration: 0.35,
                                ease: "easeOut",
                            }}
                            className="
                                h-12 w-12 rounded-2xl
                                bg-primary/15 text-primary
                                flex items-center justify-center shrink-0
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
                                flex items-center justify-center
                                text-text-secondary
                            "
                        >
                            Loading subjects...
                        </div>
                    ) : subjects.length === 0 ? (
                        <div
                            className="
                                min-h-60 border border-dashed border-border
                                rounded-2xl flex flex-col items-center justify-center
                                text-center px-6
                            "
                        >
                            <div
                                className="
                                    h-14 w-14 rounded-2xl
                                    bg-primary/10 text-primary
                                    flex items-center justify-center mb-4
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
                                2xl:grid-cols-4
                                gap-4
                            "
                        >
                            {subjects.map((item) => (
                                <motion.div
                                    key={item._id}
                                    variants={cardVariants}
                                    whileHover={{ y: -3 }}
                                    className="
                                        relative
                                        rounded-2xl
                                        border border-border
                                        bg-bg
                                        p-4
                                        shadow-sm
                                        hover:shadow-md
                                        hover:border-primary/25
                                        transition-all
                                        overflow-hidden
                                    "
                                >
                                    {/* soft glow */}
                                    <div
                                        className="
                                            absolute -top-10 -right-10
                                            h-24 w-24 rounded-full
                                            bg-primary/8 blur-3xl
                                            pointer-events-none
                                        "
                                    />

                                    {/* top row */}
                                    <div className="relative flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold text-text-base leading-6 break-words">
                                                {item.subject?.name ?? "--"}
                                            </h3>

                                            <p className="mt-1 text-sm text-text-secondary">
                                                {item.subject?.code ?? "--"}
                                            </p>
                                        </div>

                                        <div
                                            className="
                                                h-10 w-10 rounded-xl
                                                bg-primary/12 text-primary
                                                flex items-center justify-center shrink-0
                                            "
                                        >
                                            <BookOpen className="h-4.5 w-4.5" />
                                        </div>
                                    </div>

                                    {/* meta row */}
                                    <div className="relative mt-4 flex flex-wrap items-center gap-2">
                                        <span
                                            className="
                                                inline-flex items-center gap-1.5
                                                rounded-full bg-primary/10 text-primary
                                                px-2.5 py-1 text-[11px] font-medium
                                            "
                                        >
                                            <BadgeInfo className="h-3.5 w-3.5" />
                                            {item.subject?.creditHours ?? 0} Credit Hours
                                        </span>

                                        <span
                                            className="
                                                inline-flex items-center gap-1.5
                                                rounded-full bg-success/10 text-success
                                                px-2.5 py-1 text-[11px] font-medium
                                            "
                                        >
                                            <GraduationCap className="h-3.5 w-3.5" />
                                            Assigned
                                        </span>
                                    </div>

                                    {/* compact details */}
                                    <div className="relative mt-5 space-y-4">
                                        <InfoItem
                                            label="Instructor"
                                            value={item.instructor?.name ?? "--"}
                                            secondaryValue={item.instructor?.email ?? "--"}
                                            icon={UserRound}
                                            color="bg-success/12 text-success"
                                        />

                                        <InfoItem
                                            label="Department"
                                            value={item.department?.name ?? "--"}
                                            secondaryValue={item.department?.code ?? "--"}
                                            icon={Building2}
                                            color="bg-warning/12 text-warning"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Subjects;