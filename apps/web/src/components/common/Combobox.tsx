import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export interface SelectOption {
    label: string;
    value: string;
}

interface ComboboxProps {
    label: string;

    option: SelectOption | null;

    setOption: React.Dispatch<
        React.SetStateAction<SelectOption>
    >;

    options: SelectOption[];

    showTopLabel?: boolean;

    placeholder?: string;

    searchPlaceholder?: string;

    emptyText?: string;

    className?: string;

    error?: string;

    disabled?: boolean;
}

const Combobox = ({
    label,

    option,

    setOption,

    options,

    showTopLabel = false,

    placeholder,

    searchPlaceholder,

    emptyText = "No option found.",

    className = "",

    error = "",

    disabled = false,
}: ComboboxProps) => {
    const [open, setOpen] = useState(false);

    const sortedOptions = useMemo(() => options, [options]);
    const handleSelect = (value: string) => {
        const selected = options.find(
            (item) => item.value === value
        );

        if (!selected) return;

        setOption(selected);

        setOpen(false);
    };
    return (
        <div className="flex flex-col gap-1 w-full">

            {showTopLabel && (

                <label
                    className="ml-2 text-xs font-medium text-text-secondary"
                >

                    {label}

                </label>

            )}
            <Popover
                open={open}
                onOpenChange={setOpen}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        disabled={disabled}
                        aria-expanded={open}
                        className={cn(
                            `
        h-10
        w-full
        justify-between

        rounded-md

        px-3

        font-normal

        text-text-base

        transition-all
        duration-200
        outline-none
        shadow-none
        `,

                            open &&
                            `
            border-primary
            ring-3
            ring-primary/15
            `,

                            error &&
                            `
                            border-error
                            ring-error/15
                            `,
                            className
                        )}
                    >
                        <span className="truncate">

                            {option?.label ??
                                placeholder ??
                                label}

                        </span>

                        <ChevronDown
                            className={cn(
                                "h-4 w-4 shrink-0 text-text-secondary transition-transform",
                                open && "rotate-180"
                            )}
                        />

                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    sideOffset={6}
                    className="
        w-[var(--radix-popover-trigger-width)]
        p-0
        rounded-xl
        border
        border-border
        bg-bg-card
        shadow-xl
        overflow-hidden
        min-w-45
    "
                >
                    <Command
                        className="
            bg-bg-card
        "
                    >
                        <CommandInput
                            placeholder={
                                searchPlaceholder ??
                                `Search ${label.toLowerCase()}...`
                            }
                            className="
                h-11
                border-b
                !border-border
            "
                        />

                        <CommandList className="max-h-72">
                            <CommandEmpty>
                                <div className="py-8 text-center">
                                    <p className="text-sm text-text-secondary">
                                        {emptyText}
                                    </p>
                                </div>
                            </CommandEmpty>

                            <CommandGroup>
                                {sortedOptions?.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.label}
                                        keywords={[item.value]}
                                        onSelect={() =>
                                            handleSelect(item.value)
                                        }
                                        className="
                            h-10
                            cursor-pointer

                            px-3

                            text-sm

                            aria-selected:bg-surface
                            aria-selected:text-text-base

                            data-[selected=true]:bg-surface

                            transition-colors
                        "
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 text-primary",

                                                option?.value === item.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />

                                        <span className="truncate flex-1">
                                            {item.label}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
    ;
};

export default Combobox;
