"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../styles/NavBar.module.css";

const Navbar = () => {
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
            <Link
              href="https://technotran.in/contact-us/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              href="https://technotran.in/about-us/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link href="/vendor-portal" onClick={() => setIsOpen(false)}>
              {`Vendor's Portal`}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
