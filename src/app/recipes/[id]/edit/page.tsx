import { PageHeader } from "@/components/ui";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { requireUser } from "@/lib/authorization";
import { getCategories, getRecipeForEdit, updateRecipeAction } from "@/server/recipes";

type EditRecipePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditRecipePage({ params, searchParams }: EditRecipePageProps) {
  const user = await requireUser();
  const { id } = await params;
  const [recipe, categories, query] = await Promise.all([
    getRecipeForEdit({ userId: user.id, recipeId: id }),
    getCategories(),
    searchParams,
  ]);
  const updateAction = updateRecipeAction.bind(null, recipe.id);

  return (
    <div className="space-y-8">
      <PageHeader description="Upravujete vlastní recept. Změny se uloží jen po odeslání formuláře." title="Upravit recept" />
      <RecipeForm
        action={updateAction}
        cancelHref={`/recipes/${recipe.id}`}
        categories={categories}
        defaultValues={recipe}
        errorMessage={query.error ? "Recept se nepodařilo uložit. Zkontrolujte prosím zadané údaje." : null}
        submitLabel="Uložit změny"
      />
    </div>
  );
}
