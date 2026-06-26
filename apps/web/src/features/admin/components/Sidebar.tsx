import {

    ChevronDown,
    ChevronRight,

    LucideX,

} from "lucide-react";
import { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { useSidebarStore } from "../store/sidebar.store";
import { adminSidebarItems } from "@/shared/constants/sidebarItems";



const Sidebar = () => {

    const [activeItem, setActiveItem] = useState(-1)
    const isOpen = useSidebarStore((s) => s.isOpen)
    const closeSidebar = useSidebarStore((s) => s.closeSidebar)


    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile(); // Set initial value

        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const isShortSidebar = !isOpen && !isMobile
    const openSidebar = useSidebarStore((s) => s.openSidebar)

    return (
        <aside
            className={`bg-primary-hover
            p-5 py-10 h-screen text-white overflow-auto
            ${isMobile ? "fixed z-50" : ""}
            ${isOpen ? (
                    isMobile ? "min-w-75" : "min-w-75"
                ) : (
                    isMobile ? " hidden" : "w-20"
                )}
            shadow`}
        >

            <div className='flex flex-col gap-12 flex-1'>
                {isMobile && <div className="flex justify-end">
                    <LucideX
                        size={28}
                        onClick={closeSidebar}
                    />
                </div>}
                <div>
                    {!isShortSidebar && <h2 className="font-bold text-lg upperc' tracking-wider">AMS WEBSITE</h2>}
                </div>
                <div className="flex flex-col gap-6 text-sm h-full">
                    {
                        adminSidebarItems.map((item, index) => (
                            <div
                                className="flex flex-col gap-3"
                                key={item.id}>
                                {!isShortSidebar ?
                                    <h2 className="uppercase text-xs tracking-wider text-white/70">{item.label}</h2>
                                    : (index !== 0 && <h2 className="uppercase text-xs
                                     tracking-wider text-center text-white/70">{"..."}</h2>)
                                }
                                <div className="flex flex-col gap-3">
                                    {
                                        item.items.map((subItem, index) =>
                                            subItem?.children.length > 0 ? (
                                                <div className="flex flex-col gap-4">

                                                    <div
                                                        onClick={() => {
                                                            setActiveItem(p => p === index ? -1 : index)
                                                            if (isShortSidebar)
                                                                openSidebar()
                                                        }}
                                                        className={activeItem === index ?
                                                            `flex items-center justify-between gap-2 px-3 
                                                            ${isShortSidebar && "justify-center"}
                                                            h-10 bg-gray-100/90 shadow-md backdrop-blur-lg rounded-md text-primary-hover`
                                                            : `flex items-center
                                                            ${isShortSidebar && "justify-center"}
                                                            justify-between cursor-pointer
                                                            hover:bg-gray-100/80 hover:text-primary
                                                            backdrop-blur-lg rounded-md
                                                            px-3 
                                                            h-10
                                                            gap-2`}
                                                        key={subItem.id}>
                                                        <div className="flex justify-between items-center gap-2 ">
                                                            <subItem.Icon size={20}

                                                            />
                                                            {!isShortSidebar && <h2>{subItem.label}</h2>}

                                                        </div>
                                                        {
                                                            !isShortSidebar && ((activeItem === index) ?
                                                                <ChevronDown
                                                                    size={19}

                                                                /> : <ChevronRight
                                                                    size={19}

                                                                />)
                                                        }

                                                    </div>
                                                    {

                                                        !isShortSidebar && (activeItem === index && <div className="flex gap-5 ml-5">
                                                            <div className="items-stretch w-0.5 bg-white/40" />
                                                            <div className="flex flex-col gap-4">
                                                                {
                                                                    subItem?.children?.map((child) => (
                                                                        <NavLink
                                                                            end
                                                                            to={child.href}
                                                                            className={({ isActive }) => isActive ?
                                                                                `text-gray-200` : `hover:text-gray-200`}

                                                                        >
                                                                            {child.label}
                                                                        </NavLink>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>)

                                                    }
                                                </div>
                                            ) :
                                                (
                                                    <NavLink

                                                        to={subItem.href}
                                                        className={({ isActive }) => isActive ?
                                                            `flex items-center gap-2 px-3  cursor-default ${isShortSidebar && "justify-center"}
                                                            h-10 bg-gray-100/90 shadow-md backdrop-blur-lg rounded-md text-primary-hover`
                                                            : `flex items-center
                                                            ${isShortSidebar && "justify-center"}
                                                            hover:bg-gray-100/80 hover:text-primary
                                                            backdrop-blur-lg rounded-md
                                                            px-3 
                                                            h-10
                                                            gap-2`}
                                                        key={subItem.id}>
                                                        <subItem.Icon size={20} />
                                                        {!isShortSidebar && <h2>{subItem.label}</h2>}
                                                    </NavLink>))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </aside>
    )
}

export default Sidebar