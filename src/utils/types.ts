export interface Certificate {
  certificateId: string;
  vendorName: string;
  vendorAddress: string;
  vendorGSTIN: string;
  vendorEmail: string;
  vendorPhone: string;
}

export interface EditCertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate;
  onSave: (certificate: Certificate) => void;
}
