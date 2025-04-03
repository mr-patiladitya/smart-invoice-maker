// src/pages/Home.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          height: '100vh', // Full viewport height
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Vertical center
          alignItems: 'center',     // Horizontal center
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to Smart Invoice Maker
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
