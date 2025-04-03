// src/components/Step2BankDetails.jsx
import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const Step2BankDetails = ({ data, updateData }) => {
  const handleUPIChange = (e) => {
    updateData({ upi_id: e.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add UPI ID
      </Typography>

      <TextField
        label="UPI ID"
        fullWidth
        value={data.upi_id || ''}
        onChange={handleUPIChange}
        placeholder="example@upi"
        sx={{ my: 2 }}
      />
    </Box>
  );
};

export default Step2BankDetails;
