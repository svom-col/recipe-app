import Link from "next/link";
import { logoutAction } from "@/app/auth-actions";
import { auth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Přehled" },
  { href: "/recipes", label: "Moje recepty" },
  { href: "/shared", label: "Sdílené se mnou" },
  { href: "/settings/account", label: "Účet" },
];

export async function Navigation() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);
  const canRegister = process.env.ALLOW_REGISTRATION === "true";
  const displayName = session?.user?.name || session?.user?.email;

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link className="text-lg font-bold text-stone-950" href="/">
          Receptář
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-stone-700">
          {isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <Link className="rounded-md px-3 py-2 hover:bg-stone-100" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
              {displayName ? (
                <span className="rounded-md bg-stone-100 px-3 py-2 text-stone-600">{displayName}</span>
              ) : null}
              <form action={logoutAction}>
                <button className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100" type="submit">
                  Odhlásit se
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="rounded-md px-3 py-2 hover:bg-stone-100" href="/login">
                Přihlášení
              </Link>
              {canRegister ? (
                <Link className="rounded-md px-3 py-2 hover:bg-stone-100" href="/register">
                  Registrace
                </Link>
              ) : null}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
