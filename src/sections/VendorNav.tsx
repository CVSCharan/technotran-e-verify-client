"use client";

import React, { useState } from "react";
import { useVendor } from "@/context/VendorContext";
import Link from "next/link";
import styles from "../styles/NavBar.module.css";

const VendorNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useVendor();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutBtnClick = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={`${styles.logo} macondo-regular`}>
          E-Verify Portal
        </Link>
        <div className={styles.hamburger} onClick={toggleMenu}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <ul className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
          <li>
            <Link
              href="https://technotran.in/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              Technotran.in
            </Link>
          </li>
          <li>
            <h2 onClick={() => handleLogoutBtnClick()}>Logout</h2>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default VendorNav;
