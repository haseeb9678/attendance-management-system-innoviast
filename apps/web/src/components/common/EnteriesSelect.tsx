import { type SelectOption } from "./Combobox";
import SelectBox from "./SelectBox";

interface EntriesSelectProps {
    value: SelectOption;
    onChange: React.Dispatch<React.SetStateAction<SelectOption>>;
    className?: string;
    options?: SelectOption[];
}


const EntriesSelect = ({
    value,
    onChange,
    className = "",
    options: entryOptions = []
}: EntriesSelectProps) => {
    return (
        <div
            className={`flex items-center gap-2 text-sm text-text-secondary ${className}`}
        >
            <span className="whitespace-nowrap">
                Show
            </span>

            <div className="w-24">
                <SelectBox
                    label="Entries"
                    option={value}
                    setOption={onChange}
                    options={entryOptions}
                />
            </div>

            <span className="whitespace-nowrap">
                entries
            </span>
        </div>
    );
};

export default EntriesSelect;