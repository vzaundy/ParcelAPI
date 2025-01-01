const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const customerController = require('./customerController');
const menuController = require('./menuController');
const transactionSummaryController = require('./transactionSummaryController');
const salesTransactionController = require('./salesTransactionController');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Customer routes
app.get('/customers', customerController.getAllCustomers);
app.get('/customers/:id', customerController.getCustomerById);
app.post('/customers', customerController.createCustomer);
app.put('/customers/:id', customerController.updateCustomer);
app.delete('/customers/:id', customerController.deleteCustomer);

// Menu routes
app.get('/menu', menuController.getAllMenuItems);
app.get('/menu/:id', menuController.getMenuItemById);
app.post('/menu', menuController.createMenu);
app.put('/menu/:id', menuController.updateMenuItem);
app.delete('/menu/:id', menuController.deleteMenuItem);

app.post('/transaction-summary', transactionSummaryController.createTransactionSummary); 
app.get('/transaction-summary', transactionSummaryController.getAllTransactionSummaries); 
app.get('/transaction-summary/:id', transactionSummaryController.getTransactionSummaryById); 
app.put('/transaction-summary/:id', transactionSummaryController.updateTransactionSummary); 
app.delete('/transaction-summary/:id', transactionSummaryController.deleteTransactionSummary); 
// Sales Transaction Routes 
app.post('/sales-transaction', salesTransactionController.createSalesTransaction); 
app.get('/sales-transaction', salesTransactionController.getAllSalesTransactions); 
app.get('/sales-transaction/:id', salesTransactionController.getSalesTransactionById); 
app.put('/sales-transaction/:id', salesTransactionController.updateSalesTransaction); 
app.delete('/sales-transaction/:id', salesTransactionController.deleteSalesTransaction);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});