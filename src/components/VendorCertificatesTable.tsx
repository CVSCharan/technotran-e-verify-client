import { VendorCertificatesTableProps } from "@/utils/types";
import Link from "next/link";
import React from "react";
import { TablePagination } from "@mui/material";
import styles from "../styles/CertificatesTable.module.css";

const VendorCertificatesTable: React.FC<VendorCertificatesTableProps> = ({
  certificates,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const displayedCertificates = certificates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Department</th>
            <th>Issue Date</th>
          </tr>
        </thead>
        <tbody>
          {displayedCertificates.map((certificate) => (
            <tr key={certificate._id}>
              <td>
                <Link
                  href={`/certificate/${certificate.certificateId}`}
                  className={styles.link}
                >
                  {certificate.name}
                </Link>
              </td>
              <td>{certificate.type}</td>
              <td>{certificate.department}</td>
              <td>{new Date(certificate.issueDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        component="div"
        count={certificates.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 7]}
        sx={{
          "& .MuiTablePagination-toolbar": {
            fontFamily: `"Quicksand", sans-serif`,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows":
            {
              fontFamily: `"Quicksand", sans-serif`,
            },
        }}
      />
    </>
  );
};

export default VendorCertificatesTable;
