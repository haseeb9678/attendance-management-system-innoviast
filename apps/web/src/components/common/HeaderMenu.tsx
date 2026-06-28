import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useLogout } from "@/features/auth/hooks/useAuthMutation";

const menuVariants = {
    hidden: {
        opacity: 0,
        scale: 0.96,
        y: -10,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.18,
            ease: "easeOut",
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        y: -8,
        transition: {
            duration: 0.15,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        x: -8,
    },
    visible: {
        opacity: 1,
        x: 0,
    },
};

const HeaderMenu = ({
    menu,
    isOpen,
}) => {
    const navigate = useNavigate();

    const { mutate: logout } = useLogout();

    const handleAction = (action: string) => {
        switch (action) {
            case "logout":
                logout(undefined, {
                    onSuccess: () => {
                        navigate("/", {
                            replace: true,
                        });
                    },
                });
                break;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="
                        absolute
                        -right-3
                        top-14
                        w-60
                        rounded-2xl
                        border
                        border-border
                        bg-bg-card/95
                        backdrop-blur-xl
                        shadow-[0_10px_40px_rgba(0,0,0,.18)]
                        overflow-hidden
                        z-50
                    "
                >
                    {menu.map((item) => {
                        const Icon = item.Icon;

                        if (item.type === "action") {
                            return (
                                <motion.button
                                    key={item.id}
                                    variants={itemVariants}
                                    whileHover={{
                                        x: 0,
                                        scale: 1.03
                                    }}
                                    whileTap={{
                                        scale: 0.97,
                                    }}
                                    onClick={() =>
                                        handleAction(item.action)
                                    }
                                    className={`
                                        w-full
                                        px-4
                                        py-3
                                        flex
                                        items-center
                                        gap-3
                                        text-sm
                                        transition-colors
                                        hover:bg-surface
                                        ${item.danger
                                            ? "text-red-500 hover:bg-red-500/10"
                                            : ""
                                        }
                                    `}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </motion.button>
                            );
                        }

                        return (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                            >
                                <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        text-sm
                                        transition-all
                                        duration-200
                                        ${isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-surface"
                                        }
                                    `
                                    }
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HeaderMenu;