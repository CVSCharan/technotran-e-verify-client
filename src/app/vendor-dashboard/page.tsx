"use client";

import React from "react";
import { useVendor } from "@/context/VendorContext";
import VendorNav from "@/sections/VendorNav";
import Footer from "@/sections/Footer";
import LoginModal from "@/components/AuthModal";
import VendorContent from "@/components/VendorContent";

const VendorDashboardPage = () => {
  const { vendorUser, showModal } = useVendor();

  return (
    <main id="E-Verify Portal Vendor Dashboard">
      {/* Show the LoginModal if user is not authenticated */}
      {!vendorUser && showModal && <LoginModal authParams="Vendor" />}

      <VendorNav />

      <VendorContent />

      <Footer />
    </main>
  );
};

export default VendorDashboardPage;
