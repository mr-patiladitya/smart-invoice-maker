import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            maxWidth: 500,
            width: '100%'
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Smart Invoice Maker
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Create sleek, professional invoices in seconds — no hassle, no clutter.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3, px: 4, py: 1.5 }}
            onClick={() => navigate('/create-invoice')}
          >
            Create Your Invoice
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
