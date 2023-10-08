import { opportunity } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import prisma from "../../../lib/db";
import { useState } from "react";
import { auth } from "../../../lib/auth";
import { useRouter } from "next/router";

export const getServerSideProps = (async (context) => {
  const { id } = context.params ?? {};

  // If the id is not specified, return a 404
  if (id == null) {
    return { notFound: true };
  }

  // Find the opportunity in MongoDB by its id
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: id as string },
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
      isEventCreator: user?.email == opportunity.organizationId,
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
  const { opportunity, isEventCreator } = props;

  const [registerState, setRegisterState] = useState<boolean | null>(
    props.registered
  );
  const [saveState, setSaveState] = useState<boolean | null>(props.saved);

  /**
   * Updates the state of `currentValue` using `setOppState` and if
   * successful, updates the state of the button to reflect the new state.
   *
   * Calls the endpoint `trueEndpoint` if `currentValue` is false, and
   * `falseEndpoint` if `currentValue` is true.
   * @param currentValue
   * @param setOppState
   * @param trueEndpoint
   * @param falseEndpoint
   */
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

  const router = useRouter();
  /**
   * Toggles user registration for the opportunity.
   */
  const onRegister = async () => {
    setOppState(registerState, setRegisterState, "register", "unregister");
  };

  /**
   * Toggles user saving for the opportunity.
   */
  const onSave = async () => {
    setOppState(saveState, setSaveState, "save", "unsave");
  };

  /**
   * Deletes the opportunity and redirects to the opportunities page.
   */
  const onDelete = async () => {
    try {
      await fetch(`/api/opportunities/${opportunity.id}/delete`);
      alert("Opporunity deleted.");
      router.push("/opportunities");
    } catch {
      alert("Error deleting opportunity");
    }
  };

  const saveText =
    saveState == null ? "Loading" : saveState ? "Unsave" : "Save";
  const registerText =
    registerState == null
      ? "Loading"
      : registerState
      ? "Unregister"
      : "Register";

  return (
    opportunity != null && (
      <div>
        {/* <img src={post.imageUrl}></img> */}
        <h1>{opportunity.title}</h1>
        <p>{opportunity.description}</p>
        <p>Location: {opportunity.location}</p>
        <p>Date: {opportunity.date}</p>

        <button
          className="btn btn-primary m-1"
          onClick={onRegister}
          disabled={registerState == null}
        >
          {registerText}
        </button>
        <button
          className="btn btn-secondary m-1"
          onClick={onSave}
          disabled={saveState == null}
        >
          {saveText}
        </button>
        <button
          className={`btn btn-danger m-1 ${isEventCreator ? "" : "d-none"}`}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    )
  );
}
