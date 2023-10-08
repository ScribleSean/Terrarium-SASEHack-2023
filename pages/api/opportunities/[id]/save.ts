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

  // Ensure that the opportunity exists
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId as string },
  });

  if (!opportunity) return res.status(404);

  // Update the user's registeredOpportunityIds
  await prisma.users.update({
    where: { email: session!.user.email },
    data: { savedOpportunityIds: { push: opportunityId } },
  });

  res.status(204).json(opportunity);
}
