import React from "react";
import styles from "../styles/AdminsTable.module.css";
import { AdminsTableProps } from "@/utils/types";
import { TablePagination } from "@mui/material";
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
          {displayedAdmins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              {adminUser?.role === "superadmin" && (
                <>
                  <td>
                    <EditOutlinedIcon
                      onClick={() => onEditClick(admin)}
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    />
                  </td>
                  <td>
                    <DeleteOutlineIcon
                      onClick={() => onDeleteClick(admin)} // Trigger delete modal
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        component="div"
        count={admins.length}
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

export default AdminsTable;
