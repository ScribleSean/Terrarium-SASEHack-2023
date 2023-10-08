import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

type ResponseData = undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const opportunityId = req.query.id as string | undefined;
  const { userIds, hours } = JSON.parse(req.body);

  if (!opportunityId) return res.status(404);

  const session = await auth(req, res);

  // Ensure that the opportunity exists
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId as string },
  });

  if (!opportunity) return res.status(404);
  // Ensure that the user is the organization
  if (opportunity.organizationId != session?.user.id) return res.status(403);

  // Mark all the users as attended the event
  for (const userId of userIds) {
    await prisma.opportunitiesOnUsers.updateMany({
      where: { id: userId },
      data: { isAttended: true },
    });
  }

  // Update the opportunity's hours
  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: { hours, ended: true },
  });

  res.status(204).end();
}
