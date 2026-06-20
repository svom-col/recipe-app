import { Card, LinkButton, PageHeader } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        action={<LinkButton href="/dashboard">Otevřít přehled</LinkButton>}
        description="Jednoduchá self-hosted aplikace pro ukládání vlastních receptů a read-only sdílení mezi účty."
        title="Receptář pro vlastní kuchyni"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="font-semibold text-stone-950">Soukromé recepty</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Každý recept má vlastníka a přístup se bude kontrolovat na serveru.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold text-stone-950">Globální kategorie</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Základní české kategorie se zakládají idempotentním seedem.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold text-stone-950">Připraveno pro Coolify</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Dockerfile používá produkční standalone build a port 3000.
          </p>
        </Card>
      </div>
    </div>
  );
}
