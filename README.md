# # Recipes App

Self-hosted aplikace pro správu receptů nasazovaná přes Coolify.

Aplikace slouží jako první reálný pilot na vlastní infrastruktuře. Ověřuje Next.js, PostgreSQL, Prisma, Auth.js, Tailwind CSS, Dockerfile deployment, healthcheck, environment variables, databázové migrace a multi-user práci s daty.

## Cíl projektu

Cílem je vytvořit jednoduchou, čistou a rozšiřitelnou aplikaci pro správu receptů.

Aplikace má umožnit:

* správu vlastních receptů,

* neveřejnou registraci uživatelů,

* přihlášení e-mailem a heslem,

* globální kategorie receptů,

* sdílení receptů mezi účty,

* read-only zobrazení receptů sdílených jiným uživatelem.

UI aplikace je v češtině.

## Stack

* Next.js App Router

* TypeScript

* PostgreSQL

* Prisma ORM

* Auth.js / NextAuth

* Credentials authentication

* Tailwind CSS

* Zod

* Dockerfile deployment

## MVP funkcionalita

* Přihlášení e-mailem a heslem

* Neveřejná registrace přes registrační kód

* Odhlášení

* Přehled vlastních receptů

* Detail receptu

* Vytvoření receptu

* Úprava vlastního receptu

* Smazání vlastního receptu

* Vyhledávání receptů podle názvu

* Globální kategorie receptů

* Sdílení vlastního receptu s jiným existujícím uživatelem

* Přehled receptů sdílených se mnou

* Read-only detail sdíleného receptu

* Healthcheck endpoint pro Coolify

## Mimo rozsah MVP

V první verzi se neimplementuje:

* OAuth login,

* veřejná registrace bez kódu,

* veřejné sdílecí odkazy,

* editace cizích sdílených receptů,

* obrázky receptů,

* komentáře,

* hodnocení,

* admin panel,

* tagy,

* strukturované ingredience v JSON,

* veřejné REST API pro recepty.

## Základní pravidla přístupu

Každý recept má jednoho vlastníka.

Vlastník může svůj recept:

* zobrazit,

* upravit,

* smazat,

* sdílet s jiným uživatelem.

Uživatel, se kterým je recept sdílen, může recept pouze zobrazit.

Sdílení je v MVP read-only.

Přístup k receptům musí být vždy kontrolován server-side. UI kontrola sama o sobě nestačí.

## Doporučená struktura projektu

```
src/
  app/
    api/
      auth/
        [...nextauth]/
          route.ts
      health/
        route.ts
    dashboard/
      page.tsx
    login/
      page.tsx
    register/
      page.tsx
    recipes/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
        edit/
          page.tsx
        share/
          page.tsx
    shared/
      page.tsx
    settings/
      account/
        page.tsx
    page.tsx
  components/
    auth/
    layout/
    recipes/
    ui/
  lib/
    auth.ts
    prisma.ts
    validations/
    slug.ts
  server/
    recipes.ts
    users.ts
prisma/
  schema.prisma
  migrations/
```

## Environment variables

Aplikace očekává následující proměnné:

```
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
ALLOW_REGISTRATION=false
REGISTRATION_INVITE_CODE=
```

Příklad pro lokální vývoj:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recipes"
AUTH_SECRET="local-development-secret-change-me"
NEXTAUTH_URL="http://localhost:3000"
ALLOW_REGISTRATION="true"
REGISTRATION_INVITE_CODE="local-invite-code"
```

Příklad pro produkci v Coolify:

```
DATABASE_URL="postgresql://voreno:<PASSWORD>@mw8nrhonb5j78hoa1npubw3z:5432/postgres"
AUTH_SECRET="<strong-random-secret>"
NEXTAUTH_URL="https://recipes.voreno.cz"
ALLOW_REGISTRATION="false"
REGISTRATION_INVITE_CODE="<private-code>"
```

Skutečné produkční hodnoty nepatří do repozitáře.

## Lokální vývoj

Po naklonování repozitáře:

```
npm install
```

Vytvořit lokální `.env` podle `.env.example`.

Spustit databázové migrace:

```
npx prisma migrate dev
```

Volitelně spustit seed dat:

```
npx prisma db seed
```

Spustit vývojový server:

```
npm run dev
```

Aplikace poběží na:

```
http://localhost:3000
```

## npm scripts

Projekt obsahuje tyto základní skripty:

```
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint .",
    "prisma:generate": "prisma generate",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:seed": "prisma db seed"
  }
}
```

Next.js 16 už nepoužívá příkaz `next lint`, proto projekt spouští ESLint přímo přes `eslint .`.

## Databázové migrace

Lokální vývoj:

```
npx prisma migrate dev
```

Produkce:

```
npx prisma migrate deploy
```

V produkci nepoužívat:

```
npx prisma db push
```

Migrace se nemají spouštět během Docker image buildu.

Prisma 7 načítá databázovou URL z `prisma.config.ts`. V produkci musí být nastavená proměnná `DATABASE_URL`.

Pro aktuální single-instance MVP v Coolify je přijatelné spustit migrace při startu kontejneru, například:

```
npx prisma migrate deploy && node server.js
```

Alternativně je možné později oddělit migrace do samostatného release/deploy kroku.

## Seed dat

Aplikace by měla seedovat globální kategorie receptů, například:

* Snídaně

* Polévky

* Hlavní jídla

* Dezerty

* Pečivo

* Nápoje

* Omáčky

* Saláty

* Přílohy

* Ostatní

Seed nesmí přepisovat existující uživatelská data.

## Healthcheck

Endpoint:

```
/api/health
```

Očekávaná odpověď:

```
{
  "status": "ok",
  "service": "recipes-app"
}
```

Endpoint má vracet HTTP 200.

Healthcheck má být jednoduchý a rychlý. Nemusí kontrolovat databázi.

## Deploy přes Coolify

Předpokládané nastavení:

* Build Pack: Dockerfile

* Port: 3000

* Healthcheck path: `/api/health`

* Environment variables nastavené v Coolify

* PostgreSQL dostupný přes interní Coolify/Docker síť

Produkční databáze se nepřipojuje veřejně z internetu.

Aplikace má poslouchat na portu `3000`.

## Dokumentace pro agenty

Projektové instrukce pro coding agenty jsou v souboru:

```
AGENTS.md
```

Codex má používat Context7 MCP dokumentaci pro aktuální informace k frameworkům a knihovnám.

Týká se hlavně:

* Next.js App Router

* Auth.js / NextAuth

* Prisma

* Tailwind CSS

* Docker / Next.js standalone deployment

## Bezpečnostní poznámky

* Necommitovat `.env`.

* Necommitovat secrets.

* Nehardcodovat produkční `DATABASE_URL`.

* Nehardcodovat hesla, registrační kódy ani auth secrets.

* Nekontrolovat oprávnění pouze na úrovni UI.

* Nepoužívat `prisma db push` v produkci.

* Nespouštět migrace během Docker image buildu.

[ChatGPT - Aplikace pro správu receptů](https://chatgpt.com/g/g-p-6a368f626e5c819184a21c9f177a835e-aplikace-pro-spravu-receptu/c/6a3695a9-cae0-83eb-9169-89940940ed3b?tab=sources)
