import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBox = ({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}: SearchBoxProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div
            className={`flex h-10 w-full items-center gap-2 rounded-md border
                 border-gray-200 px-3 text-text-secondary transition-all duration-300
      focus-within:border-primary-hover
      focus-within:ring-3
      focus-within:ring-primary-hover/15
      ${className}`}
        >
            <Search
                size={20}
                className="shrink-0 text-text-secondary/70"
            />

            <input
                type="search"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary/60"
            />
        </div>
    );
};

export default SearchBox;