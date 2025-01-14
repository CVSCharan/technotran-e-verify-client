import Link from "next/link";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { TablePagination } from "@mui/material";
import styles from "../styles/CertificatesTable.module.css";
import { CertificatesTableProps } from "@/utils/types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const CertificatesTable: React.FC<CertificatesTableProps> = ({
  certificates,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  onDeleteClick, // New prop to handle delete action
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
            <th>Issue Date</th>
            <th>Edit</th>
            <th>Delete</th>
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
              <td>{new Date(certificate.issueDate).toLocaleDateString()}</td>
              <td>
                <EditOutlinedIcon
                  onClick={() => onEditClick(certificate)}
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                />
              </td>
              <td>
                <DeleteOutlineIcon
                  onClick={() => onDeleteClick(certificate)} // Trigger delete modal
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                />
              </td>
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

export default CertificatesTable;
