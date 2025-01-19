import React from "react";
import styles from "../styles/VendorsTable.module.css";
import { VendorsTableProps } from "@/utils/types";
import { TablePagination } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const VendorsTable: React.FC<VendorsTableProps> = ({
  vendors,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id}>
              <td>{vendor.name}</td>
              <td>{vendor.email}</td>
              <td>{vendor.org}</td>
              <td>
                <EditOutlinedIcon
                  onClick={() => onEditClick(vendor)}
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                />
              </td>
              <td>
                <DeleteOutlineIcon
                  onClick={() => onDeleteClick(vendor)} // Trigger delete modal
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        component="div"
        count={vendors.length}
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

export default VendorsTable;
