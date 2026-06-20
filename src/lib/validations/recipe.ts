import { z } from "zod";

function emptyStringToNull(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
}

const nullableTrimmedString = (maxLength: number) =>
  z.preprocess(emptyStringToNull, z.string().trim().max(maxLength).nullable());

const nullablePositiveInteger = z.preprocess(
  emptyStringToNull,
  z.coerce
    .number()
    .int({ error: "Zadejte celé číslo." })
    .positive({ error: "Zadejte kladné číslo." })
    .nullable(),
);

export const recipeInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Zadejte název receptu." })
    .max(160, { error: "Název je příliš dlouhý." }),
  description: nullableTrimmedString(1_000),
  ingredients: z
    .string()
    .trim()
    .min(1, { error: "Zadejte ingredience." })
    .max(10_000, { error: "Ingredience jsou příliš dlouhé." }),
  instructions: z
    .string()
    .trim()
    .min(1, { error: "Zadejte postup." })
    .max(20_000, { error: "Postup je příliš dlouhý." }),
  categoryId: nullableTrimmedString(128),
  prepTimeMinutes: nullablePositiveInteger,
  cookTimeMinutes: nullablePositiveInteger,
  servings: nullablePositiveInteger,
  sourceUrl: z.preprocess(emptyStringToNull, z.url({ error: "Zadejte platnou URL adresu." }).nullable()),
});

export type RecipeInput = z.infer<typeof recipeInputSchema>;
