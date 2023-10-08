import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, opportunity } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { auth } from "../../../lib/auth";

type ResponseData = opportunity;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await auth(req, res);
  const client = new PrismaClient();

  const { title, description, location, imageUrl, date } = JSON.parse(req.body);

  const Opportunity = await client.opportunity.create({
    data: {
      title,
      description,
      location,
      imageUrl,
      date,
      organizationId: session?.user.email,
    },
  });

  res.status(201).json(Opportunity);
}
