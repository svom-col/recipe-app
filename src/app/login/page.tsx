import { redirect } from "next/navigation";
import { loginAction } from "@/app/auth-actions";
import { auth } from "@/lib/auth";
import { Button, Card, Input, LinkButton, PageHeader } from "@/components/ui";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const hasError = params.error === "invalid";
  const wasRegistered = params.registered === "1";
  const registrationEnabled = process.env.ALLOW_REGISTRATION === "true";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader description="Přihlaste se e-mailem a heslem." title="Přihlášení" />
      <Card>
        {wasRegistered ? (
          <p className="mb-4 rounded-md border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">
            Registrace proběhla úspěšně. Teď se můžete přihlásit.
          </p>
        ) : null}
        {hasError ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Přihlášení se nepodařilo. Zkontrolujte e-mail a heslo.
          </p>
        ) : null}
        <form action={loginAction} className="space-y-4">
          <Input autoComplete="email" label="E-mail" name="email" placeholder="jmeno@example.com" required type="email" />
          <Input autoComplete="current-password" label="Heslo" name="password" required type="password" />
          <Button className="w-full" type="submit">
            Přihlásit se
          </Button>
        </form>
        {registrationEnabled ? (
          <p className="mt-4 text-sm text-stone-600">
            Nemáte účet?{" "}
            <LinkButton className="min-h-0 px-0 py-0" href="/register" variant="ghost">
              Přejít na registraci
            </LinkButton>
          </p>
        ) : (
          <p className="mt-4 text-sm text-stone-600">Registrace nových účtů je momentálně vypnutá.</p>
        )}
      </Card>
    </div>
  );
}
