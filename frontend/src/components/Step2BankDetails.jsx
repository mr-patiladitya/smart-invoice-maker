// src/components/Step2BankDetails.jsx
import React from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Step2BankDetails = ({ data, updateData }) => {
  const handleUPIChange = (e) => {
    updateData({ upi_id: e.target.value });
  };

  const handleSubmit = () => {
    if (data.upi_id) {
      console.log('UPI ID submitted:', data.upi_id);
      // Add your submit logic here
    } else {
      alert('Please enter a valid UPI ID.');
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2, maxWidth: 400, margin: '0 auto' }}>
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
              <IconButton edge="end" onClick={handleSubmit}>
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