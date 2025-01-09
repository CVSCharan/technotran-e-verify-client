"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../styles/NavBar.module.css";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
            <Link href="/admin-dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/view-certificates" onClick={() => setIsOpen(false)}>
              Certificates
            </Link>
          </li>
          <li>
            <Link href="/view-vendors" onClick={() => setIsOpen(false)}>
              Vendors
            </Link>
          </li>
          <li>
            <Link href="/" onClick={() => setIsOpen(false)}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNav;
