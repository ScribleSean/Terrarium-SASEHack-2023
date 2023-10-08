import { Prisma, PrismaClient, opportunity, users } from "@prisma/client";
import OpportunityCard from "../../components/OpportunityCard";
import Link from "next/link";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps = (async () => {
  const client = new PrismaClient();

  const opportunities = await client.opportunity.findMany({
    include: { organization: true },
  });

  if (opportunities == null) {
    return { notFound: true };
  }

  return {
    props: {
      opportunities,
    },
  };
}) satisfies GetServerSideProps<{
  opportunities: OpportunityQueryType;
}>;

export default function ({
  opportunities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1 className="title">Let's find your next opportunity</h1>
      <div className="d-flex flex-row flex-wrap">
        {opportunities.map((opportunity, index) => (
          <Link href={`/opportunities/${opportunity.id}`} key={index}>
            <OpportunityCard opportunity={opportunity}></OpportunityCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
