import Link from "next/link";
import styles from "./navbar.module.css";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <img className={styles.logo} src="/logo.png"></img>
        <span>Terrarium</span>
      </div>
      <div className={styles.row}>
        <Link className={styles.link} href="/feed">
          Feed
        </Link>
        <Link className={styles.link} href="/opportunities">
          Opportunities
        </Link>
        <Link
          className={`${styles.link} ${user?.isOrg ? "" : "d-none"}`}
          href="/opportunities/create"
        >
          Create
        </Link>
        <Link className={styles.link} href="/profile">
          <img
            src={user?.imageUrl}
            className="rounded-circle"
            width="30em"
            height="30em"
          />
        </Link>
      </div>
    </div>
  );
}
