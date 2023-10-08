import Link from "next/link";

export default function OpportunityCard(props: {
  opportunity: OpportunityQueryType;
}) {
  const { opportunity } = props;

  return (
    <Link href={`/opportunities/${opportunity.id}`} key={opportunity.id}>
      <div className="card m-1" style={{ width: "20rem", cursor: "pointer" }}>
        <img src={opportunity.imageUrl} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{opportunity.title}</h5>
          <p className="card-text m-0">📅 {opportunity.date}</p>
          <p className="card-text m-0">📍 {opportunity.location}</p>
          <p className="card-text m-0">🫂 {opportunity.organization.name}</p>
        </div>
      </div>
    </Link>
  );
}
