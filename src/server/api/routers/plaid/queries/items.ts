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

  return await prisma.plaidItem.create({
    data: {
      id: itemId,
      accessToken,
      status: "good",
      user: {
        connect: { id: userId },
      },
      institution: {
        create: {
          name: institution.name,
          logo: Buffer.from(String(institution.logo), "utf-8"),
          url: institution.url,
          primary_color: institution.primary_color,
        },
      },
    },
  });
}

export async function updateItemTransactionsCursor(
  plaidItemId: string,
  cursor: string
) {
  return await prisma.plaidItem.update({
    where: {
      id: plaidItemId,
    },
    data: {
      cursor: cursor,
    },
  });
}

export async function retrievePlaidItemById(id: string) {
  return await prisma.plaidItem.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
}

export async function retrievePlaidItemByInstitutionId(institutionId: string) {
  return await prisma.plaidItem.findFirst({
    where: {
      institution: {
        id: institutionId,
      },
    },
  });
}
