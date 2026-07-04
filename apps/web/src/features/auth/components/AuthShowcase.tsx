import { LucideSchool } from "lucide-react";
import School from "/school.jpg";

const AuthShowcase = () => {
    return (
        <aside
            className="
        relative hidden lg:flex
        w-full max-w-2xl
        overflow-hidden
        border border-border/10
        bg-gradient-to-br from-primary-hover to-secondary
        p-10 text-white
      "
        >
            {/* Background Image */}
            <img
                src={School}
                alt="School"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark Overlay */}
            <div
                className="
    absolute inset-0
    bg-gradient-to-r
    from-primary-hover
    via-primary/90
    to-primary/60
    via-45%
  "
            />

            {/* Decorative Blur */}
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between">
                {/* Top */}
                <div className="space-y-10">
                    {/* Badge */}
                    <div
                        className="
              inline-flex items-center gap-3
              rounded-full
              border border-white/15
              bg-white/10
              px-4 py-2
              backdrop-blur-md
            "
                    >
                        <div className="rounded-xl bg-white p-2 text-primary shadow-lg">
                            <LucideSchool className="size-5" />
                        </div>

                        <span className="text-sm font-medium">
                            Attendance Management System
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-5">
                        <h1 className="max-w-lg text-4xl font-bold leading-tight">
                            Smart attendance management for modern institutions.
                        </h1>

                        <p className="max-w-lg text-base leading-8 text-white/90">
                            Streamline attendance tracking, manage students and staff,
                            generate insightful reports, and simplify administration—all
                            from one powerful dashboard.
                        </p>
                    </div>
                </div>


            </div>
        </aside>
    );
};

export default AuthShowcase;