# ## Project Overview

This project is a self-hosted Recipes App built as a real pilot application for deployment through Coolify.

The app is a Czech-language multi-user recipe manager with private recipes and read-only recipe sharing between user accounts.

## Core Stack

Use the following stack:

* Next.js with App Router

* TypeScript

* PostgreSQL

* Prisma ORM

* Auth.js / NextAuth

* Credentials authentication with e-mail and password

* Tailwind CSS

* Zod

* Dockerfile-based production deployment

Prefer simple, stable and maintainable patterns over experimental abstractions.

## Documentation Rule

When implementing or modifying code that depends on framework or library behavior, use Context7 MCP documentation before coding.

This especially applies to:

* Next.js App Router

* Auth.js / NextAuth

* Prisma

* Tailwind CSS

* Docker / Next.js standalone deployment

Prefer current official documentation over memory. Do not invent APIs.

## Language Rules

The user interface must be in Czech.

This includes:

* navigation

* page titles

* buttons

* form labels

* validation messages

* empty states

* confirmation messages

* authentication messages

Internal code names, model names, function names, component names and filenames should be in English.

## Architecture Rules

Use Next.js App Router only.

Do not mix App Router and Pages Router.

Prefer:

* server components

* server actions

* server-side authorization helpers

* small reusable components

* explicit data access functions

* clear validation schemas

Use client components only where interactivity requires them.

Do not create a public REST API for recipe CRUD unless explicitly requested.

Required API routes:

* `/api/auth/[...nextauth]`

* `/api/health`

## Authentication Rules

Use e-mail and password authentication.

Do not add OAuth providers in the MVP.

Passwords must never be stored in plaintext.

Use a secure password hashing library such as bcrypt or argon2.

Registration is not publicly open by default.

Registration must be controlled by environment variables:

```
ALLOW_REGISTRATION=false
REGISTRATION_INVITE_CODE=
```

If `ALLOW_REGISTRATION` is not set to `true`, registration must not create new accounts.

If registration is enabled, the user must provide the correct invite code.

Login errors must not unnecessarily reveal whether a specific e-mail address exists.

## Authorization Rules

The app is multi-user.

Each recipe has exactly one owner.

Users can share their own recipes with other existing users.

In the MVP, sharing is read-only.

Access rules:

* The owner can view, edit, delete and share their own recipes.

* A shared user can only view the recipe.

* A user must not edit or delete a recipe they do not own.

* A user must not view another user's recipe unless it is explicitly shared with them.

* Every server-side read, update and delete operation must check ownership or `RecipeShare`.

* UI-level checks are not sufficient.

Do not implement public sharing links in the MVP.

## Data Model Rules

Use Prisma models conceptually aligned with:

* `User`

* `Recipe`

* `Category`

* `RecipeShare`

* Auth.js models as needed: `Account`, `Session`, `VerificationToken`

Recipe fields should include at least:

* `id`

* `ownerId`

* `categoryId`

* `title`

* `description`

* `ingredients`

* `instructions`

* `prepTimeMinutes`

* `cookTimeMinutes`

* `servings`

* `sourceUrl`

* `visibility`

* `createdAt`

* `updatedAt`

Use simple text fields for `ingredients` and `instructions` in the MVP.

Do not implement structured ingredient JSON in the MVP.

`visibility = SHARED` must not grant access by itself. Actual access must be represented by `RecipeShare`.

## Category Rules

Categories are global and shared by all users.

A recipe can have at most one category.

Use seeded categories for the MVP, for example:

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

Do not implement user-specific categories in the MVP.

Do not implement tags in the MVP unless explicitly requested later.

## UI Rules

Use Tailwind CSS for all styling.

Do not add external UI component libraries such as shadcn/ui, Material UI, DaisyUI or Bootstrap.

Create small reusable UI components where useful, for example:

* `Button`

* `Input`

* `Textarea`

* `Select`

* `Card`

* `Badge`

* `EmptyState`

* `PageHeader`

* `FormError`

* `Navigation`

The UI should be:

* clean

* readable

* responsive

* simple

* accessible enough for normal form use

Do not add complex animations.

Do not add dark mode in the MVP unless explicitly requested.

## Validation Rules

Use Zod for server-side validation.

Validate at least:

* login

* registration

* recipe creation

* recipe editing

* recipe sharing

Client-side validation may be added, but server-side validation is mandatory.

## Required Pages

Implement or preserve the following routes:

* `/`

* `/login`

* `/register`

* `/dashboard`

* `/recipes`

* `/recipes/new`

* `/recipes/[id]`

* `/recipes/[id]/edit`

* `/recipes/[id]/share`

* `/shared`

* `/settings/account`

* `/api/health`

`/recipes` should show recipes owned by the current user.

`/shared` should show recipes shared with the current user.

## Healthcheck Rule

Implement `/api/health`.

It must return HTTP 200 and this JSON:

```
{
  "status": "ok",
  "service": "recipes-app"
}
```

The healthcheck should be simple and fast.

It does not need to check database connectivity.

## Environment Variables

The app must use environment variables for secrets and deployment configuration.

Required variables:

```
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
ALLOW_REGISTRATION=false
REGISTRATION_INVITE_CODE=
```

Never commit real secrets.

Never hardcode the production database URL.

Never hardcode passwords, invite codes or Auth secrets.

## Prisma and Database Rules

Use Prisma migrations.

For local development, use:

```
prisma migrate dev
```

For production deployment, use:

```
prisma migrate deploy
```

Do not use `prisma db push` for production.

Do not run migrations during Docker image build.

Production migrations should run at container startup or as a separate deployment step before starting the app.

For the current Coolify single-instance MVP, running `prisma migrate deploy` in the startup command is acceptable.

## Docker and Deployment Rules

The app is deployed through Coolify using Dockerfile build pack.

The app must listen on port `3000`.

Prefer Next.js standalone production output.

The Dockerfile must be suitable for production.

Expected Coolify configuration:

* Build Pack: Dockerfile

* Port: 3000

* Healthcheck path: `/api/health`

* Environment variables configured in Coolify

* PostgreSQL connection through the internal Coolify/Docker network

Do not expose the database publicly.

## Security Rules

Do not commit secrets.

Do not log sensitive values.

Do not expose stack traces or internal errors to users.

Do not allow authorization checks to exist only in the UI.

Do not allow shared users to edit or delete recipes in the MVP.

Do not add image upload in the MVP.

Do not add comments, ratings, admin roles or public recipe links in the MVP.

## Implementation Discipline

Keep changes focused on the requested task.

Avoid unnecessary dependencies.

Avoid speculative features.

Prefer readable code over clever code.

When adding a new dependency, make sure it is necessary and compatible with the stack.

After meaningful changes, run the relevant checks when possible:

```
npm run lint
npm run build
```

If Prisma schema changes, also run the appropriate Prisma command for the environment.

## Expected Project Structure

Prefer a structure similar to:

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

Adjust only when there is a clear reason.

[ChatGPT - Aplikace pro správu receptů](https://chatgpt.com/g/g-p-6a368f626e5c819184a21c9f177a835e-aplikace-pro-spravu-receptu/c/6a3695a9-cae0-83eb-9169-89940940ed3b?tab=sources)