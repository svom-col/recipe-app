import type { ReactNode } from "react";
import { LinkButton } from "./Button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
};

export function EmptyState({ title, description, actionHref, actionLabel, children }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white px-5 py-10 text-center">
      <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">{description}</p>
      {actionHref && actionLabel ? (
        <div className="mt-5">
          <LinkButton href={actionHref}>{actionLabel}</LinkButton>
        </div>
      ) : null}
      {children}
    </div>
  );
}
