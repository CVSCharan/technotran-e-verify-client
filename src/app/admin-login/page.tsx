"use client";

import React, { useState } from "react";
import styles from "./page.module.css"; // Import CSS module
import AdminLoginComp from "@/components/AdminLoginComp";

const AdminLoginPage = () => {
  return (
    <main id="E-Verify Admin Login Page">
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.heading}>E-Verify Portal Login</h1>
            <h2 className={styles.subHeading}>
              A Technotran Solutions Venture
            </h2>
          </div>
          <div className={styles.formContainer}>
            <AdminLoginComp />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;
