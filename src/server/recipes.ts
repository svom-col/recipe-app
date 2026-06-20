"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { canEditRecipe, canViewRecipe, requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { recipeInputSchema, type RecipeInput } from "@/lib/validations/recipe";

type GetMyRecipesInput = {
  userId: string;
  query?: string;
};

type RecipeMutationInput = RecipeInput & {
  ownerId: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readRecipeFormData(formData: FormData) {
  return {
    title: getStringValue(formData, "title"),
    description: getStringValue(formData, "description"),
    categoryId: getStringValue(formData, "categoryId"),
    ingredients: getStringValue(formData, "ingredients"),
    instructions: getStringValue(formData, "instructions"),
    prepTimeMinutes: getStringValue(formData, "prepTimeMinutes"),
    cookTimeMinutes: getStringValue(formData, "cookTimeMinutes"),
    servings: getStringValue(formData, "servings"),
    sourceUrl: getStringValue(formData, "sourceUrl"),
  };
}

async function parseRecipeForm(formData: FormData) {
  const parsedInput = recipeInputSchema.safeParse(readRecipeFormData(formData));

  if (!parsedInput.success) {
    return {
      ok: false as const,
      message: "Zkontrolujte prosím povinná pole a formát zadaných údajů.",
    };
  }

  return {
    ok: true as const,
    data: parsedInput.data,
  };
}

async function categoryExists(categoryId: string | null) {
  if (!categoryId) {
    return true;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  return Boolean(category);
}

function toRecipeMutationData(input: RecipeMutationInput) {
  return {
    ownerId: input.ownerId,
    title: input.title,
    description: input.description,
    categoryId: input.categoryId,
    ingredients: input.ingredients,
    instructions: input.instructions,
    prepTimeMinutes: input.prepTimeMinutes,
    cookTimeMinutes: input.cookTimeMinutes,
    servings: input.servings,
    sourceUrl: input.sourceUrl,
  };
}

function toRecipeUpdateData(input: RecipeInput) {
  return {
    title: input.title,
    description: input.description,
    categoryId: input.categoryId,
    ingredients: input.ingredients,
    instructions: input.instructions,
    prepTimeMinutes: input.prepTimeMinutes,
    cookTimeMinutes: input.cookTimeMinutes,
    servings: input.servings,
    sourceUrl: input.sourceUrl,
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getMyRecipes({ userId, query }: GetMyRecipesInput) {
  const normalizedQuery = query?.trim();

  return prisma.recipe.findMany({
    where: {
      ownerId: userId,
      ...(normalizedQuery
        ? {
            title: {
              contains: normalizedQuery,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getRecipeForView({ userId, recipeId }: { userId: string; recipeId: string }) {
  const canView = await canViewRecipe(userId, recipeId);

  if (!canView) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  return recipe;
}

export async function getRecipeForEdit({ userId, recipeId }: { userId: string; recipeId: string }) {
  const canEdit = await canEditRecipe(userId, recipeId);

  if (!canEdit) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  return recipe;
}

export async function createRecipeAction(formData: FormData) {
  const user = await requireUser();
  const parsedInput = await parseRecipeForm(formData);

  if (!parsedInput.ok) {
    redirect("/recipes/new?error=invalid");
  }

  if (!(await categoryExists(parsedInput.data.categoryId))) {
    redirect("/recipes/new?error=invalid");
  }

  const recipe = await prisma.recipe.create({
    data: toRecipeMutationData({
      ...parsedInput.data,
      ownerId: user.id,
    }),
    select: { id: true },
  });

  revalidatePath("/recipes");
  redirect(`/recipes/${recipe.id}`);
}

export async function updateRecipeAction(recipeId: string, formData: FormData) {
  const user = await requireUser();
  const canEdit = await canEditRecipe(user.id, recipeId);

  if (!canEdit) {
    notFound();
  }

  const parsedInput = await parseRecipeForm(formData);

  if (!parsedInput.ok) {
    redirect(`/recipes/${recipeId}/edit?error=invalid`);
  }

  if (!(await categoryExists(parsedInput.data.categoryId))) {
    redirect(`/recipes/${recipeId}/edit?error=invalid`);
  }

  await prisma.recipe.update({
    where: { id: recipeId },
    data: toRecipeUpdateData(parsedInput.data),
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);
  redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipeAction(recipeId: string) {
  const user = await requireUser();
  const canEdit = await canEditRecipe(user.id, recipeId);

  if (!canEdit) {
    notFound();
  }

  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  revalidatePath("/recipes");
  redirect("/recipes");
}
