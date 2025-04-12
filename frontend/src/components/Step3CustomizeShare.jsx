// src/components/Step3CustomizeShare.jsx
import React, { useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, Stack } from '@mui/material';
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
      key: "your_key_id",
      amount: info.amount,
      currency: info.currency,
      name: "Smart Invoice Maker",
      description: `Invoice #${data.invoice_number}`,
      order_id: info.order_id,
      prefill: {
        name: info.client_name,
        email: info.client_email,
        contact: info.client_contact,
      },
      theme: { color: "#3399cc" },
      method: { netbanking: false, card: false, upi: true, wallet: false },
      handler: async function (response) {
        await fetch('/api/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoice_id: info.invoice_id,
            payment_id: response.razorpay_payment_id
          })
        });
        alert("✅ Payment successful!");
      },
      modal: {
        ondismiss: function () {
          alert("❌ Payment cancelled.");
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>
        Customize & Finalize
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Discount Field */}
      <Box sx={{ mb: 4 }}>
  <TextField
    label="Discount (%)"
    type="number"
    name="discount"
    value={data.discount}
    onChange={handleChange}
    sx={{ width: 200 }}
  />
</Box>

      {/* Signature Section */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Add Signature
        </Typography>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 1,
            width: '100%',
            maxWidth: 600
          }}
        >
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 600, height: 150, className: 'sigCanvas' }}
            ref={sigCanvas}
          />
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={saveSignature}>Save</Button>
          <Button variant="outlined" color="error" onClick={clearSignature}>Clear</Button>
        </Stack>
      </Box>

      {/* Preview */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Live Invoice Preview
        </Typography>
        <LiveInvoicePreview data={data} />
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 5 }}>
        <Button variant="outlined" onClick={handleSendEmail}>
          Email Invoice
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleRazorpayPayment}>
          Pay via Razorpay
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Paper>
  );
};

export default Step3CustomizeShare;
