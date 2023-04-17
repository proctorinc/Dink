import { CountryCode } from "plaid";
import plaidClient from "~/server/api/plaid";
import { prisma } from "~/server/db";

type CreateItemProps = {
  userId: string;
  itemId: string;
  institutionId: string;
  accessToken: string;
};

export async function createPlaidItem(data: CreateItemProps) {
  const { userId, itemId, institutionId, accessToken } = data;

  const institution = await plaidClient
    .institutionsGetById({
      institution_id: institutionId,
      country_codes: [CountryCode.Us],
      options: {
        include_optional_metadata: true,
      },
    })
    .then((response) => response.data.institution);

  return await prisma.institution.create({
    data: {
      name: institution.name,
      logo: Buffer.from(String(institution.logo), "utf-8"),
      url: institution.url,
      primaryColor: institution.primary_color,
      syncItem: {
        create: {
          plaidId: itemId,
          accessToken,
          status: "good",
        },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
}

export async function updateItemTransactionsCursor(
  plaidItemId: string,
  cursor: string
) {
  return await prisma.institutionSyncItem.update({
    where: {
      plaidId: plaidItemId,
    },
    data: {
      cursor: cursor,
    },
  });
}

export async function retrievePlaidItemById(itemId: string) {
  return await prisma.institutionSyncItem.findUniqueOrThrow({
    where: {
      plaidId: itemId,
    },
  });
}

export async function retrievePlaidItemByInstitutionId(institutionId: string) {
  return await prisma.institutionSyncItem.findFirst({
    where: {
      plaidId: institutionId,
    },
  });
}
