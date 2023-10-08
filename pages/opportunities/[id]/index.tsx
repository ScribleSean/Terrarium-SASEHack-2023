import { opportunity } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import prisma from "../../../lib/db";
import { ChangeEvent, useRef, useState } from "react";
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

  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
  });

  // Return all registered users for the opportunity
  const registeredUsers = await prisma.users.findMany({
    where: { registeredOpportunityIds: { has: opportunity.id } },
    select: { name: true, imageUrl: true, id: true },
  });

  return {
    props: {
      opportunity,
      registered:
        user?.registeredOpportunityIds?.includes(opportunity.id) ?? false,
      saved: user?.savedOpportunityIds?.includes(opportunity.id) ?? false,
      isEventCreator: user?.id == opportunity.organizationId,
      registeredUsers,
    },
  };
}) satisfies GetServerSideProps<{
  opportunity: opportunity;
  registered: boolean;
  saved: boolean;
  registeredUsers: { name: string; imageUrl: string; id: string }[];
}>;

export default function Opportunity({
  opportunity,
  isEventCreator,
  registeredUsers,
  registered: initialRegistered,
  saved: initialSaved,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [saveState, setSaveState] = useState<boolean | null>(initialSaved);
  const [isInCompletionMode, setIsInCompletionMode] = useState<boolean>(false);
  const selectedUserIds = useRef(new Set());
  const hours = useRef(0);

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
    if (initialRegistered) {
      await fetch(`/api/opportunities/${opportunity.id}/unregister`);
    } else {
      await fetch(`/api/opportunities/${opportunity.id}/register`);
    }

    router.reload();
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

  /**
   * Submits the completion form.
   */
  const onComplete = async () => {
    if (
      isInCompletionMode &&
      confirm("Are you sure you want to complete this event?")
    ) {
      await fetch(`/api/opportunities/${opportunity.id}/complete`, {
        body: JSON.stringify({
          hours: hours.current,
          userIds: Array.from(selectedUserIds.current),
        }),
        method: "POST",
      });

      router.reload();
    }

    setIsInCompletionMode(!isInCompletionMode);
  };

  /**
   * Updates the hours value when the hours input changes.
   * @param e The change event from the hours input
   */
  const onHoursChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    hours.current = parseInt(e.target.value);
  };

  /**
   * Adds or removes the user from the list of selected users.
   * @param e The change event from the checkbox
   */
  const onUserSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) selectedUserIds.current.add(e.target.value);
    else selectedUserIds.current.delete(e.target.value);
  };

  const saveText =
    saveState == null ? "Loading" : saveState ? "Unsave" : "Save";
  const registerText = opportunity.ended
    ? "Ended"
    : initialRegistered
    ? "Unregister"
    : "Register";

  return (
    opportunity != null && (
      <div>
        <div className="mb-3">
          <h1>{opportunity.title}</h1>
          <p>{opportunity.description}</p>
          <p>Location: {opportunity.location}</p>
          <p>Date: {opportunity.date}</p>

          {isEventCreator && (
            <>
              <button
                className={"btn btn-primary"}
                onClick={onComplete}
                disabled={opportunity.ended}
              >
                {isInCompletionMode ? "Done Completing" : "Complete"}
              </button>

              <button
                className={`btn btn-danger m-1 ${
                  isEventCreator ? "" : "d-none"
                }`}
                onClick={onDelete}
              >
                Delete
              </button>
            </>
          )}

          {!isEventCreator && (
            <>
              <button className={"btn btn-primary"} onClick={onRegister}>
                {registerText}
              </button>
              <button
                className={"btn btn-secondary m-1"}
                onClick={onSave}
                disabled={saveState == null}
              >
                {saveText}
              </button>
            </>
          )}
        </div>

        {isInCompletionMode && (
          <div className="form-group mb-3">
            <label htmlFor="input-hours">
              How long did the event last for?
            </label>
            <input
              className="form-control"
              type="number"
              id="input-hours"
              onChange={onHoursChanged}
            ></input>
          </div>
        )}

        <div>
          <h2>{isInCompletionMode ? "Who's went?" : "Who's going?"}</h2>
          <div className="d-flex flex-col">
            {registeredUsers.map((user) => (
              <div
                key={user.id}
                className="d-flex justify-content-between align-items-center"
              >
                {isInCompletionMode && (
                  <input
                    type="radio"
                    value={user.id}
                    className="m-2"
                    onChange={onUserSelected}
                  ></input>
                )}
                {!isInCompletionMode && opportunity.ended && (
                  <input
                    type="radio"
                    className="m-2"
                    checked={opportunity.attendedUsersIds.includes(user.id)}
                    disabled
                  ></input>
                )}

                <img
                  src={user.imageUrl}
                  style={{ width: "50px", height: "50px" }}
                  className="rounded-circle bg-info"
                />
                <span className="m-2">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
