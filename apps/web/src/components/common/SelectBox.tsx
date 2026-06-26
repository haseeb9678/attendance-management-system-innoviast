import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import {
    useFloating,
    offset,
    flip,
    shift,
    autoUpdate,
    size
} from "@floating-ui/react";

interface SelectOption {
    label: string;
    value: string;
}

interface SelectBoxProps {
    label: string;
    showTopLabel?: boolean;
    option: SelectOption | null;
    setOption: React.Dispatch<React.SetStateAction<SelectOption>>;
    options: SelectOption[];
    className?: string
    error?: string
}

const SelectBox = ({
    label,
    showTopLabel = false,
    option,
    setOption,
    options,
    className = "",
    error = ""
}: SelectBoxProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (item: SelectOption) => {
        setOption(item);
        setIsOpen(false);
    };

    const { refs, floatingStyles } = useFloating({
        placement: "bottom-start",
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            flip(),
            shift({ padding: 8 }),
            size({
                apply({ availableHeight, elements }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${Math.min(availableHeight, 300)}px`,
                        overflowY: "auto",
                    });
                },
            }),
        ],
    });

    return (
        <div className="flex flex-col gap-1 w-full">
            {showTopLabel && (
                <label
                    htmlFor={label}
                    className="ml-2 text-xs font-medium text-text-secondary dark:text-gray-200"
                >
                    {label}
                </label>
            )}

            <div
                onClick={toggleOpen}
                ref={refs.setReference}
                className={`relative flex h-10 min-w-max rounded-md  cursor-pointer items-center 
                justify-between gap-2 border border-gray-200 px-3 text-text-secondary

                ${className}

                ${isOpen && (!error) && `transition-all duration-300
      border-primary-hover
      ring-3
      ring-primary-hover/15`}

      ${error
                        ? `border-red-500 focus-within:border-red-500 
                            focus-within:ring-3 focus-within:ring-red-600/15` : ``
                    }
                
            `}>
                <span className="text-sm">{option?.label ?? label}</span>

                {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}

                {isOpen && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className="
        z-50
        flex w-full flex-col
        overflow-y-auto
         max-h-60
        rounded-md
        border border-gray-200
        bg-white
        shadow-lg 
    "
                    >
                        <div className="flex h-9 cursor-default! items-center px-3 text-sm font-semibold">
                            {label}
                        </div>

                        {options.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className={`flex h-9 w-full items-center
                cursor-pointer
                justify-between px-3 text-left text-sm transition-colors ${option?.value === item.value
                                        ? "bg-gray-200 cursor-default!"
                                        : "hover:bg-gray-100"
                                    }`}
                            >
                                <span>{item.label}</span>

                                {option?.value === item.value && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default SelectBox;