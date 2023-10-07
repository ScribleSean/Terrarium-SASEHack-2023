import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.container}>
      <img className={styles.logo} src="/logo.png"></img>
      <Link className={styles.link} href="/feed">
        Feed
      </Link>
      <Link className={styles.link} href="/opportunities">
        Opportunities
      </Link>
    </div>
  );
}
