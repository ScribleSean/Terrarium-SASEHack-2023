import { opportunity } from "@prisma/client";
import { GetServerSideProps } from "next";
import prisma from "../lib/db";

function Feed() {
  return (
    <div>
      <h1 className="title">Feed</h1>
      <div className="d-flex flex-column justify-content-center">
        <div className="p-2">user 1</div>
        <div className="p-2">user 2</div>
        <div className="p-2">user 3</div>
      </div>
    </div>
  );
}
export default Feed;
