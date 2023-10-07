import { useRouter } from "next/router";
import opportunities from "../../../data/opportunities.json";

export default function Opportunity() {
  const router = useRouter();

  const post: Opportunity = opportunities.find(
    (opp) => opp.id === router.query.id
  )! as any as Opportunity;

  return (
    post != null && (
      <div>
        {/* <img src={post.imageUrl}></img> */}
        <h1>{post.name}</h1>
        <p>{post.description}</p>
        <p>Location: {post.location}</p>
        <p>Date: {post.date}</p>

        <button className="btn btn-primary m-2">Register</button>
        <button className="btn btn-secondary">Save</button>
      </div>
    )
  );
}
