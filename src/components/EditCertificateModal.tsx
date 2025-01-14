"use client";

import React from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { Certificate, EditCertificateModalProps } from "@/utils/types";

const EditCertificateModal: React.FC<EditCertificateModalProps> = ({
  open,
  onClose,
  certificate,
  onSave,
}) => {
  const [localCertificate, setLocalCertificate] =
    React.useState<Certificate | null>(null);

  React.useEffect(() => {
    if (certificate) {
      setLocalCertificate({ ...certificate });
    }
  }, [certificate]);

  const handleSave = () => {
    if (localCertificate) {
      onSave(localCertificate);
    }
    onClose();
  };

  if (!localCertificate) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-certificate-modal-title"
      aria-describedby="edit-certificate-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography
          id="edit-certificate-modal-title"
          variant="h6"
          component="h2"
        >
          Edit Certificate
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={localCertificate.name}
          onChange={(e) =>
            setLocalCertificate({ ...localCertificate, name: e.target.value })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Type"
          value={localCertificate.type}
          onChange={(e) =>
            setLocalCertificate({ ...localCertificate, type: e.target.value })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Issue Date"
          type="date"
          value={
            new Date(localCertificate.issueDate).toISOString().split("T")[0]
          }
          onChange={(e) =>
            setLocalCertificate({
              ...localCertificate,
              issueDate: new Date(e.target.value).toISOString(),
            })
          }
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditCertificateModal;
