import { useRouter } from "next/router";
import { PrismaClient, opportunity } from "@prisma/client";
import { GetServerSideProps } from "next";

export const getServerSideProps = (async (context) => {
  const client = new PrismaClient();

  if (context.params?.id == null) {
    return { notFound: true };
  }

  const opportunity = await client.opportunity.findFirst({
    where: { id: context.params.id as string },
  });

  if (opportunity == null) {
    return { notFound: true };
  }

  return {
    props: {
      opportunity,
    },
  };
}) satisfies GetServerSideProps<{
  opportunity: opportunity;
}>;

export default function Opportunity(props: { opportunity: opportunity }) {
  const { opportunity } = props;

  return (
    opportunity != null && (
      <div>
        {/* <img src={post.imageUrl}></img> */}
        <h1>{opportunity.title}</h1>
        <p>{opportunity.description}</p>
        <p>Location: {opportunity.location}</p>
        <p>Date: {opportunity.date}</p>

        <button className="btn btn-primary m-2">Register</button>
        <button className="btn btn-secondary">Save</button>
      </div>
    )
  );
}
