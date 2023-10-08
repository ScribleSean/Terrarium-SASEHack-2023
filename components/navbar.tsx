import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
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
        <Link className={styles.link} href="/opportunities/create">
          Create
        </Link>
      </div>
    </div>
  );
}
