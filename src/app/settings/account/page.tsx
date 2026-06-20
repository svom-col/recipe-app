import { Card, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/authorization";

export default async function AccountSettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-8">
      <PageHeader description="Základní informace o přihlášeném účtu." title="Nastavení účtu" />
      <Card>
        <h2 className="font-semibold text-stone-950">Účet</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="font-medium text-stone-700">Jméno</dt>
            <dd className="mt-1 text-stone-950">{user.name || "Není vyplněno"}</dd>
          </div>
          <div>
            <dt className="font-medium text-stone-700">E-mail</dt>
            <dd className="mt-1 text-stone-950">{user.email}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-stone-600">Úprava účtu zatím není součástí MVP.</p>
      </Card>
    </div>
  );
}
