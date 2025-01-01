const db = require('./db');

// CREATE - Add a new transaction summary
exports.createTransactionSummary = (req, res) => {
    const { CustomerName, Address, ContactNumber, DeliveredBy, PaymentMode, salesTransactions,TransactionDate } = req.body;
    const SummaryGuid = require('uuid').v4();
    let TransactionAmount = req.body.TransactionAmount;

    if (!TransactionAmount && salesTransactions) {
        TransactionAmount = salesTransactions.reduce((sum, item) => sum + item.Amount, 0);
        TransactionAmount = TransactionAmount * -1;
    }

    const query = `INSERT INTO TransactionSummary (BillNo, TransactionDate, CustomerName, Address, ContactNumber, 
                     TransactionAmount, DeliveredBy, PaymentMode, SummaryGuid) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [`Bill-${Date.now()}`, TransactionDate??(new Date()).toLocaleDateString(), CustomerName, Address, ContactNumber, 
                    TransactionAmount, DeliveredBy, PaymentMode, SummaryGuid], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error adding transaction summary", error: err.message });
        }

        const summaryId = this.lastID;

        if (salesTransactions) {
            salesTransactions.forEach(transaction => {
                transaction.SummaryGuid = SummaryGuid;
                transaction.SalesDate = TransactionDate??(new Date()).toLocaleDateString();
            });
            const salesQuery = `INSERT INTO SalesTransaction (SummaryGuid, SalesDate, ItemName, Rate, Qty, Unit, Amount)
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            salesTransactions.forEach(transaction => {
                db.run(salesQuery, [transaction.SummaryGuid, transaction.SalesDate, transaction.ItemName, transaction.Rate, 
                    transaction.Qty, transaction.Unit, transaction.Amount]);
            });
        }

        res.status(201).json({ message: "Transaction summary created", id: summaryId });
    });
};

// READ - Get all transaction summaries
exports.getAllTransactionSummaries = (req, res) => {
    const query = "SELECT * FROM TransactionSummary";

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching transaction summaries", error: err.message });
        }
        res.status(200).json(rows);
    });
};

// READ - Get a transaction summary by ID
exports.getTransactionSummaryById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM TransactionSummary WHERE Id = ?";

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching transaction summary", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Transaction summary not found" });
        }
        res.status(200).json(row);
    });
};

// UPDATE - Update an existing transaction summary
exports.updateTransactionSummary = (req, res) => {
    const { id } = req.params;
    const { CustomerName, Address, ContactNumber, DeliveredBy, PaymentMode, TransactionAmount } = req.body;

    const query = `UPDATE TransactionSummary SET 
                   CustomerName = ?, Address = ?, ContactNumber = ?, DeliveredBy = ?, 
                   PaymentMode = ?, TransactionAmount = ? WHERE Id = ?`;

    db.run(query, [CustomerName, Address, ContactNumber, DeliveredBy, PaymentMode, TransactionAmount, id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error updating transaction summary", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Transaction summary not found" });
        }
        res.status(200).json({ message: "Transaction summary updated" });
    });
};

// DELETE - Delete a transaction summary
exports.deleteTransactionSummary = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM TransactionSummary WHERE Id = ?";

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error deleting transaction summary", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Transaction summary not found" });
        }
        res.status(200).json({ message: "Transaction summary deleted" });
    });
};