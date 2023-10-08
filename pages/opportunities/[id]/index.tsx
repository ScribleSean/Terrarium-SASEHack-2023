import { opportunity } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import prisma from "../../../lib/db";
import { useState } from "react";
import { auth } from "../../../lib/auth";

export const getServerSideProps = (async (context) => {
  // If the id is not specified, return a 404
  if (context.params?.id == null) {
    return { notFound: true };
  }

  // Find the opportunity in MongoDB by its id
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: context.params.id as string },
  });

  // If the opportunity is not found, return a 404
  if (opportunity == null) {
    return { notFound: true };
  }

  // Get the user's registered/saved state
  const session = await auth(context.req, context.res);

  if (session == null) return { notFound: true };

  const user = await prisma.users.findFirst({
    where: { email: session.user.email },
  });

  return {
    props: {
      opportunity,
      registered:
        user?.registeredOpportunityIds?.includes(opportunity.id) ?? false,
      saved: user?.savedOpportunityIds?.includes(opportunity.id) ?? false,
    },
  };
}) satisfies GetServerSideProps<{
  opportunity: opportunity;
  registered: boolean;
  saved: boolean;
}>;

export default function Opportunity(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { opportunity } = props;

  const [registerState, setRegisterState] = useState<boolean | null>(
    props.registered
  );
  const [saveState, setSaveState] = useState<boolean | null>(props.saved);

  const setOppState = async (
    currentValue: boolean | null,
    setOppState: (value: boolean | null) => void,
    trueEndpoint: string,
    falseEndpoint: string
  ) => {
    const newState = !currentValue;
    const endpoint =
      `/api/opportunities/${opportunity.id}/` +
      (newState ? trueEndpoint : falseEndpoint);
    try {
      setOppState(null);
      await fetch(endpoint);
      setOppState(newState);
    } catch {
      setOppState(currentValue);
    }
  };

  const onRegister = async () => {
    setOppState(registerState, setRegisterState, "register", "unregister");
  };

  const onSave = async () => {
    setOppState(saveState, setSaveState, "save", "unsave");
  };

  return (
    opportunity != null && (
      <div>
        {/* <img src={post.imageUrl}></img> */}
        <h1>{opportunity.title}</h1>
        <p>{opportunity.description}</p>
        <p>Location: {opportunity.location}</p>
        <p>Date: {opportunity.date}</p>

        <button
          className="btn btn-primary m-2"
          onClick={onRegister}
          disabled={registerState == null}
        >
          {registerState == null
            ? "Loading"
            : registerState
            ? "Unregister"
            : "Register"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onSave}
          disabled={saveState == null}
        >
          {saveState == null ? "Loading" : saveState ? "Unsave" : "Save"}
        </button>
      </div>
    )
  );
}
