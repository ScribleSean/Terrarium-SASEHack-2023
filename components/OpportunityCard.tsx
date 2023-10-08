import Link from "next/link";
import { OpportunityQueryType } from "../types/models";

export default function OpportunityCard(props: {
  opportunity: OpportunityQueryType;
  showContributed?: boolean;
}) {
  const { opportunity, showContributed } = props;

  return (
    <Link href={`/opportunities/${opportunity.id}`} key={opportunity.id}>
      <div className="card m-1" style={{ width: "20rem", cursor: "pointer" }}>
        <img src={opportunity.imageUrl} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title m-0">{opportunity.title}</h5>
          <div className="my-1">
            {opportunity.tagNames.map((tag) => (
              <span className="badge bg-secondary me-1">{tag}</span>
            ))}
          </div>
          <p className="card-text m-0">📅 {opportunity.date}</p>
          <p className="card-text m-0">📍 {opportunity.location}</p>
          <p className="card-text m-0">🫂 {opportunity.organization!.name}</p>
          {showContributed != null && (
            <p className="card-text m-0">
              🕒 {opportunity.hours} hours contributed
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
