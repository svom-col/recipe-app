import { Badge, Card, LinkButton, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/authorization";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-8">
      <PageHeader
        action={<LinkButton href="/recipes/new">Nový recept</LinkButton>}
        description={`Vítejte zpět${user.name ? `, ${user.name}` : ""}. Tady bude hlavní přehled vašich receptů.`}
        title="Přehled"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold text-stone-950">Moje recepty</h2>
            <Badge>Soukromé</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Seznam vlastních receptů bude dostupný na stránce Moje recepty.
          </p>
        </Card>
        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold text-stone-950">Sdílené se mnou</h2>
            <Badge>Read-only</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Tady budou recepty, které s vámi sdílí jiný uživatel.
          </p>
        </Card>
      </div>
    </div>
  );
}
