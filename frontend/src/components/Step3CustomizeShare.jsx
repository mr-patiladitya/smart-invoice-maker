// src/components/Step3CustomizeShare.jsx
import React, { useRef } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import LiveInvoicePreview from './LiveInvoicePreview';
import trimCanvas from '../utils/trimCanvas';

const Step3CustomizeShare = ({ data, updateData, handleSubmit }) => {
  const sigCanvas = useRef(null);

  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) return;
    const trimmed = trimCanvas(sigCanvas.current.getCanvas());
    const sigData = trimmed.toDataURL('image/png');
    updateData({ signature: sigData });
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    updateData({ signature: '' });
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h6" gutterBottom>
        Customize & Finalize
      </Typography>

      {/* Discount Field */}
      <TextField
        label="Discount (%)"
        type="number"
        name="discount"
        value={data.discount || ''}
        onChange={handleChange}
        sx={{ mt: 2 }}
        fullWidth
      />

      {/* Signature Input */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add Signature
        </Typography>
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
          ref={sigCanvas}
          style={{ border: '1px dashed #ccc', borderRadius: '4px' }} // Adding border for better visibility
        />
        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={saveSignature}>
            Save
          </Button>
          <Button variant="outlined" color="error" onClick={clearSignature}>
            Clear
          </Button>
        </Box>
      </Box>

      {/* Live Preview */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Live Invoice Preview
        </Typography>
        <LiveInvoicePreview data={data} />
      </Box>

      {/* Submit Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Step3CustomizeShare;