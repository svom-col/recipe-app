import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Snídaně", slug: "snidane" },
  { name: "Polévky", slug: "polevky" },
  { name: "Hlavní jídla", slug: "hlavni-jidla" },
  { name: "Dezerty", slug: "dezerty" },
  { name: "Pečivo", slug: "pecivo" },
  { name: "Nápoje", slug: "napoje" },
  { name: "Omáčky", slug: "omacky" },
  { name: "Saláty", slug: "salaty" },
  { name: "Přílohy", slug: "prilohy" },
  { name: "Ostatní", slug: "ostatni" },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
