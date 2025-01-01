const db = require('./db');

// CREATE - Add a new sales transaction
exports.createSalesTransaction = (req, res) => {
    const { SummaryGuid, SalesDate, ItemName, Rate, Qty, Unit, Amount } = req.body;

    const query = `INSERT INTO SalesTransaction (SummaryGuid, SalesDate, ItemName, Rate, Qty, Unit, Amount) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [SummaryGuid, SalesDate, ItemName, Rate, Qty, Unit, Amount], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error adding sales transaction", error: err.message });
        }
        res.status(201).json({ message: "Sales transaction created", id: this.lastID });
    });
};

// READ - Get all sales transactions
exports.getAllSalesTransactions = (req, res) => {
    const query = "SELECT * FROM SalesTransaction";

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching sales transactions", error: err.message });
        }
        res.status(200).json(rows);
    });
};

// READ - Get a sales transaction by ID
exports.getSalesTransactionById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM SalesTransaction WHERE Id = ?";

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching sales transaction", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Sales transaction not found" });
        }
        res.status(200).json(row);
    });
};

// UPDATE - Update an existing sales transaction
exports.updateSalesTransaction = (req, res) => {
    const { id } = req.params;
    const { SummaryGuid, SalesDate, ItemName, Rate, Qty, Unit, Amount } = req.body;

    const query = `UPDATE SalesTransaction SET 
                   SummaryGuid = ?, SalesDate = ?, ItemName = ?, Rate = ?, Qty = ?, 
                   Unit = ?, Amount = ? WHERE Id = ?`;

    db.run(query, [SummaryGuid, SalesDate, ItemName, Rate, Qty, Unit, Amount, id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error updating sales transaction", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Sales transaction not found" });
        }
        res.status(200).json({ message: "Sales transaction updated" });
    });
};

// DELETE - Delete a sales transaction
exports.deleteSalesTransaction = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM SalesTransaction WHERE Id = ?";

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error deleting sales transaction", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Sales transaction not found" });
        }
        res.status(200).json({ message: "Sales transaction deleted" });
    });
};
