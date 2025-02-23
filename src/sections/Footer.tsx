"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Alternative to useRouter for `app` directory

const Footer = () => {
  const [isHomeRoute, setIsHomeRoute] = useState(false);
  const pathname = usePathname(); // Provides the current route

  useEffect(() => {
    // Check if the current route is home
    setIsHomeRoute(pathname === "/");
  }, [pathname]);

  return (
    <section id="Footer" className="footer-container">
      <h3 className="quicksand-text footer-heading">
        © 2025 All rights reserved - Technotron Solutions.
      </h3>
      {isHomeRoute && (
        <h3 className="quicksand-text footer-sub-heading">
          Developed with 💛 by CVS CHARAN
        </h3>
      )}
    </section>
  );
};

export default Footer;
