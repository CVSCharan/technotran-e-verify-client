"use client";

import { useState, useEffect } from "react";
import styles from "../styles/VendorVerifyComp.module.css";
import { vendorsData } from "@/utils/helper";
import Image from "next/image";
import { Vendor, VendorVerifyCompProps } from "@/utils/types";
import VendorLoginModal from "./VendorLoginModal"; // Import the modal component
import Head from "next/head";

const VendorVerifyComp: React.FC<VendorVerifyCompProps> = ({ org }) => {
  const [orgData, setOrgData] = useState<Vendor | null>(null); // Use Vendor type
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": orgData?.name || "Vendor Organization",
    "description": "Vendor login portal for certificate verification system",
    "image": orgData?.imgSrc || "",
    "url": typeof window !== "undefined" ? window.location.href : "",
    "potentialAction": {
      "@type": "LoginAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": typeof window !== "undefined" ? window.location.href : ""
      }
    }
  };

  // Debugging: Log the org prop and vendorsData
  useEffect(() => {
    const selectedOrg = vendorsData.find(
      (client) => client.name.trim().toLowerCase() === org.trim().toLowerCase()
    );
    console.log(org, selectedOrg);
    setOrgData(selectedOrg ? selectedOrg : null); // Handle undefined case
  }, [org]); // Re-run the effect whenever org changes

  const handleLoginClick = () => {
    setOpenModal(true); // Open the modal when the login button is clicked
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      {orgData && (
        <div 
          className={styles.formContainer}
          itemScope
          itemType="https://schema.org/Organization"
        >
          <Image
            height={150}
            width={150}
            src={orgData.imgSrc}
            alt={orgData.name}
            className={styles.formImg}
            priority
            itemProp="image"
          />
          <h2 
            className={styles.formHeading}
            itemProp="name"
            id="vendor-organization-heading"
          >
            {orgData.name}
          </h2>

          <button 
            className={styles.formButton} 
            onClick={handleLoginClick}
            aria-label={`Login to ${orgData.name}`}
            aria-describedby="vendor-organization-heading"
          >
            Login
          </button>
        </div>
      )}

      {/* Vendor Login modal */}
      <VendorLoginModal
        open={openModal}
        setOpen={setOpenModal}
        orgData={orgData}
      />
    </>
  );
};

export default VendorVerifyComp;
