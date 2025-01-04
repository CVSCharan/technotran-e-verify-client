"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, Space } from "antd";
import QRCode from "antd/es/qrcode"; // Ant Design QR Code

const { Title, Text } = Typography;

type Certificate = {
  _id: string;
  name: string;
  type: string;
  issueDate: string;
  certificateId: string;
  rollNo: string;
};

const CertificateDetails = () => {
  const params = useParams();
  const id = params.id;

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCertificate = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certificates/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch certificate details");
        }
        const data: Certificate = await response.json();
        setCertificate(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <Text>Loading certificate details...</Text>;
  if (error) return <Text type="danger">Error: {error}</Text>;
  if (!certificate) return <Text>No certificate found</Text>;

  const currentUrl = `${process.env.NEXT_PUBLIC_API_URL}/certificate/${id}`;

  return (
    <Space direction="vertical" size="large" style={{ padding: "20px" }}>
      <Title level={3}>Certificate Details</Title>
      <Text>
        <strong>Name:</strong> {certificate.name}
      </Text>
      <Text>
        <strong>Type:</strong> {certificate.type}
      </Text>
      <Text>
        <strong>Issue Date:</strong>{" "}
        {new Date(certificate.issueDate).toLocaleDateString()}
      </Text>
      <Text>
        <strong>Certificate ID:</strong> {certificate.certificateId}
      </Text>
      <Text>
        <strong>Roll No:</strong> {certificate.rollNo}
      </Text>

      {/* QR Code Section */}
      <Space direction="vertical" size="small" align="center">
        <Title level={4}>Scan QR Code</Title>
        <QRCode value={currentUrl} size={200} />
        <Text>Scan this QR code to view this page on your device.</Text>
      </Space>
    </Space>
  );
};

export default CertificateDetails;
