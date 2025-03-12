export interface Certificate {
  certificateId: string;
  name: string;
  type: "AICTE Internship" | "Internship" | "Workshop";
  program: string;
  department: string;
  startDate: string;
  issueDate: string;
  certificateImgSrc: string;
  rollNo: string;
  email: string;
  org: string;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditCertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate;
  onSave: (certificate: Certificate) => void;
}
