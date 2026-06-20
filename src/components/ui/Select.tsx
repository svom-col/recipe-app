import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function Select({ label, error, id, className, children, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="block space-y-2 text-sm font-medium text-stone-800" htmlFor={selectId}>
      <span>{label}</span>
      <select
        className={[
          "block min-h-11 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 shadow-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        id={selectId}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-sm font-normal text-red-700">{error}</span> : null}
    </label>
  );
}
