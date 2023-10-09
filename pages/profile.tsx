import Head from "next/head";
import { auth } from "../lib/auth";
import prisma from "../lib/db";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { opportunity } from "@prisma/client";
import OpportunityCard from "../components/OpportunityCard";

export const getServerSideProps = (async (context) => {
  const session = await auth(context.req, context.res);
  if (session == null) return { notFound: true };
  const userId = session.user.id;

  // Get all user opportunities
  const opportunities = await prisma.opportunitiesOnUsers.findMany({
    where: { userId },
    include: { opportunity: { include: { organization: true } } },
  });

  const registeredOpportunities = opportunities
    .filter(
      (opportunity) => opportunity.isRegistered && !opportunity.isAttended
    )
    .map((opportunity) => opportunity.opportunity!);

  const savedOpportunities = opportunities
    .filter((opportunity) => opportunity.isSaved)
    .map((opportunity) => opportunity.opportunity!);

  const attendedOpportunities = opportunities
    .filter((opportunity) => opportunity.isAttended)
    .map((opportunity) => opportunity.opportunity!);

  // Get hours contributed per organization
  const hoursContributedPerOrganization = attendedOpportunities.reduce<{
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

  // Get user
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { name: true, imageUrl: true, badges: true },
  });

  if (!user) return { notFound: true };

  return {
    props: {
      hoursContributed,
      topOrganizations,
      numberOpportunitiesAttended: attendedOpportunities.length,
      numberOrganizationsContributed: Object.keys(
        hoursContributedPerOrganization
      ).length,
      savedOpportunities,
      registeredOpportunities,
      attendedOpportunities,
      user: {
        name: user.name,
        imageUrl: user.imageUrl,
        badges: user.badges,
      },
    },
  };
}) satisfies GetServerSideProps<{
  hoursContributed: number;
  topOrganizations: { name: string; imageUrl: string }[];
  numberOpportunitiesAttended: number;
  numberOrganizationsContributed: number;
  savedOpportunities: opportunity[];
  attendedOpportunities: opportunity[];
  registeredOpportunities: opportunity[];
  user: { name: string; imageUrl: string; badges: string[] };
}>;

export default function Profile({
  user,
  hoursContributed,
  topOrganizations,
  numberOpportunitiesAttended,
  attendedOpportunities,
  registeredOpportunities,
  savedOpportunities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container1">
      <Head>
        <title>My Profile</title>
      </Head>

      <main>
        <div className="d-flex align-items-center mb-5">
          <img
            className="rounded-circle mx-5"
            width={200}
            height={200}
            src={user.imageUrl}
          ></img>
          <h1>{user.name}</h1>
        </div>

        <div
          className="d-flex border w-75 align-items-center"
          style={{ marginLeft: "auto" }}
        >
          <div className="d-flex flex-column m-2">
            <h2>{hoursContributed}</h2>
            <span className="text-sm">Hours Contributed</span>
          </div>
          <div className="d-flex flex-column m-2">
            <h2>{numberOpportunitiesAttended}</h2>
            <span className="text-sm">Opportunities Attended</span>
          </div>
          <div className="d-flex">
            {user.badges.map((badgeName) => (
              <div className="d-flex flex-column m-2">
                <img
                  className="rounded-circle"
                  width={50}
                  height={50}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Awarded based on past contributions"
                  src={`badges/${badgeName}.svg`}
                ></img>
              </div>
            ))}
          </div>
        </div>

        <h1>Registered Opportunities</h1>
        <div className="d-flex flex-wrap">
          {registeredOpportunities.map((opportunity) => (
            <OpportunityCard opportunity={opportunity} />
          ))}
        </div>
        <h1>Saved Opportunities</h1>
        <div className="d-flex flex-wrap">
          {savedOpportunities.map((opportunity) => (
            <OpportunityCard opportunity={opportunity} />
          ))}
        </div>
        <h1>Completed Opportunities</h1>
        <div className="d-flex flex-wrap">
          {attendedOpportunities.map((opportunity) => (
            <OpportunityCard opportunity={opportunity} showContributed />
          ))}
        </div>
      </main>
    </div>
  );
}
