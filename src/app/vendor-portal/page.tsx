import Navbar from "@/sections/NavBar";
import React from "react";
import styles from "./page.module.css";

const VendorPortalPage = () => {
  return (
    <main id="E-Verify Vendor Portal">
      <Navbar />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.heading}>Welcome to the E-Verify Portal</h1>
            <h2 className={styles.subHeading}>
              A Technotran Solutions Venture
            </h2>
            <p className={styles.welcomeText}>
              This platform is dedicated to verifying the authenticity of
              certificates issued by our organization.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default VendorPortalPage;
