import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

type ResponseData = {
  hoursContributed: number;
  topOrganizations: { name: string; imageUrl: string }[];
  numberOrganizationsContributed: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await auth(req, res);

  // Get user
  const user = await prisma.users.findUnique({
    where: { id: session!.user.id },
  });

  const opportunities = await prisma.opportunity.findMany({
    where: { id: { in: user!.attendedOpportunityIds } },
    select: { hours: true, organizationId: true },
  });

  // Get hours contributed per organization
  const hoursContributedPerOrganization = opportunities.reduce<{
    [key: string]: number;
  }>((a, b) => {
    a[b.organizationId] = (a[b.organizationId] || 0) + b.hours;
    return a;
  }, {});

  // Get total hours contributed
  const hoursContributed = Object.values(
    hoursContributedPerOrganization
  ).reduce((a, b) => a + b, 0);

  // Get top 3 organizations by hours
  const topOrganizations = await prisma.users.findMany({
    where: {
      id: { in: Object.keys(hoursContributedPerOrganization).slice(0, 3) },
    },
    select: { name: true, imageUrl: true },
  });

  res.status(204).json({
    hoursContributed,
    topOrganizations,
    numberOrganizationsContributed: Object.keys(hoursContributedPerOrganization)
      .length,
  });
}
