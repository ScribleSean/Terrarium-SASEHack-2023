import Link from "next/link";
import styles from "../css/components.module.css";

const testData = [
  {
    date: "Oct 10 2023",
    location: "Boston, Massachusetts",
    name: "Park Cleanup",
    description:
      "Join us for a park cleanup event to keep our community green and beautiful.",
    organization: "Green Earth Volunteers",
    organization_id: 12345,
  },
  {
    date: "Oct 15 2023",
    location: "Cambridge, Massachusetts",
    name: "Food Drive",
    description:
      "Help collect and distribute food to those in need in our local community.",
    organization: "Community Food Bank",
    organization_id: 54321,
  },
  {
    date: "Oct 20 2023",
    location: "Worcester, Massachusetts",
    name: "Senior Center Visit",
    description:
      "Spend time with the elderly residents of our senior center, engage in activities, and bring joy to their day.",
    organization: "Senior Care Alliance",
    organization_id: 98765,
  },
  {
    date: "Oct 25 2023",
    location: "Springfield, Massachusetts",
    name: "Tree Planting",
    description: "Help us plant trees and improve the environment in our city.",
    organization: "Green Springfield Initiative",
    organization_id: 45678,
  },
  {
    date: "Oct 30 2023",
    location: "Lowell, Massachusetts",
    name: "Youth Mentorship Program",
    description:
      "Become a mentor and guide local youth toward a brighter future.",
    organization: "Youth Empowerment Foundation",
    organization_id: 13579,
  },
  {
    date: "Nov 5 2023",
    location: "New Bedford, Massachusetts",
    name: "Homeless Shelter Support",
    description:
      "Assist at a homeless shelter by serving meals and providing support to those in need.",
    organization: "Hope Haven Shelter",
    organization_id: 24680,
  },
  {
    date: "Nov 10 2023",
    location: "Quincy, Massachusetts",
    name: "Library Reading Program",
    description:
      "Read books to children at the local library and promote a love for reading.",
    organization: "Quincy Public Library",
    organization_id: 11223,
  },
  {
    date: "Nov 15 2023",
    location: "Somerville, Massachusetts",
    name: "Community Garden Maintenance",
    description:
      "Help maintain our community garden and ensure it remains a vibrant green space for everyone.",
    organization: "Somerville Community Gardens",
    organization_id: 33445,
  },
  {
    date: "Nov 20 2023",
    location: "Brockton, Massachusetts",
    name: "Veterans' Support",
    description:
      "Show appreciation to our veterans by participating in a veterans' support event.",
    organization: "Veterans Support Association",
    organization_id: 55667,
  },
  {
    date: "Nov 25 2023",
    location: "Framingham, Massachusetts",
    name: "Thanksgiving Meal Drive",
    description:
      "Distribute Thanksgiving meals to families in need and make their holiday special.",
    organization: "Framingham Cares",
    organization_id: 77889,
  },
  {
    date: "Nov 30 2023",
    location: "Haverhill, Massachusetts",
    name: "Home Renovation Project",
    description:
      "Assist in renovating homes for families in need, providing them with a safe and comfortable living space.",
    organization: "Home Makeover Foundation",
    organization_id: 99000,
  },
  {
    date: "Dec 5 2023",
    location: "Salem, Massachusetts",
    name: "Holiday Toy Drive",
    description:
      "Collect and distribute toys to underprivileged children during the holiday season.",
    organization: "Salem Toy Drive",
    organization_id: 66778,
  },
  {
    date: "Dec 10 2023",
    location: "Malden, Massachusetts",
    name: "Elderly Care Visit",
    description:
      "Visit and spend quality time with elderly residents at a local care facility.",
    organization: "Malden Elderly Care Center",
    organization_id: 11234,
  },
  {
    date: "Dec 15 2023",
    location: "Lawrence, Massachusetts",
    name: "Clothing Drive",
    description:
      "Collect and distribute warm clothing to those in need during the winter season.",
    organization: "Warmth for All",
    organization_id: 77899,
  },
  {
    date: "Dec 20 2023",
    location: "Plymouth, Massachusetts",
    name: "Beach Cleanup",
    description:
      "Help us clean up the local beach and protect our coastal environment.",
    organization: "Plymouth Coastal Conservation",
    organization_id: 33555,
  },
  {
    date: "Dec 25 2023",
    location: "Taunton, Massachusetts",
    name: "Holiday Food Distribution",
    description:
      "Distribute holiday meals to families in need and spread joy during the festive season.",
    organization: "Taunton Food Pantry",
    organization_id: 11222,
  },
];

export default function Feed() {
  return (
    <div className={styles.container}>
      <h1 className="title">Let's find your next opportunity</h1>
      <div className={styles.cardContainer}>
        {testData.map((opportunity, index) => (
          <div
            className="card m-1"
            style={{ width: "20rem", cursor: "pointer" }}
          >
            <img
              src={`https://picsum.photos/seed/${index + 1}/200`}
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">{opportunity.name}</h5>
              <p className="card-text m-0">📅 {opportunity.date}</p>
              <p className="card-text m-0">📍 {opportunity.location}</p>
              <Link href={`/organizations/${opportunity.organization_id}`}>
                🫂 {opportunity.organization}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
