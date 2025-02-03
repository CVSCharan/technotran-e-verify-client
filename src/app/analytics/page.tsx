"use client";

import AdminNav from "@/sections/AdminNav";
import Footer from "@/sections/Footer";
import React from "react";
// import styles from "./page.module.css";
import { useAdmin } from "@/context/AdminContext";
import LoginModal from "@/components/AuthModal";

const AnalyticsPage = () => {
  const { adminUser, showModal } = useAdmin();
  return (
    <main id="E-Verify Portal Analytics">
      {/* Show the LoginModal if user is not authenticated */}
      {!adminUser && showModal && <LoginModal authParams="Admin" />}

      <AdminNav />

      <Footer />
    </main>
  );
};

export default AnalyticsPage;
