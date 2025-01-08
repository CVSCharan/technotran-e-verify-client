import AdminNav from "@/sections/AdminNav";
import React from "react";
import styles from "./page.module.css";

const AdminDashboardPage = () => {
  return (
    <main id="E-Verify Portal Admin Dashboard">
      <AdminNav />
      <section className={styles.mainBody}></section>
    </main>
  );
};

export default AdminDashboardPage;
