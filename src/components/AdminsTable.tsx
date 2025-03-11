import React from "react";
import styles from "../styles/AdminsTable.module.css";
import { AdminsTableProps } from "@/utils/types";
import { TablePagination, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAdmin } from "@/context/AdminContext";
import Head from "next/head";

const AdminsTable: React.FC<AdminsTableProps> = ({
  admins,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  onDeleteClick,
}) => {
  const { adminUser } = useAdmin();

  const displayedAdmins = admins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Table",
    about: "Administrators in the E-Verify Portal system",
    name: "Administrators Table",
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className={styles.tableContainer}>
        <table
          className={styles.table}
          aria-describedby="admin-table-description"
        >
          <caption
            id="admin-table-description"
            className={styles.visuallyHidden}
          >
            List of administrators with their username, email, and role
          </caption>
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              {adminUser?.role === "superadmin" && (
                <>
                  <th scope="col">Edit</th>
                  <th scope="col">Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayedAdmins.length > 0 ? (
              displayedAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>
                    {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                  </td>
                  {adminUser?.role === "superadmin" && (
                    <>
                      <td>
                        <Tooltip title="Edit Admin">
                          <div
                            className={`${styles.actionIcon} ${styles.editIcon}`}
                          >
                            <EditOutlinedIcon
                              onClick={() => onEditClick(admin)}
                              fontSize="small"
                            />
                          </div>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title="Delete Admin">
                          <div
                            className={`${styles.actionIcon} ${styles.deleteIcon}`}
                          >
                            <DeleteOutlineIcon
                              onClick={() => onDeleteClick(admin)}
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
                  No administrators found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={admins.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 7, 10]}
        labelRowsPerPage="Administrators per page:"
        getItemAriaLabel={(type) => `Go to ${type} page of administrators`}
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

export default AdminsTable;
