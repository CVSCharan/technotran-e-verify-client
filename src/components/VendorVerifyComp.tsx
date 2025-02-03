"use client";

import { useState, useEffect } from "react";
import styles from "../styles/VendorVerifyComp.module.css";
import { vendorsData } from "@/utils/helper";
import Image from "next/image";
import { Vendor, VendorVerifyCompProps } from "@/utils/types";
import VendorLoginModal from "./VendorLoginModal"; // Import the modal component

const VendorVerifyComp: React.FC<VendorVerifyCompProps> = ({ org }) => {
  const [orgData, setOrgData] = useState<Vendor | null>(null); // Use Vendor type
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

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
      {orgData && (
        <div className={styles.formContainer}>
          <Image
            height={150}
            width={150}
            src={orgData.imgSrc}
            alt={orgData.name}
            className={styles.formImg}
            priority
          />
          <h2 className={styles.formHeading}>{orgData.name}</h2>

          <button className={styles.formButton} onClick={handleLoginClick}>
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
