// src/components/Step3CustomizeShare.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Divider } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import LiveInvoicePreview from './LiveInvoicePreview';
import trimCanvas from '../utils/trimCanvas';
import SendIcon from '@mui/icons-material/Send';

const Step3CustomizeShare = ({ data, updateData, handleSubmit }) => {
  const sigCanvas = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) return;
    const trimmed = trimCanvas(sigCanvas.current.getCanvas());
    const sigData = trimmed.toDataURL('image/png');
    updateData({ signature: sigData });
    setIsEmpty(false);
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    updateData({ signature: '' });
    setIsEmpty(true);
  };

  const handleSendEmail = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/send-invoice-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: data.id })
      });
      const result = await res.json();
      if (res.ok) {
        alert('✅ Invoice emailed successfully!');
      } else {
        alert('❌ Error sending invoice: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to send invoice');
    }
  };

  const handleRazorpayPayment = async () => {
    const res = await fetch(`/api/create-razorpay-order/${data.id}`, { method: 'POST' });
    const info = await res.json();

    const options = {
      key: 'your_key_id',
      amount: info.amount,
      currency: info.currency,
      name: 'Smart Invoice Maker',
      description: `Invoice #${data.invoice_number}`,
      order_id: info.order_id,
      prefill: {
        name: info.client_name,
        email: info.client_email,
        contact: info.client_contact,
      },
      theme: {
        color: '#3399cc'
      },
      method: {
        netbanking: false,
        card: false,
        upi: true,
        wallet: false,
      },
      handler: async function (response) {
        await fetch('/api/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoice_id: info.invoice_id,
            payment_id: response.razorpay_payment_id
          })
        });
        alert('✅ Payment successful!');
      },
      modal: {
        ondismiss: function () {
          alert('❌ Payment cancelled.');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 2, width: '80%', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Customize & Finalize
      </Typography>

      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Discount (%)"
            type="number"
            name="discount"
            value={data.discount}
            onChange={handleChange}
            placeholder="Enter discount in %"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              width: '100%',
              height: 150,
              backgroundColor: '#fff',
              position: 'relative'
            }}
          >
            {isEmpty && (
              <Typography
                variant="caption"
                sx={{ position: 'absolute', top: 8, left: 16, color: '#aaa', zIndex: 1 }}
              >
                SIGNATURE
              </Typography>
            )}
            <SignatureCanvas
              penColor="black"
              canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
              ref={sigCanvas}
              onEnd={() => setIsEmpty(sigCanvas.current.isEmpty())}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={saveSignature}>Save</Button>
            <Button variant="outlined" color="error" onClick={clearSignature}>Clear</Button>
          </Box>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mt: 5 }}>
        <Typography variant="h6" fontWeight="bold">Live Invoice Preview</Typography>
        <Divider sx={{ my: 2 }} />
        <LiveInvoicePreview data={data} />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" color="success" endIcon={<SendIcon />} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default Step3CustomizeShare;