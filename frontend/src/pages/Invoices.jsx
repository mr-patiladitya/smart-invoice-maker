import React, { useEffect, useState } from 'react';
import {
  Container, Typography, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';
import axios from 'axios';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('/api/invoices');
        setInvoices(response.data);
      } catch (err) {
        setError(err.message || 'Error loading invoices.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

const handleDownload = async (id) => {
  try {
    const response = await axios.get(`/api/invoices/${id}/pdf`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `invoice_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('PDF download failed', err);
    alert('Failed to download PDF.');
  }
};


  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

const handlePayNow = async (invoiceId) => {
  try {
    const res = await axios.post(`/api/razorpay/payment-link/${invoiceId}`);
    const link = res.data.link;
    window.open(link, '_blank'); 
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create payment link");
  }
};

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ my: 3 }}>
        Invoices
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.client.name}</TableCell>
                <TableCell>{invoice.date_created}</TableCell>
                <TableCell>
                  {invoice.status}
                  {invoice.status !== 'Paid' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{ ml: 1 }}
                      onClick={() => handlePayNow(invoice.id)}
                    >
                      Pay Now
                    </Button>
                  )}
                </TableCell>

                <TableCell>
                  <Button variant="outlined" onClick={() => handleDownload(invoice.id)}>
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Invoices;
