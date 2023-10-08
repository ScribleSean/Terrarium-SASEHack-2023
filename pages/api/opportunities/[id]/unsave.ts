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
    where: { id: opportunityId },
  });

  if (!opportunity) return res.status(404);

  // Get the user's registeredOpportunityIds
  const user = await prisma.users.findUnique({
    where: { id: session!.user.id },
  });

  if (!user) return res.status(400);

  // Update the user's registeredOpportunityIds
  const compositeId = opportunityId + userId;

  await prisma.opportunitiesOnUsers.upsert({
    where: { id: compositeId },
    update: {
      isSaved: false,
    },
    create: {
      id: compositeId,
      opportunityId,
      userId,
      isSaved: false,
    },
  });

  res.status(204).end();
}
