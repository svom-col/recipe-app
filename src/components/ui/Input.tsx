import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2 text-sm font-medium text-stone-800" htmlFor={inputId}>
      <span>{label}</span>
      <input
        className={[
          "block min-h-11 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        id={inputId}
        {...props}
      />
      {error ? <span className="text-sm font-normal text-red-700">{error}</span> : null}
    </label>
  );
}
