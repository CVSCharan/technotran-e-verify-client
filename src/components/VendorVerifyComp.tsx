"use client";

import { useState, useEffect } from "react";
import styles from "../styles/VendorVerifyComp.module.css";
import { useRouter } from "next/navigation";
import { vendorsData } from "@/utils/helper";
import Image from "next/image";
import { Vendor, VendorVerifyCompProps } from "@/utils/types";

const VendorVerifyComp: React.FC<VendorVerifyCompProps> = ({ org }) => {
  const router = useRouter();
  const [orgData, setOrgData] = useState<Vendor | null>(null); // Use Vendor type

  // Debugging: Log the org prop and vendorsData
  useEffect(() => {
    const selectedOrg = vendorsData.find(
      (client) => client.name.trim().toLowerCase() === org.trim().toLowerCase()
    );
    console.log(org, selectedOrg);
    setOrgData(selectedOrg ? selectedOrg : null); // Handle undefined case
  }, [org]); // Re-run the effect whenever org changes

  const handleLoginClick = () => {
    if (orgData) {
      // Redirect to login page or whatever logic you want to handle on login button click
      router.push(`/login/${orgData.name}`);
    }
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
    </>
  );
};

export default VendorVerifyComp;
