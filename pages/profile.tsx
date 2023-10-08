import Head from "next/head";
import OpportunityCard from "../components/OpportunityCard";
import oppourtunities from "../data/opportunities.json";

export default function Profile() {
  return (
    <div className="container1">
      <Head>
        <title>My Profile</title>
      </Head>

      <main>
        <h1 className="title">My Profile</h1>

        <div className="container2">
          <div className="name_opps">
            {/* <img src={imageToAdd} alt="profile_picture" />; */}

            <h2 className="heading2">Name</h2>

            <p className="subtitle">Participated in _ opportunities</p>
          </div>

          <div className="interests">
            <h3 className="heading3">Interests</h3>

            <p>list interests here</p>
          </div>
        </div>

        <div className="container3">
          <h3>Saved Opportunities</h3>

          <div className="cardContainer">
            {/* {oppourtunities.slice(0, 3).map((opportunity, index) => (
              <OpportunityCard
                opportunity={{
                  imageUrl: `https://picsum.photos/seed/${index + 1}/200`,
                  ...opportunity,
                }}
              ></OpportunityCard>
            ))} */}
          </div>

          <button type="button" className="saved_opps">
            View all saved opportunities
          </button>
        </div>

        <div className="container4">
          <h3>My Posts</h3>

          <button type="button" className="new_post">
            Create new post
          </button>
        </div>
      </main>

      <style jsx>{`
        .cardContainer {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        .container1 {
          margin: 10px;
          min-height: 100vh;
          justify-content: center;
        }

        main {
          margin: 10px;
        }

        .container2 {
          display: flex;
          justify-content: start;
          background-color: #e5c687;
          border-radius: 10px;
        }

        .name_opps {
          margin: 10px;
          width: 400px;
        }

        .interests {
          margin: 10px;
          width: 400px;
        }

        .title {
          width: 100vw;
          min-height: 1vh;
          align-items: left;
        }

        .saved_opps {
          border-radius: 6px;
          background-color: #09814a;
        }

        .new_post {
          border-radius: 6px;
          background-color: #09814a;
        }
      `}</style>
    </div>
  );
}
