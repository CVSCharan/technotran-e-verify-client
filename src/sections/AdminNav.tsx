"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../styles/NavBar.module.css";
import { useAdmin } from "@/context/AdminContext";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAdmin();

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
            <a href="#" onClick={handleLogoutBtnClick} className={styles.navLink}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNav;
