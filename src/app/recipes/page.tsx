import Link from "next/link";
import { EmptyState, LinkButton, PageHeader, Badge, Card, Button, Input } from "@/components/ui";
import { requireUser } from "@/lib/authorization";
import { getMyRecipes } from "@/server/recipes";

type RecipesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatRecipeMeta(recipe: Awaited<ReturnType<typeof getMyRecipes>>[number]) {
  const parts = [
    recipe.category?.name ?? "Bez kategorie",
    recipe.prepTimeMinutes ? `Příprava ${recipe.prepTimeMinutes} min` : null,
    recipe.cookTimeMinutes ? `Vaření ${recipe.cookTimeMinutes} min` : null,
    recipe.servings ? `${recipe.servings} porcí` : null,
  ].filter(Boolean);

  return parts.join(" · ");
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const recipes = await getMyRecipes({ userId: user.id, query });

  return (
    <div className="space-y-8">
      <PageHeader
        action={<LinkButton href="/recipes/new">Přidat recept</LinkButton>}
        description="Recepty, které patří vašemu účtu."
        title="Moje recepty"
      />

      <Card>
        <form action="/recipes" className="flex flex-col gap-3 sm:flex-row">
          <Input
            className="sm:min-w-80"
            defaultValue={query}
            label="Hledat podle názvu"
            name="q"
            placeholder="Název receptu"
            type="search"
          />
          <div className="flex items-end gap-2">
            <Button type="submit">Hledat</Button>
            {query ? (
              <LinkButton href="/recipes" variant="secondary">
                Vymazat
              </LinkButton>
            ) : null}
          </div>
        </form>
      </Card>

      {recipes.length === 0 ? (
        <EmptyState
          actionHref="/recipes/new"
          actionLabel="Vytvořit recept"
          description={
            query
              ? "Pro hledaný výraz jsme nenašli žádný váš recept."
              : "Začněte uložením prvního vlastního receptu."
          }
          title={query ? "Nic nenalezeno" : "Zatím tu nejsou žádné recepty"}
        />
      ) : (
        <div className="grid gap-4">
          {recipes.map((recipe) => (
            <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
              <Card className="transition hover:border-brand-100 hover:shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-950">{recipe.title}</h2>
                    <p className="mt-2 text-sm text-stone-600">{formatRecipeMeta(recipe)}</p>
                  </div>
                  <Badge>{recipe.visibility === "SHARED" ? "Sdílený" : "Soukromý"}</Badge>
                </div>
                {recipe.description ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{recipe.description}</p>
                ) : null}
                <p className="mt-4 text-xs text-stone-500">
                  Vytvořeno {formatDate(recipe.createdAt)} · Upraveno {formatDate(recipe.updatedAt)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
