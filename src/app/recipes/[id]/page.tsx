import { Badge, Card, LinkButton, PageHeader } from "@/components/ui";
import { DeleteRecipeButton } from "@/components/recipes/DeleteRecipeButton";
import { requireUser } from "@/lib/authorization";
import { deleteRecipeAction, getRecipeForView } from "@/server/recipes";

type RecipeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMinutes(minutes: number | null) {
  return minutes ? `${minutes} min` : "Neuvedeno";
}

function formatServings(servings: number | null) {
  return servings ? `${servings} porcí` : "Neuvedeno";
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-normal text-stone-500">{label}</h2>
      <div className="mt-2 whitespace-pre-wrap rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-800">
        {value}
      </div>
    </section>
  );
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const recipe = await getRecipeForView({ userId: user.id, recipeId: id });
  const isOwner = recipe.ownerId === user.id;

  const deleteAction = deleteRecipeAction.bind(null, recipe.id);

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          isOwner ? (
            <div className="flex flex-wrap gap-3">
              <LinkButton href={`/recipes/${recipe.id}/edit`} variant="secondary">
                Upravit
              </LinkButton>
              <LinkButton href={`/recipes/${recipe.id}/share`} variant="secondary">
                Sdílet
              </LinkButton>
              <DeleteRecipeButton action={deleteAction} />
            </div>
          ) : null
        }
        description={recipe.description ?? "Bez popisu"}
        title={recipe.title}
      />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">Kategorie</p>
            <p className="mt-1 text-sm text-stone-950">{recipe.category?.name ?? "Bez kategorie"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">Příprava</p>
            <p className="mt-1 text-sm text-stone-950">{formatMinutes(recipe.prepTimeMinutes)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">Vaření</p>
            <p className="mt-1 text-sm text-stone-950">{formatMinutes(recipe.cookTimeMinutes)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">Porce</p>
            <p className="mt-1 text-sm text-stone-950">{formatServings(recipe.servings)}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge>{isOwner ? "Vlastní recept" : "Sdílený se mnou"}</Badge>
          <Badge>{recipe.visibility === "SHARED" ? "Sdílený" : "Soukromý"}</Badge>
          <Badge>Vytvořeno {formatDateTime(recipe.createdAt)}</Badge>
          <Badge>Upraveno {formatDateTime(recipe.updatedAt)}</Badge>
        </div>
        <p className="mt-5 text-sm text-stone-700">
          Vlastník: {recipe.owner.name || recipe.owner.email}
        </p>
        {recipe.sourceUrl ? (
          <p className="mt-5 text-sm text-stone-700">
            Zdroj:{" "}
            <a className="font-medium text-brand-700 underline" href={recipe.sourceUrl} rel="noreferrer" target="_blank">
              {recipe.sourceUrl}
            </a>
          </p>
        ) : null}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <TextBlock label="Ingredience" value={recipe.ingredients} />
        <TextBlock label="Postup" value={recipe.instructions} />
      </div>
    </div>
  );
}
