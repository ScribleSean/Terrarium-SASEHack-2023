import type { NextApiRequest, NextApiResponse } from "next";
import { opportunity } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

type ResponseData = opportunity;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const opportunityId = req.query.id as string | undefined;

  if (!opportunityId) return res.status(404);

  const session = await auth(req, res);
  const userId = session!.user.id;

  // Ensure that the opportunity exists
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId as string },
  });

  if (!opportunity) return res.status(404);

  // Update the user's opportunitiesOnUsers
  const compositeId = opportunityId + userId;

  await prisma.opportunitiesOnUsers.upsert({
    where: { id: compositeId },
    update: {
      isRegistered: true,
    },
    create: {
      id: compositeId,
      opportunityId,
      userId,
      isRegistered: true,
    },
  });

  res.status(204).end();
}
