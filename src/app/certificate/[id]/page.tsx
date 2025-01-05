"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Typography, Space, Button } from "antd";
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

  // Ref to the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch certificate data
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

  // Create the certificate image with text overlay after certificate is fetched
  useEffect(() => {
    if (certificate && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.src = "/Images/certificate-img.jpeg"; // Replace with your certificate image URL

        // Debugging: Check if the image is loading
        img.onload = () => {
          console.log("Image loaded successfully!");
          // Draw the certificate image onto the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Set font style and size for the name
          ctx.font = "bold 30px 'Arial', 'Roboto', sans-serif"; // Larger font size for the name
          ctx.fillStyle = "black";
          ctx.textBaseline = "top";

          // Overlay the name on the image
          ctx.fillText(`${certificate.name}`, 50, 320);

          ctx.font = "bold 50px 'Arial', 'Roboto', sans-serif"; 
          ctx.fillText(`${certificate.type}`, 70, 150);

          // Set font style and size for other details
          ctx.font = "bold 18px 'Arial', 'Roboto', sans-serif"; // Smaller font size for other details

          // Overlay other details on the image
          ctx.fillText(`${certificate.certificateId}`, 150, 510);
          ctx.fillText(`${certificate.rollNo}`, 85, 535);
        };

        img.onerror = (err) => {
          console.error("Image loading error: ", err);
          setError("Failed to load certificate image.");
        };
      }
    }
  }, [certificate]);

  // Function to download the certificate image with text overlay
  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `certificate-${id}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  if (loading) return <Text>Loading certificate details...</Text>;
  if (error) return <Text type="danger">Error: {error}</Text>;
  if (!certificate) return <Text>No certificate found</Text>;

  const currentUrl = `https://technotran-e-verify-client.vercel.app/certificate/${id}`;

  return (
    <Space direction="vertical" size="large" style={{ padding: "20px" }}>
      <Title level={3}>Certificate Details</Title>

      {/* Certificate Image Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600} // Adjust the width and height as per your image dimensions
        style={{
          border: "1px solid #ddd",
          marginBottom: "20px",
          display: "block",
        }}
      ></canvas>

      {/* Download Button */}
      <Button type="primary" onClick={downloadImage}>
        Download Certificate with Details
      </Button>

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
