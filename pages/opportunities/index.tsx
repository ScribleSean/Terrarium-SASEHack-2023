import OpportunityCard from "../../components/OpportunityCard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import prisma from "../../lib/db";
import { auth } from "../../lib/auth";

export const getServerSideProps = (async (context) => {
  const { view } = context.query ?? {};
  const userId = await auth(context.req, context.res);

  // Find all opportunities in MongoDB
  const opportunities = await prisma.opportunity.findMany({
    include: { organization: true },
    where: view ? { organizationId: userId?.user.id } : undefined,
  });

  // If no opportunities are found, return a 404
  if (opportunities == null) {
    return { notFound: true };
  }

  // Return the opportunities as props
  return {
    props: {
      opportunities,
    },
  };
}) satisfies GetServerSideProps<{
  // Specify the return type and the type of the props object
  opportunities: any;
}>;

export default function ({
  opportunities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1 className="title">Let's find your next opportunity</h1>
      {/* Create a grid of opportunities */}
      <div className="d-flex flex-row flex-wrap">
        {opportunities.map((opportunity) => (
          <OpportunityCard opportunity={opportunity}></OpportunityCard>
        ))}
      </div>
    </div>
  );
}
