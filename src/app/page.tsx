import styles from "./page.module.css";
import CreateCertificate from "../components/CreateCertificate";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CreateCertificate />
      </main>
    </div>
  );
}
