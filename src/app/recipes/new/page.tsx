import { PageHeader } from "@/components/ui";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { requireUser } from "@/lib/authorization";
import { createRecipeAction, getCategories } from "@/server/recipes";

type NewRecipePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewRecipePage({ searchParams }: NewRecipePageProps) {
  await requireUser();
  const categories = await getCategories();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <PageHeader description="Uložte nový recept do svého soukromého receptáře." title="Nový recept" />
      <RecipeForm
        action={createRecipeAction}
        cancelHref="/recipes"
        categories={categories}
        errorMessage={params.error ? "Recept se nepodařilo uložit. Zkontrolujte prosím zadané údaje." : null}
        submitLabel="Uložit recept"
      />
    </div>
  );
}
