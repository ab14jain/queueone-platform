import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Stack,
  Avatar,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

type UserType = 'doctor' | 'staff';

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  maxWidth: 500,
  width: '100%',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  color: 'white',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  fontSize: '2.5rem',
}));

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [userType, setUserType] = useState<UserType>('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUserTypeChange = (event: React.MouseEvent<HTMLElement>, newUserType: UserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const success = await login(email, password, userType);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <StyledCard>
          <HeaderSection>
            <StyledAvatar>
              <LocalHospitalIcon sx={{ fontSize: '2.5rem' }} />
            </StyledAvatar>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              QueueOne
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Healthcare Queue Management System
            </Typography>
          </HeaderSection>

          <Box sx={{ p: 4 }}>
            {/* User Type Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                Login As
              </Typography>
              <ToggleButtonGroup
                value={userType}
                exclusive
                onChange={handleUserTypeChange}
                fullWidth
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  },
                }}
              >
                <ToggleButton value="staff" aria-label="staff">
                  <GroupIcon sx={{ mr: 1 }} />
                  Staff
                </ToggleButton>
                <ToggleButton value="doctor" aria-label="doctor">
                  <PersonIcon sx={{ mr: 1 }} />
                  Doctor
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} color="inherit" />
                      <span>Signing in...</span>
                    </Stack>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Stack>
            </form>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            {/* Footer */}
            <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
                🔒 Secure Healthcare Management
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                Need help? Contact your administrator
              </Typography>
            </Paper>
          </Box>
        </StyledCard>

        {/* Public Access Link */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
            Looking for patient services?
          </Typography>
          <MuiLink
            href="/"
            sx={{
              color: '#fca5a5',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Go to Public Portal →
          </MuiLink>
        </Box>
      </Container>
    </GradientBackground>
  );
};

export default Login;
