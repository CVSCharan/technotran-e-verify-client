import React from "react";
import styles from "../styles/AdminsTable.module.css";
import { AdminsTableProps } from "@/utils/types";
import { TablePagination, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAdmin } from "@/context/AdminContext";

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

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              {adminUser?.role === "superadmin" && (
                <>
                  <th>Edit</th>
                  <th>Delete</th>
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
                  No admins found
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
