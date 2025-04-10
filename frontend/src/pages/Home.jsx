// src/pages/Home.jsx
import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            background: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
              color: 'primary.main',
            }}
          >
            <StarIcon sx={{ fontSize: 40, animation: 'pulse 2s infinite' }} />
            <Typography variant="h4" fontWeight="bold" ml={1}>
              Smart Invoice Maker
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Create sleek, professional invoices in seconds — no hassle, no clutter.
          </Typography>
          <Button
            component={Link}
            to="/clients"
            variant="contained"
            size="large"
            sx={{
              textTransform: 'none',
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 3,
              backgroundColor: 'primary.main',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Create Your First Invoice
          </Button>
        </Paper>
      </Container>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
      `}</style>
    </Box>
  );
};

export default Home;
