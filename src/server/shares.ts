"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { canShareRecipe, requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { shareRecipeSchema } from "@/lib/validations/share";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectToSharePage(recipeId: string, params: string): never {
  redirect(`/recipes/${recipeId}/share?${params}`);
}

async function requireSharePermission(userId: string, recipeId: string) {
  const canShare = await canShareRecipe(userId, recipeId);

  if (!canShare) {
    notFound();
  }
}

export async function getRecipeSharesForOwner(recipeId: string) {
  const user = await requireUser();
  await requireSharePermission(user.id, recipeId);

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: {
      id: true,
      title: true,
      shares: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  return recipe;
}

export async function shareRecipeAction(recipeId: string, formData: FormData) {
  const user = await requireUser();
  await requireSharePermission(user.id, recipeId);

  const parsedInput = shareRecipeSchema.safeParse({
    email: getStringValue(formData, "email"),
  });

  if (!parsedInput.success) {
    redirectToSharePage(recipeId, "error=invalid");
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: parsedInput.data.email },
    select: {
      id: true,
      email: true,
    },
  });

  if (!targetUser) {
    redirectToSharePage(recipeId, "error=not-found");
  }

  if (targetUser.id === user.id) {
    redirectToSharePage(recipeId, "error=self");
  }

  const existingShare = await prisma.recipeShare.findUnique({
    where: {
      recipeId_userId: {
        recipeId,
        userId: targetUser.id,
      },
    },
    select: { id: true },
  });

  if (existingShare) {
    redirectToSharePage(recipeId, "error=duplicate");
  }

  try {
    await prisma.$transaction([
      prisma.recipeShare.create({
        data: {
          recipeId,
          userId: targetUser.id,
        },
      }),
      prisma.recipe.update({
        where: { id: recipeId },
        data: { visibility: "SHARED" },
      }),
    ]);
  } catch {
    redirectToSharePage(recipeId, "error=failed");
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath(`/recipes/${recipeId}/share`);
  revalidatePath("/shared");
  redirectToSharePage(recipeId, "shared=1");
}

export async function removeRecipeShareAction(recipeId: string, shareId: string) {
  const user = await requireUser();
  await requireSharePermission(user.id, recipeId);

  const share = await prisma.recipeShare.findFirst({
    where: {
      id: shareId,
      recipeId,
    },
    select: { id: true },
  });

  if (!share) {
    notFound();
  }

  await prisma.$transaction(async (tx) => {
    await tx.recipeShare.delete({
      where: { id: shareId },
    });

    const remainingShares = await tx.recipeShare.count({
      where: { recipeId },
    });

    if (remainingShares === 0) {
      await tx.recipe.update({
        where: { id: recipeId },
        data: { visibility: "PRIVATE" },
      });
    }
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath(`/recipes/${recipeId}/share`);
  revalidatePath("/shared");
  redirectToSharePage(recipeId, "removed=1");
}

export async function getRecipesSharedWithMe(userId: string) {
  return prisma.recipeShare.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      recipe: {
        include: {
          category: {
            select: {
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
      },
    },
  });
}
