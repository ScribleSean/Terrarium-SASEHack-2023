import Link from "next/link";

export default function OpportunityCard(props: {
  opportunity: Opportunity;
  onClick?: (id: string) => void;
}) {
  const { opportunity } = props;

  return (
    <div
      className="card m-1"
      style={{ width: "20rem", cursor: "pointer" }}
      onClick={() => props.onClick?.(opportunity.id)}
    >
      <img src={opportunity.imageUrl} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{opportunity.name}</h5>
        <p className="card-text m-0">📅 {opportunity.date}</p>
        <p className="card-text m-0">📍 {opportunity.location}</p>
        <Link href={`/organizations/${opportunity.organizationId}`}>
          🫂 {opportunity.organizationName}
        </Link>
      </div>
    </div>
  );
}
