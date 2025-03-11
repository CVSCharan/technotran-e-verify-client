import React, { useState, useRef } from 'react';
import styles from '../styles/DownloadForms.module.css';
import * as XLSX from 'xlsx';

interface MultipleDownloadFormProps {
  setMessage: (message: string) => void;
}

const MultipleDownloadForm: React.FC<MultipleDownloadFormProps> = ({ setMessage }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check if file is Excel
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setMessage('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please upload an Excel file with certificate IDs');
      return;
    }
    
    setLoading(true);
    
    try {
      // Read the Excel file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Extract certificate IDs (assuming they're in the first column)
          const certificateIds = jsonData
            .map((row: any) => row[0])
            .filter((id: any) => id && typeof id === 'string' || typeof id === 'number')
            .slice(0, 50); // Take only the first 50 IDs
          
          if (certificateIds.length === 0) {
            throw new Error('No valid certificate IDs found in the Excel file');
          }
          
          // Send the certificate IDs to the server
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates/download-batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              certificateIds
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to download certificates');
          }
          
          // Download the ZIP file
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `certificates-batch.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          setMessage(`Successfully downloaded ${certificateIds.length} certificates!`);
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Excel processing error:', error);
          setMessage(error instanceof Error ? error.message : 'Failed to process Excel file');
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setMessage('Error reading the file');
        setLoading(false);
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Download error:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to download certificates');
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="excelFile" className={styles.label}>Upload Excel File with Certificate IDs</label>
        <div className={styles.fileInput}>
          <label htmlFor="excelFile" className={styles.fileInputLabel}>
            <input
              type="file"
              id="excelFile"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls"
              style={{ display: 'none' }}
              disabled={loading}
            />
            <span className={styles.fileInputText}>
              {file ? 'Change File' : 'Click to upload Excel file (.xlsx, .xls)'}
            </span>
            {file && <span className={styles.fileName}>{file.name}</span>}
          </label>
        </div>
        <p className={styles.helperText}>
          The Excel file should contain certificate IDs in the first column. Only the first 50 IDs will be processed.
        </p>
      </div>
      
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading || !file}
      >
        {loading ? 'Downloading...' : 'Download Certificates'}
      </button>
    </form>
  );
};

export default MultipleDownloadForm;