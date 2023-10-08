import type { NextApiRequest, NextApiResponse } from "next";
import { opportunity } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

type ResponseData = opportunity;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const opportunityId = req.query.id;

  if (!opportunityId) return res.status(404);

  const session = await auth(req, res);

  // Ensure that the opportunity exists
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId as string },
  });

  if (!opportunity) return res.status(404);

  // Get the user's registeredOpportunityIds
  const user = await prisma.users.findUnique({
    where: { email: session!.user.email },
  });

  if (!user) return res.status(400);

  // Update the user's registeredOpportunityIds
  await prisma.users.update({
    where: { email: session!.user.email },
    data: {
      savedOpportunityIds: {
        set: user.savedOpportunityIds.filter((id) => id !== opportunityId),
      },
    },
  });

  res.status(204).json(opportunity);
}
