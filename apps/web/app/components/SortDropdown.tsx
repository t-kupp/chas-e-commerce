import { useId } from "react";

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  label?: string;
  ariaLabel?: string;
}

export default function SortDropdown({
  value,
  onChange,
  options,
  label = "Sort by:",
  ariaLabel,
}: SortDropdownProps) {
  const id = useId();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        aria-label={ariaLabel || label}
        className="px-4 py-2 border border-foreground/10 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
