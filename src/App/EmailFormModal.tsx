import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from "@mui/material";

// ...existing interfaces...

interface EmailFormData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  message: string;
  isTest: boolean;
}

interface EmailFormModalProps {
  open: boolean;
  onClose: () => void;
  getEmailDesign: () => { html: string; json: any } | null;
  apiUrl: string;
}

const EmailFormModal: React.FC<EmailFormModalProps> = ({
  open,
  onClose,
  getEmailDesign,
  apiUrl,
}) => {
  const [formData, setFormData] = useState<EmailFormData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    message: "",
    isTest: false,
  });
  const [csvEmails, setCsvEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) setError(null);
  };

  // CSV upload handler
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Split by newlines and commas, filter valid emails
      const parsed = text
        .split(/[\n,]+/)
        .map((email) => email.trim())
        .filter((email) => /\S+@\S+\.\S+/.test(email));
      setCsvEmails(parsed);
      // Optionally, update the "to" field for user visibility
      setFormData((prev) => ({
        ...prev,
        to: parsed.join(","),
      }));
    };
    reader.readAsText(file);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmails = (emails: string): boolean => {
    if (!emails.trim()) return false;
    const emailList = emails.split(",").map((email) => email.trim());
    return emailList.every((email) => validateEmail(email));
  };

  const handleSubmit = async () => {
    // Validate emails
    if (!validateEmails(formData.to)) {
      setError("Please enter valid email address(es)");
      return;
    }
    if (formData.cc && !validateEmails(formData.cc)) {
      setError("Please enter valid CC email address(es)");
      return;
    }
    if (formData.bcc && !validateEmails(formData.bcc)) {
      setError("Please enter valid BCC email address(es)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const emailDesign = getEmailDesign();
      if (!emailDesign) {
        throw new Error("Could not retrieve email design");
      }

      // Use CSV emails if available, otherwise use the "to" field
      const toList =
        csvEmails.length > 0
          ? csvEmails
          : formData.to.split(",").map((email) => email.trim());

      const payload = {
        recipients: {
          to: toList,
          cc: formData.cc
            ? formData.cc.split(",").map((email) => email.trim())
            : [],
          bcc: formData.bcc
            ? formData.bcc.split(",").map((email) => email.trim())
            : [],
        },
        subject: formData.subject,
        message: formData.message,
        isTest: formData.isTest,
        template: {
          html: emailDesign.html,
          json: emailDesign.json,
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email");
      }

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setFormData({
          to: "",
          cc: "",
          bcc: "",
          subject: "",
          message: "",
          isTest: false,
        });
        setCsvEmails([]);
        onClose();
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    (csvEmails.length > 0 || formData.to.trim() !== "") &&
    formData.subject.trim() !== "";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Send Email</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Email sent successfully!
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Upload CSV of recipients
          </Typography>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ marginBottom: 8 }}
          />
          {csvEmails.length > 0 && (
            <Alert severity="info" sx={{ mt: 1 }}>
              {csvEmails.length} emails loaded from CSV.
            </Alert>
          )}
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="To"
          name="to"
          value={formData.to}
          onChange={handleChange}
          placeholder="email@example.com"
          required={csvEmails.length === 0}
          helperText="Separate multiple emails with commas or upload a CSV"
        />
        <TextField
          fullWidth
          margin="normal"
          label="CC"
          name="cc"
          value={formData.cc}
          onChange={handleChange}
          placeholder="email@example.com"
        />
        <TextField
          fullWidth
          margin="normal"
          label="BCC"
          name="bcc"
          value={formData.bcc}
          onChange={handleChange}
          placeholder="email@example.com"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          multiline
          rows={4}
          placeholder="Additional message to include with your email template"
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.isTest}
              onChange={handleChange}
              name="isTest"
              color="primary"
            />
          }
          label="Send as test email"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!isValid || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailFormModal;
