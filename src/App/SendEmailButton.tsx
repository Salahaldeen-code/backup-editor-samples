import React, { useState } from "react";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmailFormModal from "./EmailFormModal";

interface SendEmailButtonProps {
  getEmailDesign: () => { html: string; json: any } | null;
}

const SendEmailButton: React.FC<SendEmailButtonProps> = ({
  getEmailDesign,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        onClick={handleOpen}
        size="small"
      >
        Send
      </Button>
      <EmailFormModal
        open={open}
        onClose={handleClose}
        getEmailDesign={getEmailDesign}
        apiUrl="http://localhost:3001/api/send-email"
      />
    </>
  );
};

export default SendEmailButton;
