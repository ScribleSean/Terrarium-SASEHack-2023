import OpportunityCard from "../../components/OpportunityCard";
import oppourtunities from "../../data/opportunities.json";
import Link from "next/link";

export default function Feed() {
  return (
    <div>
      <h1 className="title">Let's find your next opportunity</h1>
      <div className="d-flex flex-row flex-wrap">
        {oppourtunities.map((opportunity, index) => (
          <Link href={`/opportunities/${opportunity.id}`} key={index}>
            <OpportunityCard
              opportunity={{
                imageUrl: `https://picsum.photos/seed/${index + 1}/200`,
                ...opportunity,
              }}
            ></OpportunityCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
