import Link from "next/link";
import styles from "./navbar.module.css";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();
  const isOrg = session.data?.user.role == "org";

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
          className={`${styles.link} ${isOrg ? "" : "d-none"}`}
          href="/opportunities/create"
        >
          Create
        </Link>
      </div>
    </div>
  );
}
