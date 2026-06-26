import {
    ChevronDown,
    ChevronRight,
    LucideX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSidebarStore } from "../store/sidebar.store";
import { adminSidebarItems } from "@/shared/constants/sidebarItems";
import DisableUI from "@/components/common/DisableUI";
import { motion, AnimatePresence } from "framer-motion";

const sidebarVariants = {
    expanded: (isMobile: boolean) => ({
        width: isMobile ? "80%" : 300,
        x: isMobile ? 0 : 0,
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 28
        }
    }),
    collapsed: (isMobile: boolean) => ({
        width: isMobile ? "80%" : 80,
        x: isMobile ? "-100%" : 0,
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 28
        }
    }),
};

const itemVariants = {
    hover: {
        scale: 1.03,
        x: 4,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    tap: {
        scale: 0.97
    }
};

const textVariants = {
    hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } }
};

const accordionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { staggerChildren: 0.05 } }
};

const childLinkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const Sidebar = () => {
    const [activeAccordion, setActiveAccordion] = useState(-1);
    const { isOpen, closeSidebar, openSidebar, setSidebar } = useSidebarStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const isShortSidebar = !isOpen && !isMobile;

    const handleAccordionClick = (index: number) => {
        if (isShortSidebar) {
            openSidebar();
        }
        setActiveAccordion(p => (p === index ? -1 : index));
    };

    return (
        <>
            <motion.aside
                layout
                variants={sidebarVariants}
                initial={false}
                animate={isOpen ? "expanded" : "collapsed"}
                custom={isMobile}
                className={`bg-primary-hover p-5 py-10 h-screen text-white overflow-y-auto overflow-x-hidden ${isMobile ? "fixed z-50" : "relative"
                    } shadow-lg`}
            >
                <div className='flex flex-col gap-12 flex-1'>
                    {isMobile && (
                        <motion.div className="flex justify-end" layout>
                            <LucideX size={28} onClick={closeSidebar} className="cursor-pointer" />
                        </motion.div>
                    )}
                    <AnimatePresence>
                        {!isShortSidebar && (
                            <motion.div
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                layout="position"
                            >
                                <h2 className="font-bold text-lg tracking-wider">AMS WEBSITE</h2>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-6 text-sm h-full">
                        {adminSidebarItems.map((item, index) => (
                            <motion.div layout className="flex flex-col gap-3" key={item.id}>
                                <AnimatePresence>
                                    {!isShortSidebar ? (
                                        <motion.h2
                                            variants={textVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className="uppercase text-xs tracking-wider text-white/70"
                                        >
                                            {item.label}
                                        </motion.h2>
                                    ) : (
                                        index !== 0 && (
                                            <motion.h2 layout className="uppercase text-xs tracking-wider text-center text-white/70">
                                                {"..."}
                                            </motion.h2>
                                        )
                                    )}
                                </AnimatePresence>
                                <div className="flex flex-col gap-3">
                                    {item.items.map((subItem, subIndex) =>
                                        subItem.children.length > 0 ? (
                                            <motion.div layout className="flex flex-col" key={subItem.id}>
                                                <motion.div
                                                    layout
                                                    variants={itemVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                    onClick={() => handleAccordionClick(subIndex)}
                                                    className={`flex items-center justify-between gap-2 px-3 h-10 rounded-md cursor-pointer ${isShortSidebar && "justify-center"}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <subItem.Icon size={20} />
                                                        <AnimatePresence>
                                                            {!isShortSidebar && (
                                                                <motion.h2 variants={textVariants} initial="hidden" animate="visible" exit="hidden">
                                                                    {subItem.label}
                                                                </motion.h2>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    {!isShortSidebar && (
                                                        <motion.div animate={{ rotate: activeAccordion === subIndex ? 90 : 0 }}>
                                                            <ChevronRight size={19} />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                                <AnimatePresence>
                                                    {activeAccordion === subIndex && !isShortSidebar && (
                                                        <motion.div
                                                            variants={accordionVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="hidden"
                                                            className="flex gap-5 ml-5 overflow-hidden"
                                                        >
                                                            <div className="w-0.5 bg-white/40" />
                                                            <div className="flex flex-col gap-4 py-2">
                                                                {subItem.children.map((child) => (
                                                                    <motion.div key={child.id} variants={childLinkVariants}>
                                                                        <NavLink
                                                                            end
                                                                            to={child.href}
                                                                            className={({ isActive }) =>
                                                                                isActive ? "text-gray-200 font-semibold" : "hover:text-gray-200"
                                                                            }
                                                                        >
                                                                            {child.label}
                                                                        </NavLink>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ) : (
                                            <NavLink
                                                to={subItem.href}
                                                end
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2 px-3 h-10 rounded-md ${isShortSidebar && "justify-center"
                                                    } ${isActive ? 'bg-gray-100/90 shadow-md text-primary-hover' : 'hover:bg-gray-100/80 hover:text-primary'}`
                                                }
                                                key={subItem.id}
                                            >
                                                {(
                                                    <motion.div
                                                        layout
                                                        variants={itemVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <subItem.Icon size={20} />
                                                        <AnimatePresence>
                                                            {!isShortSidebar && (
                                                                <motion.h2 variants={textVariants} initial="hidden" animate="visible" exit="hidden">
                                                                    {subItem.label}
                                                                </motion.h2>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                )}
                                            </NavLink>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.aside>
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <DisableUI setDisable={setSidebar} isBlack={true} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
