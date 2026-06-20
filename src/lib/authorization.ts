import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function canViewRecipe(userId: string, recipeId: string) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      OR: [
        { ownerId: userId },
        {
          shares: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    select: { id: true },
  });

  return Boolean(recipe);
}

export async function canEditRecipe(userId: string, recipeId: string) {
  return isRecipeOwner(userId, recipeId);
}

export async function canShareRecipe(userId: string, recipeId: string) {
  return isRecipeOwner(userId, recipeId);
}

async function isRecipeOwner(userId: string, recipeId: string) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      ownerId: userId,
    },
    select: { id: true },
  });

  return Boolean(recipe);
}
