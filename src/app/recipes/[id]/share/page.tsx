import { Button, Card, EmptyState, FormError, Input, LinkButton, PageHeader } from "@/components/ui";
import { getRecipeSharesForOwner, removeRecipeShareAction, shareRecipeAction } from "@/server/shares";

type ShareRecipePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    removed?: string;
    shared?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  duplicate: "Recept už je s tímto uživatelem sdílený.",
  failed: "Sdílení se nepodařilo uložit. Zkuste to prosím znovu.",
  invalid: "Zadejte platný e-mail existujícího uživatele.",
  "not-found": "Uživatele s tímto e-mailem se nepodařilo najít.",
  self: "Recept nemůžete sdílet sami se sebou.",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ShareRecipePage({ params, searchParams }: ShareRecipePageProps) {
  const { id } = await params;
  const [recipe, query] = await Promise.all([getRecipeSharesForOwner(id), searchParams]);
  const shareAction = shareRecipeAction.bind(null, recipe.id);
  const errorMessage = query.error ? errorMessages[query.error] : null;

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <LinkButton href={`/recipes/${recipe.id}`} variant="secondary">
            Zpět na recept
          </LinkButton>
        }
        description="Sdílení je v MVP pouze pro čtení. Sdílený uživatel nemůže recept upravit, smazat ani sdílet dál."
        title={`Sdílet: ${recipe.title}`}
      />

      <Card>
        <form action={shareAction} className="grid gap-4">
          <FormError message={errorMessage} />
          {query.shared ? (
            <p className="rounded-md border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">
              Recept byl nasdílen.
            </p>
          ) : null}
          {query.removed ? (
            <p className="rounded-md border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">
              Sdílení bylo odebráno.
            </p>
          ) : null}
          <Input
            autoComplete="email"
            label="E-mail existujícího uživatele"
            name="email"
            placeholder="uzivatel@example.com"
            required
            type="email"
          />
          <div>
            <Button type="submit">Sdílet recept</Button>
          </div>
        </form>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-950">Aktuálně sdíleno s</h2>
        {recipe.shares.length === 0 ? (
          <EmptyState
            description="Recept zatím není sdílený s žádným dalším uživatelem."
            title="Žádná sdílení"
          />
        ) : (
          <div className="grid gap-3">
            {recipe.shares.map((share) => {
              const removeAction = removeRecipeShareAction.bind(null, recipe.id, share.id);
              return (
                <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" key={share.id}>
                  <div>
                    <p className="font-semibold text-stone-950">{share.user.name || share.user.email}</p>
                    <p className="text-sm text-stone-600">{share.user.email}</p>
                    <p className="mt-1 text-xs text-stone-500">Sdíleno {formatDate(share.createdAt)}</p>
                  </div>
                  <form action={removeAction}>
                    <Button type="submit" variant="secondary">
                      Odebrat sdílení
                    </Button>
                  </form>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
