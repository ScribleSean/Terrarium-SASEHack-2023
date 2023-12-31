import type { NextApiRequest, NextApiResponse } from "next";
import { opportunity } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

type ResponseData = undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const opportunityId = req.query.id as string | undefined;

  if (!opportunityId) return res.status(404);

  const session = await auth(req, res);

  // Ensure that the opportunity exists
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId as string },
  });

  if (!opportunity) return res.status(404);
  if (opportunity.organizationId != session?.user.id) return res.status(403);

  // Update the user's registeredOpportunityIds
  await prisma.opportunitiesOnUsers.deleteMany({ where: { opportunityId } });
  await prisma.opportunity.delete({ where: { id: opportunityId } });

  res.status(204).end();
}
