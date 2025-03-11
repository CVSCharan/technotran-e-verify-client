import React from "react";
import styles from "./page.module.css";
import AdminLoginComp from "@/components/AdminLoginComp";
import Footer from "@/sections/Footer";
import { Metadata } from "next";

// Define metadata for better SEO
export const metadata: Metadata = {
  title: "Admin Login | E-Verify Portal | Technotran Solutions",
  description: "Secure login portal for E-Verify administrators. Access the certificate management system by Technotran Solutions.",
  keywords: "admin login, e-verify portal, certificate verification, technotran solutions",
  robots: "noindex, nofollow", // Admin pages shouldn't be indexed
  alternates: {
    canonical: "https://e-verify-portal.com/admin-login",
  },
};

const AdminLoginPage = () => {
  return (
    <main className={styles.mainContainer} aria-labelledby="login-heading">
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <div className={styles.welcomeSection}>
            <h1 id="login-heading" className={styles.heading}>E-Verify Portal Login</h1>
            <p className={styles.subHeading}>
              A Technotran Solutions Venture
            </p>
          </div>
          <div className={styles.formContainer} aria-label="Login Form">
            <AdminLoginComp />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default AdminLoginPage;
