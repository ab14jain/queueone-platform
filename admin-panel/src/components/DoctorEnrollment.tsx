import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { Check as CheckIcon, FileDownload as DownloadIcon } from "@mui/icons-material";
import { enrollDoctor, EnrollmentResponse, getQrImage } from "../services/enrollment";

export default function DoctorEnrollment() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnrollmentResponse | null>(null);

  const [formData, setFormData] = useState({
    doctorName: "",
    doctorEmail: "",
    doctorMobile: "",
    locationName: "",
    locationAddress: "",
    locationType: "Hospital",
    queueName: "",
    tokenPrefix: "A",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await enrollDoctor({
        doctorName: formData.doctorName.trim(),
        doctorEmail: formData.doctorEmail.trim() || undefined,
        doctorMobile: formData.doctorMobile.trim() || undefined,
        locationName: formData.locationName.trim(),
        locationAddress: formData.locationAddress.trim(),
        locationType: formData.locationType.trim(),
        queueName: formData.queueName.trim(),
        tokenPrefix: formData.tokenPrefix.trim(),
      });
      setResult(response);
      setStep("result");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setResult(null);
    setFormData({
      doctorName: "",
      doctorEmail: "",
      doctorMobile: "",
      locationName: "",
      locationAddress: "",
      locationType: "Hospital",
      queueName: "",
      tokenPrefix: "A",
    });
  };

  if (step === "result" && result) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ mb: 3, borderTop: "5px solid", borderTopColor: "success.main", boxShadow: 2 }}>
          <CardHeader
            avatar={<CheckIcon sx={{ fontSize: 32, color: "success.main" }} />}
            title="Enrollment Successful"
            subheader="New queue created successfully"
            titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "primary.50", borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                    Doctor
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {formData.doctorName}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "primary.50", borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                    Location
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {formData.locationName}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "primary.50", borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                    Queue Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {formData.queueName}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "primary.50", borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                    Public ID
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mt: 0.5, fontFamily: "monospace", wordBreak: "break-all" }}
                  >
                    {result.publicId}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardHeader title="Queue QR Code" titleTypographyProps={{ variant: "h6" }} />
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Box sx={{ display: "inline-block", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <img
                src={getQrImage(result.queueId)}
                alt="Queue QR Code"
                style={{ width: 250, height: 250, borderRadius: 8 }}
              />
            </Box>
            <Typography variant="caption" sx={{ display: "block", mt: 2, color: "textSecondary" }}>
              Scan this QR code to join the queue
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardHeader title="Queue Details" titleTypographyProps={{ variant: "h6" }} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  Queue ID
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", fontWeight: 500, wordBreak: "break-all", mt: 0.5 }}
                >
                  {result.queueId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  Location Type
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {formData.locationType}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Address
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {formData.locationAddress || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            href={getQrImage(result.queueId)}
            download
            fullWidth
          >
            Download QR Code
          </Button>
          <Button variant="outlined" color="primary" onClick={handleReset} fullWidth>
            Add Another Queue
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 2 }}>
        <CardHeader
          title="Doctor Queue Enrollment"
          subheader="Register a new doctor queue"
          titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                  Doctor Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Doctor Name"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="doctorEmail"
                  type="email"
                  value={formData.doctorEmail}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="doctorMobile"
                  value={formData.doctorMobile}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 2, color: "primary.main", mt: 2 }}
                >
                  Location Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location Name"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Location Type</InputLabel>
                  <Select
                    name="locationType"
                    value={formData.locationType}
                    onChange={handleSelectChange}
                    label="Location Type"
                  >
                    <MenuItem value="Hospital">Hospital</MenuItem>
                    <MenuItem value="Clinic">Clinic</MenuItem>
                    <MenuItem value="Diagnostic Center">Diagnostic Center</MenuItem>
                    <MenuItem value="Lab">Lab</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location Address"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 2, color: "primary.main", mt: 2 }}
                >
                  Queue Settings
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Queue Name"
                  name="queueName"
                  value={formData.queueName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Token Prefix"
                  name="tokenPrefix"
                  value={formData.tokenPrefix}
                  onChange={handleChange}
                  inputProps={{ maxLength: 1 }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ flex: 1 }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : "Create Queue"}
                  </Button>
                  <Button variant="outlined" color="secondary" size="large" sx={{ flex: 1 }}>
                    Clear Form
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
