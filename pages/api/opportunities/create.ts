import type { NextApiRequest, NextApiResponse } from "next";
import { opportunity } from "@prisma/client";
import { auth } from "../../../lib/auth";
import prisma from "../../../lib/db";

type ResponseData = opportunity;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await auth(req, res);

  const { title, description, location, imageUrl, date } = JSON.parse(req.body);

  const Opportunity = await prisma.opportunity.create({
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
