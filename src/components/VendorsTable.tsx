import React from "react";
import styles from "../styles/VendorsTable.module.css";
import { VendorsTableProps } from "@/utils/types";
import { TablePagination, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAdmin } from "@/context/AdminContext";

const VendorsTable: React.FC<VendorsTableProps> = ({
  vendors,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  onDeleteClick,
}) => {
  const { adminUser } = useAdmin();

  const displayedVendors = vendors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              {adminUser?.role === "superadmin" && (
                <>
                  <th>Edit</th>
                  <th>Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayedVendors.length > 0 ? (
              displayedVendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.org}</td>
                  {adminUser?.role === "superadmin" && (
                    <>
                      <td>
                        <Tooltip title="Edit Vendor">
                          <div
                            className={`${styles.actionIcon} ${styles.editIcon}`}
                          >
                            <EditOutlinedIcon
                              onClick={() => onEditClick(vendor)}
                              fontSize="small"
                            />
                          </div>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title="Delete Vendor">
                          <div
                            className={`${styles.actionIcon} ${styles.deleteIcon}`}
                          >
                            <DeleteOutlineIcon
                              onClick={() => onDeleteClick(vendor)}
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
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={vendors.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage="Vendors per page:"
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

export default VendorsTable;
