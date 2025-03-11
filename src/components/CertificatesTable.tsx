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
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Issue Date</th>
              {adminUser?.role === "superadmin" && (
                <>
                  <th>Edit</th>
                  <th>Delete</th>
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
                          <div
                            className={`${styles.actionIcon} ${styles.editIcon}`}
                          >
                            <EditOutlinedIcon
                              onClick={() => onEditClick(certificate)}
                              fontSize="small"
                            />
                          </div>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title="Delete Certificate">
                          <div
                            className={`${styles.actionIcon} ${styles.deleteIcon}`}
                          >
                            <DeleteOutlineIcon
                              onClick={() => onDeleteClick(certificate)}
                              fontSize="small"
                            />
                          </div>
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
