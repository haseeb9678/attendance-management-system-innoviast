import { motion } from "framer-motion";
import {
    Building2,
    FileText,
    GraduationCap,
    Hash,
    ShieldCheck,
} from "lucide-react";

import { useMyClass } from "@/features/student/hooks/useStudent";

interface StudentClass {
    _id: string;
    name: string;
    code: string;
    description?: string;
    status: string;
    department?: {
        _id: string;
        name: string;
        code: string;
    } | null;
}

interface InfoCardProps {
    title: string;
    value: string;
    Icon: React.ElementType;
    color: string;
}

const InfoCard = ({
    title,
    value,
    Icon,
    color,
}: InfoCardProps) => {
    return (
        <div
            className="
                border border-border
                rounded-2xl
                bg-bg
                p-5
                transition-all
                hover:border-primary/30
                hover:shadow-sm
            "
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-text-secondary">
                        {title}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-text-base break-words">
                        {value || "--"}
                    </h3>
                </div>

                <div
                    className={`
                        h-12
                        w-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${color}
                    `}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

const MyClass = () => {
    const { data, isPending } = useMyClass();

    const classInfo = data?.data as StudentClass | undefined;

    return (
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
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="
                    bg-bg-card
                    border
                    border-border
                    rounded-md
                    shadow-sm
                    p-6
                "
            >
                <div>
                    <h2 className="text-2xl font-bold text-text-base">
                        My Class
                    </h2>

                    <p className="mt-1 text-text-secondary">
                        View your class information and department details.
                    </p>
                </div>

                {isPending ? (
                    <div className="mt-8 text-sm text-text-secondary">
                        Loading class information...
                    </div>
                ) : !classInfo ? (
                    <div className="mt-8 text-sm text-text-secondary">
                        No class information found.
                    </div>
                ) : (
                    <>
                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                xl:grid-cols-4
                                gap-5
                                mt-8
                            "
                        >
                            <InfoCard
                                title="Class Name"
                                value={classInfo.name || "--"}
                                Icon={GraduationCap}
                                color="bg-success/20 text-success"
                            />

                            <InfoCard
                                title="Class Code"
                                value={classInfo.code || "--"}
                                Icon={Hash}
                                color="bg-primary/20 text-primary"
                            />

                            <InfoCard
                                title="Department"
                                value={
                                    classInfo.department?.name ||
                                    "--"
                                }
                                Icon={Building2}
                                color="bg-warning/20 text-warning"
                            />

                            <InfoCard
                                title="Status"
                                value={classInfo.status || "--"}
                                Icon={ShieldCheck}
                                color="bg-error/20 text-error"
                            />
                        </div>

                        <div className="mt-8 border-t border-dashed border-border" />

                        <div className="mt-8">
                            <div
                                className="
                                    border border-border
                                    rounded-2xl
                                    bg-bg
                                    p-5
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            h-11
                                            w-11
                                            rounded-xl
                                            bg-primary/15
                                            text-primary
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                        "
                                    >
                                        <FileText className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-text-base">
                                            Class Description
                                        </h3>

                                        <p className="text-sm text-text-secondary">
                                            Additional information about your class.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <p className="text-sm leading-7 text-text-secondary">
                                        {classInfo.description?.trim()
                                            ? classInfo.description
                                            : "No class description available."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.section>
        </div>
    );
};

export default MyClass;