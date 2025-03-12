export interface VendorsDataItem {
  id: number;
  imgSrc: string;
  name: string;
}

export interface Vendor {
  name: string;
  imgSrc: string;
}

export interface VendorVerifyCompProps {
  org: string;
  openModal: boolean; // Add the openModal property
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  role: "superadmin" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface VendorUser {
  _id: string;
  username: string;
  email: string;
  org: string;
  orgPic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContextType {
  adminUser: AdminUser | null;
  setAdminUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  logout: () => void;
  login: (user: AdminUser) => void;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>; // Added this
}

export interface VendorContextType {
  vendorUser: VendorUser | null;
  setVendorUser: React.Dispatch<React.SetStateAction<VendorUser | null>>;
  logout: () => void;
  login: (user: VendorUser) => void;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Certificate {
  _id: string;
  name: string;
  type: "AICTE Internship" | "Internship" | "Workshop"; // Restricting to known types
  program: string;
  department: string;
  startDate: string;
  issueDate: string;
  certificateId: string;
  certificateImgSrc?: string;
  rollNo: string;
  email: string;
  org: string;
  aicteId?: string; // Optional AICTE ID (only for AICTE Internship)
}

export interface Vendors {
  _id: string;
  name: string;
  email: string;
  org: string;
  orgPic: string;
}

export interface VendorLoginModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orgData: Vendor | null; // Accept orgData as a prop
}

export interface CertificatesTableProps {
  certificates: Certificate[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: (certificate: Certificate) => void;
  onDeleteClick: (certificate: Certificate) => void; // Added type for delete click
}

export interface VendorCertificatesTableProps {
  certificates: Certificate[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface VendorsTableProps {
  vendors: Vendors[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: (vendor: Vendors) => void;
  onDeleteClick: (vendor: Vendors) => void; // Added type for delete click
}

export interface AdminsTableProps {
  admins: AdminUser[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: (admin: AdminUser) => void;
  onDeleteClick: (admin: AdminUser) => void; // Added type for delete click
}

export interface EditCertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onSave: (updatedCertificate: Certificate) => void;
}

export interface EditVendorModalProps {
  open: boolean;
  onClose: () => void;
  vendor: Vendors | null;
  onSave: (updateVendor: Vendors) => void;
}

export interface EditAdminModalProps {
  open: boolean;
  onClose: () => void;
  admin: AdminUser | null;
  onSave: (updateAdmin: AdminUser) => void;
}

export interface DeleteCertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onDelete: () => void;
}

export interface DeleteVendorModalProps {
  open: boolean;
  onClose: () => void;
  vendor: Vendors | null;
  onDelete: () => void;
}

export interface DeleteAdminModalProps {
  open: boolean;
  onClose: () => void;
  admin: AdminUser | null;
  onDelete: () => void;
}

export interface MultipleEntryFormProps {
  onMessage: (message: string) => void;
}

export interface SingleEntryFormProps {
  onMessage: (message: string) => void;
}

export interface CreateModelProps {
  handleCloseModal: () => void;
}

export interface LoginModalProps {
  authParams: "Vendor" | "Admin";
}

export interface ForgotPasswordModalProps {
  target: "Vendor" | "Admin";
  open: boolean;
  onClose: () => void;
}
