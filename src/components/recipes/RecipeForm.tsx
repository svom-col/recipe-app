import { Button, Card, FormError, Input, LinkButton, Select, Textarea } from "@/components/ui";

type RecipeFormCategory = {
  id: string;
  name: string;
};

type RecipeFormValues = {
  title?: string;
  description?: string | null;
  categoryId?: string | null;
  ingredients?: string;
  instructions?: string;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  servings?: number | null;
  sourceUrl?: string | null;
};

type RecipeFormProps = {
  action: (formData: FormData) => Promise<void>;
  categories: RecipeFormCategory[];
  submitLabel: string;
  cancelHref: string;
  errorMessage?: string | null;
  defaultValues?: RecipeFormValues;
};

export function RecipeForm({
  action,
  categories,
  submitLabel,
  cancelHref,
  errorMessage,
  defaultValues,
}: RecipeFormProps) {
  return (
    <Card>
      <form action={action} className="grid gap-4">
        <FormError message={errorMessage} />
        <Input
          defaultValue={defaultValues?.title ?? ""}
          label="Název receptu"
          name="title"
          placeholder="Třeba domácí chléb"
          required
          type="text"
        />
        <Textarea
          defaultValue={defaultValues?.description ?? ""}
          label="Popis"
          name="description"
          placeholder="Krátké shrnutí receptu"
        />
        <Select defaultValue={defaultValues?.categoryId ?? ""} label="Kategorie" name="categoryId">
          <option value="">Bez kategorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            defaultValue={defaultValues?.prepTimeMinutes ?? ""}
            label="Příprava v minutách"
            min={1}
            name="prepTimeMinutes"
            type="number"
          />
          <Input
            defaultValue={defaultValues?.cookTimeMinutes ?? ""}
            label="Vaření v minutách"
            min={1}
            name="cookTimeMinutes"
            type="number"
          />
          <Input defaultValue={defaultValues?.servings ?? ""} label="Počet porcí" min={1} name="servings" type="number" />
        </div>
        <Input
          defaultValue={defaultValues?.sourceUrl ?? ""}
          label="Zdrojová URL"
          name="sourceUrl"
          placeholder="https://..."
          type="url"
        />
        <Textarea
          defaultValue={defaultValues?.ingredients ?? ""}
          label="Ingredience"
          name="ingredients"
          placeholder="Každou ingredienci napište na nový řádek"
          required
        />
        <Textarea
          defaultValue={defaultValues?.instructions ?? ""}
          label="Postup"
          name="instructions"
          placeholder="Jednotlivé kroky přípravy"
          required
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <LinkButton href={cancelHref} variant="secondary">
            Zrušit
          </LinkButton>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Card>
  );
}
