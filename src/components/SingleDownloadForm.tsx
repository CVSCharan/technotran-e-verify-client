import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/DownloadForms.module.css';
import { Certificate } from '@/utils/types';
import { vendorsData } from '@/utils/helper';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

interface SingleDownloadFormProps {
  setMessage: (message: string) => void;
}

export const SingleDownloadForm: React.FC<SingleDownloadFormProps> = ({ setMessage }) => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Function to format date as dd/mm/yy
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };

  // Effect to render certificate when data is available
  useEffect(() => {
    if (certificate && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        let imgSrc =
          "https://github.com/CVSCharan/Technotran_Assets/blob/main/Internship_Cert.png?raw=true"; // Default to Internship

        if (certificate.type === "Workshop") {
          imgSrc =
            "https://res.cloudinary.com/dcooiidus/image/upload/v1740660460/default_blank_workshop_cert_sgu2ad.jpg"; // Use Workshop Template
        }

        if (certificate.certificateImgSrc !== "") {
          imgSrc = certificate.certificateImgSrc ?? imgSrc;
        }

        const img = new window.Image();
        img.crossOrigin = "anonymous"; // Ensure CORS support
        img.src = imgSrc;

        img.onload = async () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          await document.fonts.ready;

          // Embed Vendor Logo
          const vendor = vendorsData.find((v) => v.name === certificate.org);
          if (vendor) {
            const vendorLogo = new window.Image();
            vendorLogo.crossOrigin = "anonymous";
            vendorLogo.src = vendor.imgSrc;
            vendorLogo.onload = () => {
              ctx.drawImage(vendorLogo, 110, 60, 70, 70);
              
              // Continue with the rest of the rendering
              renderCertificateText(ctx, canvas, certificate);
              
              // Set canvas as ready after all rendering is complete
              setCanvasReady(true);
            };
          } else {
            // If no vendor logo, continue with text rendering
            renderCertificateText(ctx, canvas, certificate);
            setCanvasReady(true);
          }
        };
      }
    }
  }, [certificate]);
  
  // Function to render certificate text
  const renderCertificateText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, certificate: Certificate) => {
    // Text Styles
    ctx.font = `16px "ArialCustom", Arial, sans-serif`;
    ctx.fillStyle = "black";

    // Display Student Details
    ctx.fillText(certificate.name, 400, 200);

    ctx.font = `22px "ArialCustom", Arial, sans-serif`;
    ctx.fillStyle = "#4b0406";

    // Calculate dynamic X position
    const programTextWidth = ctx.measureText(certificate.program).width;
    const centerXPrgm = (canvas.width - programTextWidth) / 2;

    // Draw centered text
    ctx.fillText(certificate.program, centerXPrgm, 265);

    ctx.font = `16px "ArialCustom", Arial, sans-serif`;
    ctx.fillStyle = "#4b0406";

    // Calculate dynamic X position
    const departmentTextWidth = ctx.measureText(
      certificate.department
    ).width;
    const centerXDept = (canvas.width - departmentTextWidth) / 2;

    const orgTextWidth = ctx.measureText(certificate.org).width;
    const centerXOrg = (canvas.width - orgTextWidth) / 2;

    ctx.fillText(certificate.department, centerXDept, 320);
    ctx.fillText(certificate.org, centerXOrg, 370);

    ctx.font = `16px "ArialCustom", Arial, sans-serif`;
    ctx.fillStyle = "black";

    // Format Dates (dd/mm/yy)
    const formattedStartDate = formatDate(certificate.startDate);
    const formattedIssueDate = formatDate(certificate.issueDate);

    ctx.fillText(formattedStartDate, 325, 395);
    ctx.fillText(formattedIssueDate, 495, 395);

    ctx.font = `11px "ArialCustom", Arial, sans-serif`;
    ctx.fillStyle = "#4b0406";

    ctx.fillText(certificate.certificateId, 723, 315);

    // Generate QR Code
    QRCode.toCanvas(
      qrCanvasRef.current,
      `https://e-verify.technotran.in/certificate/${certificate.certificateId}`,
      {
        width: 100,
        margin: 0,
      },
      (error) => {
        if (!error && qrCanvasRef.current) {
          const qrImg = qrCanvasRef.current;
          ctx.drawImage(
            qrImg,
            canvas.width - 133,
            canvas.height - 140,
            80,
            80
          ); // Adjust QR position
        }
      }
    );
  };

  // Effect to trigger download when canvas is ready
  useEffect(() => {
    if (canvasReady && certificate) {
      // Add a small delay to ensure canvas is fully rendered
      const timer = setTimeout(() => {
        downloadCertificatePDF();
        setMessage('Certificate downloaded successfully!');
        // Reset states after download
        setCertificate(null);
        setCanvasReady(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [canvasReady, certificate]);

  const downloadCertificatePDF = () => {
    if (canvasRef.current && certificate) {
      const canvas = canvasRef.current;

      // Increase resolution for better quality
      const scale = 2; // Adjust scale for better resolution
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
      const ctx = tempCanvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to get 2D context");
        return;
      }

      ctx.scale(scale, scale);
      ctx.drawImage(canvas, 0, 0);

      // Create a high-resolution PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // Convert scaled canvas to image
      const imgData = tempCanvas.toDataURL("image/png");

      // Add high-res image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Save the PDF
      pdf.save(`${certificate.name}_certificate.pdf`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      setMessage('Please enter a certificate ID');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Fetch certificate data
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/certificates/id/${certificateId}`);
      
      if (response.status === 404) {
        throw new Error('Certificate not found');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch certificate details');
      }
      
      // Get certificate data and set it to state
      const data = await response.json();
      setCertificate(data);
      setMessage('Generating certificate...');
      
    } catch (error) {
      console.error('Download error:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to find certificate');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          type="text"
          id="certificateId"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          className={styles.input}
          placeholder="Enter certificate ID"
          disabled={loading}
        />
      </div>
      
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Download Certificate'}
      </button>
      
      {/* Hidden canvases for certificate generation */}
      <div style={{ display: 'none' }}>
        <canvas
          ref={canvasRef}
          width={850}
          height={550}
        ></canvas>
        <canvas
          ref={qrCanvasRef}
          width={100}
          height={100}
        ></canvas>
      </div>
    </form>
  );
};
