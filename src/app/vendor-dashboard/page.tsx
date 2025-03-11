"use client";

import React, { useEffect } from "react";
import { useVendor } from "@/context/VendorContext";
import VendorNav from "@/sections/VendorNav";
import Footer from "@/sections/Footer";
import LoginModal from "@/components/AuthModal";
import VendorContent from "@/components/VendorContent";
import Head from "next/head";

const VendorDashboardPage = () => {
  const { vendorUser, showModal } = useVendor();

  // Set page title dynamically
  useEffect(() => {
    document.title = "Vendor Dashboard | E-Verify Portal";
  }, []);

  return (
    <>
      <Head>
        <title>Vendor Dashboard | E-Verify Portal | Technotran Solutions</title>
        <meta name="description" content="Vendor dashboard for managing certificates and verification requests in the E-Verify Portal system." />
        <meta name="keywords" content="vendor dashboard, certificate management, e-verify portal, document verification, technotran solutions" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://e-verify-portal.com/vendor-dashboard" />
      </Head>
      
      <main id="E-Verify Portal Vendor Dashboard">
        {/* Show the LoginModal if user is not authenticated */}
        {!vendorUser && showModal && <LoginModal authParams="Vendor" />}

        <VendorNav />

        <VendorContent />

        <Footer />
      </main>
    </>
  );
};

export default VendorDashboardPage;
