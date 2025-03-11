"use client";

import AdminNav from "@/sections/AdminNav";
import React from "react";
import { useAdmin } from "@/context/AdminContext";
import LoginModal from "@/components/AuthModal";
import Footer from "@/sections/Footer";
import Head from "next/head";
import styles from "./page.module.css";

const DownloadsPage = () => {
  const { adminUser, showModal } = useAdmin();

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

      <main id="downloads-page" aria-label="Downloads Page">
        {/* Show the LoginModal if user is not authenticated */}
        {!adminUser && showModal && <LoginModal authParams="Admin" />}

        <AdminNav />

        <Footer />
      </main>
    </>
  );
};

export default DownloadsPage;
