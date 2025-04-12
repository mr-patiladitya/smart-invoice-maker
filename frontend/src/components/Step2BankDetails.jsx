// src/components/Step2BankDetails.jsx
import React from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Step2BankDetails = ({ data, updateData }) => {
  const handleUPIChange = (e) => {
    updateData({ upi_id: e.target.value });
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Your UPI ID
      </Typography>

      <TextField
        label="UPI ID"
        fullWidth
        value={data.upi_id || ''}
        onChange={handleUPIChange}
        placeholder="example@upi"
        sx={{ my: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={() => console.log('UPI ID submitted')}>
                <CheckCircleIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="body2" color="textSecondary">
        Please enter your UPI ID to facilitate easy payments.
      </Typography>
    </Box>
  );
};

export default Step2BankDetails;