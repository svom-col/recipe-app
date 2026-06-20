"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { loginSchema, registrationSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAction(formData: FormData) {
  const parsedInput = loginSchema.safeParse({
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
  });

  if (!parsedInput.success) {
    redirect("/login?error=invalid");
  }

  try {
    await signIn("credentials", {
      email: parsedInput.data.email,
      password: parsedInput.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=invalid");
    }

    throw error;
  }
}

export async function registerAction(formData: FormData) {
  if (process.env.ALLOW_REGISTRATION !== "true") {
    redirect("/register?error=disabled");
  }

  const parsedInput = registrationSchema.safeParse({
    name: getStringValue(formData, "name"),
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
    passwordConfirmation: getStringValue(formData, "passwordConfirmation"),
    inviteCode: getStringValue(formData, "inviteCode"),
  });

  if (!parsedInput.success) {
    redirect("/register?error=invalid");
  }

  if (!process.env.REGISTRATION_INVITE_CODE || parsedInput.data.inviteCode !== process.env.REGISTRATION_INVITE_CODE) {
    redirect("/register?error=invalid");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsedInput.data.email },
    select: { id: true },
  });

  if (existingUser) {
    redirect("/register?error=invalid");
  }

  const passwordHash = await bcrypt.hash(parsedInput.data.password, 12);

  try {
    await prisma.user.create({
      data: {
        name: parsedInput.data.name,
        email: parsedInput.data.email,
        passwordHash,
      },
    });
  } catch {
    redirect("/register?error=failed");
  }

  redirect("/login?registered=1");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
