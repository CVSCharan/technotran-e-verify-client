import styles from "./page.module.css";
import Navbar from "@/sections/NavBar";
import VerifyCertificateComp from "@/components/VerifyCertificateComp";
import Footer from "@/sections/Footer";
import { Metadata } from "next";

// Define metadata for better SEO
export const metadata: Metadata = {
  title: "E-Verify Portal | Certificate Verification System | Technotran Solutions",
  description: "Verify the authenticity of certificates issued by educational institutions and organizations through the E-Verify Portal. A secure verification system by Technotran Solutions.",
  keywords: "certificate verification, e-verify portal, document authentication, educational certificates, technotran solutions",
  robots: "index, follow",
  openGraph: {
    title: "E-Verify Portal | Certificate Verification System",
    description: "Verify the authenticity of certificates issued by educational institutions and organizations.",
    url: "https://e-verify-portal.com",
    siteName: "E-Verify Portal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Verify Portal | Certificate Verification",
    description: "Verify the authenticity of certificates issued by educational institutions.",
  },
  alternates: {
    canonical: "https://e-verify-portal.com",
  },
};

export default function Home() {
  return (
    <main className={styles.mainContainer} aria-labelledby="main-heading">
      <Navbar />
      <section className={styles.mainBody}>
        <div className={styles.landingSection}>
          <div className={styles.welcomeSection}>
            <h1 id="main-heading" className={styles.heading}>Welcome to the E-Verify Portal</h1>
            <p className={styles.subHeading}>
              A Technotran Solutions Venture
            </p>
            <p className={styles.welcomeText}>
              This platform is dedicated to verifying the authenticity of
              certificates issued by our organization.
            </p>
          </div>

          <div className={styles.formContainer} role="form" aria-label="Certificate verification form">
            <VerifyCertificateComp />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
