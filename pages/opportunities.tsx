import Link from "next/link";
import styles from "../css/components.module.css";
import OpportunityCard from "../components/OpportunityCard";
import oppourtunities from "../data/opportunities.json";

export default function Feed() {
  return (
    <div className={styles.container}>
      <h1 className="title">Let's find your next opportunity</h1>
      <div className={styles.cardContainer}>
        {oppourtunities.map((opportunity, index) => (
          <OpportunityCard
            opportunity={{
              imageUrl: `https://picsum.photos/seed/${index + 1}/200`,
              ...opportunity,
            }}
          ></OpportunityCard>
        ))}
      </div>
    </div>
  );
}
