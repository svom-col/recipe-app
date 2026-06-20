"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

type DeleteRecipeButtonProps = {
  action: () => Promise<void>;
};

export function DeleteRecipeButton({ action }: DeleteRecipeButtonProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isConfirmed) {
    return (
      <Button onClick={() => setIsConfirmed(true)} type="button" variant="secondary">
        Smazat
      </Button>
    );
  }

  return (
    <form action={action} className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">Opravdu chcete tento recept smazat? Tuto akci nejde vrátit zpět.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button type="submit" variant="primary">
          Ano, smazat recept
        </Button>
        <Button onClick={() => setIsConfirmed(false)} type="button" variant="ghost">
          Zrušit
        </Button>
      </div>
    </form>
  );
}
