import Link from "next/link";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { TablePagination, Tooltip } from "@mui/material";
import styles from "../styles/CertificatesTable.module.css";
import { CertificatesTableProps } from "@/utils/types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAdmin } from "@/context/AdminContext";

const CertificatesTable: React.FC<CertificatesTableProps> = ({
  certificates,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  onDeleteClick,
}) => {
  const { adminUser } = useAdmin();

  const displayedCertificates = certificates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className={styles.tableContainer} role="region" aria-label="Certificates list">
        <table className={styles.table} aria-describedby="certificates-table-description">
          <caption id="certificates-table-description" className={styles.visuallyHidden}>
            List of certificates with their name, type, and issue date
          </caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Issue Date</th>
              {adminUser?.role === "superadmin" && (
                <>
                  <th scope="col">Edit</th>
                  <th scope="col">Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayedCertificates.length > 0 ? (
              displayedCertificates.map((certificate) => (
                <tr key={certificate._id}>
                  <td>
                    <Link
                      href={`/certificate/${certificate.certificateId}`}
                      className={styles.link}
                      aria-label={`View certificate for ${certificate.name}`}
                    >
                      {certificate.name}
                    </Link>
                  </td>
                  <td>{certificate.type}</td>
                  <td>{formatDate(certificate.issueDate)}</td>
                  {adminUser?.role === "superadmin" && (
                    <>
                      <td>
                        <Tooltip title="Edit Certificate">
                          <button
                            className={`${styles.actionIcon} ${styles.editIcon}`}
                            onClick={() => onEditClick(certificate)}
                            aria-label={`Edit certificate for ${certificate.name}`}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </button>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title="Delete Certificate">
                          <button
                            className={`${styles.actionIcon} ${styles.deleteIcon}`}
                            onClick={() => onDeleteClick(certificate)}
                            aria-label={`Delete certificate for ${certificate.name}`}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </button>
                        </Tooltip>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={adminUser?.role === "superadmin" ? 5 : 3}
                  className={styles.emptyMessage}
                >
                  No certificates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={certificates.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 7, 10]}
        labelRowsPerPage="Certificates per page:"
        getItemAriaLabel={(type) => `Go to ${type} page of certificates`}
        sx={{
          "& .MuiTablePagination-toolbar": {
            fontFamily: `"Quicksand", sans-serif`,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows":
            {
              fontFamily: `"Quicksand", sans-serif`,
            },
          "& .MuiTablePagination-actions": {
            color: "#4b0406",
          },
        }}
      />
    </>
  );
};

export default CertificatesTable;
