"use client";

import AdminNav from "@/sections/AdminNav";
import React, { useState } from "react";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";

const AdminDashboardPage = () => {
  return (
    <main id="E-Verify Portal Admin Dashboard">
      <AdminNav />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <h1 className={styles.landingHeading}>E-Verify Portal Dashboard</h1>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default AdminDashboardPage;
