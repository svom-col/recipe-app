import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="block space-y-2 text-sm font-medium text-stone-800" htmlFor={textareaId}>
      <span>{label}</span>
      <textarea
        className={[
          "block min-h-32 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        id={textareaId}
        {...props}
      />
      {error ? <span className="text-sm font-normal text-red-700">{error}</span> : null}
    </label>
  );
}
