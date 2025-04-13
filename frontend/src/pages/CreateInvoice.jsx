import React, { useState } from 'react';
import {
  Container, Typography, Stepper, Step, StepLabel, Box, Button, Paper
} from '@mui/material';
import Step1InvoiceDetails from '../components/Step1InvoiceDetails';
import Step2BankDetails from '../components/Step2BankDetails';
import Step3CustomizeShare from '../components/Step3CustomizeShare';
import axios from 'axios';

const steps = ['Add Invoice Details', 'Add Bank Details', 'Customize & Share'];

const CreateInvoice = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [invoiceData, setInvoiceData] = useState({
    invoice_number: '',
    due_date: '',
    client_id: '',
    currency: 'INR',
    items: [{ description: '', quantity: 1, unit_price: 0 }],
    discount: 0,
    logo_url: '',
    upi_id: '',
    signature: ''
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const updateInvoiceData = (newData) => {
    setInvoiceData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/invoices', invoiceData);
      const newId = res.data.id;
      setInvoiceData((prev) => ({ ...prev, id: newId }));

      const emailRes = await fetch('http://localhost:5000/api/send-invoice-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: newId })
      });

      const emailResult = await emailRes.json();
      if (emailRes.ok) {
        alert('✅ Invoice created and emailed successfully!');
      } else {
        alert('✅ Invoice created, but failed to send email: ' + emailResult.error);
      }

      setInvoiceData({
        invoice_number: '',
        due_date: '',
        client_id: '',
        currency: 'INR',
        items: [{ description: '', quantity: 1, unit_price: 0 }],
        discount: 0,
        logo_url: '',
        upi_id: '',
        signature: ''
      });

      setActiveStep(0);
    } catch (err) {
      console.error('❌ Failed to create invoice:', err);
      alert('❌ Failed to create invoice. Check console for errors.');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1InvoiceDetails data={invoiceData} updateData={updateInvoiceData} />;
      case 1:
        return <Step2BankDetails data={invoiceData} updateData={updateInvoiceData} />;
      case 2:
        return <Step3CustomizeShare data={invoiceData} updateData={updateInvoiceData} handleSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <Container sx={{ py: 5, width: '70%', mx: 'auto' }}>

      <Typography variant="h4" gutterBottom textAlign="center">
        Create Invoice
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Box>{renderStepContent()}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          {activeStep < steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateInvoice;
