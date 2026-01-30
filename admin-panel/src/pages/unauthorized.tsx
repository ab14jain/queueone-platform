import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  Container,
  Button,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

const CenteredContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.warning.light} 100%)`,
  padding: theme.spacing(2),
}));

const ErrorAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.error.main,
  fontSize: '2.5rem',
}));

const Unauthorized: React.FC = () => {
  const router = useRouter();

  return (
    <CenteredContainer>
      <Container maxWidth="sm">
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <ErrorAvatar>
            <ErrorIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
          </ErrorAvatar>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Access Denied
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You don't have permission to access this resource. Your role or access level may not allow this action.
          </Typography>

          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              size="large"
            >
              Go Back
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={() => router.push('/dashboard')}
              size="large"
            >
              Go to Dashboard
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            If you believe this is an error, please contact your administrator.
          </Typography>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default Unauthorized;
