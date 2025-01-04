"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Certificate = {
  _id: string;
  name: string;
  type: string;
  issueDate: string;
  certificateId: string;
  rollNo: string;
};

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch("http://localhost:3008/api/certificates");
        if (!response.ok) {
          throw new Error("Failed to fetch certificates");
        }
        const data: Certificate[] = await response.json();
        setCertificates(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return <p>Loading certificates...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Certificates</h1>
      {certificates.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        <table
          border={1}
          cellPadding="8"
          style={{ margin: "20px auto", width: "80%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Issue Date</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr key={certificate._id}>
                <td>{certificate.name}</td>
                <td>{certificate.type}</td>
                <td>{new Date(certificate.issueDate).toLocaleDateString()}</td>
                <td>
                  <Link href={`/certificate/${certificate._id}`}>Link</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CertificatesPage;
