"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/sections/NavBar";
import VerifyCertificateComp from "@/components/VerifyCertificateComp";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className={styles.mainBody}>
        <section className={styles.landingSection}>
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

          <div className={styles.formContainer}>
            <VerifyCertificateComp />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
