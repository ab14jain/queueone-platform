import { useState } from "react";
import DoctorEnrollment from "../components/DoctorEnrollment";
import QueueControlRoom from "../components/QueueControlRoom";
import ReportingDashboard from "../components/ReportingDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";

type Tab = "control" | "enroll" | "reporting";

interface TabPanelProps {
  children?: React.ReactNode;
  index: Tab;
  value: Tab;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
}));

const UserChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  fontWeight: 600,
}));

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("control");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getRoleColor = (role: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "STAFF":
        return "warning";
      case "DOCTOR":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* App Bar */}
        <StyledAppBar position="sticky">
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Box sx={{ fontSize: "1.5rem", mr: 2 }}>🏥</Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  QueueOne
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Healthcare Queue Management
                </Typography>
              </Box>
            </Box>

            {/* User Info */}
            {user && (
              <Stack direction="row" spacing={1} alignItems="center">
                <UserChip
                  icon={<AccountCircleIcon />}
                  label={user.name}
                  color="primary"
                  variant="outlined"
                  sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.5)" }}
                />
                <Chip
                  label={user.role}
                  size="small"
                  color={getRoleColor(user.role)}
                  variant="filled"
                  sx={{ fontWeight: 600, color: "white" }}
                />
                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    ml: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Logout
                </Button>
              </Stack>
            )}
          </Toolbar>
        </StyledAppBar>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Section */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "#f9fafb" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, {user?.name}! Manage your queue operations efficiently.
              </Typography>
            </Paper>

            {/* Tabs */}
            <Paper elevation={1} sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                  },
                }}
              >
                <Tab
                  icon={<DashboardIcon />}
                  iconPosition="start"
                  label="Queue Control"
                  value="control"
                  id="tab-control"
                />
                {(user?.role === "STAFF" || user?.role === "ADMIN") && (
                  <Tab
                    icon={<PersonAddIcon />}
                    iconPosition="start"
                    label="Enroll Doctor"
                    value="enroll"
                    id="tab-enroll"
                  />
                )}
                <Tab
                  icon={<AssessmentIcon />}
                  iconPosition="start"
                  label="Reports & Analytics"
                  value="reporting"
                  id="tab-reporting"
                />
              </Tabs>
            </Paper>

            {/* Tab Panels */}
            <Box>
              <TabPanel value={activeTab} index="control">
                <QueueControlRoom />
              </TabPanel>

              {(user?.role === "STAFF" || user?.role === "ADMIN") && (
                <TabPanel value={activeTab} index="enroll">
                  <DoctorEnrollment />
                </TabPanel>
              )}

              <TabPanel value={activeTab} index="reporting">
                <ReportingDashboard />
              </TabPanel>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 2,
            px: 2,
            backgroundColor: "#f9fafb",
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2026 QueueOne Platform. All rights reserved. | Healthcare Queue Management System v1.0
          </Typography>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
