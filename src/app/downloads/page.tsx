"use client";

import AdminNav from "@/sections/AdminNav";
import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import LoginModal from "@/components/AuthModal";
import Footer from "@/sections/Footer";
import Head from "next/head";
import styles from "./page.module.css";
import { SingleDownloadForm } from "@/components/SingleDownloadForm";
import MultipleDownloadForm from "@/components/MultipleDownloadForm";

const DownloadsPage = () => {
  const { adminUser, showModal } = useAdmin();
  const [viewMode, setViewMode] = useState("single"); // "single" or "multiple"
  const [message, setMessage] = useState("");

  return (
    <>
      <Head>
        <title>
          E-Verify Portal Downloads | Access Certificate Templates & Resources
        </title>
        <meta
          name="description"
          content="Download certificate templates, verification tools, and resources from the E-Verify Portal. Access everything you need for certificate management and verification."
        />
        <meta
          name="keywords"
          content="certificate downloads, e-verify downloads, certificate templates, verification resources"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/downloads" />
      </Head>

      <main
        id="downloads-page"
        aria-label="Downloads Page"
        className={styles.mainContainer}
      >
        {/* Show the LoginModal if user is not authenticated */}
        {!adminUser && showModal && <LoginModal authParams="Admin" />}

        <AdminNav />

        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <h1 id="downloads-heading" className={styles.heading}>
              E-Verify Portal Downloads
            </h1>

            <div className={styles.formContainer}>
              <div
                className={styles.viewToggleButtonContainer}
                role="tablist"
                aria-label="Form entry mode"
              >
                <button
                  className={`${styles.viewToggleButton} ${
                    viewMode === "single" ? styles.active : styles.inactive
                  }`}
                  onClick={() => setViewMode("single")}
                >
                  Single Certificate
                </button>
                <button
                  className={`${styles.viewToggleButton} ${
                    viewMode === "multiple" ? styles.active : styles.inactive
                  }`}
                  onClick={() => setViewMode("multiple")}
                >
                  Multiple Certificates
                </button>
              </div>

              {message && <p className={styles.statusMessage}>{message}</p>}

              <div className={styles.formWrapper}>
                {viewMode === "single" && (
                  <SingleDownloadForm setMessage={setMessage} />
                )}
                {viewMode === "multiple" && (
                  <MultipleDownloadForm setMessage={setMessage} />
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default DownloadsPage;
