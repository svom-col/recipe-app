import { redirect } from "next/navigation";
import { registerAction } from "@/app/auth-actions";
import { auth } from "@/lib/auth";
import { Button, Card, Input, PageHeader } from "@/components/ui";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  disabled: "Registrace je momentálně vypnutá.",
  failed: "Registraci se nepodařilo dokončit. Zkuste to prosím znovu.",
  invalid: "Registraci se nepodařilo dokončit. Zkontrolujte zadané údaje.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const registrationEnabled = process.env.ALLOW_REGISTRATION === "true";
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        description="Registrace je chráněná registračním kódem a není veřejně otevřená."
        title="Registrace"
      />
      <Card>
        {!registrationEnabled ? (
          <p className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
            Registrace je momentálně vypnutá. Nový účet teď nelze vytvořit.
          </p>
        ) : (
          <>
            {errorMessage ? (
              <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}
            <form action={registerAction} className="space-y-4">
              <Input autoComplete="name" label="Jméno" name="name" placeholder="Vaše jméno" required type="text" />
              <Input autoComplete="email" label="E-mail" name="email" placeholder="jmeno@example.com" required type="email" />
              <Input autoComplete="new-password" label="Heslo" name="password" required type="password" />
              <Input
                autoComplete="new-password"
                label="Potvrzení hesla"
                name="passwordConfirmation"
                required
                type="password"
              />
              <Input label="Registrační kód" name="inviteCode" required type="password" />
              <Button className="w-full" type="submit">
                Vytvořit účet
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
