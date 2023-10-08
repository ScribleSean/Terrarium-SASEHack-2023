import { Prisma } from "@prisma/client";

type OpportunityQueryType = Prisma.opportunityGetPayload<{
  include: { organization: true };
}>;
