import Link from "next/link";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/authorization";
import { getRecipesSharedWithMe } from "@/server/shares";

function formatRecipeMeta(share: Awaited<ReturnType<typeof getRecipesSharedWithMe>>[number]) {
  const recipe = share.recipe;
  const parts = [
    recipe.category?.name ?? "Bez kategorie",
    recipe.prepTimeMinutes ? `Příprava ${recipe.prepTimeMinutes} min` : null,
    recipe.cookTimeMinutes ? `Vaření ${recipe.cookTimeMinutes} min` : null,
    recipe.servings ? `${recipe.servings} porcí` : null,
  ].filter(Boolean);

  return parts.join(" · ");
}

function formatOwner(share: Awaited<ReturnType<typeof getRecipesSharedWithMe>>[number]) {
  return share.recipe.owner.name || share.recipe.owner.email;
}

export default async function SharedPage() {
  const user = await requireUser();
  const shares = await getRecipesSharedWithMe(user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        description="Recepty, které s vámi sdílí jiní uživatelé. Tyto recepty jsou pouze pro čtení."
        title="Sdílené se mnou"
      />

      {shares.length === 0 ? (
        <EmptyState
          description="Jakmile vám někdo nasdílí recept, objeví se tady."
          title="Nemáte žádné sdílené recepty"
        />
      ) : (
        <div className="grid gap-4">
          {shares.map((share) => (
            <Link href={`/recipes/${share.recipe.id}`} key={share.id}>
              <Card className="transition hover:border-brand-100 hover:shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-950">{share.recipe.title}</h2>
                    <p className="mt-2 text-sm text-stone-600">{formatRecipeMeta(share)}</p>
                    <p className="mt-2 text-sm text-stone-600">Vlastník: {formatOwner(share)}</p>
                  </div>
                  <Badge>Read-only</Badge>
                </div>
                {share.recipe.description ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{share.recipe.description}</p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
