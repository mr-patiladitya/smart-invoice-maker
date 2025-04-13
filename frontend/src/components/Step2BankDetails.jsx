// src/components/Step2BankDetails.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const Step2BankDetails = ({ data, updateData }) => {
  const [isValidUpi, setIsValidUpi] = useState(false);

  const handleUPIChange = (e) => {
    const upi = e.target.value;
    updateData({ upi_id: upi });

    // Validate format like abc@xyz
    const regex = /^[\w.-]+@[\w.-]+$/;
    setIsValidUpi(regex.test(upi));
  };

  return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add UPI ID
      </Typography>

      <TextField
        label="UPI ID"
        value={data.upi_id || ''}
        onChange={handleUPIChange}
        placeholder="example@upi"
        error={data.upi_id && !isValidUpi}
        helperText={
          data.upi_id && !isValidUpi ? 'Enter a valid UPI ID (e.g., name@bank)' : 'Format: name@bank'
        }
        sx={{ my: 2, width: '100%', maxWidth: 400 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isValidUpi ? (
                <CheckCircleIcon color="success" />
              ) : (
                <RadioButtonUncheckedIcon color="disabled" />
              )}
            </InputAdornment>
          )
        }}
      />
    </Box>

  );
};

export default Step2BankDetails;
