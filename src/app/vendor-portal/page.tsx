"use client";

import Navbar from "@/sections/NavBar";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import VendorVerifyComp from "@/components/VendorVerifyComp";

const VendorPortalPage = () => {
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [openModal, setOpenModal] = useState(false); // Add state for the modal

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrganization(event.target.value);
  };

  useEffect(() => {
    setSelectedOrganization("");
  }, []);

  return (
    <main id="E-Verify Vendor Portal">
      <Navbar />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.heading}>Vendor E-Verify Portal</h1>
            <h2 className={styles.subHeading}>
              A Technotran Solutions Venture
            </h2>
            <p className={styles.welcomeText}>
              This platform is dedicated to verifying the authenticity of
              certificates issued by our organization.
            </p>
          </div>
          {/* Add Select Component */}
          <div className={styles.selectContainer}>
            <label htmlFor="vendor-options" className={styles.selectLabel}>
              Vendor Organization
            </label>
            <select
              id="vendor-options"
              className={styles.selectDropdown}
              value={selectedOrganization}
              onChange={handleSelectChange}
            >
              <option value="">Select an option</option>
              <option value="Vemu Institute of Technology, Chittoor">
                Vemu Institute of Technology, Chittoor
              </option>
              <option value="SV College of Engineering, Kadapa">
                SV College of Engineering, Kadapa
              </option>
              <option value="VNR VJIET, Hyderabad">VNR VJIET, Hyderabad</option>
              <option value="S.A Engineering College, Chennai">
                S.A Engineering College, Chennai
              </option>
              <option value="Rainbow International School, Nellore">
                Rainbow International School, Nellore
              </option>
              <option value="Prakasam Engineering College, Kandukur">
                Prakasam Engineering College, Kandukur
              </option>
              <option value="NBKR Institute of Science & Technology">
                NBKR Institute of Science & Technology
              </option>
              <option value="PBR Visvodaya Technical Academy, Kavali">
                PBR Visvodaya Technical Academy, Kavali
              </option>
              <option value="Narayana Engineering College, Nellore & Gudur">
                Narayana Engineering College, Nellore & Gudur
              </option>
              <option value="Laki Reddy Bali Reddy College of Engineering, Vijayawada">
                Laki Reddy Bali Reddy College of Engineering, Vijayawada
              </option>
              <option value="Geethanjali College of Engineering & Technology, Hyderabad">
                Geethanjali College of Engineering & Technology, Hyderabad
              </option>
              <option value="Bhoj Reddy Engineering College for Women, Hyderabad">
                Bhoj Reddy Engineering College for Women, Hyderabad
              </option>
              <option value="Audisankara College of Engineering & Technology, Gudur">
                Audisankara College of Engineering & Technology, Gudur
              </option>
              <option value="Annamacharya Institute of Technology & Sciences, Rajampet">
                Annamacharya Institute of Technology & Sciences, Rajampet
              </option>
              <option value="Sree Chaitanya">Sree Chaitanya</option>
            </select>
          </div>
          {selectedOrganization && (
            <div className={styles.formContainer}>
              {/* Pass openModal and setOpenModal to VendorVerifyComp */}
              <VendorVerifyComp
                org={selectedOrganization}
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default VendorPortalPage;
