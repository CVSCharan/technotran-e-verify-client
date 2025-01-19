"use client";
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const { showModal, setShowModal } = useAdmin();
  const router = useRouter();

  const handleClose = () => {
    setShowModal(false); // Close the modal
  };

  const handleGoToLogin = () => {
    setShowModal(false); // Close modal on redirection
    router.push("/admin-login"); // Redirect to login page
  };

  return (
    <Modal open={true}>
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
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Authentication Required
        </Typography>
        <Typography sx={{ mt: 2 }}>
          You need to log in to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, width: "100%" }}
          onClick={handleGoToLogin}
        >
          Go to Login
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginModal;
